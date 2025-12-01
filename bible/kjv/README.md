Place public-domain KJV book JSON files here as <Book>.json (e.g., John.json).

Expected JSON formats supported:

1) Object with chapters nested under "chapters":
{
  "book": "John",
  "chapters": {
    "3": { "16": "For God so loved the world, ..." }
  }
}

2) Chapters object at the top level:
{
  "1": { "1": "In the beginning was the Word..." },
  "2": { ... }
}

The app will fetch files at runtime from /bible/kjv/<Book>.json and cache them in memory.

Books expected (66): Genesis ... Revelation. File names must match exactly (e.g., "1 Samuel.json", "Song of Solomon.json").

Data source suggestions (public domain):
- KJV in JSON from open repositories (ensure license compliance).
- You can generate per-book JSON from a full KJV JSON using a simple script.

Once files are added, SHARP can retrieve ANY verse from KJV by reference.

