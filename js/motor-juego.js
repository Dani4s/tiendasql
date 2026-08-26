// motor-juego.js — ejecuta la consulta del jugador contra una base fresca,
// la compara contra la solución del nivel y devuelve un veredicto.
//
// Estrategia general: nunca se compara el TEXTO de la consulta del jugador
// contra el texto de la solución (eso rechazaría respuestas correctas pero
// escritas distinto). En su lugar, se ejecutan ambas contra bases de datos
// idénticas y se comparan los RESULTADOS.

function normalizarFila(fila) {
    return JSON.stringify(fila.map((valor) => (valor === undefined ? null : valor)));
}

function compararResultados(resJugador, resSolucion, { ordenImporta, ignorarNombresColumnas }) {
    if (!ignorarNombresColumnas) {
        if (JSON.stringify(resJugador.columns) !== JSON.stringify(resSolucion.columns)) {
            return { iguales: false, motivo: 'columnas' };
        }
    } else if (resJugador.columns.length !== resSolucion.columns.length) {
        return { iguales: false, motivo: 'cantidad_columnas' };
    }

    if (resJugador.values.length !== resSolucion.values.length) {
        return { iguales: false, motivo: 'cantidad_filas' };
    }

    let filasJugador = resJugador.values.map(normalizarFila);
    let filasSolucion = resSolucion.values.map(normalizarFila);
    if (!ordenImporta) {
        filasJugador = [...filasJugador].sort();
        filasSolucion = [...filasSolucion].sort();
    }
    for (let i = 0; i < filasJugador.length; i++) {
        if (filasJugador[i] !== filasSolucion[i]) {
            return { iguales: false, motivo: ordenImporta ? 'valores_u_orden' : 'valores' };
        }
    }
    return { iguales: true };
}

function mensajeDeError(motivo) {
    switch (motivo) {
        case 'columnas':
            return 'Tu consulta funciona, pero los nombres de columna del resultado no son los esperados. Revisa si el nivel pide un alias exacto (AS).';
        case 'cantidad_columnas':
            return 'Tu consulta devuelve un número distinto de columnas al esperado.';
        case 'cantidad_filas':
            return 'Tu consulta devuelve un número distinto de filas al esperado. Revisa tu condición WHERE/HAVING.';
        case 'valores_u_orden':
            return 'Los datos no coinciden exactamente, o el ORDEN de las filas no es el esperado (este nivel evalúa el orden).';
        case 'valores':
        default:
            return 'Tu consulta se ejecuta bien, pero los datos que devuelve no son los esperados para esta misión.';
    }
}

// Ejecuta una consulta de solo lectura y devuelve su único resultado.
// Si hay varias sentencias separadas por ";", se toma el resultado de la última.
function ejecutarConsultaUnica(db, sql) {
    const resultados = db.exec(sql);
    if (!resultados || resultados.length === 0) {
        throw new Error('La consulta no devolvió ningún resultado. ¿Es una sentencia SELECT válida?');
    }
    return resultados[resultados.length - 1];
}

async function evaluarConsulta(nivel, sqlJugador, opciones) {
    let dbJugador = null;
    let dbSolucion = null;
    try {
        dbJugador = await crearBaseFresca();
        const resJugador = ejecutarConsultaUnica(dbJugador, sqlJugador);

        dbSolucion = await crearBaseFresca();
        const resSolucion = ejecutarConsultaUnica(dbSolucion, nivel.solucion);

        const comparacion = compararResultados(resJugador, resSolucion, opciones);
        if (comparacion.iguales) {
            return { exito: true, resultado: resJugador };
        }
        return { exito: false, mensaje: mensajeDeError(comparacion.motivo), resultado: resJugador };
    } catch (e) {
        return { exito: false, mensaje: `Error SQL: ${e.message}` };
    } finally {
        if (dbJugador) dbJugador.close();
        if (dbSolucion) dbSolucion.close();
    }
}

async function evaluarMutacionConVerificacion(nivel, sqlJugador, opciones) {
    let dbJugador = null;
    let dbSolucion = null;
    try {
        dbJugador = await crearBaseFresca();
        dbJugador.run(sqlJugador);
        const resJugador = ejecutarConsultaUnica(dbJugador, nivel.verificacion);

        dbSolucion = await crearBaseFresca();
        dbSolucion.run(nivel.solucion);
        const resSolucion = ejecutarConsultaUnica(dbSolucion, nivel.verificacion);

        const comparacion = compararResultados(resJugador, resSolucion, opciones);
        if (comparacion.iguales) {
            return { exito: true, resultado: resJugador };
        }
        return { exito: false, mensaje: mensajeDeError(comparacion.motivo), resultado: resJugador };
    } catch (e) {
        return { exito: false, mensaje: `Error SQL: ${e.message}` };
    } finally {
        if (dbJugador) dbJugador.close();
        if (dbSolucion) dbSolucion.close();
    }
}

// Para niveles de diseño (CREATE TABLE con restricciones, claves foráneas...)
// no comparamos datos, sino COMPORTAMIENTO: tras crear la estructura del
// jugador, se intentan una serie de sentencias de prueba y se comprueba que
// cada una tenga éxito o falle según lo esperado.
async function evaluarMutacionConPruebas(nivel, sqlJugador) {
    let db = null;
    try {
        db = await crearBaseFresca();
        db.run(sqlJugador);
    } catch (e) {
        if (db) db.close();
        return { exito: false, mensaje: `Error SQL al crear la estructura: ${e.message}` };
    }

    for (const prueba of nivel.pruebas) {
        let fallo = false;
        let mensajeError = '';
        try {
            db.run(prueba.sql);
        } catch (e) {
            fallo = true;
            mensajeError = e.message;
        }
        if (fallo !== prueba.debeFallar) {
            db.close();
            if (prueba.debeFallar) {
                return {
                    exito: false,
                    mensaje: `Tu tabla debería haber rechazado esta operación (falta alguna restricción):\n${prueba.sql}`,
                };
            }
            return {
                exito: false,
                mensaje: `Esta operación debería funcionar sin problemas, pero tu tabla la rechazó:\n${prueba.sql}\n(${mensajeError})`,
            };
        }
    }
    db.close();
    return { exito: true };
}

// Punto de entrada único usado por la UI.
async function evaluarRespuesta(nivel, sqlJugador) {
    const consulta = (sqlJugador || '').trim();
    if (!consulta) {
        return { exito: false, mensaje: 'Escribe una consulta SQL antes de ejecutar.' };
    }

    const opciones = {
        ordenImporta: !!nivel.ordenImporta,
        ignorarNombresColumnas: nivel.ignorarNombresColumnas !== false,
    };

    if (nivel.tipo === 'consulta') {
        return evaluarConsulta(nivel, consulta, opciones);
    }
    if (nivel.tipo === 'mutacion') {
        if (nivel.pruebas) {
            return evaluarMutacionConPruebas(nivel, consulta);
        }
        return evaluarMutacionConVerificacion(nivel, consulta, opciones);
    }
    return { exito: false, mensaje: 'Tipo de nivel desconocido.' };
}

// Ejecuta libremente una consulta en modo sandbox (sin validar nada),
// usado por el Modo Libre. Acepta cualquier sentencia SQL.
async function ejecutarModoLibre(db, sql) {
    const consulta = (sql || '').trim();
    if (!consulta) throw new Error('Escribe una consulta SQL.');
    const resultados = db.exec(consulta);
    if (!resultados || resultados.length === 0) return null;
    return resultados[resultados.length - 1];
}
