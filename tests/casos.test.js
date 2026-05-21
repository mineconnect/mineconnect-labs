import { CASOS, casosVisibles, totalCasos } from '../assets/js/lib/casos.js';

describe('CASOS', () => {
  test('todos tienen id, título y descripción', () => {
    for (const c of CASOS) {
      expect(c.id).toBeTruthy();
      expect(c.titulo).toBeTruthy();
      expect(c.descripcion).toBeTruthy();
      expect(Array.isArray(c.etiquetas)).toBe(true);
    }
  });
  test('los ids son únicos', () => {
    const ids = CASOS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('casosVisibles / totalCasos', () => {
  test('filtra casos sin título o descripción', () => {
    const lista = [
      { id: 'a', titulo: 'A', descripcion: 'desc' },
      { id: 'b', titulo: '', descripcion: 'desc' },
      { id: 'c', titulo: 'C', descripcion: '' },
      null,
    ];
    expect(casosVisibles(lista).map((c) => c.id)).toEqual(['a']);
  });
  test('cuenta los casos reales', () => {
    expect(totalCasos()).toBe(CASOS.length);
    expect(totalCasos()).toBeGreaterThanOrEqual(2);
  });
});
