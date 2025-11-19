#!/usr/bin/env python3
"""
Convert Codex Sinaiticus XML (OSIS/TEI-like) into a Text-Fabric (TF) folder.

Outputs the minimal TF features needed by our downstream JSON converter:
  - otype.tf, oslots.tf, otext.tf
  - book.tf (str), chapter.tf (int), verse.tf (int)
  - word.tf (token text), lex_utf8.tf (lemma), morphology.tf (morph code)

Assumptions (tunable via CLI flags):
  - Input is a directory of per-book XML files (e.g., Gen.xml, Matt.xml), OSIS-like.
  - Verses appear as elements (typically <verse osisID="Gen.1.1">) with nested <w> for words.
  - Word elements have attributes lemma/morph; if missing, we fall back to splitting verse text.

Usage:
  python scripts/convert_sinaiticus_xml_to_tf.py --input <xml_dir> --out <tf_dir>

Optional flags:
  --verse-tag name         Default: 'verse' (supports namespaces)
  --word-tag name          Default: 'w'     (supports namespaces)
  --lemma-attr name        Default: 'lemma'
  --morph-attr name        Default: 'morph'
"""
import argparse
import io
import json
import os
import re
import sys
import xml.etree.ElementTree as ET

# Map common OSIS/TEI short codes or filenames to canonical book names
BOOK_MAP = {
    # OT
    'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deut': 'Deuteronomy',
    'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth', '1Sam': '1 Samuel', '2Sam': '2 Samuel',
    '1Kgs': '1 Kings', '2Kgs': '2 Kings', '1Chr': '1 Chronicles', '2Chr': '2 Chronicles',
    'Ezra': 'Ezra', 'Neh': 'Nehemiah', 'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psalms', 'Prov': 'Proverbs',
    'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon', 'Isa': 'Isaiah', 'Jer': 'Jeremiah', 'Lam': 'Lamentations',
    'Ezek': 'Ezekiel', 'Dan': 'Daniel', 'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah',
    'Jonah': 'Jonah', 'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zeph': 'Zephaniah', 'Hag': 'Haggai',
    'Zech': 'Zechariah', 'Mal': 'Malachi',
    # NT
    'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke', 'John': 'John', 'Acts': 'Acts', 'Rom': 'Romans',
    '1Cor': '1 Corinthians', '2Cor': '2 Corinthians', 'Gal': 'Galatians', 'Eph': 'Ephesians', 'Phil': 'Philippians',
    'Col': 'Colossians', '1Thess': '1 Thessalonians', '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy',
    'Titus': 'Titus', 'Phlm': 'Philemon', 'Heb': 'Hebrews', 'Jas': 'James', '1Pet': '1 Peter', '2Pet': '2 Peter',
    '1John': '1 John', '2John': '2 John', '3John': '3 John', 'Jude': 'Jude', 'Rev': 'Revelation',
}

