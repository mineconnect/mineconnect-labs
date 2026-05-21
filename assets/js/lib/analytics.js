// Analítica liviana sobre Google Analytics 4 (gratis).
// Lógica pura testeable + helpers que son no-op si GA no está configurado,
// así el sitio nunca rompe por falta de ID ni mete tracking sin querer.

// Placeholder: reemplazar por tu Measurement ID real de GA4 (formato G-XXXXXXXXXX).
// Se saca gratis en https://analytics.google.com (Admin -> Flujos de datos -> Web).
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// El tracking solo se activa con un ID real (no el placeholder, formato válido).
export function trackingHabilitado(id = GA_MEASUREMENT_ID) {
  return /^G-[A-Z0-9]{6,}$/.test(String(id || '')) && id !== 'G-XXXXXXXXXX';
}

// URL del script de gtag para un ID dado.
export function urlGtag(id) {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
}

// Normaliza los parámetros de un evento: nombre limpio + props sin nulos.
export function paramsEvento(nombre, props = {}) {
  const limpio = {};
  for (const [k, v] of Object.entries(props)) {
    if (v != null && v !== '') limpio[k] = v;
  }
  return { evento: String(nombre || 'evento').trim() || 'evento', props: limpio };
}

// Inyecta gtag una sola vez (no-op si el tracking no está habilitado o no hay DOM).
export function initAnalytics(id = GA_MEASUREMENT_ID, doc = (typeof document !== 'undefined' ? document : null)) {
  if (!trackingHabilitado(id) || !doc || doc.getElementById('ga-script')) return false;
  const s = doc.createElement('script');
  s.async = true;
  s.id = 'ga-script';
  s.src = urlGtag(id);
  doc.head.appendChild(s);

  const w = doc.defaultView || (typeof window !== 'undefined' ? window : {});
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() { w.dataLayer.push(arguments); };
  w.gtag('js', new Date());
  w.gtag('config', id);
  return true;
}

// Dispara un evento si gtag existe; si no, no hace nada (no rompe).
export function track(nombre, props = {}, w = (typeof window !== 'undefined' ? window : null)) {
  const { evento, props: limpio } = paramsEvento(nombre, props);
  if (w && typeof w.gtag === 'function') {
    w.gtag('event', evento, limpio);
    return true;
  }
  return false;
}
