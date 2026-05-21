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

## Recepción de leads (ya configurada)

El formulario manda cada lead a **FormSubmit** (`assets/js/lib/backend.js`), que lo
reenvía por email a `contacto@mineconnect.com.ar` **sin necesidad de cuenta ni
servidor**. Así el lead llega aunque el visitante no apriete WhatsApp.

> **Único paso manual, una sola vez:** la primera vez que llegue un lead,
> FormSubmit envía un mail de activación a `contacto@mineconnect.com.ar`. Hay que
> abrirlo y confirmar. Desde ahí, cada lead llega automáticamente.

## Activar analytics (opcional, gratis)

Para medir tráfico y conversiones con **Google Analytics 4** (requiere tu cuenta de Google):
- Crear una propiedad en [analytics.google.com](https://analytics.google.com) y copiar el Measurement ID (`G-XXXXXXXXXX`).
- Pegarlo en `GA_MEASUREMENT_ID` (`assets/js/lib/analytics.js`).
- Se registran eventos clave: `cta_plan`, `cta_curso`, `lead_enviado`.
- Mientras esté el placeholder, el tracking es no-op (no rompe nada).

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
assets/js/lib/casos.js     Proyectos/experiencia para prueba social (puro, testeado)
assets/js/lib/analytics.js Google Analytics 4 con activación opcional (puro, testeado)
assets/js/lib/backend.js   Envío del lead a FormSubmit (sin cuenta) — fix del embudo (puro, testeado)
tests/                     Tests jest
```

## Deploy
Publicado con **GitHub Pages** desde la rama `main`. HTTPS automático.
