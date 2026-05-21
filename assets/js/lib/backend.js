// Envío del lead a un backend para que NO dependa de que el visitante
// apriete WhatsApp/email. Usa FormSubmit (https://formsubmit.co):
// reenvío de formularios a un email SIN registro, sin cuenta y sin tarjeta.
//
// Ya viene configurado al email del negocio. Lo ÚNICO pendiente (inevitable en
// cualquier servicio de email): la primera vez que llegue un lead, FormSubmit
// manda un mail de activación a EMAIL_DESTINO. Hay que abrirlo y confirmar una
// sola vez; desde ahí, cada lead llega solo.

export const EMAIL_DESTINO = 'contacto@mineconnect.com.ar';

// Endpoint AJAX de FormSubmit (devuelve JSON, no redirige).
export const FORM_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL_DESTINO}`;

// El backend está configurado si hay un endpoint https válido (no placeholder).
export function backendConfigurado(url = FORM_ENDPOINT) {
  const u = String(url || '');
  return /^https:\/\/formsubmit\.co\/ajax\/.+@.+\..+$/.test(u);
}

// Arma el payload limpio que se manda al backend (sin campos vacíos).
// Los campos con guion bajo son directivas de FormSubmit (asunto, anti-captcha).
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
  limpio._subject = `Nuevo lead: ${base.tipo || 'consulta'} — ${base.nombre || 'sin nombre'}`;
  limpio._template = 'table';
  limpio._captcha = 'false';
  return limpio;
}

// Envía el lead al backend. fetchImpl inyectable para testear sin red.
// Devuelve { enviado: bool, motivo? }. Nunca lanza: el form no debe romperse.
export async function enviarLead(lead, url = FORM_ENDPOINT, fetchImpl) {
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
