// db.js — inicializa sql.js (SQLite compilado a WebAssembly) y crea
// bases de datos "frescas" de la tienda para cada intento del jugador.

let SQLlib = null;
let esquemaSqlTexto = null;

// Descripción estática del esquema, usada por el visor de tablas (ui.js).
// Debe reflejar exactamente lo que crea data/esquema.sql.
const ESQUEMA_TABLAS = {
    categorias: {
        descripcion: 'Categorías de productos de la tienda.',
        columnas: [
            { nombre: 'id', tipo: 'INTEGER', notas: 'clave primaria' },
            { nombre: 'nombre', tipo: 'TEXT', notas: 'única' },
        ],
    },
    proveedores: {
        descripcion: 'Proveedores que abastecen los productos.',
        columnas: [
            { nombre: 'id', tipo: 'INTEGER', notas: 'clave primaria' },
            { nombre: 'nombre', tipo: 'TEXT', notas: '' },
            { nombre: 'pais', tipo: 'TEXT', notas: '' },
        ],
    },
    productos: {
        descripcion: 'Catálogo de productos en venta.',
        columnas: [
            { nombre: 'id', tipo: 'INTEGER', notas: 'clave primaria' },
            { nombre: 'nombre', tipo: 'TEXT', notas: '' },
            { nombre: 'categoria_id', tipo: 'INTEGER', notas: '→ categorias.id' },
            { nombre: 'precio', tipo: 'REAL', notas: '' },
            { nombre: 'stock', tipo: 'INTEGER', notas: 'unidades disponibles' },
            { nombre: 'proveedor_id', tipo: 'INTEGER', notas: '→ proveedores.id' },
        ],
    },
    clientes: {
        descripcion: 'Clientes registrados de la tienda.',
        columnas: [
            { nombre: 'id', tipo: 'INTEGER', notas: 'clave primaria' },
            { nombre: 'nombre', tipo: 'TEXT', notas: '' },
            { nombre: 'email', tipo: 'TEXT', notas: 'única' },
            { nombre: 'ciudad', tipo: 'TEXT', notas: '' },
            { nombre: 'fecha_registro', tipo: 'TEXT', notas: 'puede ser NULL' },
        ],
    },
    empleados: {
        descripcion: 'Equipo de la tienda (jerarquía interna).',
        columnas: [
            { nombre: 'id', tipo: 'INTEGER', notas: 'clave primaria' },
            { nombre: 'nombre', tipo: 'TEXT', notas: '' },
            { nombre: 'puesto', tipo: 'TEXT', notas: '' },
            { nombre: 'salario', tipo: 'REAL', notas: '' },
            { nombre: 'jefe_id', tipo: 'INTEGER', notas: '→ empleados.id (puede ser NULL)' },
        ],
    },
    pedidos: {
        descripcion: 'Pedidos realizados por los clientes.',
        columnas: [
            { nombre: 'id', tipo: 'INTEGER', notas: 'clave primaria' },
            { nombre: 'cliente_id', tipo: 'INTEGER', notas: '→ clientes.id' },
            { nombre: 'empleado_id', tipo: 'INTEGER', notas: '→ empleados.id' },
            { nombre: 'fecha', tipo: 'TEXT', notas: "formato 'YYYY-MM-DD'" },
            { nombre: 'estado', tipo: 'TEXT', notas: "'completado' | 'pendiente' | 'cancelado'" },
        ],
    },
    detalle_pedidos: {
        descripcion: 'Líneas de producto dentro de cada pedido.',
        columnas: [
            { nombre: 'id', tipo: 'INTEGER', notas: 'clave primaria' },
            { nombre: 'pedido_id', tipo: 'INTEGER', notas: '→ pedidos.id' },
            { nombre: 'producto_id', tipo: 'INTEGER', notas: '→ productos.id' },
            { nombre: 'cantidad', tipo: 'INTEGER', notas: '' },
            { nombre: 'precio_unitario', tipo: 'REAL', notas: 'precio al momento de la venta' },
        ],
    },
};

async function inicializarSQL() {
    if (SQLlib) return SQLlib;
    SQLlib = await initSqlJs({ locateFile: (archivo) => `lib/${archivo}` });
    return SQLlib;
}

async function obtenerEsquemaSqlTexto() {
    if (esquemaSqlTexto) return esquemaSqlTexto;
    const resp = await fetch('data/esquema.sql');
    if (!resp.ok) {
        throw new Error('No se pudo cargar data/esquema.sql (¿estás usando un servidor local?)');
    }
    esquemaSqlTexto = await resp.text();
    return esquemaSqlTexto;
}

// Crea una base de datos SQLite completamente nueva, con el esquema y los
// datos semilla de la tienda ya cargados. Cada intento del jugador (y cada
// verificación contra la solución) usa su propia base fresca e independiente.
async function crearBaseFresca() {
    const SQL = await inicializarSQL();
    const texto = await obtenerEsquemaSqlTexto();
    const db = new SQL.Database();
    db.run('PRAGMA foreign_keys = ON;');
    db.run(texto);
    return db;
}
