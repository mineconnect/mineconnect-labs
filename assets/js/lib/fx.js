// Matemática pura del fondo animado "3D" (campo de partículas con perspectiva).
// Sin DOM ni canvas: el render loop vive en app.js; acá solo cálculo testeable.

// Proyección en perspectiva de un punto 3D a coordenadas 2D de pantalla.
// Devuelve {x, y, scale}; scale sirve para tamaño/opacidad según profundidad.
export function proyectar(p, ancho, alto, fov = 600) {
  const z = p.z + fov; // alejamos para evitar división por ~0
  const scale = fov / Math.max(z, 1);
  return {
    x: ancho / 2 + p.x * scale,
    y: alto / 2 + p.y * scale,
    scale,
  };
}

// Distancia euclídea 2D.
export function distancia(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Opacidad de la línea entre dos partículas según distancia (0 si supera maxDist).
export function intensidadConexion(d, maxDist) {
  if (d >= maxDist || maxDist <= 0) return 0;
  return 1 - d / maxDist;
}

// Crea una partícula determinística a partir de un índice (para tests reproducibles).
export function crearParticula(i, rango = 1000) {
  // Hash simple para dispersión pseudoaleatoria pero determinística.
  const r = (n) => {
    const x = Math.sin(n) * 10000;
    return x - Math.floor(x); // 0..1
  };
  return {
    x: (r(i * 1.1) - 0.5) * rango,
    y: (r(i * 2.3) - 0.5) * rango,
    z: (r(i * 3.7) - 0.5) * rango,
    vx: (r(i * 4.9) - 0.5) * 0.4,
    vy: (r(i * 6.1) - 0.5) * 0.4,
    vz: (r(i * 7.3) - 0.5) * 0.4,
  };
}

// Avanza una partícula y la "envuelve" dentro de [-rango/2, rango/2] en cada eje.
export function actualizarParticula(p, dt, rango = 1000) {
  const lim = rango / 2;
  const envolver = (v) => {
    if (v > lim) return v - rango;
    if (v < -lim) return v + rango;
    return v;
  };
  return {
    ...p,
    x: envolver(p.x + p.vx * dt),
    y: envolver(p.y + p.vy * dt),
    z: envolver(p.z + p.vz * dt),
  };
}

// Crea una onda (ripple) en respuesta a un click, en coordenadas de pantalla.
export function crearOnda(x, y, ahora = 0) {
  return { x, y, radio: 0, max: 320, nacimiento: ahora };
}

// Expande la onda; devuelve la onda actualizada o null si ya expiró.
export function expandirOnda(onda, dt) {
  const radio = onda.radio + dt * 0.6;
  if (radio >= onda.max) return null;
  return { ...onda, radio };
}

// Empuje radial que una onda ejerce sobre un punto (efecto "magia" al click).
// Devuelve un vector {dx, dy} que decae con la distancia al frente de la onda.
export function empujeOnda(onda, punto, fuerza = 12) {
  const dx = punto.x - onda.x;
  const dy = punto.y - onda.y;
  const d = Math.hypot(dx, dy) || 1;
  // El empuje es máximo cerca del frente de onda y decae a los lados.
  const cercania = 1 - Math.min(Math.abs(d - onda.radio) / 60, 1);
  if (cercania <= 0) return { dx: 0, dy: 0 };
  const f = (fuerza * cercania) / d;
  return { dx: dx * f, dy: dy * f };
}
