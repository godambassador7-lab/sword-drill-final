# Biblical Bloodlines - Interactive Family Tree Viewer

## Overview
Biblical Bloodlines is an interactive genealogy viewer that allows users to explore the family trees and lineages from the Bible, from creation to Jesus Christ.

## Features

### 🌳 **Multiple Family Trees**
- **Jesus Genealogy** - Complete lineage through both Joseph (legal) and Mary (biological)
- **12 Tribes of Israel** - Jacob/Israel and his descendants
- **Shem to Abraham** - Patriarchal line
- **Ham & Descendants** - Nations from Ham
- **Japheth & Descendants** - Nations from Japheth
- **Esau/Edom** - Descendants of Esau
- **Ishmael & Ishmaelites** - Arab nations
- **Moab & Ammon** - Lot's descendants
- **Canaan & Canaanites** - Pre-conquest inhabitants
- **Keturah & Midian** - Abraham's other descendants
- **Arameans** - Syrian peoples

### ✨ **Jesus's Bloodline Glows Amber**
- All persons in Jesus's direct lineage are highlighted with amber/gold coloring
- Special sparkle icons mark Messianic line members
- Both Matthew's (Joseph) and Luke's (Mary) genealogies tracked
- Automatic expansion of Jesus's lineage tree

### 🔍 **Powerful Search**
- Real-time search across all people in current tree
- Search by name or alternate names (aka)
- Jump directly to person's location in tree
- Shows full path to person in search results

### 👤 **Interactive Profile Panels**
Each person's profile displays:
- **Name** - Primary name and aliases
- **Type** - Person, tribe, nation, clan, or line
- **Notes** - Biblical context and significance
- **Scripture References** - Where they appear in the Bible
- **Children** - Direct descendants with navigation
- **Special Marking** - Indicates if in Jesus's lineage

### 🎨 **Color-Coded Types**
- **Person** - Blue badge
- **Tribe** - Green badge
- **Nation** - Red badge
- **Clan** - Yellow badge
- **Line** - Purple badge

### 🌲 **Tree Navigation**
- Expandable/collapsible nodes
- Click to view profile
- Click chevron to expand/collapse children
- Visual hierarchy with indentation
- Border lines showing relationships

## Data Structure

Each person/entity in the JSON follows this structure:

```json
{
  "name": "Person Name",
  "aka": ["Alternate Name 1", "Alternate Name 2"],
  "type": "person | tribe | nation | clan | line",
  "notes": "Description and biblical context",
  "source_refs": ["Genesis 1:1", "Matthew 1:1"],
  "children": [
    {
      "name": "Child Name",
      ...
    }
  ]
}
```

### Special Jesus Genealogy Structure

The Jesus genealogy has unique fields:
- `legal_line_through_joseph` - Matthew's genealogy (royal/legal line)
- `line_through_mary` - Luke's genealogy (biological line)

## Usage

1. **Select a Tree** - Choose from available family trees
2. **Explore** - Click on nodes to expand/collapse
3. **Search** - Use search bar to find specific people
4. **View Profiles** - Click names to see detailed information
5. **Navigate** - Click children to jump to their profiles

## Jesus's Lineage Highlighting

The Messianic bloodline is specially marked with:
- **Amber/orange background** - Stands out from regular entries
- **Amber border** - Clear visual distinction
- **Sparkle icon (✨)** - Messianic significance marker
- **Amber text** - Name highlighted in gold
- **Special badge** - "Part of Jesus's Messianic Lineage"

This makes it easy to trace the line from Abraham through David to Jesus, showing how prophecy was fulfilled through specific genealogical lines.

## Biblical Sources

All data is sourced from Scripture with references provided:
- Genesis (creation to Abraham)
- Exodus through Deuteronomy (Moses and Aaron)
- Ruth (David's ancestry)
- 1 & 2 Samuel, 1 & 2 Kings, 1 & 2 Chronicles (Kingdom period)
- Matthew 1 (Joseph's legal line)
- Luke 3 (Mary's biological line)

## Technical Details

**Component**: `BiblicalBloodlines.jsx`
**Data Location**: `/public/biblical_lineages_json/`
**Format**: JSON
**Icons**: Lucide React
**Styling**: Tailwind CSS with custom gradients

## Future Enhancements

Potential additions:
- Export family tree as image
- Print-friendly view
- Filter by tribe/nation
- Timeline view
- Interactive maps showing where people lived
- Cross-reference with biblical events
