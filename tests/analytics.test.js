import {
  GA_MEASUREMENT_ID,
  trackingHabilitado,
  urlGtag,
  paramsEvento,
  track,
} from '../assets/js/lib/analytics.js';

describe('trackingHabilitado', () => {
  test('falso con el placeholder', () => {
    expect(trackingHabilitado('G-XXXXXXXXXX')).toBe(false);
    expect(trackingHabilitado(GA_MEASUREMENT_ID)).toBe(false);
  });
  test('falso con vacío o formato inválido', () => {
    expect(trackingHabilitado('')).toBe(false);
    expect(trackingHabilitado('UA-123')).toBe(false);
    expect(trackingHabilitado(null)).toBe(false);
  });
  test('verdadero con un ID GA4 real', () => {
    expect(trackingHabilitado('G-ABC123XYZ')).toBe(true);
  });
});

describe('urlGtag', () => {
  test('arma la URL con el id', () => {
    expect(urlGtag('G-ABC123')).toBe('https://www.googletagmanager.com/gtag/js?id=G-ABC123');
  });
});

describe('paramsEvento', () => {
  test('limpia props nulas/vacías', () => {
    const { evento, props } = paramsEvento('cta_click', { plan: 'landing', extra: '', nada: null });
    expect(evento).toBe('cta_click');
    expect(props).toEqual({ plan: 'landing' });
  });
  test('nombre por defecto si viene vacío', () => {
    expect(paramsEvento('').evento).toBe('evento');
  });
});

describe('track', () => {
  test('no rompe si no hay gtag', () => {
    expect(track('x', {}, {})).toBe(false);
    expect(track('x', {}, null)).toBe(false);
  });
  test('llama a gtag cuando existe', () => {
    const llamadas = [];
    const w = { gtag: (...a) => llamadas.push(a) };
    expect(track('lead_enviado', { tipo: 'Landing page' }, w)).toBe(true);
    expect(llamadas[0]).toEqual(['event', 'lead_enviado', { tipo: 'Landing page' }]);
  });
});
