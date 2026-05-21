# Guía de prospección — MineConnect Labs

> **Por qué no hay una lista de empresas ya cargada acá:** inventar nombres,
> emails o teléfonos de negocios reales sería peligroso (mandarías mensajes a
> direcciones equivocadas y quemarías tu dominio). Esta guía te dice **dónde
> sacar contactos reales y verificados**, y te deja una plantilla para cargarlos.

---

## 1. Dónde conseguir contactos reales (fuentes públicas y legítimas)

| Fuente | Qué sacás | Cómo |
|--------|-----------|------|
| **Google Maps** | Bares, gimnasios, locales de tu zona con teléfono y, a veces, web/mail | Buscá "gimnasios en [tu ciudad]", abrí cada ficha, copiá tel/web |
| **Instagram / Facebook** | Negocios activos sin web propia (buena señal: venden por DM) | Buscá hashtags locales (#barescatamarca, etc.) y mirá la bio |
| **Cámaras de comercio / asociaciones locales** | Padrón de PyMEs de la zona | Muchas publican listados de socios |
| **Páginas Amarillas / guías locales** | Teléfonos de comercios | paginasamarillas.com.ar y similares |
| **Tu red personal** | Los que mejor convierten | Conocidos, referidos, vecinos comerciantes |

**Regla de oro:** usá solo el **mail/teléfono público de contacto del negocio**
(el que ellos mismos publican). No compres bases de datos ni scrapees datos
personales: además de poco efectivo, te expone legalmente (Ley 25.326).

---

## 2. Plantilla de carga

Usá `prospectos-template.csv` (en este repo). Una fila por negocio:

```
negocio,rubro,contacto_email,contacto_tel,ciudad,fuente,secuencia,estado,notas
```

- **secuencia**: `A` (bares), `B` (gimnasios), `C` (PyMEs/locales), `D` (academia IA) — ver `EMAIL-SEQUENCES.md`
- **estado**: pendiente → enviado_1 → enviado_2 → enviado_3 → respondió → cerrado / descartado

---

## 3. Flujo recomendado (de la lista al cierre)

1. **Cargá 20-30 negocios** en el CSV desde las fuentes de arriba.
2. **Personalizá** cada Email 1 con el nombre del negocio y algo que viste (su Instagram, que no tiene web).
3. **Enviá a mano**, de a 10-20 por día, desde tu correo normal. Marcá `enviado_1` y la fecha.
4. **Seguimiento:** Email 2 a los 4 días, Email 3 a los 8 (solo a quienes no respondieron).
5. **Cuando alguien responde o escribe al WhatsApp:** cargalo en el **CRM** (`crm.html`) y seguilo ahí hasta cerrar.

---

## 4. Metas realistas (no te engañes)

- De cada **100 mails bien personalizados**, esperá **2-4 conversaciones** reales.
- De cada **10 conversaciones**, **1-2 cierres** si el precio y el timing acompañan.
- O sea: ~100 mails → ~1-2 ventas. Por eso importa el volumen Y la personalización, no una sola cosa.

---

## 5. Cuándo automatizar (y cuándo NO)

- **Al principio (0-100 contactos): a mano.** Más personal, mejor entrega, aprendés qué funciona.
- **Cuando ya tengas un mensaje que convierte y volumen:** ahí sí conectamos una
  herramienta de envío (con tu login) y, si el volumen lo pide, te armo un
  importador del CSV directo al CRM. No antes: automatizar algo que todavía no
  vende solo multiplica el ruido.
