"""Create matching vector/raster QR artwork and verify the raster decodes."""
from pathlib import Path
from html import escape
import qrcode
from PIL import Image, ImageDraw, ImageFilter
import zxingcpp

URL = 'http://sevenlizards.com/'
OUT = Path(__file__).resolve().parents[1] / 'output' / 'qr'
OUT.mkdir(parents=True, exist_ok=True)
qr = qrcode.QRCode(version=4, error_correction=qrcode.constants.ERROR_CORRECT_H, border=0)
qr.add_data(URL)
qr.make(fit=False)
matrix = qr.get_matrix()
N, M, BORDER = len(matrix), 30, 4
SIZE = (N + BORDER * 2) * M
image = Image.new('RGB', (SIZE, SIZE), 'white')
draw = ImageDraw.Draw(image)
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}" width="{SIZE}" height="{SIZE}" role="img" aria-label="Seven Lizards QR code">', f'<title>Seven Lizards — {escape(URL)}</title>']
INK, ACCENT, GOLD = '#263c33', '#984c32', '#b98024'

def rect(x, y, w, h, fill, r=0):
    draw.rounded_rectangle((x, y, x+w-1, y+h-1), radius=r, fill=fill)
    svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"/>')

def line(points, fill=INK, width=5):
    draw.line(points, fill=fill, width=width, joint='curve')
    radius = width/2
    for x,y in (points[0],points[-1]):
        draw.ellipse((x-radius,y-radius,x+radius,y+radius),fill=fill)
    coords = ' '.join(f'{x},{y}' for x,y in points)
    svg.append(f'<polyline points="{coords}" stroke="{fill}" stroke-width="{width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')

rect(0,0,SIZE,SIZE,'white')
finder_origins = [(0,0),(N-7,0),(0,N-7)]
for y,row in enumerate(matrix):
    for x,dark in enumerate(row):
        if any(fx <= x < fx+7 and fy <= y < fy+7 for fx,fy in finder_origins):
            continue
        # Reserve just 7x7 modules for the small central icon.
        if N//2-3 <= x <= N//2+3 and N//2-3 <= y <= N//2+3:
            continue
        if dark:
            rect((x+BORDER)*M,(y+BORDER)*M,M,M,INK,5)
for fx,fy in finder_origins:
    x,y = (fx+BORDER)*M,(fy+BORDER)*M
    rect(x,y,7*M,7*M,INK,36)
    rect(x+M,y+M,5*M,5*M,'white',22)
    rect(x+2*M,y+2*M,3*M,3*M,ACCENT,16)

# A small vector tower crane, not an AI-generated QR pattern.
c = SIZE/2
left,top = c-3.5*M,c-3.5*M
rect(left+7,top+7,7*M-14,7*M-14,'#f6efdf',24)
def pt(x,y): return (left+x,top+y)
def crane(points, color=INK, width=5): line([pt(x,y) for x,y in points],color,width)
crane([(87,175),(87,66),(107,66),(107,175)],GOLD,7)
crane([(77,178),(117,178)],INK,6)
crane([(89,163),(105,143),(89,122),(105,101),(89,79)],GOLD,4)
crane([(26,65),(179,65),(179,80),(26,80),(26,65)],INK,5)
crane([(28,78),(47,66),(65,78),(84,66),(103,78),(122,66),(141,78),(160,66),(178,78)],GOLD,3)
crane([(97,65),(97,33),(30,64)],INK,4)
crane([(97,33),(175,64)],INK,4)
rect(left+24,top+83,28,19,ACCENT,3)
rect(left+109,top+82,21,24,GOLD,3)
crane([(162,82),(162,124)],INK,4)
crane([(162,124),(169,130),(168,139),(160,143),(154,139)],INK,5)
svg.append('</svg>')
(OUT/'sevenlizards-crane.svg').write_text('\n'.join(svg),encoding='utf-8')
image.save(OUT/'sevenlizards-crane.png',dpi=(300,300))

checks = {'original': image}
for size in (410,246,164):
    checks[f'{size}px'] = image.resize((size,size),Image.Resampling.LANCZOS)
checks['grayscale'] = image.convert('L')
checks['slight blur'] = image.resize((410,410),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(.5))
for name,sample in checks.items():
    result = zxingcpp.read_barcode(sample)
    assert result and result.text == URL, f'QR decode failed: {name}'
    print(f'PASS {name}: {result.text}')
print(f'Saved PNG + SVG in {OUT}')
