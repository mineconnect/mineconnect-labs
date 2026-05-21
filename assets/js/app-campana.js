// Interfaz de la campaña "1 click". Usa la lógica pura testeada de outreach.js.
import { NEGOCIOS } from './data/negocios.js';
import { accionEnvio, secuenciaPorRubro } from './lib/outreach.js';
import { initFondo } from './fx-bg.js';

const KEY = 'mclabs_campana';
const $ = (s) => document.querySelector(s);

function cargar() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function guardar(estado) { localStorage.setItem(KEY, JSON.stringify(estado)); }

let estado = cargar(); // { [id]: { email, enviado: {1,2,3} } }

function escapar(s) {
  const d = document.createElement('div');
  d.textContent = String(s ?? '');
  return d.innerHTML;
}

function negocioConOverrides(n) {
  const e = estado[n.id] || {};
  return { ...n, email: (e.email || n.email || '').trim() };
}

function paso() { return Number($('#paso').value) || 1; }

function render() {
  const p = paso();
  const lista = $('#lista');
  let enviados = 0;

  lista.innerHTML = NEGOCIOS.map((n) => {
    const e = estado[n.id] || {};
    const yaEnviado = !!(e.enviado && e.enviado[p]);
    if (yaEnviado) enviados++;
    const negocio = negocioConOverrides(n);
    const acc = accionEnvio(negocio, p);
    const sec = negocio.secuencia || secuenciaPorRubro(negocio.rubro);
    const deshab = !acc.url;
    return `
    <div class="neg ${yaEnviado ? 'enviado' : ''}" data-id="${n.id}">
      <div class="neg-top">
        <div>
          <h3>${escapar(n.nombre)} ${yaEnviado ? '<span style="color:var(--accent)">✓ enviado</span>' : ''}</h3>
          <div class="sub">${escapar(n.rubro)} · ${escapar(n.ciudad)} · secuencia ${sec} · fuente: ${escapar(n.fuente)}</div>
        </div>
        <span class="canal ${acc.canal}">${acc.canal}</span>
      </div>
      <div class="neg-acciones">
        <a class="btn ${deshab ? 'btn-ghost' : 'btn-primary'}" data-enviar href="${acc.url || '#'}" ${acc.url ? 'target="_blank" rel="noopener"' : 'aria-disabled="true"'}>${acc.etiqueta}</a>
        <input type="email" data-email placeholder="agregar email para enviar por Gmail" value="${escapar(e.email || '')}" />
        <label class="check"><input type="checkbox" data-check ${yaEnviado ? 'checked' : ''} style="width:auto"/> marcar enviado</label>
      </div>
      ${n.nota ? `<div class="nota">⚠ ${escapar(n.nota)}</div>` : ''}
      <details class="preview"><summary>Ver mensaje (${escapar(acc.asunto)})</summary><pre>${escapar(acc.cuerpo)}</pre></details>
    </div>`;
  }).join('');

  $('#progreso').innerHTML = `Paso ${p}: <b>${enviados}</b> / ${NEGOCIOS.length} enviados`;
}

function setEnviado(id, p, val) {
  estado[id] = estado[id] || {};
  estado[id].enviado = estado[id].enviado || {};
  estado[id].enviado[p] = val;
  guardar(estado);
}

function init() {
  const canvas = document.getElementById('fx-bg');
  if (canvas) initFondo(canvas);

  $('#paso').addEventListener('change', render);

  const lista = $('#lista');
  // Al enviar: abre el canal y marca como enviado ese paso.
  lista.addEventListener('click', (ev) => {
    const a = ev.target.closest('[data-enviar]');
    if (!a) return;
    if (a.getAttribute('aria-disabled') === 'true') { ev.preventDefault(); return; }
    const id = a.closest('.neg').dataset.id;
    setEnviado(id, paso(), true);
    render();
  });
  // Editar email -> persiste y re-renderiza (cambia el canal a Gmail).
  lista.addEventListener('change', (ev) => {
    const neg = ev.target.closest('.neg');
    if (!neg) return;
    const id = neg.dataset.id;
    if (ev.target.matches('[data-email]')) {
      estado[id] = estado[id] || {};
      estado[id].email = ev.target.value.trim();
      guardar(estado);
      render();
    } else if (ev.target.matches('[data-check]')) {
      setEnviado(id, paso(), ev.target.checked);
      render();
    }
  });

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
