import {
  parsearCSV,
  csvAObjetos,
  prospectoALead,
  importarProspectos,
} from '../assets/js/lib/csv.js';
import { agregarLead } from '../assets/js/lib/crm.js';

describe('parsearCSV', () => {
  test('parsea filas y columnas simples', () => {
    expect(parsearCSV('a,b,c\n1,2,3')).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });
  test('respeta comas dentro de comillas', () => {
    expect(parsearCSV('x,"hola, mundo",z')).toEqual([['x', 'hola, mundo', 'z']]);
  });
  test('soporta comillas escapadas', () => {
    expect(parsearCSV('"dijo ""hola"""')).toEqual([['dijo "hola"']]);
  });
  test('normaliza CRLF', () => {
    expect(parsearCSV('a,b\r\n1,2')).toEqual([['a', 'b'], ['1', '2']]);
  });
});

describe('csvAObjetos', () => {
  test('usa la primera fila como encabezado', () => {
    const objs = csvAObjetos('nombre,edad\nAna,30\nBeto,40');
    expect(objs).toEqual([
      { nombre: 'Ana', edad: '30' },
      { nombre: 'Beto', edad: '40' },
    ]);
  });
  test('ignora filas totalmente vacías', () => {
    expect(csvAObjetos('a,b\n1,2\n\n3,4')).toHaveLength(2);
  });
  test('devuelve vacío si no hay datos', () => {
    expect(csvAObjetos('a,b')).toEqual([]);
    expect(csvAObjetos('')).toEqual([]);
  });
});

describe('prospectoALead', () => {
  test('mapea negocio, contacto y secuencia->tipo', () => {
    const l = prospectoALead({
      negocio: 'Bar Sol',
      rubro: 'Gastronomía',
      contacto_email: 'sol@bar.com',
      ciudad: 'Catamarca',
      fuente: 'Google Maps',
      secuencia: 'A',
      notas: 'sin web',
    });
    expect(l.negocio).toBe('Bar Sol');
    expect(l.nombre).toBe('Bar Sol');
    expect(l.contacto).toBe('sol@bar.com');
    expect(l.tipo).toBe('Landing page');
    expect(l.detalle).toContain('Gastronomía');
    expect(l.detalle).toContain('sin web');
    expect(l.estado).toBe('nuevo');
  });
  test('usa el teléfono si no hay email', () => {
    expect(prospectoALead({ negocio: 'Gym', contacto_tel: '3834000000' }).contacto).toBe('3834000000');
  });
  test('secuencia desconocida deja tipo vacío', () => {
    expect(prospectoALead({ negocio: 'X', contacto_tel: '1', secuencia: 'Z' }).tipo).toBe('');
  });
});

describe('importarProspectos', () => {
  const csv = `negocio,rubro,contacto_email,contacto_tel,ciudad,fuente,secuencia,estado,notas
Bar Sol,Gastronomía,sol@bar.com,,Catamarca,Maps,A,pendiente,sin web
Gym Fuerza,Gimnasio,,3834000000,Catamarca,IG,B,pendiente,cuotas en cuaderno
Sin Contacto,Otro,,,Cba,Maps,C,pendiente,no tiene datos`;

  test('importa filas con contacto y omite las que no tienen', () => {
    const r = importarProspectos([], csv, agregarLead, 100);
    expect(r.importados).toBe(2);
    expect(r.omitidos).toBe(1); // "Sin Contacto"
    expect(r.lista).toHaveLength(2);
  });

  test('deduplica contra leads ya existentes', () => {
    let lista = agregarLead([], { nombre: 'Bar Sol', contacto: 'sol@bar.com' }, 50);
    const r = importarProspectos(lista, csv, agregarLead, 100);
    // Bar Sol ya existía -> se omite como nuevo; Gym Fuerza se suma.
    expect(r.importados).toBe(1);
    expect(r.lista).toHaveLength(2);
  });

  test('CSV vacío no rompe', () => {
    const r = importarProspectos([], '', agregarLead);
    expect(r.importados).toBe(0);
    expect(r.lista).toEqual([]);
  });
});
