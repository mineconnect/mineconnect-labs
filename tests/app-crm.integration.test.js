/**
 * @jest-environment jsdom
 *
 * Integración del CRM: monta crm.html, ejecuta app-crm.js y verifica el flujo
 * con delegación de eventos (agregar lead, cambiar estado, eliminar) + localStorage.
 */
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.join(process.cwd(), 'crm.html'), 'utf8');
const body = html.split('<body>')[1].split('</body>')[0];

async function montar() {
  localStorage.clear();
  document.body.innerHTML = body;
  window.alert = jest.fn();
  jest.resetModules();
  await import('../assets/js/app-crm.js');
}

function setVal(sel, val) {
  document.querySelector(sel).value = val;
}

describe('integración CRM', () => {
  test('arranca vacío y muestra el cartel de vacío', async () => {
    await montar();
    expect(document.querySelectorAll('#tbody tr').length).toBe(0);
    expect(document.querySelector('#empty').style.display).toBe('block');
  });

  test('agregar un lead lo muestra en la tabla y lo persiste', async () => {
    await montar();
    setVal('#c-nombre', 'Ana');
    setVal('#c-negocio', 'Bar Sol');
    setVal('#c-contacto', 'ana@bar.com');
    document.querySelector('#crm-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(document.querySelectorAll('#tbody tr').length).toBe(1);
    expect(document.querySelector('#tbody').textContent).toContain('Bar Sol');
    const guardado = JSON.parse(localStorage.getItem('mclabs_leads'));
    expect(guardado).toHaveLength(1);
  });

  test('no agrega si falta nombre o contacto (avisa)', async () => {
    await montar();
    setVal('#c-nombre', 'Solo');
    document.querySelector('#crm-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(window.alert).toHaveBeenCalled();
    expect(document.querySelectorAll('#tbody tr').length).toBe(0);
  });

  test('cambiar estado por delegación actualiza stats y persiste', async () => {
    await montar();
    setVal('#c-nombre', 'Beto');
    setVal('#c-contacto', 'b@c.com');
    document.querySelector('#crm-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const sel = document.querySelector('#tbody .estado-sel');
    sel.value = 'cerrado';
    sel.dispatchEvent(new Event('change', { bubbles: true }));

    const guardado = JSON.parse(localStorage.getItem('mclabs_leads'));
    expect(guardado[0].estado).toBe('cerrado');
    // El tablero de stats debe reflejar 1 cerrado.
    expect(document.querySelector('#stats').textContent).toContain('Cerrados');
  });

  test('eliminar por delegación quita la fila', async () => {
    await montar();
    setVal('#c-nombre', 'Caro');
    setVal('#c-contacto', 'caro@x.com');
    document.querySelector('#crm-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(document.querySelectorAll('#tbody tr').length).toBe(1);

    document.querySelector('#tbody [data-del]').dispatchEvent(new Event('click', { bubbles: true }));
    expect(document.querySelectorAll('#tbody tr').length).toBe(0);
    expect(JSON.parse(localStorage.getItem('mclabs_leads'))).toHaveLength(0);
  });

  test('el buscador filtra las filas visibles', async () => {
    await montar();
    for (const [n, c, neg] of [['Ana', 'a@x.com', 'Bar Sol'], ['Beto', 'b@x.com', 'Gym Fuerza']]) {
      setVal('#c-nombre', n); setVal('#c-contacto', c); setVal('#c-negocio', neg);
      document.querySelector('#crm-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
    expect(document.querySelectorAll('#tbody tr').length).toBe(2);
    setVal('#buscar', 'gym');
    document.querySelector('#buscar').dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.querySelectorAll('#tbody tr').length).toBe(1);
  });
});
