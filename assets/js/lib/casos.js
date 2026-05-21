// Proyectos reales para la sección de prueba social de la landing.
// Mantener honesto: solo proyectos propios verificables. Sin clientes inventados.

export const CASOS = [
  {
    id: 'mineconnect-labs',
    titulo: 'MineConnect Labs',
    rubro: 'Sitio propio',
    descripcion: 'Esta misma landing: web rápida, sin frameworks pesados, con cotizador en vivo y CRM interno. Online en GitHub Pages.',
    url: 'https://mineconnect.github.io/mineconnect-labs/',
    etiquetas: ['Landing', 'JS sin build', 'SEO'],
  },
  {
    id: 'mineconnect-tienda',
    titulo: 'MineConnect',
    rubro: 'Tienda online',
    descripcion: 'Sitio comercial con tienda integrada y pagos por MercadoPago. Catálogo propio, sin suscripciones mensuales.',
    url: '',
    etiquetas: ['Tienda', 'MercadoPago', 'Catálogo'],
  },
  {
    id: 'sistema-gestion',
    titulo: 'Sistema de gestión a medida',
    rubro: 'Software interno',
    descripcion: 'Plataforma de gestión que reemplaza planillas por módulos a medida (personal, stock, reportes) con control de acceso por rol.',
    url: '',
    etiquetas: ['Sistema', 'Roles', 'Reportes'],
  },
];

// Solo los casos que se muestran (tienen título y descripción).
export function casosVisibles(casos = CASOS) {
  return casos.filter((c) => c && c.titulo && c.descripcion);
}

// Cantidad de casos publicables.
export function totalCasos(casos = CASOS) {
  return casosVisibles(casos).length;
}
