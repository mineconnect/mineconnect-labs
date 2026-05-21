// Lógica pura de captación de leads para MineConnect Labs.
// Sin dependencias del DOM: testeable con jest en entorno node.

export const TIPOS_PROYECTO = [
  'Landing page',
  'Sitio web institucional',
  'Tienda online',
  'App móvil',
  'Sistema/automatización a medida',
  'Curso de IA',
];

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Deja solo dígitos y normaliza un teléfono argentino a formato wa.me (sin +).
export function normalizarTelefono(raw) {
  if (raw == null) return '';
  return String(raw).replace(/\D/g, '');
}

export function validarLead(lead = {}) {
  const errores = {};
  const nombre = String(lead.nombre ?? '').trim();
  const contacto = String(lead.contacto ?? '').trim();
  const tipo = String(lead.tipo ?? '').trim();

  if (nombre.length < 2) errores.nombre = 'Ingresá tu nombre.';

  // El contacto es válido si es un email O un teléfono de al menos 8 dígitos.
  const esEmail = RE_EMAIL.test(contacto);
  const esTel = normalizarTelefono(contacto).length >= 8;
  if (!esEmail && !esTel) {
    errores.contacto = 'Dejá un email o teléfono válido.';
  }

  if (!TIPOS_PROYECTO.includes(tipo)) {
    errores.tipo = 'Elegí qué necesitás.';
  }

  return { valido: Object.keys(errores).length === 0, errores };
}

// Arma el cuerpo del mensaje (texto plano) a partir de un lead validado.
export function construirMensaje(lead = {}) {
  const lineas = [
    '¡Hola MineConnect Labs! Quiero pedir un presupuesto.',
    '',
    `• Nombre: ${String(lead.nombre ?? '').trim()}`,
    `• Negocio/Rubro: ${String(lead.negocio ?? '').trim() || 'No especificado'}`,
    `• Necesito: ${String(lead.tipo ?? '').trim()}`,
    `• Contacto: ${String(lead.contacto ?? '').trim()}`,
  ];
  const detalle = String(lead.detalle ?? '').trim();
  if (detalle) lineas.push(`• Detalle: ${detalle}`);
  return lineas.join('\n');
}

// Deep link a WhatsApp con el mensaje prearmado.
export function construirUrlWhatsapp(lead, telefono) {
  const tel = normalizarTelefono(telefono);
  const texto = encodeURIComponent(construirMensaje(lead));
  return `https://wa.me/${tel}?text=${texto}`;
}

// Enlace mailto de respaldo.
export function construirMailto(lead, email) {
  const asunto = encodeURIComponent(
    `Pedido de presupuesto: ${String(lead.tipo ?? '').trim() || 'Proyecto'}`
  );
  const cuerpo = encodeURIComponent(construirMensaje(lead));
  return `mailto:${email}?subject=${asunto}&body=${cuerpo}`;
}
