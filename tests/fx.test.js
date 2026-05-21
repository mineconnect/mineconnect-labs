import {
  proyectar,
  distancia,
  intensidadConexion,
  crearParticula,
  actualizarParticula,
  crearOnda,
  expandirOnda,
  empujeOnda,
} from '../assets/js/lib/fx.js';

describe('proyectar', () => {
  test('un punto en el centro y z=0 cae en el centro de pantalla', () => {
    const p = proyectar({ x: 0, y: 0, z: 0 }, 800, 600, 600);
    expect(p.x).toBe(400);
    expect(p.y).toBe(300);
    expect(p.scale).toBeCloseTo(1, 5);
  });
  test('mayor z (más lejos) reduce la escala', () => {
    const cerca = proyectar({ x: 0, y: 0, z: 0 }, 800, 600);
    const lejos = proyectar({ x: 0, y: 0, z: 600 }, 800, 600);
    expect(lejos.scale).toBeLessThan(cerca.scale);
  });
});

describe('distancia / intensidadConexion', () => {
  test('distancia 3-4-5', () => {
    expect(distancia({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
  test('intensidad decae con la distancia y es 0 al límite', () => {
    expect(intensidadConexion(0, 100)).toBe(1);
    expect(intensidadConexion(50, 100)).toBeCloseTo(0.5);
    expect(intensidadConexion(100, 100)).toBe(0);
    expect(intensidadConexion(120, 100)).toBe(0);
  });
});

describe('partículas', () => {
  test('crearParticula es determinística', () => {
    expect(crearParticula(5)).toEqual(crearParticula(5));
  });
  test('crearParticula respeta el rango', () => {
    const p = crearParticula(3, 1000);
    expect(Math.abs(p.x)).toBeLessThanOrEqual(500);
    expect(Math.abs(p.z)).toBeLessThanOrEqual(500);
  });
  test('actualizarParticula envuelve al salir del rango', () => {
    const p = { x: 499, y: 0, z: 0, vx: 10, vy: 0, vz: 0 };
    const np = actualizarParticula(p, 1, 1000); // 509 -> -491
    expect(np.x).toBeCloseTo(-491);
    expect(Math.abs(np.x)).toBeLessThanOrEqual(500);
  });
});

describe('ondas (click mágico)', () => {
  test('crearOnda arranca con radio 0', () => {
    expect(crearOnda(100, 200).radio).toBe(0);
  });
  test('expandirOnda crece y expira al superar el máximo', () => {
    let o = crearOnda(0, 0);
    o.radio = 319;
    o = expandirOnda(o, 1); // ~319.6 < 320 -> sigue
    expect(o).not.toBeNull();
    o.radio = 320;
    expect(expandirOnda(o, 1)).toBeNull();
  });
  test('empujeOnda empuja hacia afuera cerca del frente y no hace nada lejos', () => {
    const o = { x: 0, y: 0, radio: 100, max: 320 };
    const cerca = empujeOnda(o, { x: 100, y: 0 }); // justo en el frente
    expect(cerca.dx).toBeGreaterThan(0);
    const lejos = empujeOnda(o, { x: 100, y: 300 }); // fuera del frente
    expect(lejos.dx).toBe(0);
    expect(lejos.dy).toBe(0);
  });
});
