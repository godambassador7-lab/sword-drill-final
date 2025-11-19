#!/usr/bin/env python3
"""
Convert LXX Text-Fabric (Rahlfs 1935) slot-level features into per-book JSON files.

Input directory (TF): src/data/LXX-main/LXX-main/tf/1935
Reads: book.tf, chapter.tf, verse.tf, word.tf, lex_utf8.tf, morphology.tf

Output directory: public/lxx/<Book>.json
JSON shape: { "book": <name>, "chapters": { "<ch>": { "<vs>": [ [text, lemma, morph], ... ] } } }

This streams features line-by-line in lockstep to avoid holding entire arrays.
"""
import os
import json
import io

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TF_DIR = os.path.join(ROOT, 'src', 'data', 'LXX-main', 'LXX-main', 'tf', '1935')
OUT_DIR = os.path.join(ROOT, 'public', 'lxx')

# Map TF book codes to canonical English names
BOOK_MAP = {
    'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deut': 'Deuteronomy',
    'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth',
    '1Sam': '1 Samuel', '2Sam': '2 Samuel',
    '1Kgs': '1 Kings', '2Kgs': '2 Kings',
    '1Chr': '1 Chronicles', '2Chr': '2 Chronicles',
    'Ezra': 'Ezra', 'Neh': 'Nehemiah', 'Esth': 'Esther',
    'Job': 'Job', 'Ps': 'Psalms', 'Prov': 'Proverbs', 'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon',
    'Isa': 'Isaiah', 'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
    'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah', 'Jonah': 'Jonah', 'Mic': 'Micah',
    'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zeph': 'Zephaniah', 'Hag': 'Haggai', 'Zech': 'Zechariah', 'Mal': 'Malachi',
    # Deuterocanon / Apocrypha (if present in TF set)
    'Tob': 'Tobit', 'Jdt': 'Judith',
    'GkEsth': 'Additions to Esther', 'AddEsth': 'Additions to Esther',
    '1Esd': '1 Esdras', '2Esd': '2 Esdras',
    'Wis': 'Wisdom of Solomon', 'Sir': 'Sirach', 'Ecclus': 'Sirach',
    'Bar': 'Baruch', 'EpJer': 'Letter of Jeremiah', 'LetJer': 'Letter of Jeremiah',
    'PrAzar': 'Prayer of Azariah', 'SongThree': 'Song of the Three Holy Children', 'SongThreeChild': 'Song of the Three Holy Children',
    'Sus': 'Susanna', 'Bel': 'Bel and the Dragon',
    'PrMan': 'Prayer of Manasseh', 'Ps151': 'Psalm 151',
    '1Macc': '1 Maccabees', '2Macc': '2 Maccabees', '3Macc': '3 Maccabees', '4Macc': '4 Maccabees',
}

FEATURE_FILES = {
    'book': 'book.tf',
    'chapter': 'chapter.tf',
    'verse': 'verse.tf',
    'word': 'word.tf',
    'lemma': 'lex_utf8.tf',
    'morph': 'morphology.tf',
}

def open_values(path):
    f = io.open(path, 'r', encoding='utf-8', errors='replace')
    # Skip header lines starting with '@'
    for line in f:
        if not line.startswith('@'):
            # First data line
            yield line.rstrip('\n')
            break
    # Yield remaining lines
    for line in f:
        yield line.rstrip('\n')

def ensure_dir(p):
    if not os.path.exists(p):
        os.makedirs(p, exist_ok=True)

def write_book(out_dir, book_name, chapters):
    ensure_dir(out_dir)
    out_path = os.path.join(out_dir, f"{book_name}.json")
    data = { 'book': book_name, 'chapters': chapters }
    with io.open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)
    print('Wrote', out_path)

def convert():
    # Prepare iterators for each feature
    iters = {}
    for key, fname in FEATURE_FILES.items():
        full = os.path.join(TF_DIR, fname)
        if not os.path.exists(full):
            raise FileNotFoundError(full)
        iters[key] = open_values(full)

    current_book_code = None
    current_book_name = None
    current = None  # chapters dict for current book

    count = 0
    while True:
        try:
            bc = next(iters['book']).strip()
            ch = next(iters['chapter']).strip()
            vs = next(iters['verse']).strip()
            wd = next(iters['word'])
            lm = next(iters['lemma'])
            mf = next(iters['morph'])
        except StopIteration:
            break

        # Skip empty lines (should not occur after headers)
        if not bc:
            continue
        # Detect book switch
        if current_book_code is None:
            current_book_code = bc
            current_book_name = BOOK_MAP.get(current_book_code)
            if not current_book_name:
                # Unknown/extra book codes; skip accumulating until a known code appears
                current = None
            else:
                current = {}
        elif bc != current_book_code:
            # Flush previous book if known
            if current_book_name and current is not None:
                write_book(OUT_DIR, current_book_name, current)
            # Start new book
            current_book_code = bc
            current_book_name = BOOK_MAP.get(current_book_code)
            current = {} if current_book_name else None

        # If book is not mapped, skip accumulating but continue advancing iterators
        if not current_book_name or current is None:
            count += 1
            continue

        # Chapter/verse keys as strings
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

        # Normalize empty lemma/morph to None
        lm_val = lm if lm else None
        mf_val = mf if mf else None
        # Append triplet [text, lemma, morph]
        current[ch_key][vs_key].append([wd, lm_val, mf_val])
        count += 1

    # Flush last book
    if current_book_name and current is not None:
        write_book(OUT_DIR, current_book_name, current)

    print('Processed slots:', count)

if __name__ == '__main__':
    convert()
