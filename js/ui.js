// ui.js — construye y actualiza las pantallas del juego dentro de #app.
// Las funciones de navegación (irAMapa, irAMundo, irANivel, irAModoLibre,
// actualizarCabecera) viven en main.js; este archivo solo pinta pantallas
// y llama a esas funciones globales para moverse entre ellas.

function construirHtmlEsquema(tablasDestacadas) {
    const destacadas = tablasDestacadas || [];
    let html = '';
    Object.keys(ESQUEMA_TABLAS).forEach((nombreTabla) => {
        const tabla = ESQUEMA_TABLAS[nombreTabla];
        const destacada = destacadas.includes(nombreTabla);
        html += `<div class="tabla-esquema ${destacada ? 'destacada' : ''}">
            <div class="tabla-esquema-nombre">${nombreTabla}</div>`;
        tabla.columnas.forEach((col) => {
            html += `<div class="tabla-esquema-columna">
                <span class="col-nombre">${col.nombre}</span>
                <span class="col-tipo">${col.tipo}</span>
                <span class="col-notas">${col.notas || ''}</span>
            </div>`;
        });
        html += `</div>`;
    });
    return html;
}

function construirTablaResultado(resultado, nombreArchivoCSV) {
    const contenedor = document.createElement('div');
    contenedor.className = 'contenedor-tabla-resultado';

    if (!resultado || resultado.values.length === 0) {
        const vacio = document.createElement('p');
        vacio.style.padding = '10px';
        vacio.style.margin = '0';
        vacio.style.color = 'var(--color-texto-suave)';
        vacio.textContent = 'La consulta se ejecutó bien, pero no devolvió filas.';
        contenedor.appendChild(vacio);
        return contenedor;
    }

    const barraAcciones = document.createElement('div');
    barraAcciones.className = 'barra-acciones-resultado';
    const btnCSV = document.createElement('button');
    btnCSV.className = 'btn-exportar-csv';
    btnCSV.textContent = '⬇️ Exportar como CSV';
    btnCSV.addEventListener('click', () => {
        descargarArchivo(nombreArchivoCSV || 'resultado.csv', generarCSV(resultado), 'text/csv;charset=utf-8');
    });
    barraAcciones.appendChild(btnCSV);
    contenedor.appendChild(barraAcciones);

    const tabla = document.createElement('table');
    tabla.className = 'tabla-resultado';

    const thead = document.createElement('thead');
    const trCab = document.createElement('tr');
    resultado.columns.forEach((col) => {
        const th = document.createElement('th');
        th.textContent = col;
        trCab.appendChild(th);
    });
    thead.appendChild(trCab);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    resultado.values.forEach((fila) => {
        const tr = document.createElement('tr');
        fila.forEach((valor) => {
            const td = document.createElement('td');
            if (valor === null) {
                td.textContent = 'NULL';
                td.className = 'valor-nulo';
            } else {
                td.textContent = String(valor);
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    tabla.appendChild(tbody);

    contenedor.appendChild(tabla);
    return contenedor;
}

// -------------------- Mapa de mundos --------------------

function renderMapaMundos() {
    const progreso = cargarProgreso();
    const contenedorApp = document.getElementById('app');

    let html = `
        <div class="intro-juego">
            <h1>🏪 Bienvenido a TiendaSQL</h1>
            <p>Aprende SQL resolviendo misiones reales de una tienda: de tus primeras consultas a reportes avanzados.</p>
        </div>
        <div class="mapa-mundos">
    `;

    MUNDOS.forEach((mundo) => {
        const primerNivel = mundo.niveles[0];
        const desbloqueado = estaNivelDesbloqueado(primerNivel.id, progreso);
        const pct = porcentajeMundoCompletado(mundo, progreso);
        const completado = progreso.mundosConInsignia.includes(mundo.id);
        html += `
            <div class="tarjeta-mundo ${desbloqueado ? 'desbloqueado' : 'bloqueado'}" data-mundo="${mundo.id}">
                <div class="tarjeta-mundo-cabeza">
                    <span class="tarjeta-mundo-insignia">${desbloqueado ? mundo.insignia : '🔒'}</span>
                    <span class="tarjeta-mundo-titulo">${mundo.titulo}</span>
                    ${completado ? '<span class="chip-completado">Completado</span>' : ''}
                </div>
                <div class="tarjeta-mundo-desc">${mundo.descripcion}</div>
                <div class="tarjeta-mundo-pie">
                    <div class="barra-progreso"><div class="barra-progreso-relleno" style="width:${pct}%"></div></div>
                    <span>${pct}%</span>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    contenedorApp.innerHTML = html;

    contenedorApp.querySelectorAll('.tarjeta-mundo.desbloqueado').forEach((el) => {
        el.addEventListener('click', () => irAMundo(el.dataset.mundo));
    });
}

// -------------------- Vista de mundo --------------------

function renderVistaMundo(mundoId) {
    const progreso = cargarProgreso();
    const mundo = MUNDOS.find((m) => m.id === mundoId);
    const contenedorApp = document.getElementById('app');

    let html = `
        <button class="btn-volver" id="btn-volver-mapa">← Volver al mapa</button>
        <div class="vista-mundo-cabeza">
            <span class="icono">${mundo.insignia}</span>
            <div>
                <h1 style="margin:0">${mundo.titulo}</h1>
                <p style="margin:2px 0 0;color:var(--color-texto-suave)">${mundo.descripcion}</p>
            </div>
        </div>
        <div class="lista-niveles">
    `;

    mundo.niveles.forEach((nivel) => {
        const completado = estaNivelCompletado(nivel.id, progreso);
        const desbloqueado = estaNivelDesbloqueado(nivel.id, progreso);
        let estadoIcono = '🔒';
        if (completado) estadoIcono = '✔';
        else if (desbloqueado) estadoIcono = '▶';

        html += `
            <div class="item-nivel ${desbloqueado ? 'desbloqueado' : 'bloqueado'} ${completado ? 'completado' : ''}" data-nivel="${nivel.id}">
                <div class="item-nivel-estado">${estadoIcono}</div>
                <div>
                    <div class="item-nivel-titulo">${nivel.titulo}</div>
                    <div class="item-nivel-concepto">${nivel.concepto}</div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    contenedorApp.innerHTML = html;

    document.getElementById('btn-volver-mapa').addEventListener('click', irAMapa);
    contenedorApp.querySelectorAll('.item-nivel.desbloqueado').forEach((el) => {
        el.addEventListener('click', () => irANivel(el.dataset.nivel));
    });
}

// -------------------- Vista de nivel --------------------

function renderVistaNivel(nivelId) {
    const nivel = buscarNivelPorId(nivelId);
    const mundo = MUNDOS.find((m) => m.id === nivel.mundoId);
    const contenedorApp = document.getElementById('app');
    let pistasReveladas = 0;

    contenedorApp.innerHTML = `
        <button class="btn-volver" id="btn-volver-mundo">← Volver a ${mundo.titulo}</button>
        <div class="vista-nivel">
            <div class="columna-izquierda">
                <div class="panel panel-mision">
                    <div class="mundo-etiqueta">${mundo.titulo}</div>
                    <h1>${nivel.titulo}</h1>
                    <div class="concepto-chip">${nivel.concepto}</div>
                    <p>${nivel.mision}</p>
                </div>
                <div class="panel">
                    <h3>📋 Esquema de la base de datos</h3>
                    ${construirHtmlEsquema(nivel.tablas)}
                </div>
                <div class="panel chuleta">
                    <h3>📎 Chuleta de sintaxis</h3>
                    <pre>${nivel.sintaxis}</pre>
                </div>
                <div class="panel panel-pistas">
                    <h3>💡 Pistas</h3>
                    <div id="contenedor-pistas"></div>
                    <button class="btn-pista" id="btn-pista">Ver una pista (${nivel.pistas.length} disponibles)</button>
                </div>
            </div>
            <div class="columna-derecha">
                <div class="panel">
                    <h3>🖊️ Tu consulta SQL</h3>
                    <textarea class="editor-sql" id="editor-sql" spellcheck="false" placeholder="Escribe tu consulta SQL aquí..."></textarea>
                    <div class="editor-acciones">
                        <button class="btn-primario" id="btn-ejecutar">▶ Ejecutar</button>
                        <button class="btn-secundario" id="btn-limpiar">Limpiar</button>
                    </div>
                    <div id="panel-resultado"></div>
                </div>
            </div>
        </div>
    `;

    activarResaltadoSQL(document.getElementById('editor-sql'));

    document.getElementById('btn-volver-mundo').addEventListener('click', () => irAMundo(mundo.id));

    const btnPista = document.getElementById('btn-pista');
    const contenedorPistas = document.getElementById('contenedor-pistas');
    btnPista.addEventListener('click', () => {
        if (pistasReveladas >= nivel.pistas.length) return;
        const div = document.createElement('div');
        div.className = 'pista-revelada';
        div.textContent = `Pista ${pistasReveladas + 1}: ${nivel.pistas[pistasReveladas]}`;
        contenedorPistas.appendChild(div);
        pistasReveladas++;
        if (pistasReveladas >= nivel.pistas.length) {
            btnPista.disabled = true;
            btnPista.textContent = 'No hay más pistas';
        } else {
            btnPista.textContent = `Ver otra pista (${nivel.pistas.length - pistasReveladas} disponibles)`;
        }
    });

    document.getElementById('btn-limpiar').addEventListener('click', () => {
        const editor = document.getElementById('editor-sql');
        editor.value = '';
        editor.dispatchEvent(new Event('input'));
    });

    const btnEjecutar = document.getElementById('btn-ejecutar');
    btnEjecutar.addEventListener('click', async () => {
        const sql = document.getElementById('editor-sql').value;
        btnEjecutar.disabled = true;
        btnEjecutar.textContent = 'Ejecutando...';
        try {
            const veredicto = await evaluarRespuesta(nivel, sql);
            mostrarVeredictoNivel(nivel, mundo, veredicto);
        } finally {
            btnEjecutar.disabled = false;
            btnEjecutar.textContent = '▶ Ejecutar';
        }
    });
}

function mostrarVeredictoNivel(nivel, mundo, veredicto) {
    const panelResultado = document.getElementById('panel-resultado');
    panelResultado.innerHTML = '';

    const msg = document.createElement('div');
    msg.className = 'mensaje-resultado ' + (veredicto.exito ? 'exito' : 'error');
    if (veredicto.exito) {
        msg.textContent = '✔ ' + (veredicto.mensaje || '¡Correcto! Misión cumplida.');
    } else {
        msg.textContent = '✘ ' + veredicto.mensaje;
    }
    panelResultado.appendChild(msg);

    if (veredicto.resultado) {
        panelResultado.appendChild(construirTablaResultado(veredicto.resultado, `${nivel.id}.csv`));
    }

    if (!veredicto.exito) return;

    const { mundoRecienCompletado } = marcarNivelCompletado(nivel.id);
    actualizarCabecera();

    const siguienteDiv = document.createElement('div');
    siguienteDiv.className = 'panel-siguiente';
    siguienteDiv.style.marginTop = '14px';

    const todos = obtenerTodosLosNiveles();
    const indiceActual = todos.findIndex((n) => n.id === nivel.id);
    const siguienteNivel = todos[indiceActual + 1];

    const btnVolver = document.createElement('button');
    btnVolver.className = 'btn-secundario';
    btnVolver.textContent = `← Volver a ${mundo.titulo}`;
    btnVolver.addEventListener('click', () => irAMundo(mundo.id));
    siguienteDiv.appendChild(btnVolver);

    if (siguienteNivel) {
        const btnSiguiente = document.createElement('button');
        btnSiguiente.className = 'btn-primario';
        btnSiguiente.textContent = 'Siguiente misión →';
        btnSiguiente.addEventListener('click', () => irANivel(siguienteNivel.id));
        siguienteDiv.appendChild(btnSiguiente);
    } else {
        const fin = document.createElement('span');
        fin.textContent = '🎉 ¡Has completado todas las misiones de TiendaSQL!';
        fin.style.fontWeight = '700';
        siguienteDiv.appendChild(fin);
    }

    panelResultado.appendChild(siguienteDiv);

    if (mundoRecienCompletado) {
        mostrarModalInsignia(mundoRecienCompletado);
    }
}

function mostrarModalInsignia(mundo) {
    const fondo = document.createElement('div');
    fondo.className = 'fondo-modal';
    fondo.innerHTML = `
        <div class="modal-insignia">
            <div class="icono-grande">${mundo.insignia}</div>
            <h2>¡Insignia desbloqueada!</h2>
            <p>Completaste "${mundo.titulo}". Sigue así.</p>
            <button class="btn-primario" id="btn-cerrar-modal">Continuar</button>
        </div>
    `;
    document.body.appendChild(fondo);
    document.getElementById('btn-cerrar-modal').addEventListener('click', () => fondo.remove());
}

// -------------------- Modo libre --------------------

let dbModoLibre = null;

async function renderModoLibre() {
    const contenedorApp = document.getElementById('app');
    contenedorApp.innerHTML = `
        <button class="btn-volver" id="btn-volver-mapa-libre">← Volver al mapa</button>
        <div class="panel">
            <h2>🧪 Modo libre</h2>
            <p style="color:var(--color-texto-suave)">Escribe cualquier consulta SQL sobre la base de datos completa de la tienda. No hay misiones que validar aquí: explora, experimenta y practica. Usa "Reiniciar base" para volver a los datos originales.</p>
        </div>
        <div class="panel">
            <h3>📦 Importar y exportar tablas</h3>
            <p style="color:var(--color-texto-suave);font-size:0.88rem">
                <strong>Exportar</strong> genera un archivo <code>.sql</code> de texto plano con las
                sentencias <code>CREATE TABLE</code> e <code>INSERT</code> necesarias para recrear tu
                base tal cual está ahora mismo — así es como funcionan por dentro herramientas reales
                como <code>mysqldump</code>, <code>pg_dump</code> o el comando <code>.dump</code> de la
                consola de SQLite. <strong>Importar</strong> ejecuta un archivo <code>.sql</code> que tú
                elijas contra esta base (por ejemplo uno que hayas exportado antes, o uno propio con tus
                tablas y datos).
            </p>
            <div class="editor-acciones">
                <button class="btn-secundario" id="btn-exportar-sql">⬇️ Exportar base como .sql</button>
                <label class="btn-secundario" for="input-importar-sql" style="cursor:pointer">⬆️ Importar archivo .sql</label>
                <input type="file" id="input-importar-sql" accept=".sql,text/plain" style="display:none">
            </div>
            <p style="color:var(--color-texto-suave);font-size:0.78rem;margin-bottom:0">
                Nota: el visor de esquema de abajo solo describe las tablas originales de la tienda.
                Si importas tus propias tablas, consúltalas con <code>SELECT * FROM tu_tabla;</code>
                o revisa <code>SELECT name FROM sqlite_master WHERE type='table';</code> para ver todas
                las tablas que existen en este momento.
            </p>
        </div>
        <div class="modo-libre-layout">
            <div class="panel">
                <h3>📋 Esquema completo</h3>
                ${construirHtmlEsquema([])}
            </div>
            <div class="panel">
                <textarea class="editor-sql" id="editor-libre" spellcheck="false" placeholder="SELECT * FROM productos;"></textarea>
                <div class="editor-acciones">
                    <button class="btn-primario" id="btn-ejecutar-libre">▶ Ejecutar</button>
                    <button class="btn-secundario" id="btn-reiniciar-base-libre">↺ Reiniciar base</button>
                </div>
                <div id="panel-resultado-libre"></div>
            </div>
        </div>
    `;

    activarResaltadoSQL(document.getElementById('editor-libre'));

    document.getElementById('btn-volver-mapa-libre').addEventListener('click', irAMapa);

    if (!dbModoLibre) {
        dbModoLibre = await crearBaseFresca();
    }

    document.getElementById('btn-reiniciar-base-libre').addEventListener('click', async () => {
        if (dbModoLibre) dbModoLibre.close();
        dbModoLibre = await crearBaseFresca();
        document.getElementById('panel-resultado-libre').innerHTML =
            '<div class="mensaje-resultado exito">✔ Base de datos reiniciada a su estado original.</div>';
    });

    document.getElementById('btn-exportar-sql').addEventListener('click', () => {
        const dump = generarDumpSQL(dbModoLibre);
        descargarArchivo('tiendasql-export.sql', dump, 'text/plain;charset=utf-8');
    });

    document.getElementById('input-importar-sql').addEventListener('change', async (evento) => {
        const archivo = evento.target.files[0];
        evento.target.value = '';
        if (!archivo) return;
        const panel = document.getElementById('panel-resultado-libre');
        panel.innerHTML = '';
        try {
            const texto = await leerArchivoComoTexto(archivo);
            importarSQL(dbModoLibre, texto);
            const msg = document.createElement('div');
            msg.className = 'mensaje-resultado exito';
            msg.textContent = `✔ Archivo "${archivo.name}" importado correctamente. Ya puedes consultar tus tablas con SELECT.`;
            panel.appendChild(msg);
        } catch (e) {
            const msg = document.createElement('div');
            msg.className = 'mensaje-resultado error';
            msg.textContent = `Error al importar "${archivo.name}": ${e.message}`;
            panel.appendChild(msg);
        }
    });

    document.getElementById('btn-ejecutar-libre').addEventListener('click', async () => {
        const sql = document.getElementById('editor-libre').value;
        const panel = document.getElementById('panel-resultado-libre');
        panel.innerHTML = '';
        try {
            const resultado = await ejecutarModoLibre(dbModoLibre, sql);
            if (resultado) {
                panel.appendChild(construirTablaResultado(resultado, 'consulta.csv'));
            } else {
                const msg = document.createElement('div');
                msg.className = 'mensaje-resultado exito';
                msg.textContent = '✔ Sentencia ejecutada correctamente (sin filas que mostrar).';
                panel.appendChild(msg);
            }
        } catch (e) {
            const msg = document.createElement('div');
            msg.className = 'mensaje-resultado error';
            msg.textContent = 'Error SQL: ' + e.message;
            panel.appendChild(msg);
        }
    });
}
