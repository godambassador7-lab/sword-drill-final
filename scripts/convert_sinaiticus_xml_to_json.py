#!/usr/bin/env python3
import os, io, sys, re, json
import xml.etree.ElementTree as ET

# Map book codes (as seen in TEI div ids) to canonical names
CODE_MAP = {
  # OT
  'GEN':'Genesis','EXOD':'Exodus','EXO':'Exodus','LEV':'Leviticus','NUM':'Numbers','DEUT':'Deuteronomy','DEU':'Deuteronomy',
  'JOSH':'Joshua','JOS':'Joshua','JUDG':'Judges','JDG':'Judges','RUTH':'Ruth','RUT':'Ruth',
  '1SAM':'1 Samuel','2SAM':'2 Samuel','1KGS':'1 Kings','2KGS':'2 Kings','1CHR':'1 Chronicles','2CHR':'2 Chronicles',
  'EZRA':'Ezra','NEH':'Nehemiah','ESTH':'Esther','JOB':'Job','PS':'Psalms','PSA':'Psalms','PROV':'Proverbs','PRV':'Proverbs',
  'ECCL':'Ecclesiastes','QOH':'Ecclesiastes','SONG':'Song of Solomon','SNG':'Song of Solomon',
  'ISA':'Isaiah','JER':'Jeremiah','LAM':'Lamentations','EZEK':'Ezekiel','EZE':'Ezekiel','DAN':'Daniel',
  'HOS':'Hosea','JOEL':'Joel','AMOS':'Amos','OBAD':'Obadiah','JONAH':'Jonah','MIC':'Micah','NAH':'Nahum','HAB':'Habakkuk',
  'ZEPH':'Zephaniah','HAG':'Haggai','ZECH':'Zechariah','MAL':'Malachi',
  # NT (best-effort)
  'MATT':'Matthew','MARK':'Mark','LUKE':'Luke','JOHN':'John','ACTS':'Acts','ROM':'Romans','1COR':'1 Corinthians','2COR':'2 Corinthians',
  'GAL':'Galatians','EPH':'Ephesians','PHIL':'Philippians','COL':'Colossians','1THESS':'1 Thessalonians','2THESS':'2 Thessalonians',
  '1TIM':'1 Timothy','2TIM':'2 Timothy','TITUS':'Titus','PHLM':'Philemon','HEB':'Hebrews','JAS':'James','1PET':'1 Peter','2PET':'2 Peter',
  '1JOHN':'1 John','2JOHN':'2 John','3JOHN':'3 John','JUDE':'Jude','REV':'Revelation'
}

def canonical_from_div_id(div_id):
  if not div_id: return None
  m = re.search(r'-([A-Z0-9]{2,8})$', div_id)
  if not m: return None
  code = m.group(1)
  return CODE_MAP.get(code)

def normalize_text(s):
  try:
    return s.normalize('NFC') if hasattr(s, 'normalize') else s
  except Exception:
    return s

def convert(xml_path, out_dir):
  tree = ET.parse(xml_path)
  root = tree.getroot()

  by_book = {}
  current_book = None
  current_ch = None
  current_vs = None

  # Walk document order; start new verse on <lb vnumber="c:v">
  for el in root.iter():
    tag = el.tag.split('}',1)[-1]
    if tag == 'div' and el.attrib.get('type') == 'book':
      name = canonical_from_div_id(el.attrib.get('id'))
      if name:
        current_book = name
        if current_book not in by_book:
          by_book[current_book] = {}
        current_ch = None
        current_vs = None
    elif tag == 'lb':
      vnum = el.attrib.get('vnumber')
      if vnum and ':' in vnum and current_book:
        ch_s, vs_s = vnum.split(':',1)
        try:
          ch = str(int(ch_s))
          vs = str(int(vs_s))
        except ValueError:
          continue
        current_ch, current_vs = ch, vs
        if ch not in by_book[current_book]:
          by_book[current_book][ch] = {}
        if vs not in by_book[current_book][ch]:
          by_book[current_book][ch][vs] = []
    elif tag == 'w':
      if current_book and current_ch and current_vs:
        tok = ''.join(el.itertext()).strip()
        if not tok:
          continue
        # TEI file lacks lemma/morph; keep placeholders (None)
        by_book[current_book][current_ch][current_vs].append([tok, None, None])

  # Write per-book JSON
  os.makedirs(out_dir, exist_ok=True)
  for book, chapters in by_book.items():
    path = os.path.join(out_dir, f"{book}.json")
    with io.open(path, 'w', encoding='utf-8') as f:
      json.dump({ 'book': book, 'chapters': chapters }, f, ensure_ascii=False)
    print('Wrote', path)

def main():
  if len(sys.argv) < 3:
    print('Usage: python scripts/convert_sinaiticus_xml_to_json.py <xml_file> <out_dir>')
    sys.exit(1)
  xml_file = sys.argv[1]
  out_dir = sys.argv[2]
  convert(xml_file, out_dir)

if __name__ == '__main__':
  main()

