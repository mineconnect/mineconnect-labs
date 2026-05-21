// Lógica pura de planes y cotización estimada (en ARS).
// Valores "desde", orientados a PyMEs/locales de Argentina. Testeable con jest.

export const PLANES = [
  {
    id: 'landing',
    nombre: 'Landing Express',
    desde: 180000,
    entrega: '3 a 5 días',
    incluye: [
      'Página de una sola pantalla que convierte',
      'Botón directo a WhatsApp',
      'Diseño mobile-first y carga rápida',
      'Hosting gratuito con HTTPS incluido',
    ],
  },
  {
    id: 'web-pro',
    nombre: 'Web Pro',
    desde: 420000,
    entrega: '7 a 12 días',
    incluye: [
      'Sitio de varias secciones (servicios, sobre nosotros, contacto)',
      'Catálogo o galería de productos',
      'SEO base para aparecer en Google',
      'Formularios de contacto y métricas',
    ],
  },
  {
    id: 'app-medida',
    nombre: 'App / Sistema a medida',
    desde: 900000,
    entrega: '2 a 4 semanas',
    incluye: [
      'Aplicación web o móvil pensada para tu operación',
      'Reemplaza planillas y suscripciones que pagás de más',
      'Base de datos propia, sin depender de terceros',
      'Capacitación y soporte de puesta en marcha',
    ],
  },
  {
    id: 'academia-ia',
    nombre: 'Academia IA',
    desde: 89000,
    entrega: 'Acceso inmediato',
    incluye: [
      'Cursos premium de IA y automatización (3 niveles)',
      'Biblioteca curada de material gratuito de YouTube',
      'Plantillas, prompts y proyectos reales',
      'Certificado y comunidad de soporte',
    ],
  },
];

export function getPlan(id) {
  return PLANES.find((p) => p.id === id) || null;
}

// Formatea un número como moneda argentina: 180000 -> "$180.000"
export function formatearARS(n) {
  const entero = Math.round(Number(n) || 0);
  const conPuntos = String(Math.abs(entero)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${entero < 0 ? '-' : ''}$${conPuntos}`;
}

// Estima un rango de precio según complejidad declarada por el visitante.
// opciones: { tipo, paginas, integraciones, urgente }
export function estimarProyecto(opciones = {}) {
  const plan = getPlan(opciones.tipo) || getPlan('landing');
  let base = plan.desde;

  const paginas = Math.max(0, Number(opciones.paginas) || 0);
  if (paginas > 1) base += (paginas - 1) * 60000;

  const integraciones = Math.max(0, Number(opciones.integraciones) || 0);
  base += integraciones * 120000;

  // Urgencia: recargo del 30% por entrega exprés.
  if (opciones.urgente) base = Math.round(base * 1.3);

  // El rango alto agrega un 35% de margen de complejidad.
  const max = Math.round(base * 1.35);

  return {
    plan: plan.id,
    min: base,
    max,
    etiqueta: `${formatearARS(base)} a ${formatearARS(max)}`,
  };
}
