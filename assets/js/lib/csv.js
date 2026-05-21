// Parser CSV puro (sin dependencias) + mapeo de prospectos a leads del CRM.
// Soporta campos entre comillas con comas, saltos de línea y comillas escapadas ("").

// Parsea un texto CSV a un array de filas (cada fila = array de celdas).
export function parsearCSV(texto) {
  const filas = [];
  let fila = [];
  let celda = '';
  let enComillas = false;
  const s = String(texto ?? '').replace(/\r\n?/g, '\n'); // normaliza saltos

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (enComillas) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          celda += '"';
          i++; // comilla escapada
        } else {
          enComillas = false;
        }
      } else {
        celda += c;
      }
    } else if (c === '"') {
      enComillas = true;
    } else if (c === ',') {
      fila.push(celda);
      celda = '';
    } else if (c === '\n') {
      fila.push(celda);
      filas.push(fila);
      fila = [];
      celda = '';
    } else {
      celda += c;
    }
  }
  // última celda/fila si el archivo no termina en salto
  if (celda !== '' || fila.length > 0) {
    fila.push(celda);
    filas.push(fila);
  }
  return filas;
}

// Convierte el CSV en array de objetos usando la primera fila como encabezado.
export function csvAObjetos(texto) {
  const filas = parsearCSV(texto).filter((f) => f.some((c) => c.trim() !== ''));
  if (filas.length < 2) return [];
  const headers = filas[0].map((h) => h.trim());
  return filas.slice(1).map((f) => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (f[idx] ?? '').trim();
    });
    return obj;
  });
}

// Mapea una fila de prospectos-template.csv a la forma de lead del CRM.
const SECUENCIA_A_TIPO = {
  A: 'Landing page',
  B: 'App móvil',
  C: 'Sitio web institucional',
  D: 'Curso de IA',
};

export function prospectoALead(row = {}) {
  const negocio = (row.negocio || '').trim();
  const contacto = (row.contacto_email || row.contacto_tel || '').trim();
  const partes = [row.rubro, row.ciudad, row.fuente, row.notas]
    .map((x) => (x || '').trim())
    .filter(Boolean);
  return {
    nombre: negocio || contacto,
    negocio,
    tipo: SECUENCIA_A_TIPO[(row.secuencia || '').trim().toUpperCase()] || '',
    contacto,
    detalle: partes.join(' · '),
    estado: 'nuevo',
  };
}

// Importa prospectos a la lista de leads, deduplicando por contacto.
// Devuelve { lista, importados, omitidos }.
export function importarProspectos(lista, texto, agregarLead, ahora = Date.now()) {
  const rows = csvAObjetos(texto);
  let resultado = Array.isArray(lista) ? lista.slice() : [];
  let importados = 0;
  let omitidos = 0;
  for (const row of rows) {
    const lead = prospectoALead(row);
    // Sin contacto no se puede deduplicar ni contactar: se omite.
    if (!lead.contacto) {
      omitidos++;
      continue;
    }
    const antes = resultado.length;
    resultado = agregarLead(resultado, lead, ahora);
    if (resultado.length > antes) importados++;
    else omitidos++; // era duplicado (se actualizó, no se sumó)
  }
  return { lista: resultado, importados, omitidos };
}
