# Biblical Genealogies Dataset – Phase 2 (Chronicles Backbone)

This pack extends the core genealogies with **1 Chronicles–style** material and
related branches, focusing on:

- Adam → Abraham → Israel as summarized in 1 Chronicles 1.
- Esau/Edom plus Seir the Horite clans.
- Kings of Edom.
- Judah's detailed lines (Perez/Hezron branches) including Ram and Caleb families.
- David's house and royal relatives.
- Levi's extended genealogies (Levi → Gershom, Kohath, Merari → temple musicians and
  priestly organization).
- Selected tribal heads for Simeon, Reuben, Gad, and others (1 Chronicles 4–5).

This is **still not every single name** from 1 Chronicles 1–9, but it captures a
large and structured backbone with clear IDs and references and is designed to be
extended further.

## Schema

Same schema as Phase 1:

```json
{
  "id": "unique_lowercase_slug",
  "name": "Primary English form of name",
  "gender": "M|F|U",
  "father": "id-or-null",
  "mother": "id-or-null",
  "spouses": ["..."],
  "children": ["..."],
  "refs": ["Book Chapter:Verse", "..."],
  "notes": "text",
  "alt_names": ["..."]
}
```

## Files

- `chronicles_adamic_to_israel.json` – Adam to Israel summary per 1 Chr 1.
- `chronicles_esau_and_seir.json` – Esau's chiefs and Seir the Horite clans.
- `chronicles_edom_kings.json` – Kings of Edom before any king in Israel.
- `chronicles_judah_branches.json` – Judah, Hezron, Ram, Caleb, Jerahmeel branches.
- `chronicles_david_house.json` – David's immediate family and royal relatives.
- `chronicles_levi_extended.json` – Kohath, Gershom, Merari lines with temple roles.
- `chronicles_other_tribes_heads.json` – Selected heads from Simeon, Reuben, Gad, and others.

You can merge these with Phase 1 by ID or keep as a separate module.
