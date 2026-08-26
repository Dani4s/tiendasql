// importar-exportar.js — utilidades para exportar la base de datos (o un
// resultado de consulta) a archivos, e importar sentencias SQL desde un
// archivo elegido por el jugador. Todo ocurre en el navegador: no se sube
// nada a ningún servidor.

// Dispara la descarga de un archivo de texto generado en memoria.
function descargarArchivo(nombreArchivo, contenido, tipoMime) {
    const blob = new Blob([contenido], { type: tipoMime });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
}

// Lee un archivo elegido por el usuario (<input type="file">) como texto.
function leerArchivoComoTexto(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = () => reject(lector.error || new Error('No se pudo leer el archivo.'));
        lector.readAsText(archivo, 'utf-8');
    });
}

// -------------------- Exportar como .sql --------------------

function escaparValorSQL(valor) {
    if (valor === null || valor === undefined) return 'NULL';
    if (typeof valor === 'number') return String(valor);
    if (valor instanceof Uint8Array) {
        let hex = '';
        valor.forEach((b) => { hex += b.toString(16).padStart(2, '0'); });
        return "X'" + hex + "'";
    }
    return "'" + String(valor).replace(/'/g, "''") + "'";
}

// Genera un volcado de texto plano (CREATE TABLE + INSERT) de toda la base,
// igual que hacen herramientas reales como mysqldump, pg_dump o el comando
// ".dump" de la consola de SQLite. El resultado se puede volver a importar
// tal cual con la función importarSQL de más abajo.
function generarDumpSQL(db) {
    const tablasRes = db.exec("SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';");
    if (!tablasRes || tablasRes.length === 0) {
        return '-- Esta base de datos no tiene tablas todavía.\n';
    }

    let dump = `-- Exportado desde TiendaSQL (Modo libre) — ${new Date().toISOString()}\n`;
    dump += '-- Desactivamos temporalmente las claves foráneas para poder recrear\n';
    dump += '-- las tablas en cualquier orden al volver a importar este archivo.\n';
    dump += 'PRAGMA foreign_keys = OFF;\n\n';

    for (const [nombreTabla, sqlCreacion] of tablasRes[0].values) {
        dump += `-- Tabla: ${nombreTabla}\n`;
        dump += `DROP TABLE IF EXISTS ${nombreTabla};\n`;
        dump += sqlCreacion + ';\n';

        const filasRes = db.exec(`SELECT * FROM ${nombreTabla};`);
        if (filasRes && filasRes.length > 0) {
            const { columns, values } = filasRes[0];
            const nombresColumnas = columns.join(', ');
            values.forEach((fila) => {
                const valoresTexto = fila.map(escaparValorSQL).join(', ');
                dump += `INSERT INTO ${nombreTabla} (${nombresColumnas}) VALUES (${valoresTexto});\n`;
            });
        }
        dump += '\n';
    }

    const vistasRes = db.exec("SELECT sql FROM sqlite_master WHERE type = 'view';");
    if (vistasRes && vistasRes.length > 0) {
        dump += '-- Vistas\n';
        vistasRes[0].values.forEach(([sqlVista]) => { dump += sqlVista + ';\n'; });
        dump += '\n';
    }

    dump += 'PRAGMA foreign_keys = ON;\n';
    return dump;
}

// Ejecuta un texto SQL (por ejemplo, el contenido de un archivo .sql
// elegido por el jugador) contra una base ya abierta. Desactiva las claves
// foráneas mientras importa, por si el archivo recrea tablas en un orden
// distinto al que exige la integridad referencial.
function importarSQL(db, textoSql) {
    db.run('PRAGMA foreign_keys = OFF;');
    try {
        db.run(textoSql);
    } finally {
        db.run('PRAGMA foreign_keys = ON;');
    }
}

// -------------------- Exportar un resultado como CSV --------------------

function escaparCampoCSV(valor) {
    if (valor === null || valor === undefined) return '';
    const texto = String(valor);
    if (/[",\n]/.test(texto)) {
        return '"' + texto.replace(/"/g, '""') + '"';
    }
    return texto;
}

function generarCSV(resultado) {
    const lineas = [resultado.columns.map(escaparCampoCSV).join(',')];
    resultado.values.forEach((fila) => {
        lineas.push(fila.map(escaparCampoCSV).join(','));
    });
    return lineas.join('\n');
}