FILENAME_MAP = {
    # Common full names
    'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus', 'numbers': 'Numbers', 'deuteronomy': 'Deuteronomy',
    'joshua': 'Joshua', 'judges': 'Judges', 'ruth': 'Ruth', '1samuel': '1 Samuel', '2samuel': '2 Samuel',
    '1kings': '1 Kings', '2kings': '2 Kings', '1chronicles': '1 Chronicles', '2chronicles': '2 Chronicles',
    'ezra': 'Ezra', 'nehemiah': 'Nehemiah', 'esther': 'Esther', 'job': 'Job', 'psalms': 'Psalms', 'proverbs': 'Proverbs',
    'ecclesiastes': 'Ecclesiastes', 'songofsolomon': 'Song of Solomon', 'isaiah': 'Isaiah', 'jeremiah': 'Jeremiah',
    'lamentations': 'Lamentations', 'ezekiel': 'Ezekiel', 'daniel': 'Daniel', 'hosea': 'Hosea', 'joel': 'Joel',
    'amos': 'Amos', 'obadiah': 'Obadiah', 'jonah': 'Jonah', 'micah': 'Micah', 'nahum': 'Nahum', 'habakkuk': 'Habakkuk',
    'zephaniah': 'Zephaniah', 'haggai': 'Haggai', 'zechariah': 'Zechariah', 'malachi': 'Malachi',
    'matthew': 'Matthew', 'mark': 'Mark', 'luke': 'Luke', 'john': 'John', 'acts': 'Acts', 'romans': 'Romans',
    '1corinthians': '1 Corinthians', '2corinthians': '2 Corinthians', 'galatians': 'Galatians', 'ephesians': 'Ephesians',
    'philippians': 'Philippians', 'colossians': 'Colossians', '1thessalonians': '1 Thessalonians', '2thessalonians': '2 Thessalonians',
    '1timothy': '1 Timothy', '2timothy': '2 Timothy', 'titus': 'Titus', 'philemon': 'Philemon', 'hebrews': 'Hebrews',
    'james': 'James', '1peter': '1 Peter', '2peter': '2 Peter', '1john': '1 John', '2john': '2 John', '3john': '3 John',
    'jude': 'Jude', 'revelation': 'Revelation',
}

def guess_book_name_from_osis(osis_id):
    # osis_id like Gen.1.1 or Matt.1.1
    if not osis_id:
        return None
    code = osis_id.split('.')[0]
    return BOOK_MAP.get(code)

def guess_book_name_from_filename(path):
    stem = os.path.splitext(os.path.basename(path))[0]
    key = re.sub(r'[^a-z0-9]+', '', stem.lower())
    return FILENAME_MAP.get(key)

def iter_verses(root, verse_tag, word_tag):
    # Try namespace-agnostic tag matching
    def tag_eq(el, name):
        return el.tag == name or el.tag.endswith('}' + name)

    # Candidate verse elements
    verses = []
    for el in root.iter():
        if tag_eq(el, verse_tag) or ('osisID' in el.attrib and tag_eq(el, verse_tag)):
            verses.append(el)
    # Fallback: any element with osisID and 'verse' in tag
    if not verses:
        for el in root.iter():
            if 'osisID' in el.attrib and (el.tag.endswith('}verse') or el.tag.lower().endswith('verse')):
                verses.append(el)
    for v in verses:
        osis_id = v.attrib.get('osisID', '')
        # Handle single refs like Book.Ch.Vs (ignore ranges for simplicity)
        if '-' in osis_id:
            first = osis_id.split('-')[0]
        else:
            first = osis_id
        parts = first.split('.') if first else []
        chapter = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else None
        verse = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else None

        # Gather words
        words = []
        for w in v.iter():
            if tag_eq(w, word_tag):
                tok = (w.text or '').strip()
                if not tok:
                    continue
                lemma = w.attrib.get('lemma') or w.attrib.get('lem') or ''
                morph = w.attrib.get('morph') or w.attrib.get('ms') or ''
                words.append([tok, lemma or None, morph or None])
        if not words:
            # Fallback: split full verse text
            txt = ''.join(v.itertext()).strip()
            if txt:
                for tok in re.findall(r"\S+", txt):
                    words.append([tok, None, None])
        if chapter and verse and words:
            yield osis_id, chapter, verse, words

