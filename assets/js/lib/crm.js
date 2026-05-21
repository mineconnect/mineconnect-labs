// Lógica pura de un mini-CRM de leads para MineConnect Labs.
// Sin dependencias del DOM ni de almacenamiento: la persistencia (localStorage)
// vive en la capa de interfaz. Acá solo transformaciones puras y testeables.

export const ESTADOS = ['nuevo', 'contactado', 'presupuestado', 'cerrado', 'perdido'];

let _seq = 0;
// Genera un id razonablemente único sin depender de APIs del navegador.
export function nuevoId(ahora = Date.now()) {
  _seq = (_seq + 1) % 1000;
  return `lead_${ahora}_${String(_seq).padStart(3, '0')}`;
}

// Normaliza un contacto (email o teléfono) para comparar/deduplicar.
export function claveContacto(contacto) {
  const c = String(contacto ?? '').trim().toLowerCase();
  if (c.includes('@')) return c; // email
  const soloDigitos = c.replace(/\D/g, '');
  return soloDigitos || c;
}

// Crea un lead normalizado a partir de datos crudos del formulario.
export function crearLead(datos = {}, ahora = Date.now()) {
  return {
    id: datos.id || nuevoId(ahora),
    nombre: String(datos.nombre ?? '').trim(),
    negocio: String(datos.negocio ?? '').trim(),
    tipo: String(datos.tipo ?? '').trim(),
    contacto: String(datos.contacto ?? '').trim(),
    detalle: String(datos.detalle ?? '').trim(),
    estado: ESTADOS.includes(datos.estado) ? datos.estado : 'nuevo',
    creado: datos.creado || ahora,
  };
}

// Agrega un lead a la lista, deduplicando por contacto.
// Si ya existe el mismo contacto, actualiza sus datos sin crear duplicado.
export function agregarLead(lista, datos, ahora = Date.now()) {
  const base = Array.isArray(lista) ? lista.slice() : [];
  const nuevo = crearLead(datos, ahora);
  const clave = claveContacto(nuevo.contacto);
  const idx = base.findIndex((l) => clave && claveContacto(l.contacto) === clave);
  if (idx >= 0) {
    base[idx] = { ...base[idx], ...nuevo, id: base[idx].id, creado: base[idx].creado };
    return base;
  }
  base.push(nuevo);
  return base;
}

export function actualizarEstado(lista, id, estado) {
  if (!ESTADOS.includes(estado)) return lista;
  return (lista || []).map((l) => (l.id === id ? { ...l, estado } : l));
}

export function eliminarLead(lista, id) {
  return (lista || []).filter((l) => l.id !== id);
}

// Filtra por estado ('todos' devuelve todo) y texto libre (nombre/negocio/contacto).
export function filtrarLeads(lista, { estado = 'todos', texto = '' } = {}) {
  const q = String(texto).trim().toLowerCase();
  return (lista || []).filter((l) => {
    if (estado !== 'todos' && l.estado !== estado) return false;
    if (!q) return true;
    return [l.nombre, l.negocio, l.contacto, l.tipo]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });
}

// Estadísticas para el tablero.
export function estadisticas(lista) {
  const items = lista || [];
  const porEstado = Object.fromEntries(ESTADOS.map((e) => [e, 0]));
  for (const l of items) {
    if (porEstado[l.estado] != null) porEstado[l.estado] += 1;
  }
  const cerrados = porEstado.cerrado;
  const decididos = porEstado.cerrado + porEstado.perdido;
  const tasaCierre = decididos > 0 ? Math.round((cerrados / decididos) * 100) : 0;
  return { total: items.length, porEstado, tasaCierre };
}

// Exporta a CSV (con escape de comillas y comas).
export function aCSV(lista) {
  const cols = ['nombre', 'negocio', 'tipo', 'contacto', 'estado', 'creado', 'detalle'];
  const esc = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = cols.join(',');
  const filas = (lista || []).map((l) =>
    cols.map((c) => esc(c === 'creado' ? new Date(l.creado).toISOString() : l[c])).join(',')
  );
  return [head, ...filas].join('\n');
}
