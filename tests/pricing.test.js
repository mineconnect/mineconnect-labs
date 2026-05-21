import {
  PLANES,
  getPlan,
  formatearARS,
  estimarProyecto,
} from '../assets/js/lib/pricing.js';

describe('PLANES', () => {
  test('hay 4 planes con campos completos', () => {
    expect(PLANES).toHaveLength(4);
    for (const p of PLANES) {
      expect(p.id).toBeTruthy();
      expect(p.nombre).toBeTruthy();
      expect(typeof p.desde).toBe('number');
      expect(Array.isArray(p.incluye)).toBe(true);
      expect(p.incluye.length).toBeGreaterThan(0);
    }
  });

  test('getPlan encuentra por id y devuelve null si no existe', () => {
    expect(getPlan('landing').nombre).toBe('Landing Express');
    expect(getPlan('inexistente')).toBeNull();
  });
});

describe('formatearARS', () => {
  test('agrupa miles con puntos', () => {
    expect(formatearARS(180000)).toBe('$180.000');
    expect(formatearARS(900000)).toBe('$900.000');
    expect(formatearARS(0)).toBe('$0');
  });
  test('redondea y tolera no-números', () => {
    expect(formatearARS(1234.6)).toBe('$1.235');
    expect(formatearARS('abc')).toBe('$0');
  });
});

describe('estimarProyecto', () => {
  test('usa el desde del plan como piso', () => {
    const r = estimarProyecto({ tipo: 'landing' });
    expect(r.min).toBe(180000);
    expect(r.max).toBe(Math.round(180000 * 1.35));
    expect(r.plan).toBe('landing');
  });

  test('cae a landing si el tipo es inválido', () => {
    expect(estimarProyecto({ tipo: 'xxx' }).plan).toBe('landing');
    expect(estimarProyecto().plan).toBe('landing');
  });

  test('suma por páginas extra e integraciones', () => {
    const r = estimarProyecto({ tipo: 'web-pro', paginas: 3, integraciones: 2 });
    // 420000 + 2*60000 + 2*120000 = 780000
    expect(r.min).toBe(780000);
  });

  test('aplica recargo por urgencia', () => {
    const normal = estimarProyecto({ tipo: 'landing' }).min;
    const urgente = estimarProyecto({ tipo: 'landing', urgente: true }).min;
    expect(urgente).toBe(Math.round(normal * 1.3));
  });

  test('min nunca supera a max y la etiqueta tiene formato', () => {
    const r = estimarProyecto({ tipo: 'app-medida', paginas: 5, integraciones: 3 });
    expect(r.min).toBeLessThanOrEqual(r.max);
    expect(r.etiqueta).toMatch(/^\$[\d.]+ a \$[\d.]+$/);
  });
});
