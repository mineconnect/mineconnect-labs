// Lógica pura de la campaña de prospección "1 click para enviar".
// Genera mensajes personalizados y el link directo del canal correcto
// (Gmail/email, WhatsApp o Instagram) ya prearmado. Sin DOM: testeable.

const URL_LANDING = 'https://mineconnect.github.io/mineconnect-labs/';
const TEL = '+54 9 383 432-7244';

// Rubro -> secuencia (ver EMAIL-SEQUENCES.md). Default: C (PyME/local).
export function secuenciaPorRubro(rubro = '') {
  const r = String(rubro).toLowerCase();
  if (/(gimnasio|gym|fitness|crossfit)/.test(r)) return 'B';
  if (/(bar|cerve|resto|gastro|caf|pub|pizz)/.test(r)) return 'A';
  if (/(curso|academia|formaci)/.test(r)) return 'D';
  return 'C';
}

// Plantillas por secuencia y paso (1=primer contacto, 2=seguimiento, 3=cierre).
export function plantilla(secuencia, paso, negocio = 'tu negocio') {
  const n = negocio;
  const firma = `Facundo — MineConnect Labs\n${URL_LANDING}\n${TEL}`;
  const T = {
    A: {
      1: {
        asunto: `${n}: una idea para los pedidos`,
        cuerpo: `Hola ${n}, soy Facundo de MineConnect Labs 👋\n\nVi que toman pedidos a mano. Te armo una web con el menú y un botón que manda el pedido directo al local, en pocos días y sin abonos: queda tuya.\n\n¿Te muestro un ejemplo para ${n}? ${URL_LANDING}\n\n${firma}`,
      },
      2: {
        asunto: `Re: ${n}: una idea para los pedidos`,
        cuerpo: `Hola, te reescribo por las dudas se traspapeló.\n\nTe dejo el ejemplo: una landing con el menú y un botón que arma el pedido y lo manda al WhatsApp del local. En 3-5 días tenés algo así para ${n}. ¿Lo vemos?\n\n${firma}`,
      },
      3: {
        asunto: `Cierro el tema, ${n}`,
        cuerpo: `No te lleno la casilla, este es el último. Si más adelante querés ordenar los pedidos o tener web propia para ${n}, escribime cuando quieras. ¡Éxitos!\n\n${firma}`,
      },
    },
    B: {
      1: {
        asunto: `${n}: socios y cuotas en una app`,
        cuerpo: `Hola ${n}, soy Facundo de MineConnect Labs 👋\n\nHago apps para gimnasios: socios, cuotas vencidas y avisos automáticos por WhatsApp. En días, y la app queda tuya (sin abonos eternos).\n\n¿Te muestro cómo quedaría para ${n}? ${URL_LANDING}\n\n${firma}`,
      },
      2: {
        asunto: `Re: ${n}: socios y cuotas en una app`,
        cuerpo: `Hola, un dato concreto: lo que más recuperan los gimnasios con app propia son las cuotas vencidas (avisos automáticos a quien se atrasó). Suele pagar el proyecto en un par de meses. ¿Te armo un presupuesto para ${n}?\n\n${firma}`,
      },
      3: {
        asunto: `Último, ${n} 💪`,
        cuerpo: `No insisto más. Si querés digitalizar socios, cuotas o rutinas en ${n}, la puerta queda abierta. ¡Que sigan los socios!\n\n${firma}`,
      },
    },
    C: {
      1: {
        asunto: `${n} sin web propia`,
        cuerpo: `Hola, soy Facundo de MineConnect Labs 👋\n\nBusqué a ${n} y no tiene web propia: son clientes que te buscan y no te encuentran. Te armo una, en días y sin suscripciones.\n\n¿Te paso una propuesta para ${n}? ${URL_LANDING}\n\n${firma}`,
      },
      2: {
        asunto: `Re: ${n} sin web propia`,
        cuerpo: `Hola, por si quedó en el tintero: en ${URL_LANDING} podés ver ejemplos y, en un minuto, dejar qué necesitás. Lo charlamos cuando quieras para ${n}.\n\n${firma}`,
      },
      3: {
        asunto: `Cierro el tema, ${n}`,
        cuerpo: `Este es el último, prometido. Si más adelante querés tu web o un sistema propio para ${n}, escribime cuando quieras. ¡Gracias y éxitos!\n\n${firma}`,
      },
    },
    D: {
      1: {
        asunto: `¿Y si tu equipo aprende a usar IA?`,
        cuerpo: `Hola ${n}, en MineConnect Labs tenemos cursos de IA para negocios (no para programadores): automatizar respuestas, reportes y tareas repetitivas, con ejemplos de tu rubro. ¿Te paso el temario? ${URL_LANDING}\n\n${firma}`,
      },
      2: {
        asunto: `Re: cursos de IA para ${n}`,
        cuerpo: `Hola, te dejo el temario completo y material gratis acá: ${URL_LANDING}cursos.html. Cualquier duda, respondé este mail.\n\n${firma}`,
      },
      3: {
        asunto: `Último sobre los cursos, ${n}`,
        cuerpo: `No te escribo más por ahora. Si te interesa formar a tu equipo en IA, quedo a un mensaje de distancia. ¡Éxitos!\n\n${firma}`,
      },
    },
  };
  const sec = T[secuencia] || T.C;
  return sec[paso] || sec[1];
}

