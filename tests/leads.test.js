import {
  validarLead,
  normalizarTelefono,
  construirMensaje,
  construirUrlWhatsapp,
  construirMailto,
  TIPOS_PROYECTO,
} from '../assets/js/lib/leads.js';

describe('normalizarTelefono', () => {
  test('deja solo dígitos', () => {
    expect(normalizarTelefono('+54 9 383 432-7244')).toBe('5493834327244');
  });
  test('tolera null/undefined', () => {
    expect(normalizarTelefono(null)).toBe('');
    expect(normalizarTelefono(undefined)).toBe('');
  });
});

describe('validarLead', () => {
  const base = { nombre: 'Facu', contacto: 'test@mail.com', tipo: 'Landing page' };

  test('acepta un lead completo con email', () => {
    expect(validarLead(base).valido).toBe(true);
  });

  test('acepta teléfono como contacto', () => {
    expect(validarLead({ ...base, contacto: '3834327244' }).valido).toBe(true);
  });

  test('rechaza nombre corto', () => {
    const r = validarLead({ ...base, nombre: 'F' });
    expect(r.valido).toBe(false);
    expect(r.errores.nombre).toBeDefined();
  });

  test('rechaza contacto inválido', () => {
    const r = validarLead({ ...base, contacto: 'nope' });
    expect(r.valido).toBe(false);
    expect(r.errores.contacto).toBeDefined();
  });

  test('rechaza tipo de proyecto no listado', () => {
    const r = validarLead({ ...base, tipo: 'cohetes' });
    expect(r.valido).toBe(false);
    expect(r.errores.tipo).toBeDefined();
  });

  test('rechaza lead vacío', () => {
    expect(validarLead().valido).toBe(false);
    expect(validarLead({}).valido).toBe(false);
  });

  test('todos los TIPOS_PROYECTO son válidos', () => {
    for (const tipo of TIPOS_PROYECTO) {
      expect(validarLead({ ...base, tipo }).valido).toBe(true);
    }
  });
});

describe('construirMensaje', () => {
  test('incluye los datos clave', () => {
    const msg = construirMensaje({
      nombre: 'Ana',
      negocio: 'Bar La Esquina',
      tipo: 'Landing page',
      contacto: 'ana@bar.com',
    });
    expect(msg).toContain('Ana');
    expect(msg).toContain('Bar La Esquina');
    expect(msg).toContain('Landing page');
    expect(msg).toContain('ana@bar.com');
  });

  test('marca negocio no especificado y omite detalle vacío', () => {
    const msg = construirMensaje({ nombre: 'Ana', tipo: 'App móvil', contacto: 'x@y.com' });
    expect(msg).toContain('No especificado');
    expect(msg).not.toContain('Detalle:');
  });

  test('incluye detalle cuando existe', () => {
    const msg = construirMensaje({ nombre: 'Ana', tipo: 'App móvil', contacto: 'x@y.com', detalle: 'reservas online' });
    expect(msg).toContain('Detalle: reservas online');
  });
});

describe('enlaces', () => {
  const lead = { nombre: 'Ana', tipo: 'Landing page', contacto: 'ana@bar.com' };

  test('whatsapp usa el teléfono normalizado y codifica el texto', () => {
    const url = construirUrlWhatsapp(lead, '+54 9 383 432-7244');
    expect(url.startsWith('https://wa.me/5493834327244?text=')).toBe(true);
    expect(url).toContain('Ana');
    expect(url).not.toContain('\n'); // debe ir codificado
  });

  test('mailto incluye asunto y cuerpo codificados', () => {
    const url = construirMailto(lead, 'contacto@mineconnect.com.ar');
    expect(url.startsWith('mailto:contacto@mineconnect.com.ar?subject=')).toBe(true);
    expect(url).toContain('body=');
  });
});
