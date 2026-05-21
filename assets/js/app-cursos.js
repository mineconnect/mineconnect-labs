// Interfaz de la página de cursos: temario detallado + recursos + fondo animado.
import { CURSOS, CANALES, totalLecciones, ahorro } from './lib/cursos.js';
import { formatearARS } from './lib/pricing.js';
import { initFondo } from './fx-bg.js';

const $ = (s) => document.querySelector(s);

function escapar(s) {
  const d = document.createElement('div');
  d.textContent = String(s ?? '');
  return d.innerHTML;
}
// Deep-link de búsqueda de YouTube por lección (mismo criterio que lib/cursos.js).
function ytUrl(q) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

function renderDetalle() {
  const cont = $('#cursos-detalle');
  if (!cont) return;
  cont.innerHTML = CURSOS.map((c) => {
    const a = ahorro(c);
    const modulos = c.modulos.map((m) => `
      <details class="modulo">
        <summary>${escapar(m.titulo)}</summary>
        ${m.lecciones.map((l) => `
          <div class="lec">
            <span>${escapar(l.titulo)}</span>
            <a href="${ytUrl(l.q)}" target="_blank" rel="noopener">▶ Ver videos gratis</a>
          </div>`).join('')}
      </details>`).join('');
    return `
    <div class="card ${c.destacado ? 'destacado' : ''}" style="margin-bottom:28px">
      <div class="grid grid-2" style="align-items:start">
        <div>
          <span class="nivel" style="color:var(--accent);font-weight:700;text-transform:uppercase;font-size:.78rem">${escapar(c.nivel)}</span>
          <h3 style="font-size:1.7rem;margin:6px 0">${escapar(c.nombre)}</h3>
          <p class="muted">${escapar(c.promesa)}</p>
          <div style="margin:14px 0">
            <span class="valor-real" style="text-decoration:line-through;color:var(--muted)">Valor del material: ${formatearARS(c.valorReal)}</span>
            <div class="precio" style="font-size:2rem;font-weight:800">${formatearARS(c.precio)}</div>
            <span class="ahorro">Ahorrás ${a.etiqueta} (${a.porcentaje}%)</span>
          </div>
          <div class="muted" style="font-size:.9rem">${escapar(c.duracion)} · ${totalLecciones(c)} clases con videos gratis</div>
          <a class="btn btn-primary" href="index.html#contacto" style="margin-top:18px">Inscribirme en ${escapar(c.nombre)} →</a>
        </div>
        <div>${modulos}</div>
      </div>
    </div>`;
  }).join('');
}

function renderCanales() {
  const grid = $('#canales-grid');
  if (!grid) return;
  grid.innerHTML = CANALES.map(
    (c) => `<a href="${c.url}" target="_blank" rel="noopener">▶ ${escapar(c.nombre)}</a>`
  ).join('');
}

function init() {
  const canvas = document.getElementById('fx-bg');
  if (canvas) initFondo(canvas);
  renderDetalle();
  renderCanales();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