// Normaliza un teléfono a formato WhatsApp internacional argentino (54 9 ...).
export function aWhatsApp(telefonoRaw) {
  let d = String(telefonoRaw ?? '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('54')) d = d.slice(2); // saca código de país
  d = d.replace(/^0/, ''); // saca 0 inicial (característica)
  d = d.replace(/^9/, ''); // saca 9 de celular (se reagrega en el prefijo 549)
  // saca el "15" de celular si quedó pegado tras la característica (heurística AR)
  d = d.replace(/^(\d{2,4})15(\d{6,8})$/, '$1$2');
  if (d.length < 8) return '';
  return `549${d}`;
}

export function urlGmail(to, asunto, cuerpo) {
  const p = new URLSearchParams({ view: 'cm', fs: '1', to, su: asunto, body: cuerpo });
  return `https://mail.google.com/mail/?${p.toString()}`;
}

export function urlMailto(to, asunto, cuerpo) {
  return `mailto:${to}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}

export function urlWhatsApp(telefonoRaw, texto) {
  const tel = aWhatsApp(telefonoRaw);
  if (!tel) return '';
  return `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;
}

export function urlInstagram(handle) {
  if (!handle) return '';
  const h = String(handle).replace(/^@/, '').trim();
  return `https://instagram.com/${h}`;
}

// Decide el canal y arma la acción "1 click" para un negocio en un paso dado.
// Prioridad: email (Gmail) > WhatsApp > Instagram > teléfono.
export function accionEnvio(negocio = {}, paso = 1) {
  const sec = negocio.secuencia || secuenciaPorRubro(negocio.rubro);
  const { asunto, cuerpo } = plantilla(sec, paso, negocio.nombre || 'tu negocio');

  if (negocio.email) {
    return { canal: 'email', etiqueta: '✉ Enviar por Gmail', url: urlGmail(negocio.email, asunto, cuerpo), asunto, cuerpo };
  }
  const wa = urlWhatsApp(negocio.telefono, cuerpo);
  if (wa) {
    return { canal: 'whatsapp', etiqueta: '💬 Enviar por WhatsApp', url: wa, asunto, cuerpo };
  }
  if (negocio.instagram) {
    return { canal: 'instagram', etiqueta: '📷 Abrir Instagram (DM)', url: urlInstagram(negocio.instagram), asunto, cuerpo };
  }
  if (negocio.telefono) {
    return { canal: 'tel', etiqueta: '📞 Llamar', url: `tel:${String(negocio.telefono).replace(/\s/g, '')}`, asunto, cuerpo };
  }
  return { canal: 'ninguno', etiqueta: 'Sin contacto', url: '', asunto, cuerpo };
}
