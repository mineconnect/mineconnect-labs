# MineConnect Labs

Landing de captación de **MineConnect Labs**: desarrollo de software a medida (web, apps móviles, sistemas y tiendas online) y academia de cursos de IA para PyMEs, bares, gimnasios y locales.

> **Propuesta:** tu producto digital, listo en días, sin suscripciones eternas. Es tuyo.

## Stack
- HTML + CSS + JavaScript (ES Modules) — **sin frameworks ni build**, para hosting estático gratuito y seguro (GitHub Pages, HTTPS incluido).
- Lógica de negocio en módulos puros (`assets/js/lib/`) **cubierta por tests jest**.

## Cómo cierra ventas
El formulario de contacto valida los datos, estima un rango de precio en vivo y arma un
mensaje estructurado que dispara a:
- **WhatsApp** del negocio (`+54 9 383 432-7244`) con todo el pedido precargado.
- **Email** (`contacto@mineconnect.com.ar`) como respaldo.

No requiere backend ni servicios pagos: el lead llega íntegro al canal de venta.

## Desarrollo

```bash
npm install
npm test          # corre los tests jest de la lógica pura
```

Para previsualizar localmente, servila como estática:

```bash
npx serve .       # o cualquier servidor estático; abrir index.html
```

## CRM de leads (`crm.html`)
Panel interno para anotar y seguir los leads que llegan por WhatsApp: estados
(nuevo → contactado → presupuestado → cerrado/perdido), búsqueda, tasa de cierre
y exportación a CSV. Persiste en `localStorage` del navegador (privado, sin servidores).

## Estructura
```
index.html                 Landing (una sola página)
crm.html                   CRM interno de leads (localStorage)
assets/css/styles.css      Estilos
assets/js/app.js           Interfaz de la landing
assets/js/app-crm.js       Interfaz del CRM
assets/js/lib/leads.js     Validación + armado de mensaje/links (puro, testeado)
assets/js/lib/pricing.js   Planes + cotizador (puro, testeado)
assets/js/lib/crm.js       Lógica del CRM: dedupe, estados, stats, CSV (puro, testeado)
tests/                     Tests jest (118 en total)
```

## Deploy
Publicado con **GitHub Pages** desde la rama `main`. HTTPS automático.
