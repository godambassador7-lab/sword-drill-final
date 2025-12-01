Biblical Lineages JSON Pack
===========================

This pack is designed for Sword Drill or similar Bible tools.
It contains JSON-structured family trees and people-group lineages, including:

- Israel (Jacob) and the 12 tribes
- Esau / Edom
- Canaan and Canaanite nations
- Hamite and Japhethite lines
- Shem → Abraham → Isaac → Jacob core Messianic line
- Ishmael and Ishmaelite clans
- Keturah’s sons (including Midian) and Midianite lines
- Moab and Ammon (descendants of Lot)
- Philistines (via Mizraim and Casluhim)
- Arameans (via Aram)
- Harmonized genealogy of Jesus (Matthew and Luke)

Each JSON file uses a consistent tree-like structure:

{
  "name": "Node Name",
  "aka": ["Optional other names"],
  "type": "person | tribe | nation | clan | line",
  "notes": "Short description or biblical context.",
  "source_refs": ["Scripture references as strings"],
  "children": [ ... nested nodes ... ]
}
