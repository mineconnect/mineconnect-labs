// Motor de render del fondo "3D" animado. Usa la math pura testeada de lib/fx.js.
// Campo de partículas con perspectiva + red de conexiones + parallax con el mouse
// + ondas mágicas en CADA click (en cualquier botón o lugar de la página).
import {
  proyectar,
  distancia,
  intensidadConexion,
  crearParticula,
  actualizarParticula,
  crearOnda,
  expandirOnda,
  empujeOnda,
} from './lib/fx.js';

export function initFondo(canvas, opts = {}) {
  if (!canvas || !canvas.getContext) return () => {};
  let ctx = null;
  try {
    ctx = canvas.getContext('2d');
  } catch {
    ctx = null; // entornos sin canvas (p. ej. jsdom en tests)
  }
  // Sin contexto 2D no hay nada que animar: salida limpia.
  if (!ctx) return () => {};
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const N = opts.n || 90;
  const rango = 1500;
  const maxDist = (opts.maxDist || 135) * dpr;
  const fov = 600;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = 0;
  let h = 0;
  let particulas = [];
  let ondas = [];
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let raf = 0;
  let last = 0;

  for (let i = 0; i < N; i++) particulas.push(crearParticula(i, rango));

  function resize() {
    w = canvas.width = Math.floor(canvas.clientWidth * dpr);
    h = canvas.height = Math.floor(canvas.clientHeight * dpr);
  }

  function colorPunto(scale) {
    // Más cerca (scale grande) -> más turquesa/brillante; más lejos -> azul tenue.
    const t = Math.min(Math.max((scale - 0.6) / 0.8, 0), 1);
    const r = Math.round(79 + (46 - 79) * t);
    const g = Math.round(140 + (230 - 140) * t);
    const b = Math.round(255 + (166 - 255) * t);
    return `rgb(${r},${g},${b})`;
  }

  function frame(ts) {
    const dt = last ? Math.min((ts - last) / 16.67, 3) : 1;
    last = ts;

    // Parallax suave hacia el mouse.
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    ctx.clearRect(0, 0, w, h);

    // Proyectar todas las partículas (con leve desplazamiento por parallax).
    const offX = (mouse.x - w / 2) * 0.04;
    const offY = (mouse.y - h / 2) * 0.04;
    const proj = new Array(particulas.length);
    for (let i = 0; i < particulas.length; i++) {
      particulas[i] = actualizarParticula(particulas[i], dt, rango);
      const p = proyectar(particulas[i], w, h, fov);
      p.x += offX * p.scale;
      p.y += offY * p.scale;
      proj[i] = p;
    }

    // Conexiones (red).
    for (let i = 0; i < proj.length; i++) {
      for (let j = i + 1; j < proj.length; j++) {
        const d = distancia(proj[i], proj[j]);
        const op = intensidadConexion(d, maxDist);
        if (op > 0) {
          ctx.strokeStyle = `rgba(79,140,255,${op * 0.35})`;
          ctx.lineWidth = dpr * 0.6;
          ctx.beginPath();
          ctx.moveTo(proj[i].x, proj[i].y);
          ctx.lineTo(proj[j].x, proj[j].y);
          ctx.stroke();
        }
      }
    }

    // Puntos.
    for (let i = 0; i < proj.length; i++) {
      const p = proj[i];
      const radio = Math.max(0.6, 2.2 * p.scale) * dpr;
      ctx.fillStyle = colorPunto(p.scale);
      ctx.globalAlpha = Math.min(p.scale, 1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, radio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Ondas (ripples de click): empujan partículas y se dibujan expandiéndose.
    const vivas = [];
    for (let o of ondas) {
      // Empujar partículas cerca del frente de onda.
      for (let i = 0; i < particulas.length; i++) {
        const e = empujeOnda(o, proj[i], 18);
        if (e.dx || e.dy) {
          particulas[i].vx += e.dx * 0.02;
          particulas[i].vy += e.dy * 0.02;
        }
      }
      const alpha = 1 - o.radio / o.max;
      const grad = ctx.createRadialGradient(o.x, o.y, Math.max(o.radio - 30 * dpr, 0), o.x, o.y, o.radio);
      grad.addColorStop(0, 'rgba(46,230,166,0)');
      grad.addColorStop(0.8, `rgba(46,230,166,${alpha * 0.5})`);
      grad.addColorStop(1, 'rgba(124,92,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.radio, 0, Math.PI * 2);
      ctx.stroke();

      const nueva = expandirOnda(o, dt * dpr);
      if (nueva) vivas.push(nueva);
    }
    ondas = vivas;

    raf = requestAnimationFrame(frame);
  }

  function onMove(e) {
    const t = e.touches ? e.touches[0] : e;
    mouse.tx = t.clientX * dpr;
    mouse.ty = t.clientY * dpr;
  }

  // Onda mágica en CUALQUIER click de la página (botones incluidos).
  function onClick(e) {
    const x = (e.clientX || w / (2 * dpr)) * dpr;
    const y = (e.clientY || h / (2 * dpr)) * dpr;
    ondas.push(crearOnda(x, y, last));
    // Pequeño impulso instantáneo a las partículas cercanas.
    for (let i = 0; i < particulas.length; i++) {
      const p = proyectar(particulas[i], w, h, fov);
      const e2 = empujeOnda({ x, y, radio: 0, max: 320 }, p, 26);
      particulas[i].vx += e2.dx * 0.03;
      particulas[i].vy += e2.dy * 0.03;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('click', onClick);

  if (reduce) {
    // Accesibilidad: sin animación, dibujamos un único cuadro estático.
    frame(0);
    cancelAnimationFrame(raf);
  } else {
    raf = requestAnimationFrame(frame);
  }

  // Devuelve función de limpieza.
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('click', onClick);
  };
}
