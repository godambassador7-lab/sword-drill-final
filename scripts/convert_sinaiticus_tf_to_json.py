#!/usr/bin/env python3
"""
Convert Codex Sinaiticus Text-Fabric features into per-book JSON for the app.

Usage:
  python scripts/convert_sinaiticus_tf_to_json.py <tf_dir>

Where <tf_dir> contains TF feature files like: book.tf, chapter.tf, verse.tf, word.tf, lex_utf8.tf, morphology.tf
Output is written to public/sinaiticus/<Book>.json with shape:
  { book: <name>, chapters: { "<ch>": { "<vs>": [ [text, lemma, morph], ... ] } } }
"""
import sys, os, io, json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT_DIR = os.path.join(ROOT, 'public', 'sinaiticus')

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
    # NT common abbreviations used in TF datasets
    'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke', 'John': 'John', 'Acts': 'Acts', 'Rom': 'Romans',
    '1Cor': '1 Corinthians', '2Cor': '2 Corinthians', 'Gal': 'Galatians', 'Eph': 'Ephesians', 'Phil': 'Philippians',
    'Col': 'Colossians', '1Thess': '1 Thessalonians', '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy',
    'Titus': 'Titus', 'Phlm': 'Philemon', 'Heb': 'Hebrews', 'Jas': 'James', '1Pet': '1 Peter', '2Pet': '2 Peter',
    '1John': '1 John', '2John': '2 John', '3John': '3 John', 'Jude': 'Jude', 'Rev': 'Revelation',
}

def open_values(path):
    f = io.open(path, 'r', encoding='utf-8', errors='replace')
    # Skip header lines starting with '@'
    for line in f:
        if not line.startswith('@'):
            yield line.rstrip('\n')
            break
    for line in f:
        yield line.rstrip('\n')

def ensure_dir(p):
    if not os.path.exists(p):
        os.makedirs(p, exist_ok=True)

def write_book(book_name, chapters):
    ensure_dir(OUT_DIR)
    path = os.path.join(OUT_DIR, f"{book_name}.json")
    with io.open(path, 'w', encoding='utf-8') as f:
        json.dump({ 'book': book_name, 'chapters': chapters }, f, ensure_ascii=False)
    print('Wrote', path)

def convert(tf_dir):
    req = ['book.tf','chapter.tf','verse.tf','word.tf','lex_utf8.tf','morphology.tf']
    for fn in req:
        if not os.path.exists(os.path.join(tf_dir, fn)):
            raise FileNotFoundError(os.path.join(tf_dir, fn))

    book_it = open_values(os.path.join(tf_dir, 'book.tf'))
    chap_it = open_values(os.path.join(tf_dir, 'chapter.tf'))
    verse_it = open_values(os.path.join(tf_dir, 'verse.tf'))
    word_it = open_values(os.path.join(tf_dir, 'word.tf'))
    lemma_it = open_values(os.path.join(tf_dir, 'lex_utf8.tf'))
    morph_it = open_values(os.path.join(tf_dir, 'morphology.tf'))

    current_code = None
    current_name = None
    current = None
    slots = 0

    while True:
        try:
            bc = next(book_it).strip()
            ch = next(chap_it).strip()
            vs = next(verse_it).strip()
            wd = next(word_it)
            lm = next(lemma_it)
            mf = next(morph_it)
        except StopIteration:
            break

        if not bc:
            continue
        if current_code is None or bc != current_code:
            if current_name and current is not None:
                write_book(current_name, current)
            current_code = bc
            current_name = BOOK_MAP.get(current_code)
            current = {} if current_name else None

        if not current_name or current is None:
            slots += 1
            continue

        try:
            ch_key = str(int(ch))
        except ValueError:
            ch_key = ch or '0'
        try:
            vs_key = str(int(vs))
        except ValueError:
            vs_key = vs or '0'

        if ch_key not in current:
            current[ch_key] = {}
        if vs_key not in current[ch_key]:
            current[ch_key][vs_key] = []

        lm_val = lm if lm else None
        mf_val = mf if mf else None
        current[ch_key][vs_key].append([wd, lm_val, mf_val])
        slots += 1

    if current_name and current is not None:
        write_book(current_name, current)

    print('Processed slots:', slots)

def main():
    if len(sys.argv) < 2:
        print('Usage: python scripts/convert_sinaiticus_tf_to_json.py <tf_dir>')
        sys.exit(1)
    tf_dir = sys.argv[1]
    convert(tf_dir)

if __name__ == '__main__':
    main()

