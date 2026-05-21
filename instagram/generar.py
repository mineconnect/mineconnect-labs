#!/usr/bin/env python3
# Genera los SVG de los posts de Instagram (1080x1080) para MineConnect Labs
# y los rasteriza a PNG con qlmanage + sips (herramientas nativas de macOS).
import os, subprocess, html

OUT = os.path.dirname(os.path.abspath(__file__))

BG = "#0a0e1a"; BG2 = "#111729"; TXT = "#e8edf7"; MUT = "#9aa7c2"
BRAND = "#4f8cff"; ACC = "#2ee6a6"; PUR = "#7c5cff"

DEFS = f'''
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{BG}"/><stop offset="1" stop-color="{BG2}"/>
    </linearGradient>
    <radialGradient id="g1" cx="0.2" cy="0.15" r="0.7">
      <stop offset="0" stop-color="{PUR}" stop-opacity="0.4"/><stop offset="1" stop-color="{PUR}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0.9" cy="0.9" r="0.7">
      <stop offset="0" stop-color="{ACC}" stop-opacity="0.28"/><stop offset="1" stop-color="{ACC}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="{BRAND}"/><stop offset="1" stop-color="{ACC}"/>
    </linearGradient>
  </defs>'''

def esc(s): return html.escape(s, quote=True)

def text(x, y, s, size, fill, weight="700", anchor="start", grad=False):
    f = 'fill="url(#grad)"' if grad else f'fill="{fill}"'
    return (f'<text x="{x}" y="{y}" font-family="Helvetica, Arial, sans-serif" '
            f'font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" {f}>{esc(s)}</text>')

def header():
    return (f'<rect x="80" y="80" width="40" height="40" rx="11" fill="url(#grad)"/>'
            + text(135, 110, "MineConnect Labs", 34, TXT, "800"))

def footer():
    return (text(80, 1000, "mineconnect.com.ar", 30, BRAND, "700")
            + text(1000, 1000, "@mineconnect.labs", 28, MUT, "600", "end"))

def bullet(x, y, s, size=44):
    return (f'<circle cx="{x+10}" cy="{y-14}" r="10" fill="{ACC}"/>'
            + text(x+40, y, s, size, TXT, "600"))

def base(inner):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">'
            + DEFS
            + f'<rect width="1080" height="1080" fill="url(#bg)"/>'
            + f'<rect width="1080" height="1080" fill="url(#g1)"/>'
            + f'<rect width="1080" height="1080" fill="url(#g2)"/>'
            + header() + inner + footer() + '</svg>')

POSTS = {}

# 1 - Portada / marca
POSTS["01-portada"] = base(
    text(80, 300, "● Software a medida", 30, ACC, "600")
    + text(80, 470, "TU NEGOCIO", 96, TXT, "800")
    + text(80, 580, "necesita su", 96, TXT, "800")
    + text(80, 690, "propio software", 96, TXT, "800", grad=True)
    + text(80, 800, "Web · Apps · IA · Listo en días", 40, MUT, "500")
)

# 2 - Tip: señales de que necesitás web
POSTS["02-senales-web"] = base(
    text(80, 280, "¿Todavía sin web propia?", 52, BRAND, "800")
    + text(80, 360, "3 señales de que ya la necesitás", 40, MUT, "500")
    + bullet(80, 520, "Tus clientes te buscan en Google y no te encuentran", 42)
    + bullet(80, 640, "Vendés y tomás pedidos a mano por DM", 42)
    + bullet(80, 760, "Pagás apps que no se adaptan a tu negocio", 42)
    + text(80, 900, "Te la hacemos en días →", 40, ACC, "700")
)

# 3 - Cursos IA
POSTS["03-cursos-ia"] = base(
    text(80, 300, "ACADEMIA IA", 36, PUR, "800")
    + text(80, 440, "Aprendé a usar la IA", 74, TXT, "800")
    + text(80, 530, "para vender más", 74, TXT, "800", grad=True)
    + bullet(80, 660, "Cursos premium en español", 40)
    + bullet(80, 760, "Material gratis de YouTube incluido", 40)
    + bullet(80, 860, "Plantillas, certificado y comunidad", 40)
)

# 4 - Gimnasios
POSTS["04-gimnasios"] = base(
    text(80, 300, "GIMNASIOS 💪", 44, ACC, "800")
    + text(80, 450, "App de socios", 86, TXT, "800")
    + text(80, 550, "y cuotas", 86, TXT, "800", grad=True)
    + bullet(80, 690, "Avisos automáticos de cuotas vencidas", 40)
    + bullet(80, 790, "Rutinas y control de socios", 40)
    + text(80, 910, "Recuperá la plata que se te escapa →", 36, MUT, "600")
)

# 5 - Bares
POSTS["05-bares"] = base(
    text(80, 300, "BARES & RESTOS 🍺", 44, ACC, "800")
    + text(80, 450, "Pedidos directo", 80, TXT, "800")
    + text(80, 550, "a tu WhatsApp", 80, TXT, "800", grad=True)
    + bullet(80, 690, "Menú online y botón de pedido", 40)
    + bullet(80, 790, "Sin comisiones de apps de terceros", 40)
    + text(80, 910, "Listo en 3 a 5 días →", 40, ACC, "700")
)

# 6 - CTA presupuesto
POSTS["06-cta"] = base(
    text(540, 360, "PRESUPUESTO", 80, TXT, "800", "middle")
    + text(540, 470, "GRATIS", 110, ACC, "800", "middle", grad=True)
    + text(540, 600, "Contanos tu idea hoy", 44, MUT, "500", "middle")
    + text(540, 670, "y en días la tenés online", 44, MUT, "500", "middle")
    + text(540, 820, "📲 +54 9 383 432-7244", 46, BRAND, "700", "middle")
)

def render():
    made = []
    for name, svg in POSTS.items():
        svgp = os.path.join(OUT, f"{name}.svg")
        with open(svgp, "w", encoding="utf-8") as f:
            f.write(svg)
        # qlmanage produce thumbnail cuadrado a 1080 (la imagen ya es cuadrada)
        subprocess.run(["qlmanage", "-t", "-s", "1080", "-o", OUT, svgp],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        thumb = svgp + ".png"
        png = os.path.join(OUT, f"{name}.png")
        if os.path.exists(thumb):
            os.replace(thumb, png)
            # asegurar 1080x1080 exacto
            subprocess.run(["sips", "-z", "1080", "1080", png, "--out", png],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            made.append(name)
    return made

if __name__ == "__main__":
    print("Generados:", render())
