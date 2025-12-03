import json
import os
import glob

# Update all Bible study plans to use KJV instead of copyrighted translations
base_path = r"c:\Users\Demetrius\Documents\sword-drill\public\bible_study_plans"

# Find all JSON files in both short and comprehensive directories
plan_files = []
plan_files.extend(glob.glob(os.path.join(base_path, "short", "*.json")))
plan_files.extend(glob.glob(os.path.join(base_path, "comprehensive", "*.json")))

updated_count = 0

for filepath in plan_files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Check if default_translation exists and is a copyrighted version
        if 'default_translation' in data:
            old_translation = data['default_translation']
            if old_translation in ['ESV', 'NIV', 'NLT', 'NKJV', 'NASB']:
                data['default_translation'] = 'KJV'

                # Write back to file
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)

                print(f"Updated {os.path.basename(filepath)}: {old_translation} -> KJV")
                updated_count += 1
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

print(f"\nCompleted! Updated {updated_count} files to use KJV translation.")
