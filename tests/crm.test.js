import {
  ESTADOS,
  nuevoId,
  claveContacto,
  crearLead,
  agregarLead,
  actualizarEstado,
  eliminarLead,
  filtrarLeads,
  estadisticas,
  aCSV,
} from '../assets/js/lib/crm.js';

describe('nuevoId', () => {
  test('genera ids distintos', () => {
    expect(nuevoId(1000)).not.toBe(nuevoId(1000));
  });
});

describe('claveContacto', () => {
  test('emails se normalizan en minúsculas', () => {
    expect(claveContacto('Facu@Mail.com')).toBe('facu@mail.com');
  });
  test('teléfonos quedan en dígitos', () => {
    expect(claveContacto('+54 9 383 432-7244')).toBe('5493834327244');
  });
});

describe('crearLead', () => {
  test('normaliza y asigna estado por defecto', () => {
    const l = crearLead({ nombre: ' Ana ', tipo: 'Landing page', contacto: 'a@b.com' }, 123);
    expect(l.nombre).toBe('Ana');
    expect(l.estado).toBe('nuevo');
    expect(l.creado).toBe(123);
    expect(l.id).toContain('lead_123');
  });
  test('respeta un estado válido provisto', () => {
    expect(crearLead({ estado: 'cerrado' }).estado).toBe('cerrado');
    expect(crearLead({ estado: 'inventado' }).estado).toBe('nuevo');
  });
});

describe('agregarLead', () => {
  test('agrega un lead nuevo', () => {
    const r = agregarLead([], { nombre: 'Ana', contacto: 'a@b.com' });
    expect(r).toHaveLength(1);
  });
  test('deduplica por contacto y conserva id/fecha originales', () => {
    let lista = agregarLead([], { nombre: 'Ana', contacto: 'a@b.com' }, 100);
    const idOrig = lista[0].id;
    lista = agregarLead(lista, { nombre: 'Ana Pérez', contacto: 'A@B.com' }, 200);
    expect(lista).toHaveLength(1);
    expect(lista[0].nombre).toBe('Ana Pérez');
    expect(lista[0].id).toBe(idOrig);
    expect(lista[0].creado).toBe(100);
  });
  test('teléfono con distinto formato se considera el mismo contacto', () => {
    let lista = agregarLead([], { nombre: 'Ana', contacto: '383 432 7244' });
    lista = agregarLead(lista, { nombre: 'Ana', contacto: '3834327244' });
    expect(lista).toHaveLength(1);
  });
});

describe('actualizarEstado / eliminarLead', () => {
  const lista = [crearLead({ nombre: 'Ana', contacto: 'a@b.com', id: 'x1' })];
  test('actualiza a un estado válido', () => {
    expect(actualizarEstado(lista, 'x1', 'cerrado')[0].estado).toBe('cerrado');
  });
  test('ignora estado inválido', () => {
    expect(actualizarEstado(lista, 'x1', 'zzz')[0].estado).toBe('nuevo');
  });
  test('elimina por id', () => {
    expect(eliminarLead(lista, 'x1')).toHaveLength(0);
  });
});

describe('filtrarLeads', () => {
  const lista = [
    crearLead({ nombre: 'Ana', negocio: 'Bar Sol', contacto: 'a@b.com', estado: 'nuevo', id: '1' }),
    crearLead({ nombre: 'Beto', negocio: 'Gym Fuerza', contacto: 'b@c.com', estado: 'cerrado', id: '2' }),
  ];
  test('todos devuelve todo', () => {
    expect(filtrarLeads(lista, { estado: 'todos' })).toHaveLength(2);
  });
  test('filtra por estado', () => {
    expect(filtrarLeads(lista, { estado: 'cerrado' })).toHaveLength(1);
  });
  test('filtra por texto en cualquier campo', () => {
    expect(filtrarLeads(lista, { texto: 'gym' })).toHaveLength(1);
    expect(filtrarLeads(lista, { texto: 'sol' })[0].nombre).toBe('Ana');
  });
});

describe('estadisticas', () => {
  test('cuenta por estado y calcula tasa de cierre', () => {
    const lista = [
      crearLead({ contacto: '1', estado: 'cerrado', id: 'a' }),
      crearLead({ contacto: '2', estado: 'cerrado', id: 'b' }),
      crearLead({ contacto: '3', estado: 'perdido', id: 'c' }),
      crearLead({ contacto: '4', estado: 'nuevo', id: 'd' }),
    ];
    const s = estadisticas(lista);
    expect(s.total).toBe(4);
    expect(s.porEstado.cerrado).toBe(2);
    // 2 cerrados de 3 decididos (2 cerrados + 1 perdido) = 67%
    expect(s.tasaCierre).toBe(67);
  });
  test('tasa de cierre 0 sin decididos', () => {
    expect(estadisticas([crearLead({ contacto: 'x', estado: 'nuevo' })]).tasaCierre).toBe(0);
  });
});

describe('aCSV', () => {
  test('genera encabezado y filas, escapando comas', () => {
    const csv = aCSV([crearLead({ nombre: 'Ana, Jefa', negocio: 'Bar', contacto: 'a@b.com', creado: 0 })]);
    const lineas = csv.split('\n');
    expect(lineas[0]).toBe('nombre,negocio,tipo,contacto,estado,creado,detalle');
    expect(lineas[1]).toContain('"Ana, Jefa"');
  });
  test('lista vacía deja solo el encabezado', () => {
    expect(aCSV([]).split('\n')).toHaveLength(1);
  });
});

test('ESTADOS expone los estados esperados', () => {
  expect(ESTADOS).toEqual(['nuevo', 'contactado', 'presupuestado', 'cerrado', 'perdido']);
});
