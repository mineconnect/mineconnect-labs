// Plan de contenido de Instagram (14 días) — datos + scoring de impacto.
// Puro y testeable: sin DOM, sin red, sin estado mutable.

export const AUDIENCIA = {
  // Dueñ@s de PyMEs, bares, gimnasios y locales de Catamarca / AR.
  rubrosObjetivo: ['bar', 'gimnasio', 'pyme', 'comercio', 'gastronomia', 'local'],
  ciudadesObjetivo: ['catamarca', 'argentina', 'ar'],
  doloresClave: [
    'perder',
    'plata',
    'tiempo',
    'cliente',
    'comision',
    'suscripcion',
    'wix',
    'shopify',
    'lento',
    'caida',
  ],
};

export const PILARES = {
  EDUCATIVO: 'educativo',
  PRUEBA_SOCIAL: 'prueba_social',
  DETRAS: 'detras_de_escena',
  OFERTA: 'oferta',
  COMUNIDAD: 'comunidad',
};

// 14 días. Cada item es lo mínimo para auditar el impacto:
// - hook: la primera línea (lo que aparece antes del "ver más").
// - cuerpo: 1-3 líneas que resumen el mensaje principal del post.
// - cta: llamada a la acción concreta.
// - hashtags: lista canónica usada en el post.
// - rubro: si menciona un rubro/segmento específico, lo declaramos acá.
// - historias: cantidad de historias planeadas ese día.
// - pilar: tipo de contenido para balancear la mezcla.
export const PLAN_14_DIAS = [
  {
    dia: 1,
    formato: 'carrusel',
    pilar: PILARES.EDUCATIVO,
    hook: '¿Tu negocio todavía no tiene web propia? Estás dejando plata sobre la mesa 💸',
    cuerpo: 'Te paso 4 señales de que la necesitás YA (deslizá) y contame cuál te pasa. Te la hacemos en 3 a 5 días.',
    cta: 'Presupuesto gratis en link en bio',
    hashtags: ['#paginaweb', '#pymesargentina', '#catamarca', '#emprendedores', '#negocioslocales', '#pymes', '#desarrolloweb', '#marketingdigital'],
    rubro: 'pyme',
    historias: 5,
  },
  {
    dia: 2,
    formato: 'reel',
    pilar: PILARES.DETRAS,
    hook: '5 días. Eso tardamos en armar una landing que vende.',
    cuerpo: 'Sin Wix, sin suscripciones. Es tuya, no te alquilamos nada. Si seguís peleando con plantillas que no se adaptan a tu negocio, este es tu cartel.',
    cta: 'Presupuesto gratis: link en bio',
    hashtags: ['#desarrolloweb', '#pyme', '#emprendedoresargentina', '#landingpage', '#catamarca', '#software'],
    rubro: 'pyme',
    historias: 4,
  },
  {
    dia: 3,
    formato: 'carrusel',
    pilar: PILARES.EDUCATIVO,
    hook: '¿Cuánto pagás de Wix por año? Cuenta rápida que duele 💸',
    cuerpo: '12 meses de Wix/Shopify = una web a medida que es tuya para siempre. 3 datos comparados: precio, propiedad y velocidad de cambio. Si dejás de pagar, perdés todo.',
    cta: 'DM "CUENTA" y te paso el número exacto para tu caso',
    hashtags: ['#wix', '#shopify', '#pymes', '#catamarca', '#desarrolloweb', '#emprendedoresargentina', '#ecommerce'],
    rubro: 'pyme',
    historias: 4,
  },
  {
    dia: 4,
    formato: 'carrusel',
    pilar: PILARES.EDUCATIVO,
    hook: 'Antes de comprarte, tu cliente revisa 3 cosas. Si fallás en alguna, perdés la venta y no te enterás 🎯',
    cuerpo: '1) Google con info clara. 2) Reseñas / prueba social. 3) Canal de contacto fácil. Te muestro cómo se ve cada una bien hecha.',
    cta: 'Si querés que te lo armemos: link en bio',
    hashtags: ['#marketingdigital', '#pymesargentina', '#ventas', '#catamarca', '#emprendedores', '#negocios'],
    rubro: 'comercio',
    historias: 5,
  },
  {
    dia: 5,
    formato: 'reel',
    pilar: PILARES.DETRAS,
    hook: '¿Te imaginabas que arrancamos así? 🗒️ Sin formularios eternos: 30 minutos y 3 preguntas.',
    cuerpo: 'La idea es entender tu negocio, no venderte lo mismo de siempre. Te mostramos las 3 preguntas que hacemos siempre.',
    cta: 'Pedinos esa primera charla gratis: link en bio',
    hashtags: ['#emprender', '#desarrolloweb', '#pyme', '#catamarca', '#software', '#behindthescenes'],
    rubro: 'pyme',
    historias: 4,
  },
  {
    dia: 6,
    formato: 'post',
    pilar: PILARES.PRUEBA_SOCIAL,
    hook: 'Caso real: un gimnasio dejaba de cobrar 18 cuotas por mes por no avisar a tiempo 💪',
    cuerpo: 'Le armamos una app que avisa sola, controla socios y muestra rutinas. Se pagó sola en 2 meses. Si tenés gym, escuela de baile, academia o peluquería con membresía, esto te aplica.',
    cta: 'Te muestro la demo: link en bio',
    hashtags: ['#gimnasio', '#fitness', '#gymcatamarca', '#emprender', '#pymes', '#appmovil', '#software'],
    rubro: 'gimnasio',
    historias: 3,
  },
  {
    dia: 7,
    formato: 'carrusel',
    pilar: PILARES.COMUNIDAD,
    hook: '¿Te perdiste algún post esta semana? 7 días, 6 errores que te están costando plata 👇',
    cuerpo: 'Resumen de la semana 1: 3 señales de que necesitás web, lo que pagás de más por Wix, y el caso del gimnasio que recuperó 18 cuotas/mes. Guardalo para volver.',
    cta: 'Etiquetá a un dueño de negocio que necesite ver esto',
    hashtags: ['#emprendedoresargentina', '#pymesargentina', '#catamarca', '#comunidad', '#pymes', '#emprendedores'],
    rubro: 'pyme',
    historias: 3,
  },
  {
    dia: 8,
    formato: 'carrusel',
    pilar: PILARES.EDUCATIVO,
    hook: 'Si tu web tiene 3 de estos 5 errores, perdés entre 30% y 60% de las consultas y no te enterás 🚨',
    cuerpo: 'Sin teléfono visible en mobile, sin botón de WhatsApp directo, sin reseñas, plantilla genérica o lenta: cada uno te cuesta plata. Te marco cómo se resuelve.',
    cta: '¿Querés que la revisemos sin cargo? DM con tu link',
    hashtags: ['#paginaweb', '#pymesargentina', '#marketingdigital', '#catamarca', '#emprendedores'],
    rubro: 'pyme',
    historias: 5,
  },
  {
    dia: 9,
    formato: 'reel',
    pilar: PILARES.EDUCATIVO,
    hook: '60 segundos para entender qué hace MineConnect Labs y si te sirve 👇',
    cuerpo: 'Web a medida, apps móviles, sistemas para tu operación, IA aplicada y cursos. En días, no en meses. Es tuyo, no te alquilamos nada.',
    cta: 'Presupuesto gratis: link en bio',
    hashtags: ['#desarrolloweb', '#software', '#apps', '#ia', '#catamarca', '#pymesargentina'],
    rubro: 'pyme',
    historias: 4,
  },
  {
    dia: 10,
    formato: 'carrusel',
    pilar: PILARES.EDUCATIVO,
    hook: 'IA aplicada, no IA de moda 🧠 3 cosas reales que tu bar/comercio puede hacer hoy.',
    cuerpo: 'Bot de WhatsApp que responde menú y reservas, resumen automático del día, generador de posts con tu menú. Ahorran 5-10 horas por semana.',
    cta: 'Te lo enseñamos o te lo armamos: link en bio',
    hashtags: ['#inteligenciaartificial', '#ia', '#automatizacion', '#pymes', '#bares', '#comercios', '#catamarca'],
    rubro: 'bar',
    historias: 5,
  },
  {
    dia: 11,
    formato: 'post',
    pilar: PILARES.PRUEBA_SOCIAL,
    hook: 'Caso real: un bar dejó de pagar 12% de comisión a las apps de delivery 🍺',
    cuerpo: 'Menú online con pedido directo al WhatsApp del local. Listo en 4 días, funciona desde el celular sin descargar nada, se paga solo en menos de 1 mes.',
    cta: 'DM "BAR" y te paso el ejemplo',
    hashtags: ['#bar', '#gastronomia', '#catamarca', '#delivery', '#pymes', '#emprender'],
    rubro: 'bar',
    historias: 4,
  },
  {
    dia: 12,
    formato: 'reel',
    pilar: PILARES.EDUCATIVO,
    hook: '3 preguntas que nos hacen todas las semanas. Te respondo todas en 30 segundos 👇',
    cuerpo: '¿En cuánto tiempo?, ¿cuánto cuesta?, ¿es realmente mío? Las tres respuestas concretas, sin vueltas.',
    cta: 'Si ya tenés decidido: link en bio',
    hashtags: ['#faq', '#desarrolloweb', '#pymes', '#catamarca', '#emprendedores'],
    rubro: 'pyme',
    historias: 4,
  },
  {
    dia: 13,
    formato: 'post',
    pilar: PILARES.OFERTA,
    hook: '¿Cuánto tardás en saber si te conviene? Hasta el domingo: presupuesto en 24 hs ⏱️',
    cuerpo: 'Escribinos hoy o mañana y te respondemos con un presupuesto detallado en menos de 24 hs hábiles, gratis y sin compromiso. Te decimos tiempos, precio y si te conviene.',
    cta: 'DM "PRESUPUESTO" o link en bio',
    hashtags: ['#presupuesto', '#desarrolloweb', '#apps', '#catamarca', '#emprendedoresargentina', '#pymes', '#emprender'],
    rubro: 'pyme',
    historias: 5,
  },
  {
    dia: 14,
    formato: 'carrusel',
    pilar: PILARES.COMUNIDAD,
    hook: '¿Cuántas de estas 5 cosas estás dejando pasar en tu negocio? Recap 14 días 💬',
    cuerpo: '5 lecciones de la quincena: web propia, costo real de Wix, 3 cosas que mira tu cliente, IA aplicada y caso del bar sin comisiones. Guardá esto para volver. A los que ya escribieron: arrancan los primeros proyectos esta semana.',
    cta: 'Etiquetá a un dueño de negocio que también lo necesite',
    hashtags: ['#comunidad', '#pymesargentina', '#catamarca', '#emprendedores', '#pymes', '#emprender'],
    rubro: 'pyme',
    historias: 4,
  },
];

