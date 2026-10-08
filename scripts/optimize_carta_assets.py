"""Optimiza las imágenes aprobadas de Carta sin modificar las fuentes generadas."""
from pathlib import Path
import json
from PIL import Image

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'docs/CARTA_ASSETS_GENERADOS.json').read_text(encoding='utf-8'))
for asset in manifest['assets']:
    target = root / 'public/images/carta' / (asset['name'] + '.webp')
    if target.exists():
        continue
    target.parent.mkdir(parents=True, exist_ok=True)
    source = Image.open(asset['path'])
    if asset['name'].startswith(('title', 'categories/')):
        source = source.convert('RGBA')
        bounds = source.getchannel('A').getbbox()
        if bounds:
            source = source.crop(bounds)
        source.thumbnail((256, 224) if asset['name'].startswith('categories/') else (1400, 1000))
        source.save(target, quality=90, method=6)
    else:
        source = source.convert('RGB')
        source.thumbnail((640, 480) if asset['name'].startswith('products/') else (2172, 1200))
        source.save(target, quality=85, method=6)
print(f"{len(manifest['assets'])} imágenes de Carta disponibles")
