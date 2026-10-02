/*
 * Catálogo de productos de Labios Rojos.
 *
 * Estos datos son de ejemplo. En la Fase 2 se reemplazarán por la
 * información que entregue la base de datos (PostgreSQL con Prisma).
 * Los precios, existencias y descripciones deben ser confirmados por el negocio.
 */

'use strict';

const categoriasDeProductos = [
  { nombre: 'Labios', colorDeMuestra: '#A3122A' },
  { nombre: 'Ojos', colorDeMuestra: '#5B3A2E' },
  { nombre: 'Rostro', colorDeMuestra: '#D9A58C' },
  { nombre: 'Uñas', colorDeMuestra: '#C2185B' }
];

const catalogoDeProductos = [
  {
    identificador: 'labial-mate-rojo-clasico',
    nombre: 'Labial mate de larga duración',
    categoria: 'Labios',
    tono: 'Rojo clásico',
    colorDelTono: '#A3122A',
    precio: 189,
    existencias: 12,
    descripcion: 'Labial de acabado mate que se mantiene durante el día sin resecar los labios.',
    contenido: '3.5 gramos',
    modoDeUso: 'Aplica directamente sobre los labios, del centro hacia las comisuras.'
  },
  {
    identificador: 'brillo-labial-rosa-nude',
    nombre: 'Brillo labial hidratante',
    categoria: 'Labios',
    tono: 'Rosa nude',
    colorDelTono: '#E7A3A6',
    precio: 159,
    existencias: 8,
    descripcion: 'Brillo ligero con efecto hidratante para un acabado natural.',
    contenido: '6 mililitros',
    modoDeUso: 'Aplica solo o sobre tu labial favorito.'
  },
  {
    identificador: 'base-liquida-tono-medio',
    nombre: 'Base líquida',
    categoria: 'Rostro',
    tono: 'Tono medio',
    colorDelTono: '#D9A58C',
    precio: 289,
    existencias: 5,
    descripcion: 'Base de cobertura media que unifica el tono de la piel.',
    contenido: '30 mililitros',
    modoDeUso: 'Distribuye con brocha o esponja húmeda desde el centro del rostro hacia afuera.'
  },
  {
    identificador: 'mascara-de-pestanas-negro',
    nombre: 'Máscara de pestañas',
    categoria: 'Ojos',
    tono: 'Negro intenso',
    colorDelTono: '#1E1416',
    precio: 199,
    existencias: 15,
    descripcion: 'Máscara que da volumen y separa las pestañas.',
    contenido: '9 mililitros',
    modoDeUso: 'Aplica desde la raíz hacia las puntas con movimientos en zigzag.'
  },
  {
    identificador: 'paleta-de-sombras-tierra',
    nombre: 'Paleta de sombras',
    categoria: 'Ojos',
    tono: 'Tonos tierra',
    colorDelTono: '#8C5A45',
    precio: 349,
    existencias: 4,
    descripcion: 'Paleta con tonos mate y satinados para looks de día y de noche.',
    contenido: '12 tonos',
    modoDeUso: 'Usa los tonos claros en el párpado y los oscuros en el pliegue.'
  },
  {
    identificador: 'esmalte-de-unas-frambuesa',
    nombre: 'Esmalte de uñas',
    categoria: 'Uñas',
    tono: 'Frambuesa',
    colorDelTono: '#C2185B',
    precio: 89,
    existencias: 20,
    descripcion: 'Esmalte de secado rápido con brillo intenso.',
    contenido: '15 mililitros',
    modoDeUso: 'Aplica dos capas delgadas y deja secar entre cada una.'
  },
  {
    identificador: 'rubor-en-polvo-durazno',
    nombre: 'Rubor en polvo',
    categoria: 'Rostro',
    tono: 'Durazno',
    colorDelTono: '#E08E8E',
    precio: 179,
    existencias: 9,
    descripcion: 'Rubor de textura suave que da un color natural a las mejillas.',
    contenido: '5 gramos',
    modoDeUso: 'Aplica sobre las mejillas con una brocha suave, difuminando hacia las sienes.'
  },
  {
    identificador: 'delineador-liquido-negro',
    nombre: 'Delineador líquido',
    categoria: 'Ojos',
    tono: 'Negro',
    colorDelTono: '#1E1416',
    precio: 149,
    existencias: 3,
    descripcion: 'Delineador de punta fina para trazos precisos.',
    contenido: '1 mililitro',
    modoDeUso: 'Traza desde el lagrimal hacia el extremo exterior del ojo.'
  }
];
