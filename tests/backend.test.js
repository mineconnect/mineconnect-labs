import {
  FORMSPREE_ENDPOINT,
  backendConfigurado,
  payloadLead,
  enviarLead,
} from '../assets/js/lib/backend.js';

const LEAD = {
  nombre: 'Facu',
  negocio: 'Bar La Esquina',
  tipo: 'Landing page',
  contacto: 'facu@mail.com',
  detalle: '',
  paginas: 3,
  integraciones: 0,
  urgente: true,
};

describe('backendConfigurado', () => {
  test('falso con el placeholder por defecto', () => {
    expect(backendConfigurado(FORMSPREE_ENDPOINT)).toBe(false);
    expect(backendConfigurado('https://formspree.io/f/XXXXXXXX')).toBe(false);
  });
  test('falso con url no Formspree', () => {
    expect(backendConfigurado('https://otro.com/f/abc')).toBe(false);
    expect(backendConfigurado('')).toBe(false);
  });
  test('verdadero con endpoint real', () => {
    expect(backendConfigurado('https://formspree.io/f/abcd1234')).toBe(true);
  });
});

describe('payloadLead', () => {
  test('arma payload sin campos vacíos y con metadatos', () => {
    const p = payloadLead(LEAD);
    expect(p.nombre).toBe('Facu');
    expect(p.urgente).toBe('sí');
    expect(p.origen).toBe('landing mineconnect-labs');
    expect(p.fecha).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(p).not.toHaveProperty('detalle'); // estaba vacío
  });
  test('urgente=no cuando es falso', () => {
    expect(payloadLead({ ...LEAD, urgente: false }).urgente).toBe('no');
  });
});

describe('enviarLead', () => {
  test('no envía si el backend no está configurado', async () => {
    const r = await enviarLead(LEAD, 'https://formspree.io/f/XXXXXXXX');
    expect(r).toEqual({ enviado: false, motivo: 'sin-backend' });
  });
  test('hace POST y devuelve enviado=true en respuesta ok', async () => {
    let capt;
    const fakeFetch = async (url, opts) => {
      capt = { url, opts };
      return { ok: true };
    };
    const r = await enviarLead(LEAD, 'https://formspree.io/f/abcd1234', fakeFetch);
    expect(r.enviado).toBe(true);
    expect(capt.url).toBe('https://formspree.io/f/abcd1234');
    expect(capt.opts.method).toBe('POST');
    expect(JSON.parse(capt.opts.body).nombre).toBe('Facu');
  });
  test('respuesta no-ok -> enviado=false', async () => {
    const r = await enviarLead(LEAD, 'https://formspree.io/f/abcd1234', async () => ({ ok: false }));
    expect(r).toEqual({ enviado: false, motivo: 'respuesta-no-ok' });
  });
  test('error de red -> no rompe, enviado=false', async () => {
    const r = await enviarLead(LEAD, 'https://formspree.io/f/abcd1234', async () => { throw new Error('net'); });
    expect(r).toEqual({ enviado: false, motivo: 'error-red' });
  });
});
