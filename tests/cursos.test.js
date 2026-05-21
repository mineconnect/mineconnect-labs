import {
  CURSOS,
  CANALES,
  getCurso,
  totalLecciones,
  recursosCurso,
  ahorro,
  ytBusqueda,
} from '../assets/js/lib/cursos.js';

describe('ytBusqueda', () => {
  test('arma un deep-link de búsqueda de YouTube válido y codificado', () => {
    const url = ytBusqueda('IA desde cero');
    expect(url.startsWith('https://www.youtube.com/results?search_query=')).toBe(true);
    expect(url).toContain('IA%20desde%20cero');
  });
});

describe('CURSOS', () => {
  test('hay 3 cursos premium con campos completos', () => {
    expect(CURSOS).toHaveLength(3);
    for (const c of CURSOS) {
      expect(c.id).toBeTruthy();
      expect(typeof c.precio).toBe('number');
      expect(typeof c.valorReal).toBe('number');
      expect(c.modulos.length).toBeGreaterThan(0);
      expect(Array.isArray(c.incluye)).toBe(true);
    }
  });

  test('los precios son premium (más caros que los $45.000 viejos) y escalonados', () => {
    const precios = CURSOS.map((c) => c.precio);
    expect(Math.min(...precios)).toBeGreaterThanOrEqual(89000);
    // escalonados de menor a mayor
    expect(precios).toEqual([...precios].sort((a, b) => a - b));
  });

  test('el valor real siempre supera al precio (anclaje)', () => {
    for (const c of CURSOS) expect(c.valorReal).toBeGreaterThan(c.precio);
  });

  test('exactamente un curso está destacado', () => {
    expect(CURSOS.filter((c) => c.destacado)).toHaveLength(1);
  });
});

describe('helpers', () => {
  test('getCurso encuentra y devuelve null si no existe', () => {
    expect(getCurso('ia-pro').nombre).toBe('IA Profesional para tu Negocio');
    expect(getCurso('nope')).toBeNull();
  });

  test('totalLecciones suma todas las lecciones de los módulos', () => {
    const c = getCurso('ia-starter');
    const esperado = c.modulos.reduce((a, m) => a + m.lecciones.length, 0);
    expect(totalLecciones(c)).toBe(esperado);
    expect(totalLecciones(null)).toBe(0);
  });

  test('recursosCurso devuelve un link de YouTube por lección', () => {
    const c = getCurso('ia-starter');
    const rec = recursosCurso(c);
    expect(rec).toHaveLength(totalLecciones(c));
    for (const r of rec) {
      expect(r.url).toContain('youtube.com/results');
      expect(r.titulo).toBeTruthy();
    }
  });

  test('ahorro calcula monto y porcentaje frente al valor real', () => {
    const c = getCurso('ia-starter'); // 89.000 vs 320.000
    const a = ahorro(c);
    expect(a.monto).toBe(320000 - 89000);
    expect(a.porcentaje).toBe(Math.round((a.monto / 320000) * 100));
    expect(a.etiqueta).toMatch(/^\$[\d.]+$/);
    expect(ahorro(null).monto).toBe(0);
  });
});

describe('CANALES', () => {
  test('hay canales reales con URL de YouTube', () => {
    expect(CANALES.length).toBeGreaterThanOrEqual(5);
    for (const c of CANALES) {
      expect(c.nombre).toBeTruthy();
      expect(c.url).toContain('youtube.com');
    }
  });
});
