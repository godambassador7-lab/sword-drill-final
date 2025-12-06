# Biblical Genealogies Dataset (Extended Core)

## Important Note

This dataset is **highly detailed and extended**, but because the Bible's genealogical material is vast
(especially 1–2 Chronicles, Ezra, Nehemiah, etc.), this collection is **not guaranteed to contain every
single named individual in Scripture**, nor every minor branch. It is designed as a **solid backbone**
for app usage (e.g., Sword Drill) and can be extended.

Where possible, lineages follow the biblical text in canonical order. IDs are lowercase with underscores
for safe use in code.

## Files Overview

- `adamic_core.json` – Adam → Noah → Shem, Ham, Japheth with immediate descendants.
- `table_of_nations.json` – Genesis 10 descendants for the sons of Noah.
- `abrahamic_family.json` – Abraham, his wives/concubines, Ishmael, Isaac, Jacob, Esau, and key descendants.
- `israel_tribes_heads.json` – Jacob's sons and some tribal heads / notable descendants.
- `judah_kings.json` – Davidic royal line (kings of Judah) down to the Exile.
- `priestly_levites.json` – Levi, Kohath, Amram, Aaronic priesthood line and key Levites.
- `jesus_genealogy_matthew.json` – Matthew 1 genealogy (Abraham → David → Joseph → Jesus).
- `jesus_genealogy_luke.json` – Luke 3 genealogy (Jesus → Adam → God).

Each JSON file is an array of **person objects** with this general schema:

```json
{
  "id": "unique_lowercase_slug",
  "name": "Primary English form of name",
  "gender": "M|F|U",
  "father": "id-of-father-or-null",
  "mother": "id-of-mother-or-null",
  "spouses": ["ids-of-spouses"],
  "children": ["ids-of-children-if-known"],
  "refs": ["Book Chapter:Verse", "..."],
  "notes": "Optional notes (variant spellings, textual notes, etc.)",
  "alt_names": ["Other spellings or forms"]
}
```

Because Scripture does not always give mothers, children arrays, or complete branches,
many people only have **father and refs** filled in.

You can safely extend this dataset by:
- Adding new persons with unique `id`s.
- Linking with `father`, `mother`, `spouses`, `children` as needed.
- Using `refs` to tie back to specific passages.
