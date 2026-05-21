import {
  secuenciaPorRubro,
  plantilla,
  aWhatsApp,
  urlGmail,
  urlMailto,
  urlWhatsApp,
  urlInstagram,
  accionEnvio,
} from '../assets/js/lib/outreach.js';

describe('secuenciaPorRubro', () => {
  test('mapea rubros conocidos', () => {
    expect(secuenciaPorRubro('Gimnasio')).toBe('B');
    expect(secuenciaPorRubro('Bar / cervecería')).toBe('A');
    expect(secuenciaPorRubro('Academia de formación')).toBe('D');
    expect(secuenciaPorRubro('Peluquería y estética')).toBe('E');
    expect(secuenciaPorRubro('Ferretería')).toBe('F');
    expect(secuenciaPorRubro('Corralón')).toBe('F');
    expect(secuenciaPorRubro('Inmobiliaria')).toBe('C');
    expect(secuenciaPorRubro('')).toBe('C');
  });
});

describe('plantilla', () => {
  test('personaliza con el nombre del negocio', () => {
    const t = plantilla('B', 1, 'Temple Gym');
    expect(t.asunto).toContain('Temple Gym');
    expect(t.cuerpo).toContain('Temple Gym');
    expect(t.cuerpo).toContain('MineConnect Labs');
  });
  test('soporta pasos 1, 2 y 3 y cae a 1 si no existe', () => {
    expect(plantilla('A', 2, 'X').asunto).toMatch(/^Re:/);
    expect(plantilla('A', 3, 'X').asunto).toContain('Cierro');
    expect(plantilla('A', 9, 'X').asunto).toBe(plantilla('A', 1, 'X').asunto);
  });
  test('secuencia desconocida usa C', () => {
    expect(plantilla('Z', 1, 'X').asunto).toBe(plantilla('C', 1, 'X').asunto);
  });
  test('E (estética) y F (comercio) personalizan y firman', () => {
    const e = plantilla('E', 1, 'Spa Luz');
    expect(e.asunto).toContain('Spa Luz');
    expect(e.cuerpo).toContain('turnos');
    expect(e.cuerpo).toContain('MineConnect Labs');
    const f = plantilla('F', 1, 'Ferretería Sur');
    expect(f.asunto).toContain('Ferretería Sur');
    expect(f.cuerpo).toContain('catálogo');
    expect(f.cuerpo).toContain('MineConnect Labs');
  });
});

describe('aWhatsApp', () => {
  test('celular con 0 y 15 -> formato internacional 549', () => {
    expect(aWhatsApp('0383 15-492-8306')).toBe('5493834928306');
  });
  test('número que ya trae 54', () => {
    expect(aWhatsApp('+54 9 383 432 7244')).toBe('5493834327244');
  });
  test('vacío o muy corto -> ""', () => {
    expect(aWhatsApp('')).toBe('');
    expect(aWhatsApp('123')).toBe('');
  });
});

describe('builders de URL', () => {
  test('Gmail compose lleva to, su y body', () => {
    const u = urlGmail('a@b.com', 'Hola', 'Cuerpo');
    expect(u).toContain('view=cm');
    expect(u).toContain('to=a%40b.com');
    expect(u).toContain('su=Hola');
    expect(u).toContain('body=Cuerpo');
  });
  test('mailto codifica asunto y cuerpo', () => {
    const u = urlMailto('a@b.com', 'Hola mundo', 'Línea 1');
    expect(u.startsWith('mailto:a@b.com?subject=')).toBe(true);
    expect(u).toContain('Hola%20mundo');
  });
  test('WhatsApp arma wa.me con texto codificado', () => {
    const u = urlWhatsApp('0383 15-492-8306', 'hola che');
    expect(u.startsWith('https://wa.me/5493834928306?text=')).toBe(true);
    expect(u).toContain('hola');
  });
  test('WhatsApp con teléfono inválido devuelve ""', () => {
    expect(urlWhatsApp('', 'x')).toBe('');
  });
  test('Instagram normaliza el handle', () => {
    expect(urlInstagram('@meet.463')).toBe('https://instagram.com/meet.463');
    expect(urlInstagram('')).toBe('');
  });
});

describe('accionEnvio (elección de canal 1-click)', () => {
  test('prioriza email -> Gmail', () => {
    const a = accionEnvio({ nombre: 'X', rubro: 'Bar', email: 'x@y.com', telefono: '0383 15-111-1111' }, 1);
    expect(a.canal).toBe('email');
    expect(a.url).toContain('mail.google.com');
  });
  test('sin email pero con celular -> WhatsApp', () => {
    const a = accionEnvio({ nombre: 'Temple Gym', rubro: 'Gimnasio', telefono: '0383 15-492-8306' }, 1);
    expect(a.canal).toBe('whatsapp');
    expect(a.url).toContain('wa.me/5493834928306');
    expect(decodeURIComponent(a.url)).toContain('Temple Gym');
  });
  test('solo Instagram -> abre IG', () => {
    const a = accionEnvio({ nombre: 'Meet 463', rubro: 'Bar', instagram: '@meet.463' }, 1);
    expect(a.canal).toBe('instagram');
    expect(a.url).toContain('instagram.com/meet.463');
  });
  test('sin ningún contacto -> canal ninguno', () => {
    expect(accionEnvio({ nombre: 'X', rubro: 'Bar' }, 1).canal).toBe('ninguno');
  });
});
