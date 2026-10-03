import re

with open('src/components/ChatWidget.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r'\s*\{m\.track && \(\s*<button className="chat__link" onClick=\{\(\) => app\.openModal\(<TrackOrder orderId=\{m\.track\} />\)\}>\s*\{app\.t\("Watch the rider on the map", "Lacak kurir di peta"\)\} <Ico name="arrow" />\s*</button>\s*\)\}'

# Remove the rogue block
c = re.sub(pattern, '', c)

with open('src/components/ChatWidget.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
