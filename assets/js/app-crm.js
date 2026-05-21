// Interfaz del CRM: persiste en localStorage y cablea la lógica pura (testeada).
import {
  ESTADOS,
  agregarLead,
  actualizarEstado,
  eliminarLead,
  filtrarLeads,
  estadisticas,
  aCSV,
} from './lib/crm.js';

const KEY = 'mclabs_leads';
const $ = (s) => document.querySelector(s);

function cargar() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}
function guardar(lista) {
  localStorage.setItem(KEY, JSON.stringify(lista));
}

let leads = cargar();

function render() {
  // Stats
  const s = estadisticas(leads);
  $('#stats').innerHTML = `
    <div class="stat"><div class="n">${s.total}</div><div class="l">Leads totales</div></div>
    <div class="stat"><div class="n">${s.porEstado.nuevo}</div><div class="l">Nuevos</div></div>
    <div class="stat"><div class="n">${s.porEstado.cerrado}</div><div class="l">Cerrados ✅</div></div>
    <div class="stat"><div class="n">${s.tasaCierre}%</div><div class="l">Tasa de cierre</div></div>`;

  // Tabla filtrada
  const visibles = filtrarLeads(leads, {
    estado: $('#filtro-estado').value || 'todos',
    texto: $('#buscar').value || '',
  });
  const tbody = $('#tbody');
  tbody.innerHTML = visibles
    .map(
      (l) => `
    <tr>
      <td>${escapar(l.nombre)}</td>
      <td>${escapar(l.negocio)}</td>
      <td>${escapar(l.tipo)}</td>
      <td>${escapar(l.contacto)}</td>
      <td>
        <select data-id="${l.id}" class="estado-sel">
          ${ESTADOS.map((e) => `<option value="${e}" ${e === l.estado ? 'selected' : ''}>${e}</option>`).join('')}
        </select>
      </td>
      <td><button class="del" data-del="${l.id}" title="Eliminar">🗑</button></td>
    </tr>`
    )
    .join('');

  $('#empty').style.display = leads.length === 0 ? 'block' : 'none';
}

// Delegación de eventos: un solo par de listeners en el <tbody>, enganchados
// una vez en init(). render() solo actualiza el HTML, no re-bindea por fila.
function initTablaDelegada() {
  const tbody = $('#tbody');
  tbody.addEventListener('change', (e) => {
    const sel = e.target.closest('.estado-sel');
    if (!sel) return;
    leads = actualizarEstado(leads, sel.dataset.id, sel.value);
    guardar(leads);
    render();
  });
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    leads = eliminarLead(leads, btn.dataset.del);
    guardar(leads);
    render();
  });
}

function escapar(s) {
  const div = document.createElement('div');
  div.textContent = String(s ?? '');
  return div.innerHTML;
}

function initFiltros() {
  $('#filtro-estado').innerHTML =
    `<option value="todos">Todos los estados</option>` +
    ESTADOS.map((e) => `<option value="${e}">${e}</option>`).join('');
  $('#buscar').addEventListener('input', render);
  $('#filtro-estado').addEventListener('change', render);
}

$('#crm-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = $('#c-nombre').value.trim();
  const contacto = $('#c-contacto').value.trim();
  if (!nombre || !contacto) {
    alert('Nombre y contacto son obligatorios');
    return;
  }
  leads = agregarLead(leads, {
    nombre,
    negocio: $('#c-negocio').value,
    tipo: $('#c-tipo').value,
    contacto,
    detalle: $('#c-detalle').value,
  });
  guardar(leads);
  e.target.reset();
  e.target.closest('details').open = false;
  render();
});

$('#exportar').addEventListener('click', () => {
  const csv = aCSV(leads);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-mineconnect-labs-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

initFiltros();
initTablaDelegada();
render();
