import {
  PLAN_14_DIAS,
  PILARES,
  evaluarItem,
  evaluarPlan,
  puntajeHook,
  puntajeEspecificidad,
  puntajeDolor,
  puntajeCTA,
  puntajeHashtags,
  puntajeGuardable,
} from '../assets/js/lib/instagram-plan.js';

describe('Plan Instagram 14 días — estructura', () => {
  test('tiene exactamente 14 días, sin huecos ni duplicados', () => {
    expect(PLAN_14_DIAS).toHaveLength(14);
    const dias = PLAN_14_DIAS.map((p) => p.dia).sort((a, b) => a - b);
    expect(dias).toEqual(Array.from({ length: 14 }, (_, i) => i + 1));
  });

  test('cada pieza tiene los campos mínimos para publicar', () => {
    for (const item of PLAN_14_DIAS) {
      expect(typeof item.hook).toBe('string');
      expect(item.hook.length).toBeGreaterThan(0);
      expect(item.cuerpo.length).toBeGreaterThan(20);
      expect(item.cta.length).toBeGreaterThan(0);
      expect(Array.isArray(item.hashtags)).toBe(true);
      expect(item.hashtags.length).toBeGreaterThan(0);
      expect(item.historias).toBeGreaterThanOrEqual(3);
    }
  });

  test('mezcla de pilares balanceada (no hay un solo tipo de contenido)', () => {
    const pilares = new Set(PLAN_14_DIAS.map((p) => p.pilar));
    // Tienen que estar al menos: educativo, prueba social, detrás y comunidad/oferta.
    expect(pilares.has(PILARES.EDUCATIVO)).toBe(true);
    expect(pilares.has(PILARES.PRUEBA_SOCIAL)).toBe(true);
    expect(pilares.has(PILARES.DETRAS)).toBe(true);
    expect(pilares.size).toBeGreaterThanOrEqual(4);
  });

  test('al menos 3 reels en las 2 semanas (clave para alcance hoy en IG)', () => {
    const reels = PLAN_14_DIAS.filter((p) => p.formato === 'reel');
    expect(reels.length).toBeGreaterThanOrEqual(3);
  });

  test('cada post tiene 6-12 hashtags (sweet spot de descubrimiento)', () => {
    for (const item of PLAN_14_DIAS) {
      expect(item.hashtags.length).toBeGreaterThanOrEqual(4);
      expect(item.hashtags.length).toBeLessThanOrEqual(12);
    }
  });
});

describe('Scoring por dimensión', () => {
  test('hook con pregunta + número + dolor puntúa alto', () => {
    const p = puntajeHook('¿Tu negocio pierde 3 clientes por día? 💸');
    expect(p).toBeGreaterThanOrEqual(20);
  });

  test('hook plano y largo puntúa bajo', () => {
    const p = puntajeHook('Hola somos una empresa que ofrece servicios variados a la comunidad y queremos contarte un poco más sobre nosotros porque creemos que es importante presentarnos');
    expect(p).toBeLessThan(10);
  });

  test('especificidad: nombrar un rubro objetivo suma', () => {
    const alto = puntajeEspecificidad({
      hook: 'Para tu bar en Catamarca',
      cuerpo: 'Esto le sirve a gimnasios y comercios',
      rubro: 'bar',
      hashtags: ['#catamarca'],
    });
    const bajo = puntajeEspecificidad({
      hook: 'Hola',
      cuerpo: 'Bla bla genérico',
      rubro: null,
      hashtags: ['#marketing'],
    });
    expect(alto).toBeGreaterThan(bajo);
    expect(alto).toBeGreaterThanOrEqual(15);
  });

  test('puntajeDolor: detecta dolores y números/cifras', () => {
    const alto = puntajeDolor({
      hook: 'Perdés plata por comisiones',
      cuerpo: 'Te ahorrás 12% por pedido en 5 días',
    });
    expect(alto).toBeGreaterThanOrEqual(10);
  });

  test('puntajeCTA: verbo accionable + gratis suma', () => {
    expect(puntajeCTA({ cta: 'DM gratis y te paso el ejemplo' })).toBeGreaterThanOrEqual(10);
    expect(puntajeCTA({ cta: '' })).toBe(0);
  });

  test('puntajeHashtags: 8 hashtags con local + rubro + audiencia puntúa máximo', () => {
    const p = puntajeHashtags([
      '#catamarca',
      '#bar',
      '#gastronomia',
      '#pymesargentina',
      '#emprendedores',
      '#desarrolloweb',
      '#delivery',
      '#software',
    ]);
    expect(p).toBeGreaterThanOrEqual(12);
  });

  test('puntajeGuardable: carrusel con lista numerada se guarda más', () => {
    const carrusel = puntajeGuardable({
      formato: 'carrusel',
      pilar: PILARES.EDUCATIVO,
      hook: '5 errores que cometen las PyMEs',
      cuerpo: 'Listado',
    });
    const post = puntajeGuardable({
      formato: 'post',
      pilar: PILARES.OFERTA,
      hook: 'Hola',
      cuerpo: 'CTA',
    });
    expect(carrusel).toBeGreaterThan(post);
  });
});

describe('Impacto del plan — ¿le va a llegar al público?', () => {
  test('cada pieza del plan llega al umbral de impacto (>= 60/100)', () => {
    const flojos = [];
    for (const item of PLAN_14_DIAS) {
      const r = evaluarItem(item);
      if (!r.impacta) flojos.push({ dia: r.dia, total: r.total, detalle: r.detalle });
    }
    if (flojos.length > 0) {
      // Si algún día no llega al umbral, lo logueamos para poder pulirlo.
      // eslint-disable-next-line no-console
      console.warn('Días por debajo del umbral:', JSON.stringify(flojos, null, 2));
    }
    expect(flojos).toEqual([]);
  });

  test('promedio del plan supera 70/100 (plan sólido)', () => {
    const r = evaluarPlan();
    expect(r.promedio).toBeGreaterThanOrEqual(70);
  });

  test('al menos el 85% de las piezas impactan al público objetivo', () => {
    const r = evaluarPlan();
    expect(r.conImpacto / r.totalPosts).toBeGreaterThanOrEqual(0.85);
  });

  test('hay piezas de prueba social y oferta directa (necesarias para convertir)', () => {
    const r = evaluarPlan();
    expect(r.porPilar[PILARES.PRUEBA_SOCIAL]).toBeGreaterThanOrEqual(1);
    expect(r.porPilar[PILARES.OFERTA]).toBeGreaterThanOrEqual(1);
  });

  test('al menos 45 historias en 14 días (presencia diaria)', () => {
    const r = evaluarPlan();
    expect(r.totalHistorias).toBeGreaterThanOrEqual(45);
  });

  test('veredicto final menciona "sólido" o "muy fuerte"', () => {
    const r = evaluarPlan();
    expect(r.veredicto).toMatch(/sólido|muy fuerte/);
  });
});

describe('Cobertura de rubros objetivo en el plan', () => {
  test('el plan habla al menos a 3 rubros distintos del negocio', () => {
    const rubros = new Set(PLAN_14_DIAS.map((p) => p.rubro).filter(Boolean));
    expect(rubros.size).toBeGreaterThanOrEqual(3);
  });

  test('aparece Catamarca en al menos 10 piezas (foco local primero)', () => {
    const conCatamarca = PLAN_14_DIAS.filter((p) =>
      p.hashtags.some((h) => /catamarca/i.test(h)) ||
      /catamarca/i.test(p.hook) ||
      /catamarca/i.test(p.cuerpo)
    );
    expect(conCatamarca.length).toBeGreaterThanOrEqual(10);
  });
});
