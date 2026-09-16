import os
import zipfile
import xml.etree.ElementTree as ET

def read_docx(path):
    print(f"=== Reading DOCX: {path} ===")
    try:
        with zipfile.ZipFile(path, 'r') as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            # extract text
            texts = []
            for elem in tree.iter():
                if elem.tag.endswith('t') and elem.text:
                    texts.append(elem.text)
                elif elem.tag.endswith('p'):
                    texts.append('\n')
            print(''.join(texts))
    except Exception as e:
        print(f"Error reading {path}: {e}")

def read_doc_strings(path):
    print(f"=== Reading DOC text strings: {path} ===")
    try:
        with open(path, 'rb') as f:
            data = f.read()
        # extract printable ascii/utf16 strings
        import re
        # Find printable ascii strings >= 4 chars
        ascii_strings = re.findall(rb'[ -~]{4,}', data)
        for s in ascii_strings[:50]:
            try:
                txt = s.decode('ascii')
                if len(txt.strip()) > 3:
                    print(txt)
            except:
                pass
    except Exception as e:
        print(f"Error reading {path}: {e}")

downloads_dir = r"c:\Users\priya\Downloads"
for fname in os.listdir(downloads_dir):
    if fname.startswith("1.") or fname.startswith("2.") or fname.startswith("3.") or fname.startswith("4.") or fname.startswith("5."):
        full_p = os.path.join(downloads_dir, fname)
        if fname.endswith(".docx"):
            read_docx(full_p)
        elif fname.endswith(".doc"):
            read_doc_strings(full_p)
