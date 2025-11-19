from pathlib import Path
lines = Path("src/App.js").read_text(encoding="utf-8").splitlines()
for i,line in enumerate(lines[200:260], start=200):
    print(i+1,line)

