import os
import glob

files = glob.glob('src/**/*.jsx', recursive=True) + glob.glob('src/**/*.js', recursive=True)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if '—' in content or '–' in content:
        # Replace em dash and en dash with regular hyphen
        new_content = content.replace('—', '-').replace('–', '-')
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {f}")