def write_tf(out_dir, words_all, books_order):
    os.makedirs(out_dir, exist_ok=True)
    # Allocate node numbers
    # slots: 1..Nwords
    slot_count = sum(len(wlist) for _, _, _, wlist in words_all)
    next_node = slot_count + 1

    # Collect node mappings
    # book_nodes: name -> (node_id, start_slot, end_slot)
    # chapter_nodes: (bookname, ch) -> (node_id, start_slot, end_slot)
    # verse_nodes: (bookname, ch, vs) -> (node_id, start_slot, end_slot)
    book_nodes = {}
    chapter_nodes = {}
    verse_nodes = {}

    # Prepare feature writers
    def open_feat(name, header):
        f = io.open(os.path.join(out_dir, name), 'w', encoding='utf-8')
        f.write(header)
        f.write('\n')
        return f

    hdr_common = (
        "@node\n"
        "@Author=Unknown\n@Name=Codex Sinaiticus (XML→TF)\n@valueType=str\n@writtenBy=converter\n"
    )
    hdr_int = (
        "@node\n@Author=Unknown\n@Name=Codex Sinaiticus (XML→TF)\n@valueType=int\n@writtenBy=converter\n"
    )

    f_word = open_feat('word.tf', hdr_common + '@description=text realized word')
    f_lemma = open_feat('lex_utf8.tf', hdr_common + '@description=lemma (utf8)')
    f_morph = open_feat('morphology.tf', hdr_common + '@description=morph code')

    # Write slot features
    slot_idx = 1
    for (_book, _ch, _vs, wlist) in words_all:
        for w in wlist:
            tok, lem, mor = w
            f_word.write(f"{tok}\n")
            f_lemma.write(f"{lem or ''}\n")
            f_morph.write(f"{mor or ''}\n")
            slot_idx += 1

    f_word.close(); f_lemma.close(); f_morph.close()

    # Build ranges by traversing words_all in order
    slot_cursor = 1
    for book in books_order:
        book_start = slot_cursor
        # all entries matching this book
        entries = [e for e in words_all if e[0] and e[0].startswith(book + '.')]
        # group by chapter then verse
        ch_groups = {}
        for (_osis, ch, vs, wlist) in entries:
            key = (book, ch)
            if key not in ch_groups:
                ch_groups[key] = []
            ch_groups[key].append((vs, len(wlist)))
        # chapters in order
        for (bname, ch) in sorted(ch_groups.keys(), key=lambda x: x[1]):
            ch_start = slot_cursor
            for (vs, wlen) in sorted(ch_groups[(bname, ch)], key=lambda x: x[0]):
                v_start = slot_cursor
                slot_cursor += wlen
                v_end = slot_cursor - 1
                verse_nodes[(bname, ch, vs)] = (None, v_start, v_end)
            ch_end = slot_cursor - 1
            chapter_nodes[(bname, ch)] = (None, ch_start, ch_end)
        book_end = slot_cursor - 1
        book_nodes[book] = (None, book_start, book_end)

    # Assign node ids
    # word slots: 1..slot_count already implied
    def assign(nodes_dict):
        nonlocal next_node
        for k in sorted(nodes_dict.keys(), key=lambda x: (str(x))):
            nid = next_node
            next_node += 1
            start, end = nodes_dict[k][1], nodes_dict[k][2]
            nodes_dict[k] = (nid, start, end)

    assign(book_nodes)
    assign(chapter_nodes)
    assign(verse_nodes)

    # otype.tf
    with io.open(os.path.join(out_dir, 'otype.tf'), 'w', encoding='utf-8') as f:
        f.write('@node\n@valueType=str\n')
        f.write('1-{}\tword\n'.format(slot_count))
        bmin = min(n for (n,_,_) in book_nodes.values()) if book_nodes else slot_count+1
        bmax = max(n for (n,_,_) in book_nodes.values()) if book_nodes else slot_count
        cmin = min(n for (n,_,_) in chapter_nodes.values()) if chapter_nodes else bmax+1
        cmax = max(n for (n,_,_) in chapter_nodes.values()) if chapter_nodes else bmax
        vmin = min(n for (n,_,_) in verse_nodes.values()) if verse_nodes else cmax+1
        vmax = max(n for (n,_,_) in verse_nodes.values()) if verse_nodes else cmax
        if book_nodes:
            f.write(f'{bmin}-{bmax}\tbook\n')
        if chapter_nodes:
            f.write(f'{cmin}-{cmax}\tchapter\n')
        if verse_nodes:
            f.write(f'{vmin}-{vmax}\tverse\n')

    # oslots.tf
    with io.open(os.path.join(out_dir, 'oslots.tf'), 'w', encoding='utf-8') as f:
        f.write('@edge\n@valueType=str\n')
        # book ranges
        for name, (nid, a, b) in book_nodes.items():
            f.write(f'{nid}\t{a}-{b}\n')
        # chapter ranges
        for (bname, ch), (nid, a, b) in chapter_nodes.items():
            f.write(f'{nid}\t{a}-{b}\n')
        # verse ranges
        for (bname, ch, vs), (nid, a, b) in verse_nodes.items():
            f.write(f'{nid}\t{a}-{b}\n')

    # book.tf / chapter.tf / verse.tf
    fb = io.open(os.path.join(out_dir, 'book.tf'), 'w', encoding='utf-8')
    fc = io.open(os.path.join(out_dir, 'chapter.tf'), 'w', encoding='utf-8')
    fv = io.open(os.path.join(out_dir, 'verse.tf'), 'w', encoding='utf-8')
    try:
        fb.write('@node\n@valueType=str\n')
        fc.write('@node\n@valueType=int\n')
        fv.write('@node\n@valueType=int\n')
        # Books
        for name, (nid, _, __) in sorted(book_nodes.items(), key=lambda x: x[1][0]):
            fb.write(f'{name}\n')
        # Chapters
        for (bname, ch), (nid, _, __) in sorted(chapter_nodes.items(), key=lambda x: x[1][0]):
            fc.write(f'{ch}\n')
        # Verses
        for (bname, ch, vs), (nid, _, __) in sorted(verse_nodes.items(), key=lambda x: x[1][0]):
            fv.write(f'{vs}\n')
    finally:
        fb.close(); fc.close(); fv.close()

    # otext.tf
    with io.open(os.path.join(out_dir, 'otext.tf'), 'w', encoding='utf-8') as f:
        f.write('@config\n')
        f.write('@Name=Codex Sinaiticus\n')
        f.write('@fmt:text-orig-full={word} \n')
        f.write('@sectionFeatures=book,chapter,verse\n')
        f.write('@sectionTypes=book,chapter,verse\n')

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--input', required=True, help='Directory with Sinaiticus XML files (*.xml)')
    ap.add_argument('--out', required=True, help='Output TF directory (e.g., src/data/sinaiticus/tf/1935)')
    ap.add_argument('--verse-tag', default='verse')
    ap.add_argument('--word-tag', default='w')
    ap.add_argument('--lemma-attr', default='lemma')
    ap.add_argument('--morph-attr', default='morph')
    args = ap.parse_args()

    xml_dir = args.input
    out_dir = args.out

    files = [os.path.join(xml_dir, f) for f in os.listdir(xml_dir) if f.lower().endswith('.xml')]
    if not files:
        print('No XML files found in', xml_dir)
        sys.exit(2)

    words_all = []  # list of (bookName, chapter, verse, words[])
    books_order = []
    for path in sorted(files):
        try:
            tree = ET.parse(path)
            root = tree.getroot()
        except Exception as e:
            print('Skip (parse error):', path, e)
            continue
        # Determine book name from filename; fall back to osisID
        book_name = guess_book_name_from_filename(path)
        for osis_id, ch, vs, words in iter_verses(root, args.verse_tag, args.word_tag):
            if not book_name:
                book_name = guess_book_name_from_osis(osis_id)
            if not book_name:
                # Unknown book; skip
                continue
            words_all.append((f'{book_name}', ch, vs, words))
            if book_name not in books_order:
                books_order.append(book_name)

    # Sort words_all by book order -> chapter -> verse
    words_all.sort(key=lambda x: (books_order.index(x[0]) if x[0] in books_order else 999, x[1], x[2]))
    if not words_all:
        print('No verse/word content detected. Check tag names or XML format, and try --verse-tag/--word-tag flags.')
        sys.exit(3)

    write_tf(out_dir, words_all, books_order)
    print('TF written to', out_dir)

if __name__ == '__main__':
    main()
