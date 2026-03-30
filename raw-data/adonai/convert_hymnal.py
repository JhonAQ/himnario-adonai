import json
import os
import re
from xml.dom.minidom import Document

def create_openlyrics_xml(number, title, lyrics_lines, author="DESCONOCIDO"):
    """Create an OpenLyrics XML document"""
    doc = Document()
    
    # Root element with namespace
    song = doc.createElement("song")
    song.setAttribute("xmlns", "http://openlyrics.info/namespace/2009/song")
    doc.appendChild(song)
    
    # Properties section
    properties = doc.createElement("properties")
    song.appendChild(properties)
    
    # Titles
    titles = doc.createElement("titles")
    properties.appendChild(titles)
    
    title_elem = doc.createElement("title")
    title_text = doc.createTextNode(title.upper())
    title_elem.appendChild(title_text)
    titles.appendChild(title_elem)
    
    # Authors
    authors = doc.createElement("authors")
    properties.appendChild(authors)
    
    author_elem = doc.createElement("author")
    author_text = doc.createTextNode(author)
    author_elem.appendChild(author_text)
    authors.appendChild(author_elem)
    
    # Lyrics section
    lyrics = doc.createElement("lyrics")
    song.appendChild(lyrics)
    
    # Parse verses and chorus
    current_verse = []
    verse_count = 1
    chorus_lines = []
    is_chorus = False
    
    for line in lyrics_lines:
        line = line.strip()
        if not line:
            continue
            
        if line.upper() == "CORO":
            # Save current verse if any
            if current_verse:
                verse = doc.createElement("verse")
                verse.setAttribute("name", f"v{verse_count}")
                lyrics.appendChild(verse)
                
                lines_elem = doc.createElement("lines")
                verse.appendChild(lines_elem)
                
                for verse_line in current_verse:
                    br = doc.createElement("br")
                    lines_elem.appendChild(br)
                    br_text = doc.createTextNode(verse_line)
                    br.appendChild(br_text)
                
                current_verse = []
                verse_count += 1
            
            is_chorus = True
            continue
        
        if is_chorus:
            chorus_lines.append(line)
        else:
            current_verse.append(line)
    
    # Add final verse if any
    if current_verse:
        verse = doc.createElement("verse")
        verse.setAttribute("name", f"v{verse_count}")
        lyrics.appendChild(verse)
        
        lines_elem = doc.createElement("lines")
        verse.appendChild(lines_elem)
        
        for verse_line in current_verse:
            br = doc.createElement("br")
            lines_elem.appendChild(br)
            br_text = doc.createTextNode(verse_line)
            br.appendChild(br_text)
    
    # Add chorus if any
    if chorus_lines:
        chorus = doc.createElement("verse")
        chorus.setAttribute("name", "c")
        lyrics.appendChild(chorus)
        
        lines_elem = doc.createElement("lines")
        chorus.appendChild(lines_elem)
        
        for chorus_line in chorus_lines:
            br = doc.createElement("br")
            lines_elem.appendChild(br)
            br_text = doc.createTextNode(chorus_line)
            br.appendChild(br_text)
    
    return doc.toprettyxml(indent="  ", encoding="utf-8").decode("utf-8")

def determine_category(content, index):
    """Determine the category based on content analysis and position"""
    content_str = " ".join(content) if isinstance(content, list) else str(content)
    
    # Check for section markers in the content
    if "COROS DE ADORACION" in content_str and "TONO MAYOR" in content_str:
        return "COROS DE ADORACION TONO MAYOR"
    elif "COROS DE ADORACION" in content_str and "TONO MENOR" in content_str:
        return "COROS DE ADORACION TONO MENOR"
    elif "COROS DE ALABANZA EVANGELISTICOS" in content_str:
        return "COROS DE ALABANZA EVANGELISTICOS"
    elif "COROS EVANGELISTICOS" in content_str:
        return "COROS EVANGELISTICOS"
    elif "COROS DE ALABANZA" in content_str and "VARIOS" in content_str:
        return "COROS DE ALABANZA VARIOS"
    elif "ADORACION TONO MENOR" in content_str:
        return "ADORACION TONO MENOR"
    
    # If none found, default categorization based on index ranges
    # This will need to be adjusted based on the actual data structure
    return "HIMNOS"

def process_hymnal():
    # Read the JSON file
    with open(r"c:\Users\Dczel\Downloads\adonai\himnario_adonai_completo.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    base_path = r"c:\Users\Dczel\Downloads\adonai"
    
    # Create directories
    categories = [
        "HIMNOS",
        "COROS DE ADORACION TONO MAYOR", 
        "COROS DE ADORACION TONO MENOR",
        "COROS DE ALABANZA EVANGELISTICOS",
        "COROS EVANGELISTICOS",
        "COROS DE ALABANZA VARIOS",
        "ADORACION TONO MENOR"
    ]
    
    for category in categories:
        os.makedirs(os.path.join(base_path, category), exist_ok=True)
    
    # Process each hymn/chorus
    current_category = "HIMNOS"  # Start with hymns
    
    for item in data:
        if not isinstance(item, dict) or "number" not in item:
            continue
            
        number = item["number"]
        title = item["title"]
        lyrics = item["lyrics"]
        
        # Skip items that don't have proper structure
        if not lyrics or not isinstance(lyrics, list):
            continue
        
        # Check if this item contains category markers
        lyrics_text = " ".join(lyrics)
        
        # Update current category based on content
        if "COROS DE ADORACION" in lyrics_text and "TONO MAYOR" in lyrics_text:
            current_category = "COROS DE ADORACION TONO MAYOR"
            continue  # Skip this marker item
        elif "COROS DE ADORACION" in lyrics_text and "TONO MENOR" in lyrics_text:
            current_category = "COROS DE ADORACION TONO MENOR"
            continue
        elif "COROS DE ALABANZA EVANGELISTICOS" in lyrics_text:
            current_category = "COROS DE ALABANZA EVANGELISTICOS"
            continue
        elif "COROS EVANGELISTICOS" in lyrics_text:
            current_category = "COROS EVANGELISTICOS"
            continue
        elif "COROS DE ALABANZA" in lyrics_text and "VARIOS" in lyrics_text:
            current_category = "COROS DE ALABANZA VARIOS"
            continue
        elif "ADORACION TONO MENOR" in lyrics_text:
            current_category = "ADORACION TONO MENOR"
            continue
        
        # Create XML content
        xml_content = create_openlyrics_xml(number, title, lyrics)
        
        # Create filename
        filename = f"{number:03d} {title}.xml"
        # Clean filename for Windows compatibility
        filename = re.sub(r'[<>:"/\\|?*]', '', filename)
        
        file_path = os.path.join(base_path, current_category, filename)
        
        # Write XML file
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(xml_content)
        
        print(f"Created: {current_category}/{filename}")
    
    print(f"\nProcessing complete! All files have been created in their respective categories.")

if __name__ == "__main__":
    process_hymnal()
