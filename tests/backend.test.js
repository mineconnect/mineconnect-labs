import {
  EMAIL_DESTINO,
  FORM_ENDPOINT,
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

describe('configuración', () => {
  test('el endpoint apunta al email del negocio vía FormSubmit', () => {
    expect(FORM_ENDPOINT).toBe(`https://formsubmit.co/ajax/${EMAIL_DESTINO}`);
  });
});

describe('backendConfigurado', () => {
  test('verdadero con el endpoint por defecto (ya configurado)', () => {
    expect(backendConfigurado()).toBe(true);
    expect(backendConfigurado(FORM_ENDPOINT)).toBe(true);
  });
  test('falso con url no FormSubmit o sin email', () => {
    expect(backendConfigurado('https://otro.com/f/abc')).toBe(false);
    expect(backendConfigurado('https://formsubmit.co/ajax/no-es-email')).toBe(false);
    expect(backendConfigurado('')).toBe(false);
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
  test('incluye las directivas de FormSubmit', () => {
    const p = payloadLead(LEAD);
    expect(p._subject).toContain('Facu');
    expect(p._template).toBe('table');
    expect(p._captcha).toBe('false');
  });
  test('urgente=no cuando es falso', () => {
    expect(payloadLead({ ...LEAD, urgente: false }).urgente).toBe('no');
  });
});

describe('enviarLead', () => {
  test('no envía si el backend no está configurado', async () => {
    const r = await enviarLead(LEAD, 'https://otro.com/x');
    expect(r).toEqual({ enviado: false, motivo: 'sin-backend' });
  });
  test('hace POST y devuelve enviado=true en respuesta ok', async () => {
    let capt;
    const fakeFetch = async (url, opts) => {
      capt = { url, opts };
      return { ok: true };
    };
    const r = await enviarLead(LEAD, FORM_ENDPOINT, fakeFetch);
    expect(r.enviado).toBe(true);
    expect(capt.url).toBe(FORM_ENDPOINT);
    expect(capt.opts.method).toBe('POST');
    expect(JSON.parse(capt.opts.body).nombre).toBe('Facu');
  });
  test('respuesta no-ok -> enviado=false', async () => {
    const r = await enviarLead(LEAD, FORM_ENDPOINT, async () => ({ ok: false }));
    expect(r).toEqual({ enviado: false, motivo: 'respuesta-no-ok' });
  });
  test('error de red -> no rompe, enviado=false', async () => {
    const r = await enviarLead(LEAD, FORM_ENDPOINT, async () => { throw new Error('net'); });
    expect(r).toEqual({ enviado: false, motivo: 'error-red' });
  });
});
