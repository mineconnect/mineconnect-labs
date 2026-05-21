// Lógica pura de la Academia IA de MineConnect Labs.
// Cursos premium con temario + material gratuito real curado de YouTube.
// Los links de video usan deep-links de búsqueda de YouTube: siempre resuelven
// a contenido real y gratuito, así nunca quedan rotos.
import { formatearARS } from './pricing.js';

// Genera un deep-link de búsqueda de YouTube para un tema (robusto, nunca 404).
export function ytBusqueda(consulta) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(consulta)}`;
}

// Canales reales recomendados (deep-link de búsqueda por nombre para no fijar handles frágiles).
export const CANALES = [
  { nombre: 'Dot CSV', tema: 'machine learning' },
  { nombre: 'Xavier Mitjana', tema: 'IA aplicada' },
  { nombre: 'Jon Hernández IA', tema: 'novedades IA' },
  { nombre: 'Víctor Pérez IA', tema: 'automatización sin código' },
  { nombre: 'EDteam', tema: 'programación' },
  { nombre: 'Sergio de la Rosa IA', tema: 'IA práctica' },
].map((c) => ({ ...c, url: ytBusqueda(`${c.nombre} ${c.tema}`) }));

export const CURSOS = [
  {
    id: 'ia-starter',
    nombre: 'IA desde Cero',
    nivel: 'Principiante',
    precio: 89000,
    valorReal: 320000,
    duracion: '12 horas · 4 módulos',
    promesa: 'Pasá de no saber nada a usar IA todos los días en tu trabajo.',
    incluye: [
      'Acceso de por vida y actualizaciones',
      'Material de estudio descargable (PDF + plantillas)',
      'Biblioteca curada de videos gratuitos de YouTube',
      'Certificado de finalización',
      'Comunidad privada de soporte',
    ],
    modulos: [
      { titulo: 'Qué es la IA y cómo te sirve hoy', lecciones: [
        { titulo: 'Conceptos básicos de IA generativa', q: 'qué es la inteligencia artificial generativa explicado fácil' },
        { titulo: 'Tu primer chat con una IA', q: 'cómo usar ChatGPT desde cero tutorial español' },
      ]},
      { titulo: 'Prompts que funcionan', lecciones: [
        { titulo: 'Anatomía de un buen prompt', q: 'cómo escribir buenos prompts ChatGPT español' },
        { titulo: 'Plantillas de prompts para trabajo', q: 'plantillas de prompts para productividad español' },
      ]},
      { titulo: 'IA para textos e imágenes', lecciones: [
        { titulo: 'Generá textos de venta', q: 'IA para copywriting y textos de venta español' },
        { titulo: 'Creá imágenes con IA', q: 'cómo generar imágenes con IA gratis tutorial' },
      ]},
      { titulo: 'IA en tu día a día', lecciones: [
        { titulo: 'Resumir, traducir y organizar', q: 'usar IA para resumir y organizar tareas español' },
      ]},
    ],
  },
  {
    id: 'ia-pro',
    nombre: 'IA Profesional para tu Negocio',
    nivel: 'Intermedio',
    precio: 219000,
    valorReal: 740000,
    duracion: '24 horas · 6 módulos',
    promesa: 'Aplicá IA para vender más, atender mejor y ahorrar horas cada semana.',
    destacado: true,
    incluye: [
      'Todo lo del curso IA desde Cero',
      'Casos prácticos por rubro (gastronomía, fitness, comercio)',
      'Plantillas de automatización listas para usar',
      'Sesiones de preguntas y respuestas grabadas',
      'Certificado profesional',
    ],
    modulos: [
      { titulo: 'IA para marketing y ventas', lecciones: [
        { titulo: 'Embudos de venta asistidos por IA', q: 'IA para embudos de venta y marketing español' },
        { titulo: 'Contenido para redes en minutos', q: 'crear contenido para redes sociales con IA español' },
      ]},
      { titulo: 'Atención al cliente con IA', lecciones: [
        { titulo: 'Chatbots para WhatsApp', q: 'crear chatbot para WhatsApp con IA tutorial' },
        { titulo: 'Respuestas automáticas que venden', q: 'automatizar respuestas de atención al cliente IA' },
      ]},
      { titulo: 'Productividad y datos', lecciones: [
        { titulo: 'IA en planillas de cálculo', q: 'usar IA en Excel y Google Sheets español' },
        { titulo: 'Reportes automáticos', q: 'generar reportes automáticos con IA español' },
      ]},
      { titulo: 'Herramientas no-code', lecciones: [
        { titulo: 'Automatizá sin programar', q: 'automatización sin código n8n make zapier español' },
      ]},
      { titulo: 'IA para imágenes y video', lecciones: [
        { titulo: 'Video marketing con IA', q: 'crear videos para marketing con IA español' },
      ]},
      { titulo: 'Ética y buenas prácticas', lecciones: [
        { titulo: 'Usar IA de forma responsable', q: 'uso responsable y ético de la inteligencia artificial' },
      ]},
    ],
  },
  {
    id: 'ia-automation',
    nombre: 'Automatización & Agentes IA',
    nivel: 'Avanzado',
    precio: 480000,
    valorReal: 1650000,
    duracion: '40 horas · 8 módulos',
    promesa: 'Construí automatizaciones y agentes que trabajan por vos 24/7.',
    incluye: [
      'Todo lo de los cursos anteriores',
      'Proyectos reales guiados de punta a punta',
      'Acceso a flujos y agentes plantilla',
      'Mentoría grupal en vivo (cupos limitados)',
      'Certificación avanzada de MineConnect Labs',
    ],
    modulos: [
      { titulo: 'Fundamentos de automatización', lecciones: [
        { titulo: 'Pensar en procesos', q: 'cómo automatizar procesos de un negocio' },
        { titulo: 'APIs sin miedo', q: 'qué es una API explicado fácil español' },
      ]},
      { titulo: 'n8n a fondo', lecciones: [
        { titulo: 'Tu primer flujo en n8n', q: 'n8n tutorial español desde cero' },
        { titulo: 'Conectar apps reales', q: 'n8n conectar aplicaciones automatización español' },
      ]},
      { titulo: 'Agentes de IA', lecciones: [
        { titulo: 'Qué es un agente de IA', q: 'qué es un agente de inteligencia artificial español' },
        { titulo: 'Construir un agente útil', q: 'crear agente de IA paso a paso español' },
      ]},
      { titulo: 'IA + bases de datos', lecciones: [
        { titulo: 'Memoria y datos para tus agentes', q: 'bases de datos vectoriales IA español' },
      ]},
      { titulo: 'Automatizar ventas', lecciones: [
        { titulo: 'Del lead al cierre, automático', q: 'automatizar proceso de ventas con IA español' },
      ]},
      { titulo: 'Automatizar operaciones', lecciones: [
        { titulo: 'Stock, turnos y reportes', q: 'automatizar operaciones de negocio con IA español' },
      ]},
      { titulo: 'Despliegue y monitoreo', lecciones: [
        { titulo: 'Poner todo a producción', q: 'desplegar automatizaciones en producción español' },
      ]},
      { titulo: 'Proyecto final', lecciones: [
        { titulo: 'Tu sistema autónomo', q: 'proyecto de automatización con IA de principio a fin' },
      ]},
    ],
  },
];

export function getCurso(id) {
  return CURSOS.find((c) => c.id === id) || null;
}

export function totalLecciones(curso) {
  if (!curso || !Array.isArray(curso.modulos)) return 0;
  return curso.modulos.reduce((acc, m) => acc + (m.lecciones?.length || 0), 0);
}

// Lista plana de recursos (lección -> link de YouTube) para un curso.
export function recursosCurso(curso) {
  if (!curso) return [];
  const out = [];
  for (const m of curso.modulos || []) {
    for (const l of m.lecciones || []) {
      out.push({ modulo: m.titulo, titulo: l.titulo, url: ytBusqueda(l.q) });
    }
  }
  return out;
}

// Ahorro frente al "valor real" del material (anclaje de precio).
export function ahorro(curso) {
  if (!curso) return { monto: 0, porcentaje: 0, etiqueta: '$0' };
  const monto = Math.max(0, curso.valorReal - curso.precio);
  const porcentaje = curso.valorReal > 0 ? Math.round((monto / curso.valorReal) * 100) : 0;
  return { monto, porcentaje, etiqueta: formatearARS(monto) };
}
