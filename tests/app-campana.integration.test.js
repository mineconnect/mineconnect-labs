/**
 * @jest-environment jsdom
 *
 * Integración de campana.html: monta la página, ejecuta app-campana.js y verifica
 * el flujo de "1 click" (canal correcto, marcar enviado, agregar email -> Gmail).
 */
import fs from 'fs';
import path from 'path';

HTMLCanvasElement.prototype.getContext = () => null;

const html = fs.readFileSync(path.join(process.cwd(), 'campana.html'), 'utf8');
const body = html.split('<body>')[1].split('</body>')[0];

async function montar() {
  localStorage.clear();
  document.body.innerHTML = body;
  jest.resetModules();
  await import('../assets/js/app-campana.js');
}

describe('integración campaña', () => {
  test('renderiza los negocios reales con su canal', async () => {
    await montar();
    const filas = document.querySelectorAll('#lista .neg');
    expect(filas.length).toBeGreaterThanOrEqual(6);
    expect(document.body.textContent).toContain('Temple Gym');
    // Un gimnasio con celular -> canal whatsapp
    const temple = document.querySelector('.neg[data-id="temple-gym"]');
    expect(temple.querySelector('.canal').textContent).toBe('whatsapp');
    expect(temple.querySelector('[data-enviar]').getAttribute('href')).toContain('wa.me/5493834928306');
  });

  test('el progreso arranca en 0 enviados', async () => {
    await montar();
    expect(document.querySelector('#progreso').textContent).toContain('0 /');
  });

  test('al hacer click en Enviar marca como enviado y persiste', async () => {
    await montar();
    const btn = document.querySelector('.neg[data-id="temple-gym"] [data-enviar]');
    btn.dispatchEvent(new Event('click', { bubbles: true }));
    const guardado = JSON.parse(localStorage.getItem('mclabs_campana'));
    expect(guardado['temple-gym'].enviado['1']).toBe(true);
    expect(document.querySelector('#progreso').textContent).toContain('1 /');
  });

  test('agregar un email cambia el canal a Gmail', async () => {
    await montar();
    const fila = document.querySelector('.neg[data-id="temple-gym"]');
    const input = fila.querySelector('[data-email]');
    input.value = 'temple@gym.com';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    const filaR = document.querySelector('.neg[data-id="temple-gym"]');
    expect(filaR.querySelector('.canal').textContent).toBe('email');
    expect(filaR.querySelector('[data-enviar]').getAttribute('href')).toContain('mail.google.com');
  });

  test('cambiar de paso re-renderiza el mensaje', async () => {
    await montar();
    const sel = document.querySelector('#paso');
    sel.value = '3';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.querySelector('#progreso').textContent).toContain('Paso 3');
    // El mensaje de cierre aparece en algún preview.
    expect(document.body.textContent).toContain('Cierro el tema');
  });

  test('existe el canvas del fondo animado', async () => {
    await montar();
    expect(document.getElementById('fx-bg')).not.toBeNull();
  });
});
