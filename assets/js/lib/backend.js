// Envío del lead a un backend para que NO dependa de que el visitante
// apriete WhatsApp/email. Usa Formspree (plan gratis: 50 envíos/mes, sin tarjeta).
//
// Cómo activarlo (gratis):
//   1. Crear un form en https://formspree.io con el email contacto@mineconnect.com.ar
//   2. Copiar el endpoint (https://formspree.io/f/XXXXXXXX)
//   3. Pegarlo abajo en FORMSPREE_ENDPOINT
// Mientras esté el placeholder, el envío es no-op y el form sigue andando por WhatsApp.

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/XXXXXXXX';

// El backend solo se usa si hay un endpoint real configurado.
export function backendConfigurado(url = FORMSPREE_ENDPOINT) {
  return /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(String(url || '')) && !/XXXXXXXX/.test(url);
}

// Arma el payload limpio que se manda al backend (sin campos vacíos).
export function payloadLead(lead = {}) {
  const base = {
    nombre: String(lead.nombre ?? '').trim(),
    negocio: String(lead.negocio ?? '').trim(),
    tipo: String(lead.tipo ?? '').trim(),
    contacto: String(lead.contacto ?? '').trim(),
    detalle: String(lead.detalle ?? '').trim(),
    paginas: lead.paginas ?? '',
    integraciones: lead.integraciones ?? '',
    urgente: lead.urgente ? 'sí' : 'no',
    origen: 'landing mineconnect-labs',
    fecha: new Date().toISOString(),
  };
  const limpio = {};
  for (const [k, v] of Object.entries(base)) {
    if (v !== '' && v != null) limpio[k] = v;
  }
  return limpio;
}

// Envía el lead al backend. fetchImpl inyectable para testear sin red.
// Devuelve { enviado: bool, motivo? }. Nunca lanza: el form no debe romperse.
export async function enviarLead(lead, url = FORMSPREE_ENDPOINT, fetchImpl) {
  if (!backendConfigurado(url)) return { enviado: false, motivo: 'sin-backend' };
  const fn = fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (!fn) return { enviado: false, motivo: 'sin-fetch' };
  try {
    const res = await fn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payloadLead(lead)),
    });
    return { enviado: !!(res && res.ok), motivo: res && res.ok ? undefined : 'respuesta-no-ok' };
  } catch (e) {
    return { enviado: false, motivo: 'error-red' };
  }
}