// Quita acentos y baja a minúsculas para hacer comparaciones laxas.
function normalizar(texto = '') {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function contiene(texto, palabras) {
  const t = normalizar(texto);
  return palabras.some((p) => t.includes(normalizar(p)));
}

// Hook fuerte: pregunta, número, $, signo de pena/urgencia o emoji disparador.
export function puntajeHook(hook = '') {
  let pts = 0;
  const t = String(hook);
  if (/[¿?]/.test(t)) pts += 8; // pregunta
  if (/\d/.test(t)) pts += 6; // número concreto
  if (/[$💸💰📉⏱️🚨👀🎯]/.test(t)) pts += 5; // tensión o urgencia visual
  if (contiene(t, AUDIENCIA.doloresClave)) pts += 6; // nombra un dolor real
  // primera línea no debe ser un ladrillo: penaliza largo excesivo
  const longitud = t.length;
  if (longitud > 0 && longitud <= 140) pts += 5;
  return Math.min(pts, 25);
}

export function puntajeEspecificidad(item) {
  let pts = 0;
  const texto = `${item.hook} ${item.cuerpo}`;
  if (item.rubro && AUDIENCIA.rubrosObjetivo.includes(item.rubro)) pts += 10;
  if (contiene(texto, AUDIENCIA.rubrosObjetivo)) pts += 5;
  if (contiene(texto, AUDIENCIA.ciudadesObjetivo) || contiene(item.hashtags.join(' '), AUDIENCIA.ciudadesObjetivo)) pts += 5;
  return Math.min(pts, 20);
}

export function puntajeDolor(item) {
  const texto = `${item.hook} ${item.cuerpo}`;
  let pts = 0;
  const dolores = AUDIENCIA.doloresClave.filter((d) => normalizar(texto).includes(normalizar(d)));
  pts += Math.min(dolores.length * 4, 12);
  // bonus si nombra una cifra concreta (ej: "3 a 5 días", "12%", "$200.000")
  if (/(\d+\s?(días|hs|horas|%|días)|\$\s?[\d.,]+)/i.test(texto)) pts += 3;
  return Math.min(pts, 15);
}

export function puntajeCTA(item) {
  const cta = normalizar(item.cta || '');
  if (!cta) return 0;
  let pts = 0;
  const verbos = ['link', 'dm', 'whatsapp', 'escribi', 'pedi', 'reserva', 'comenta', 'etiqueta', 'guarda', 'mira', 'descarga'];
  if (verbos.some((v) => cta.includes(v))) pts += 8;
  if (cta.includes('gratis') || cta.includes('sin compromiso') || cta.includes('24 hs')) pts += 4;
  if (cta.length > 0 && cta.length <= 80) pts += 3;
  return Math.min(pts, 15);
}

export function puntajeHashtags(hashtags = []) {
  if (!Array.isArray(hashtags) || hashtags.length === 0) return 0;
  let pts = 0;
  const cant = hashtags.length;
  // Sweet spot: 6 a 12 hashtags. Menos = poco descubrimiento; más = IG penaliza.
  if (cant >= 6 && cant <= 12) pts += 6;
  else if (cant >= 4 && cant <= 15) pts += 3;
  const todos = hashtags.join(' ');
  const hayLocal = contiene(todos, AUDIENCIA.ciudadesObjetivo);
  const hayRubro = contiene(todos, AUDIENCIA.rubrosObjetivo);
  const hayAudiencia = /(#pyme|#emprend|#negocio|#comercio)/i.test(todos);
  if (hayLocal) pts += 3;
  if (hayRubro) pts += 3;
  if (hayAudiencia) pts += 3;
  return Math.min(pts, 15);
}

export function puntajeGuardable(item) {
  // ¿Es contenido que se guarda o comparte? Listas, tips, comparativas, números.
  let pts = 0;
  const texto = `${item.hook} ${item.cuerpo}`.toLowerCase();
  if (item.formato === 'carrusel') pts += 4;
  if (item.formato === 'reel') pts += 2;
  if (/(\d+\s+(señales|errores|cosas|tips|pasos|formas|razones|preguntas|automatizaciones))/i.test(texto)) pts += 4;
  if (item.pilar === PILARES.EDUCATIVO) pts += 2;
  return Math.min(pts, 10);
}

// Suma todo (0-100) y dice si "impacta" al público objetivo.
export function evaluarItem(item) {
  const detalle = {
    hook: puntajeHook(item.hook),
    especificidad: puntajeEspecificidad(item),
    dolor: puntajeDolor(item),
    cta: puntajeCTA(item),
    hashtags: puntajeHashtags(item.hashtags),
    guardable: puntajeGuardable(item),
  };
  const total = Object.values(detalle).reduce((a, b) => a + b, 0);
  return {
    dia: item.dia,
    formato: item.formato,
    pilar: item.pilar,
    detalle,
    total,
    impacta: total >= 60, // umbral de "le va a pegar al público"
  };
}

export function evaluarPlan(plan = PLAN_14_DIAS) {
  const items = plan.map(evaluarItem);
  const promedio = items.reduce((a, b) => a + b.total, 0) / items.length;
  const conImpacto = items.filter((i) => i.impacta).length;
  const porPilar = items.reduce((acc, i) => {
    acc[i.pilar] = (acc[i.pilar] || 0) + 1;
    return acc;
  }, {});
  const totalHistorias = plan.reduce((a, b) => a + (b.historias || 0), 0);
  const reels = plan.filter((p) => p.formato === 'reel').length;
  return {
    items,
    promedio,
    conImpacto,
    totalPosts: plan.length,
    porPilar,
    totalHistorias,
    reels,
    veredicto: veredicto(promedio, conImpacto, plan.length, porPilar, reels),
  };
}

function veredicto(promedio, conImpacto, total, porPilar, reels) {
  const ratio = conImpacto / total;
  const partes = [];
  if (promedio >= 75) partes.push('plan muy fuerte');
  else if (promedio >= 65) partes.push('plan sólido');
  else if (promedio >= 55) partes.push('plan aceptable, hay que pulir');
  else partes.push('plan flojo, conviene reescribir hooks');
  partes.push(`${conImpacto}/${total} piezas impactan (${Math.round(ratio * 100)}%)`);
  if (reels < 3) partes.push('falta reels (mínimo 3 en 14 días)');
  if (!porPilar[PILARES.PRUEBA_SOCIAL]) partes.push('falta prueba social');
  if (!porPilar[PILARES.OFERTA]) partes.push('falta CTA de oferta directa');
  return partes.join(' · ');
}
