// main.js — arranque de la aplicación y funciones de navegación entre pantallas.

function irAMapa() {
    renderMapaMundos();
}

function irAMundo(mundoId) {
    renderVistaMundo(mundoId);
}

function irANivel(nivelId) {
    renderVistaNivel(nivelId);
}

function irAModoLibre() {
    renderModoLibre();
}

function actualizarCabecera() {
    const progreso = cargarProgreso();
    const pct = porcentajeGeneralCompletado(progreso);
    document.getElementById('barra-progreso-relleno').style.width = pct + '%';
    document.getElementById('texto-progreso').textContent = pct + '% completado';
}

async function iniciarApp() {
    const pantallaCarga = document.getElementById('cargando');
    try {
        await inicializarSQL();
        // Precarga también el texto del esquema para que el primer nivel
        // no tenga que esperar a un fetch adicional.
        await obtenerEsquemaSqlTexto();
    } catch (e) {
        pantallaCarga.innerHTML = `
            <div style="max-width:480px;text-align:center;padding:0 20px">
                <p>❌ No se pudo cargar el motor SQL.</p>
                <p style="font-size:0.85rem;color:var(--color-texto-suave)">${e.message}</p>
                <p style="font-size:0.85rem;color:var(--color-texto-suave)">
                    Asegúrate de abrir esta página a través de un servidor local
                    (por ejemplo <code>python -m http.server</code>) en vez de abrir
                    el archivo index.html directamente. Consulta el README.md.
                </p>
            </div>
        `;
        return;
    }

    pantallaCarga.style.display = 'none';
    actualizarCabecera();
    irAMapa();

    document.getElementById('btn-mapa').addEventListener('click', irAMapa);
    document.getElementById('btn-modo-libre').addEventListener('click', irAModoLibre);
    document.getElementById('btn-reiniciar').addEventListener('click', () => {
        const confirmado = confirm('¿Seguro que quieres borrar todo tu progreso? Esta acción no se puede deshacer.');
        if (!confirmado) return;
        reiniciarProgreso();
        actualizarCabecera();
        irAMapa();
    });
}

document.addEventListener('DOMContentLoaded', iniciarApp);
