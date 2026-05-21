#!/usr/bin/env python3
# Genera un folleto/flyer vertical (1080x1350) para imprimir o publicar.
# Truco: lienzo cuadrado 1350x1350 con el contenido en la banda central de
# 1080 de ancho (x 135..1215); luego se recorta a 1080x1350 con sips.
import os, subprocess, html
OUT = os.path.dirname(os.path.abspath(__file__))
BG="#0a0e1a"; BG2="#111729"; TXT="#e8edf7"; MUT="#9aa7c2"; BRAND="#4f8cff"; ACC="#2ee6a6"; PUR="#7c5cff"
X0=135  # margen izquierdo de la banda (centra el contenido de 1080 ancho)

def esc(s): return html.escape(s, quote=True)
def t(x,y,s,size,fill,w="700",a="start",grad=False):
    f='fill="url(#grad)"' if grad else f'fill="{fill}"'
    return f'<text x="{X0+x}" y="{y}" font-family="Helvetica,Arial,sans-serif" font-size="{size}" font-weight="{w}" text-anchor="{a}" {f}>{esc(s)}</text>'
def bullet(x,y,s,size=38):
    return f'<circle cx="{X0+x+9}" cy="{y-13}" r="9" fill="{ACC}"/>'+t(x+36,y,s,size,TXT,"600")

inner = (
    # header
    f'<rect x="{X0}" y="70" width="44" height="44" rx="12" fill="url(#grad)"/>'
    + t(60,102,"MineConnect Labs",36,TXT,"800")
    + t(0,250,"● Tu socio tecnológico",30,ACC,"600")
    + t(0,360,"SOFTWARE A",78,TXT,"800")
    + t(0,450,"MEDIDA",78,TXT,"800",grad=True)
    + t(0,540,"para tu negocio, listo en días",38,MUT,"500")
    # servicios
    + t(0,680,"Qué hacemos:",40,BRAND,"800")
    + bullet(0,760,"Páginas web que venden")
    + bullet(0,830,"Apps móviles a medida")
    + bullet(0,900,"Tiendas online con pagos")
    + bullet(0,970,"Sistemas y automatización con IA")
    + bullet(0,1040,"Academia de cursos de IA")
    # CTA box
    + f'<rect x="{X0}" y="1110" width="1080" height="170" rx="20" fill="rgba(79,140,255,0.12)" stroke="{BRAND}" stroke-opacity="0.4"/>'
    + t(40,1175,"Presupuesto GRATIS",46,ACC,"800")
    + t(40,1230,"📲 +54 9 383 432-7244",38,TXT,"700")
    + t(1040,1230,"mineconnect.com.ar",32,BRAND,"700","end")
)

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="1350" height="1350" viewBox="0 0 1350 1350">'
  f'<defs>'
  f'<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{BG}"/><stop offset="1" stop-color="{BG2}"/></linearGradient>'
  f'<radialGradient id="g1" cx="0.2" cy="0.1" r="0.7"><stop offset="0" stop-color="{PUR}" stop-opacity="0.4"/><stop offset="1" stop-color="{PUR}" stop-opacity="0"/></radialGradient>'
  f'<radialGradient id="g2" cx="0.85" cy="0.9" r="0.7"><stop offset="0" stop-color="{ACC}" stop-opacity="0.25"/><stop offset="1" stop-color="{ACC}" stop-opacity="0"/></radialGradient>'
  f'<linearGradient id="grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{BRAND}"/><stop offset="1" stop-color="{ACC}"/></linearGradient>'
  f'</defs>'
  f'<rect width="1350" height="1350" fill="url(#bg)"/>'
  f'<rect width="1350" height="1350" fill="url(#g1)"/>'
  f'<rect width="1350" height="1350" fill="url(#g2)"/>'
  + inner + '</svg>')

svgp=os.path.join(OUT,"folleto.svg"); png=os.path.join(OUT,"folleto.png")
open(svgp,"w",encoding="utf-8").write(svg)
subprocess.run(["qlmanage","-t","-s","1350","-o",OUT,svgp],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
thumb=svgp+".png"
if os.path.exists(thumb):
    os.replace(thumb,png)
    # recortar banda central a 1080 ancho x 1350 alto, luego normalizar
    subprocess.run(["sips","-c","1350","1080",png,"--out",png],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    print("OK folleto.png")
else:
    print("ERROR: no se generó el thumbnail")
