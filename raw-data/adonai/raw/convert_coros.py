import re
import os
import xml.dom.minidom as minidom
from xml.etree import ElementTree as ET

def create_openlyrics_xml(title, lyrics, number):
    """Crea un archivo XML en formato OpenLyrics para un coro"""
    # Crear la estructura XML base
    openlyrics = ET.Element("song")
    openlyrics.set("xmlns", "http://openlyrics.info/namespace/2009/song")
    openlyrics.set("version", "0.8")
    
    # Agregar propiedades
    properties = ET.SubElement(openlyrics, "properties")
    titles = ET.SubElement(properties, "titles")
    ET.SubElement(titles, "title").text = title
    
    # Agregar la letra
    lyrics_elem = ET.SubElement(openlyrics, "lyrics")
    verse = ET.SubElement(lyrics_elem, "verse")
    verse.set("name", "v1")
    lines = ET.SubElement(verse, "lines")
    lines.text = lyrics.strip()
    
    # Crear el árbol XML y formatearlo
    tree = ET.ElementTree(openlyrics)
    xml_str = ET.tostring(openlyrics, encoding="utf-8")
    
    # Formatear el XML para que sea legible
    dom = minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent="  ")
    
    # Guardar el archivo
    filename = f"CORO {number:03d}.xml"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(pretty_xml)
    
    return filename

def process_file(file_path):
    """Procesa el archivo de coros y crea los archivos XML individuales"""
    # Obtener rutas absolutas para evitar problemas con directorios
    file_path = os.path.abspath(file_path)
    current_dir = os.path.dirname(file_path)
    output_dir = os.path.join(current_dir, "coros_xml")
    
    # Crear directorio para los archivos XML si no existe
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Leer el archivo primero antes de cambiar de directorio
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Cambiar al directorio de salida después de leer el archivo
    os.chdir(output_dir)
    
    # Eliminar las comillas del contenido
    content = content.replace('"', '')
    
    # Patrón para encontrar los coros por su número
    pattern = r'(?:^|\n)\s*(\d+)\s*,\s*\n((?:(?!\n\s*\d+\s*,)[\s\S])*)'
    
    # Encontrar todos los coros
    matches = re.findall(pattern, content)
    
    files_created = []
    for num, lyrics in matches:
        # Eliminar líneas que contienen solo categorías
        if re.match(r'^COROS|^TONO', lyrics.strip()):
            continue
        
        # Crear título para el coro
        title = f"CORO {num}"
        
        # Limpiar la letra (eliminar espacios innecesarios y líneas vacías)
        clean_lyrics = re.sub(r'^\s+|\s+$', '', lyrics, flags=re.MULTILINE)
        clean_lyrics = re.sub(r'\n\s*\n', '\n', clean_lyrics)
        
        # Crear el archivo XML
        filename = create_openlyrics_xml(title, clean_lyrics, int(num))
        files_created.append(filename)
        print(f"Creado: {filename}")
    
    print(f"\nTotal de archivos creados: {len(files_created)}")
    return files_created

if __name__ == "__main__":
    # Usar automáticamente 'raw.txt' del directorio actual
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, "raw.txt")
    
    if os.path.exists(file_path):
        print(f"Procesando archivo: {file_path}")
        process_file(file_path)
    else:
        print(f"El archivo {file_path} no existe.")