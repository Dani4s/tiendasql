// progreso.js — guarda y consulta el avance del jugador en localStorage.

const CLAVE_PROGRESO = 'tiendasql_progreso_v1';

function progresoPorDefecto() {
    return {
        nivelesCompletados: [], // lista de ids de nivel, ej. "m1n1"
        mundosConInsignia: [], // ids de mundo ya completados al 100%
    };
}

function cargarProgreso() {
    try {
        const crudo = localStorage.getItem(CLAVE_PROGRESO);
        if (!crudo) return progresoPorDefecto();
        const datos = JSON.parse(crudo);
        return {
            nivelesCompletados: Array.isArray(datos.nivelesCompletados) ? datos.nivelesCompletados : [],
            mundosConInsignia: Array.isArray(datos.mundosConInsignia) ? datos.mundosConInsignia : [],
        };
    } catch (e) {
        console.warn('No se pudo leer el progreso guardado, se empieza de cero.', e);
        return progresoPorDefecto();
    }
}

function guardarProgresoObjeto(progreso) {
    try {
        localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(progreso));
    } catch (e) {
        console.warn('No se pudo guardar el progreso (¿localStorage deshabilitado?).', e);
    }
}

// Marca un nivel como completado y, si con eso se completa todo un mundo,
// añade su insignia. Devuelve { progreso, mundoRecienCompletado } para que
// la UI pueda celebrarlo si corresponde.
function marcarNivelCompletado(idNivel) {
    const progreso = cargarProgreso();
    if (!progreso.nivelesCompletados.includes(idNivel)) {
        progreso.nivelesCompletados.push(idNivel);
    }

    let mundoRecienCompletado = null;
    const nivel = buscarNivelPorId(idNivel);
    if (nivel) {
        const mundo = MUNDOS.find((m) => m.id === nivel.mundoId);
        const todosCompletados = mundo.niveles.every((n) => progreso.nivelesCompletados.includes(n.id));
        if (todosCompletados && !progreso.mundosConInsignia.includes(mundo.id)) {
            progreso.mundosConInsignia.push(mundo.id);
            mundoRecienCompletado = mundo;
        }
    }

    guardarProgresoObjeto(progreso);
    return { progreso, mundoRecienCompletado };
}

function estaNivelCompletado(idNivel, progreso) {
    return progreso.nivelesCompletados.includes(idNivel);
}

// Un nivel está desbloqueado si es el primero de todos, o si el nivel
// inmediatamente anterior (en el orden global de mundos) ya se completó.
function estaNivelDesbloqueado(idNivel, progreso) {
    const todos = obtenerTodosLosNiveles();
    const indice = todos.findIndex((n) => n.id === idNivel);
    if (indice <= 0) return true;
    const anterior = todos[indice - 1];
    return estaNivelCompletado(anterior.id, progreso);
}

function porcentajeMundoCompletado(mundo, progreso) {
    const total = mundo.niveles.length;
    const completados = mundo.niveles.filter((n) => estaNivelCompletado(n.id, progreso)).length;
    return total === 0 ? 0 : Math.round((completados / total) * 100);
}

function porcentajeGeneralCompletado(progreso) {
    const todos = obtenerTodosLosNiveles();
    if (todos.length === 0) return 0;
    return Math.round((progreso.nivelesCompletados.length / todos.length) * 100);
}

function reiniciarProgreso() {
    localStorage.removeItem(CLAVE_PROGRESO);
}
