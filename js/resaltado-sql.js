// resaltado-sql.js — resalta en color las palabras clave SQL dentro de los
// editores (textarea.editor-sql) y las pasa automáticamente a MAYÚSCULAS
// mientras el jugador escribe.
//
// Un <textarea> normal no permite colorear partes del texto, así que usamos
// el truco clásico de "editor con overlay": detrás del textarea (que se
// vuelve transparente) colocamos un <pre><code> con el mismo texto pero con
// las palabras clave envueltas en <span> de color. Ambos elementos comparten
// fuente, tamaño y relleno para que las letras coincidan pixel a pixel, y
// sincronizamos el scroll entre los dos.

const SQL_PALABRAS_CLAVE = [
    'SELECT', 'FROM', 'WHERE', 'ORDER', 'GROUP', 'BY', 'LIMIT', 'OFFSET',
    'LIKE', 'BETWEEN', 'IN', 'IS', 'NULL', 'NOT', 'AND', 'OR', 'AS',
    'DISTINCT', 'HAVING',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'CROSS', 'JOIN', 'ON',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'COLUMN', 'RENAME', 'TO', 'IF',
    'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'EXISTS', 'ANY', 'SOME',
    'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'OVER', 'PARTITION',
    'CHECK', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'DEFAULT', 'UNIQUE',
    'INDEX', 'VIEW', 'ASC', 'DESC',
    'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION',
];

const CONJUNTO_PALABRAS_CLAVE_SQL = new Set(SQL_PALABRAS_CLAVE);

// Tipos de dato: se resaltan con un color distinto al de las palabras clave.
const SQL_TIPOS_DATO = [
    'INTEGER', 'INT', 'TINYINT', 'SMALLINT', 'MEDIUMINT', 'BIGINT',
    'TEXT', 'CHAR', 'CHARACTER', 'VARCHAR', 'NCHAR', 'NVARCHAR', 'CLOB',
    'REAL', 'DOUBLE', 'FLOAT', 'NUMERIC', 'DECIMAL',
    'BOOLEAN', 'BOOL', 'BLOB', 'DATE', 'DATETIME', 'TIMESTAMP', 'TIME',
];

const CONJUNTO_TIPOS_DATO_SQL = new Set(SQL_TIPOS_DATO);

// Divide el texto en: comentarios de línea (--), comentarios de bloque
// (/* */), cadenas entre comillas simples, identificadores entre comillas
// dobles, palabras (identificadores/palabras clave) y cualquier otro
// carácter suelto (espacios, paréntesis, operadores...).
const RE_TOKEN_SQL = /(--[^\n]*)|(\/\*[\s\S]*?\*\/)|('(?:[^']|'')*')|("(?:[^"]|"")*")|([A-Za-z_][A-Za-z0-9_]*)|([\s\S])/g;

function escaparHtmlSQL(texto) {
    return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Devuelve { textoNuevo, html }: textoNuevo es el texto original con las
// palabras clave y los tipos de dato puestos en MAYÚSCULAS (misma longitud,
// así el cursor no se desplaza); html es ese mismo texto con esas palabras,
// cadenas y comentarios envueltos en <span> para colorearlos en el overlay.
//
// Si una palabra ya estaba en mayúsculas (porque antes era una palabra clave
// o un tipo de dato reconocido) pero, tras borrar o agregar algún carácter,
// deja de coincidir con la lista, se "des-resalta": se le quita el color y
// se vuelve a convertir a minúsculas, como si nunca se hubiera reconocido.
function procesarTextoSQL(texto) {
    let textoNuevo = '';
    let html = '';
    RE_TOKEN_SQL.lastIndex = 0;
    let coincidencia;
    while ((coincidencia = RE_TOKEN_SQL.exec(texto)) !== null) {
        const [, comentarioLinea, comentarioBloque, cadena, identificador, palabra, otro] = coincidencia;
        if (comentarioLinea !== undefined) {
            textoNuevo += comentarioLinea;
            html += `<span class="tok-comentario">${escaparHtmlSQL(comentarioLinea)}</span>`;
        } else if (comentarioBloque !== undefined) {
            textoNuevo += comentarioBloque;
            html += `<span class="tok-comentario">${escaparHtmlSQL(comentarioBloque)}</span>`;
        } else if (cadena !== undefined) {
            textoNuevo += cadena;
            html += `<span class="tok-cadena">${escaparHtmlSQL(cadena)}</span>`;
        } else if (identificador !== undefined) {
            textoNuevo += identificador;
            html += escaparHtmlSQL(identificador);
        } else if (palabra !== undefined) {
            const mayus = palabra.toUpperCase();
            if (CONJUNTO_PALABRAS_CLAVE_SQL.has(mayus)) {
                textoNuevo += mayus;
                html += `<span class="tok-palabra-clave">${escaparHtmlSQL(mayus)}</span>`;
            } else if (CONJUNTO_TIPOS_DATO_SQL.has(mayus)) {
                textoNuevo += mayus;
                html += `<span class="tok-tipo-dato">${escaparHtmlSQL(mayus)}</span>`;
            } else if (/[A-Z]/.test(palabra)) {
                // Ya no es una palabra clave ni un tipo de dato reconocido:
                // si conserva mayúsculas de un resaltado anterior (se borró
                // o se agregó una letra y se rompió la coincidencia), se
                // devuelve a minúsculas y pierde el color.
                const minus = palabra.toLowerCase();
                textoNuevo += minus;
                html += escaparHtmlSQL(minus);
            } else {
                textoNuevo += palabra;
                html += escaparHtmlSQL(palabra);
            }
        } else if (otro === ',') {
            // Las comas se resaltan aparte para que se note a simple vista
            // dónde termina cada columna/valor de una lista.
            textoNuevo += otro;
            html += `<span class="tok-coma">${otro}</span>`;
        } else {
            textoNuevo += otro;
            html += escaparHtmlSQL(otro);
        }
    }
    return { textoNuevo, html };
}

// Engancha el resaltado a un <textarea class="editor-sql"> concreto. Se
// puede llamar varias veces sobre el mismo elemento sin problema (queda
// marcado con data-resaltado-sql para no envolverlo dos veces).
function activarResaltadoSQL(textarea) {
    if (!textarea || textarea.dataset.resaltadoSql === 'activo') return;
    textarea.dataset.resaltadoSql = 'activo';

    const contenedor = document.createElement('div');
    contenedor.className = 'editor-sql-contenedor';

    const fondo = document.createElement('pre');
    fondo.className = 'editor-sql-fondo';
    fondo.setAttribute('aria-hidden', 'true');
    const code = document.createElement('code');
    fondo.appendChild(code);

    textarea.parentNode.insertBefore(contenedor, textarea);
    contenedor.appendChild(fondo);
    contenedor.appendChild(textarea);
    textarea.classList.add('editor-sql--resaltado');

    function sincronizarScroll() {
        fondo.scrollTop = textarea.scrollTop;
        fondo.scrollLeft = textarea.scrollLeft;
    }

    function refrescar() {
        const inicio = textarea.selectionStart;
        const fin = textarea.selectionEnd;
        const { textoNuevo, html } = procesarTextoSQL(textarea.value);
        if (textoNuevo !== textarea.value) {
            textarea.value = textoNuevo;
            textarea.setSelectionRange(inicio, fin);
        }
        code.innerHTML = html;
        sincronizarScroll();
    }

    textarea.addEventListener('input', refrescar);
    textarea.addEventListener('scroll', sincronizarScroll);

    refrescar();
}
