import os
import re
import zipfile
import xml.etree.ElementTree as ET

def extract_from_docx(filepath):
    print(f"\n==================== DOCX: {os.path.basename(filepath)} ====================")
    try:
        with zipfile.ZipFile(filepath, 'r') as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            paragraphs = []
            for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                texts = [node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            print('\n'.join(paragraphs))
    except Exception as e:
        print(f"Error reading docx: {e}")

def extract_from_doc(filepath):
    print(f"\n==================== DOC: {os.path.basename(filepath)} ====================")
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
        
        # Try UTF-16 LE decode chunks
        # In OLE doc files, text is often stored in 16-bit unicode
        unicode_str = content.decode('utf-16le', errors='ignore')
        # Clean printable characters
        lines = []
        for line in unicode_str.split('\n'):
            cleaned = re.sub(r'[^\w\s\.\,\:\;\-\(\)\[\]\/\#\%\&\*\+\=\<\>\'\"]+', ' ', line).strip()
            if len(cleaned) > 5 and not cleaned.isnumeric():
                lines.append(cleaned)
        
        print("\n".join(lines[:150]))
    except Exception as e:
        print(f"Error reading doc: {e}")

downloads = r"C:\Users\priya\Downloads"
files = [
    "1.Cover page.doc",
    "2.College Certificate.doc",
    "3.Company certificate format.docx",
    "4.ACKNOWLEDGMENT.docx",
    "5.IT - Summer internship Report Format.doc"
]

for f in files:
    fp = os.path.join(downloads, f)
    if os.path.exists(fp):
        if f.endswith('.docx'):
            extract_from_docx(fp)
        else:
            extract_from_doc(fp)
    else:
        print(f"File not found: {fp}")
