# Onboarding — MineConnect Labs

Landing de captación + mini-CRM para vender **desarrollo de software a medida**
(web, apps, tiendas, sistemas) y **cursos de IA** a PyMEs, bares, gimnasios y locales.
Stack estático (HTML/CSS/JS ES Modules, sin build) desplegado en GitHub Pages.

- **Live:** https://mineconnect.github.io/mineconnect-labs/
- **CRM:** https://mineconnect.github.io/mineconnect-labs/crm.html
- **Repo:** https://github.com/mineconnect/mineconnect-labs
- **Contacto del negocio:** contacto@mineconnect.com.ar · +54 9 383 432-7244

## Cómo arrancar

```bash
npm install      # solo dependencias de test (jest + babel)
npm test         # 68 tests; deben pasar todos
npx serve .      # previsualizar la landing localmente (o abrir index.html)
```

## Mapa del proyecto

| Ruta | Qué es |
|------|--------|
| `index.html` | Landing (una sola página). |
| `crm.html` | CRM interno de leads (persiste en `localStorage`). |
| `assets/js/lib/leads.js` | **Lógica pura**: validación + armado de mensaje WhatsApp/mailto. |
| `assets/js/lib/pricing.js` | **Lógica pura**: planes y cotizador. |
| `assets/js/lib/crm.js` | **Lógica pura**: dedupe, estados, stats, export CSV. |
| `assets/js/lib/csv.js` | **Lógica pura**: parser CSV + import de prospectos al CRM. |
| `assets/js/app.js` | Interfaz de la landing (cablea la lógica al DOM). |
| `assets/js/app-crm.js` | Interfaz del CRM (delegación de eventos + localStorage). |
| `assets/og-image.{svg,png}` | Imagen de preview al compartir el link. |
| `tests/` | Tests jest: 68 (unitarios de lógica pura + integración jsdom). |
| `EMAIL-SEQUENCES.md` | 4 secuencias de prospección en frío listas para enviar. |
| `PROSPECCION.md` + `prospectos-template.csv` | Guía de fuentes + plantilla para cargar negocios. |

## Convenciones

- **Toda lógica de negocio va en `assets/js/lib/*.js` como funciones puras** (sin DOM),
  y se testea con jest. La capa `app*.js` solo cablea esa lógica al DOM.
- Los datos de usuario que se renderizan en el CRM se escapan con `escapar()` (anti-XSS).
- Antes de dar algo por terminado: `npm test` en verde (68/68 hoy).

## Deploy

Push a `main` → GitHub Pages reconstruye solo (HTTPS automático). Verificar con:

```bash
gh api repos/mineconnect/mineconnect-labs/pages --jq .status   # debe quedar "built"
curl -sI https://mineconnect.github.io/mineconnect-labs/ | head -1
```

## Cómo funciona la venta (circuito completo)

1. El visitante entra a la landing y completa el formulario.
2. La landing valida, cotiza y arma un deep-link a **WhatsApp** (+ mailto de respaldo).
3. El lead llega con todos los datos al WhatsApp del negocio.
4. Se carga en el **CRM** y se sigue por estados hasta cerrar.

## Próximos pasos pendientes (requieren acción humana / login)

- Cargar negocios reales en `prospectos-template.csv` (ver `PROSPECCION.md`).
- Enviar las secuencias de email a mano, de a 10-20 por día.
- Opcional: conectar analytics (GA/Plausible) y/o un subdominio propio (DNS).
- Opcional: importador de `prospectos.csv` → CRM cuando el volumen lo justifique.
