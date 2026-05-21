// Capa de interfaz: cablea la lógica pura (testeada con jest) al DOM.
import {
  validarLead,
  construirUrlWhatsapp,
  construirMailto,
  TIPOS_PROYECTO,
} from './lib/leads.js';
import { PLANES, getPlan, formatearARS, estimarProyecto } from './lib/pricing.js';

const TELEFONO = '+54 9 383 432-7244';
const EMAIL = 'contacto@mineconnect.com.ar';

const $ = (sel) => document.querySelector(sel);

// --- Año en el footer ---
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

// --- Render de planes ---
function renderPlanes() {
  const grid = $('#planes-grid');
  if (!grid) return;
  grid.innerHTML = PLANES.map((p) => `
    <div class="plan card ${p.id === 'web-pro' ? 'destacado' : ''}">
      ${p.id === 'web-pro' ? '<span class="tag-pop">Más elegido</span>' : ''}
      <h3>${p.nombre}</h3>
      <div class="precio">${formatearARS(p.desde)} <small>desde</small></div>
      <div class="entrega">⚡ ${p.entrega}</div>
      <ul>${p.incluye.map((i) => `<li>${i}</li>`).join('')}</ul>
      <a class="btn ${p.id === 'web-pro' ? 'btn-primary' : 'btn-ghost'}" href="#contacto" data-plan="${p.id}">Elegir ${p.nombre}</a>
    </div>
  `).join('');

  // Al elegir un plan, lo preseleccionamos en el formulario.
  grid.querySelectorAll('[data-plan]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = getPlan(btn.dataset.plan);
      if (plan) seleccionarTipoPorPlan(plan.id);
    });
  });
}

// Mapea id de plan -> opción del <select> de tipo de proyecto.
const PLAN_A_TIPO = {
  landing: 'Landing page',
  'web-pro': 'Sitio web institucional',
  'app-medida': 'Sistema/automatización a medida',
  'academia-ia': 'Curso de IA',
};
// Y la inversa, para estimar precio desde el tipo elegido.
const TIPO_A_PLAN = {
  'Landing page': 'landing',
  'Sitio web institucional': 'web-pro',
  'Tienda online': 'web-pro',
  'App móvil': 'app-medida',
  'Sistema/automatización a medida': 'app-medida',
  'Curso de IA': 'academia-ia',
};

function seleccionarTipoPorPlan(planId) {
  const tipoSel = $('#f-tipo');
  if (tipoSel && PLAN_A_TIPO[planId]) {
    tipoSel.value = PLAN_A_TIPO[planId];
    actualizarEstimado();
  }
}

// --- Poblar el select de tipos ---
function renderTipos() {
  const sel = $('#f-tipo');
  if (!sel) return;
  sel.innerHTML = TIPOS_PROYECTO.map((t) => `<option value="${t}">${t}</option>`).join('');
}

// --- Lectura del formulario ---
function leerFormulario() {
  return {
    nombre: $('#f-nombre')?.value ?? '',
    negocio: $('#f-negocio')?.value ?? '',
    tipo: $('#f-tipo')?.value ?? '',
    contacto: $('#f-contacto')?.value ?? '',
    detalle: $('#f-detalle')?.value ?? '',
    paginas: $('#f-paginas')?.value ?? 1,
    integraciones: $('#f-integraciones')?.value ?? 0,
    urgente: $('#f-urgente')?.checked ?? false,
  };
}

// --- Estimación en vivo ---
function actualizarEstimado() {
  const f = leerFormulario();
  const planId = TIPO_A_PLAN[f.tipo] || 'landing';
  const est = estimarProyecto({
    tipo: planId,
    paginas: f.paginas,
    integraciones: f.integraciones,
    urgente: f.urgente,
  });
  const val = $('#estimado-val');
  const plan = $('#estimado-plan');
  if (val) val.textContent = est.etiqueta;
  if (plan) plan.textContent = `Plan base: ${getPlan(est.plan)?.nombre ?? ''}`;
}

// --- Mostrar errores de validación ---
function pintarErrores(errores) {
  document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
  for (const [campo, msg] of Object.entries(errores)) {
    const el = document.querySelector(`.field-error[data-for="${campo}"]`);
    if (el) el.textContent = msg;
  }
}

// --- Envío del formulario ---
function manejarEnvio(e) {
  e.preventDefault();
  const lead = leerFormulario();
  const { valido, errores } = validarLead(lead);
  pintarErrores(errores);
  if (!valido) {
    const primer = document.querySelector('.field-error:not(:empty)');
    primer?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  const url = construirUrlWhatsapp(lead, TELEFONO);
  window.open(url, '_blank', 'noopener');
  $('#form-ok')?.classList.add('show');
}

// --- Inicialización ---
function init() {
  renderPlanes();
  renderTipos();
  actualizarEstimado();

  // Mailto y FAB de WhatsApp se recalculan al vuelo.
  const form = $('#lead-form');
  form?.addEventListener('submit', manejarEnvio);
  form?.addEventListener('input', () => {
    actualizarEstimado();
    const ml = $('#mailto-link');
    if (ml) ml.href = construirMailto(leerFormulario(), EMAIL);
  });

  const ml = $('#mailto-link');
  if (ml) ml.href = construirMailto(leerFormulario(), EMAIL);

  const fab = $('#fab-wa');
  if (fab) {
    fab.href = construirUrlWhatsapp(
      { nombre: '', tipo: 'Landing page', contacto: '' },
      TELEFONO
    );
    fab.target = '_blank';
    fab.rel = 'noopener';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
