// niveles.js — contenido pedagógico del juego: mundos y misiones.
//
// Cada nivel tiene:
//   id            identificador único ("m1n1", "m1n2", ...)
//   titulo        título corto de la misión
//   mision        texto narrativo + tarea concreta que debe resolver el jugador
//   concepto      nombre corto del concepto SQL enseñado
//   sintaxis      chuleta de sintaxis (se muestra en el panel de ayuda)
//   tablas        tablas relevantes a resaltar en el visor de esquema
//   tipo          'consulta' (SELECT de solo lectura) | 'mutacion' (INSERT/UPDATE/DELETE/CREATE...)
//   solucion      SQL de referencia usado para validar (no se muestra al jugador)
//   ordenImporta  si el orden de las filas del resultado importa (por defecto false)
//   ignorarNombresColumnas  si se ignoran los encabezados de columna al comparar (por defecto true)
//   verificacion  (solo 'mutacion') SELECT que se ejecuta tras la sentencia del jugador
//                 y de la solución, para comparar el estado resultante
//   pruebas       (solo 'mutacion', alternativa a verificacion) lista de sentencias de
//                 prueba { sql, debeFallar } que se ejecutan tras la sentencia del jugador
//                 para comprobar comportamiento (útil para CREATE TABLE con restricciones)
//   pistas        lista de 2-3 pistas progresivas

const MUNDOS = [
    // =========================================================
    { id: 'm1', titulo: 'Fundamentos', insignia: '🔰',
      descripcion: 'Tu primer día en TiendaSQL: aprende a mirar los datos con SELECT y WHERE.',
      niveles: [
        {
            id: 'm1n1', titulo: 'Bienvenido al panel',
            mision: 'Es tu primer día como analista de datos en TiendaSQL. El gerente quiere que abras el catálogo completo de productos para familiarizarte con él. Muestra TODAS las columnas de TODOS los productos.',
            concepto: 'SELECT * — ver todos los datos',
            sintaxis: 'SELECT * FROM tabla;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT * FROM productos;',
            pistas: [
                'El asterisco (*) significa "todas las columnas".',
                'Escribe: SELECT * FROM productos;',
            ],
        },
        {
            id: 'm1n2', titulo: 'Solo lo necesario',
            mision: 'El gerente no necesita ver todo, solo el nombre y el precio de cada producto para una lista rápida. Muestra únicamente esas dos columnas.',
            concepto: 'Elegir columnas específicas',
            sintaxis: 'SELECT columna1, columna2 FROM tabla;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT nombre, precio FROM productos;',
            pistas: [
                'En vez de *, separa los nombres de columnas con comas.',
                'SELECT nombre, precio FROM productos;',
            ],
        },
        {
            id: 'm1n3', titulo: 'Productos premium',
            mision: 'Marketing quiere destacar los productos "premium": aquellos con un precio mayor a 30. Muéstralos completos.',
            concepto: 'Filtrar con WHERE',
            sintaxis: 'SELECT * FROM tabla WHERE condicion;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT * FROM productos WHERE precio > 30;',
            pistas: [
                'WHERE filtra filas según una condición, se coloca después de FROM.',
                'Usa el operador > para "mayor que".',
                'SELECT * FROM productos WHERE precio > 30;',
            ],
        },
        {
            id: 'm1n4', titulo: 'Alerta de reposición',
            mision: 'Almacén necesita reponer urgentemente: encuentra los productos de la categoría Electrónica (categoria_id = 1) que ADEMÁS tengan un stock mayor a 10 unidades (para saber cuáles están bien surtidos).',
            concepto: 'Combinar condiciones con AND',
            sintaxis: 'SELECT * FROM tabla WHERE condicion1 AND condicion2;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT * FROM productos WHERE categoria_id = 1 AND stock > 10;',
            pistas: [
                'AND exige que se cumplan AMBAS condiciones a la vez.',
                'SELECT * FROM productos WHERE categoria_id = 1 AND stock > 10;',
            ],
        },
        {
            id: 'm1n5', titulo: 'Ofertas o esenciales',
            mision: 'Para la campaña de la semana, necesitas productos de la categoría Alimentos (categoria_id = 4) O que tengan un precio menor a 10 (productos económicos de cualquier categoría).',
            concepto: 'Combinar condiciones con OR',
            sintaxis: 'SELECT * FROM tabla WHERE condicion1 OR condicion2;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT * FROM productos WHERE categoria_id = 4 OR precio < 10;',
            pistas: [
                'OR exige que se cumpla AL MENOS UNA de las condiciones.',
                'SELECT * FROM productos WHERE categoria_id = 4 OR precio < 10;',
            ],
        },
        {
            id: 'm1n6', titulo: 'Del más caro al más barato',
            mision: 'El gerente quiere el catálogo completo ordenado del producto MÁS CARO al MÁS BARATO.',
            concepto: 'Ordenar con ORDER BY',
            sintaxis: 'SELECT * FROM tabla ORDER BY columna DESC;  -- ASC = ascendente (por defecto), DESC = descendente',
            tablas: ['productos'], tipo: 'consulta', ordenImporta: true,
            solucion: 'SELECT * FROM productos ORDER BY precio DESC;',
            pistas: [
                'ORDER BY columna ordena los resultados; DESC es de mayor a menor.',
                'SELECT * FROM productos ORDER BY precio DESC;',
            ],
        },
        {
            id: 'm1n7', titulo: 'El top 5',
            mision: 'Para un informe ejecutivo, necesitas solo los 5 productos más caros de la tienda.',
            concepto: 'Limitar resultados con LIMIT',
            sintaxis: 'SELECT * FROM tabla ORDER BY columna DESC LIMIT n;',
            tablas: ['productos'], tipo: 'consulta', ordenImporta: true,
            solucion: 'SELECT * FROM productos ORDER BY precio DESC LIMIT 5;',
            pistas: [
                'LIMIT n corta el resultado a las primeras n filas; combínalo con ORDER BY.',
                'SELECT * FROM productos ORDER BY precio DESC LIMIT 5;',
            ],
        },
        {
            id: 'm1n8', titulo: 'Búsqueda por nombre',
            mision: 'Un cliente busca productos, pero solo recuerda que el nombre empieza con la letra "C". Encuentra esos productos.',
            concepto: 'Buscar patrones con LIKE',
            sintaxis: "SELECT * FROM tabla WHERE columna LIKE 'patron%';  -- % = cualquier texto, _ = un solo caracter",
            tablas: ['productos'], tipo: 'consulta',
            solucion: "SELECT * FROM productos WHERE nombre LIKE 'C%';",
            pistas: [
                'LIKE compara texto con patrones; % representa "cualquier cosa".',
                "'C%' significa: empieza con C, seguido de lo que sea.",
                "SELECT * FROM productos WHERE nombre LIKE 'C%';",
            ],
        },
        {
            id: 'm1n9', titulo: 'Precio medio',
            mision: 'Un cliente busca productos "de precio medio": entre 10 y 30 (ambos incluidos).',
            concepto: 'Rango de valores con BETWEEN',
            sintaxis: 'SELECT * FROM tabla WHERE columna BETWEEN valor1 AND valor2;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT * FROM productos WHERE precio BETWEEN 10 AND 30;',
            pistas: [
                'BETWEEN x AND y incluye los dos extremos.',
                'SELECT * FROM productos WHERE precio BETWEEN 10 AND 30;',
            ],
        },
        {
            id: 'm1n10', titulo: 'Varias categorías a la vez',
            mision: 'Necesitas productos que pertenezcan a Electrónica (1), Juguetes (5) o Deportes (6), sin escribir tres condiciones OR.',
            concepto: 'Lista de valores con IN',
            sintaxis: 'SELECT * FROM tabla WHERE columna IN (valor1, valor2, valor3);',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT * FROM productos WHERE categoria_id IN (1, 5, 6);',
            pistas: [
                'IN reemplaza varias condiciones OR sobre la misma columna.',
                'SELECT * FROM productos WHERE categoria_id IN (1, 5, 6);',
            ],
        },
        {
            id: 'm1n11', titulo: 'Registros incompletos',
            mision: 'Detectaste clientes con datos incompletos: encuentra los que NO tienen fecha de registro guardada.',
            concepto: 'Valores ausentes con IS NULL',
            sintaxis: 'SELECT * FROM tabla WHERE columna IS NULL;',
            tablas: ['clientes'], tipo: 'consulta',
            solucion: 'SELECT * FROM clientes WHERE fecha_registro IS NULL;',
            pistas: [
                'Un valor ausente se llama NULL y NO se compara con "= NULL", sino con IS NULL.',
                'SELECT * FROM clientes WHERE fecha_registro IS NULL;',
            ],
        },
        {
            id: 'm1n12', titulo: 'Un reporte más claro',
            mision: 'Vas a enviar un reporte a Gerencia y quieres encabezados más claros: muestra el nombre de cada producto bajo la columna "Producto" y su precio bajo la columna "Precio_EUR".',
            concepto: 'Renombrar columnas con AS (alias)',
            sintaxis: 'SELECT columna AS nombre_nuevo FROM tabla;',
            tablas: ['productos'], tipo: 'consulta', ignorarNombresColumnas: false,
            solucion: 'SELECT nombre AS Producto, precio AS Precio_EUR FROM productos;',
            pistas: [
                'AS te permite ponerle un alias (nombre nuevo) a una columna en el resultado.',
                'Los alias deben llamarse exactamente Producto y Precio_EUR.',
                'SELECT nombre AS Producto, precio AS Precio_EUR FROM productos;',
            ],
        },
      ],
    },
    // =========================================================
    { id: 'm2', titulo: 'Funciones y agregación', insignia: '📊',
      descripcion: 'Deja de mirar fila por fila: resume, cuenta y agrupa los datos de la tienda.',
      niveles: [
        {
            id: 'm2n1', titulo: 'Tamaño del catálogo',
            mision: '¿Cuántos productos hay en total en el catálogo? Gerencia quiere ese único número.',
            concepto: 'Contar filas con COUNT',
            sintaxis: 'SELECT COUNT(*) FROM tabla;',
            tablas: ['productos'], tipo: 'consulta', ignorarNombresColumnas: true,
            solucion: 'SELECT COUNT(*) FROM productos;',
            pistas: [
                'COUNT(*) cuenta cuántas filas cumplen la consulta.',
                'SELECT COUNT(*) FROM productos;',
            ],
        },
        {
            id: 'm2n2', titulo: 'Unidades totales',
            mision: 'Almacén quiere saber cuántas unidades de producto hay en total, sumando el stock de todos los productos.',
            concepto: 'Sumar con SUM',
            sintaxis: 'SELECT SUM(columna) FROM tabla;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT SUM(stock) FROM productos;',
            pistas: [
                'SUM(columna) suma los valores numéricos de esa columna.',
                'SELECT SUM(stock) FROM productos;',
            ],
        },
        {
            id: 'm2n3', titulo: 'Precio típico',
            mision: 'Para fijar una referencia de precios, calcula el precio PROMEDIO de todos los productos.',
            concepto: 'Promediar con AVG',
            sintaxis: 'SELECT AVG(columna) FROM tabla;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT AVG(precio) FROM productos;',
            pistas: [
                'AVG(columna) calcula el promedio (media) de esa columna.',
                'SELECT AVG(precio) FROM productos;',
            ],
        },
        {
            id: 'm2n4', titulo: 'Extremos de precio',
            mision: 'Necesitas dos datos a la vez para un gráfico: el precio MÁS BAJO y el precio MÁS ALTO de todo el catálogo.',
            concepto: 'MIN y MAX',
            sintaxis: 'SELECT MIN(columna), MAX(columna) FROM tabla;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT MIN(precio), MAX(precio) FROM productos;',
            pistas: [
                'Puedes usar varias funciones de agregación en el mismo SELECT, separadas por coma.',
                'SELECT MIN(precio), MAX(precio) FROM productos;',
            ],
        },
        {
            id: 'm2n5', titulo: 'Ciudades sin repetir',
            mision: 'Marketing quiere saber en qué ciudades hay clientes, pero sin que ninguna ciudad se repita en la lista.',
            concepto: 'Eliminar duplicados con DISTINCT',
            sintaxis: 'SELECT DISTINCT columna FROM tabla;',
            tablas: ['clientes'], tipo: 'consulta',
            solucion: 'SELECT DISTINCT ciudad FROM clientes;',
            pistas: [
                'DISTINCT elimina los valores repetidos del resultado.',
                'SELECT DISTINCT ciudad FROM clientes;',
            ],
        },
        {
            id: 'm2n6', titulo: 'Productos por categoría',
            mision: 'Genera un resumen: cuántos productos hay EN CADA categoría (muestra el id de categoría y la cantidad).',
            concepto: 'Agrupar con GROUP BY',
            sintaxis: 'SELECT columna, COUNT(*) FROM tabla GROUP BY columna;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT categoria_id, COUNT(*) FROM productos GROUP BY categoria_id;',
            pistas: [
                'GROUP BY agrupa las filas que comparten el mismo valor, y luego puedes agregarlas (COUNT, SUM, AVG...).',
                'SELECT categoria_id, COUNT(*) FROM productos GROUP BY categoria_id;',
            ],
        },
        {
            id: 'm2n7', titulo: 'Precio promedio por categoría',
            mision: 'Ahora combina agregación y agrupación: muestra el id de categoría junto con el precio PROMEDIO de sus productos.',
            concepto: 'GROUP BY + función de agregación',
            sintaxis: 'SELECT columna, AVG(otra_columna) FROM tabla GROUP BY columna;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT categoria_id, AVG(precio) FROM productos GROUP BY categoria_id;',
            pistas: [
                'Igual que en el nivel anterior, pero con AVG en vez de COUNT.',
                'SELECT categoria_id, AVG(precio) FROM productos GROUP BY categoria_id;',
            ],
        },
        {
            id: 'm2n8', titulo: 'Categorías con variedad',
            mision: 'Gerencia solo quiere ver las categorías que tienen MÁS DE 4 productos distintos (para saber dónde hay más variedad).',
            concepto: 'Filtrar grupos con HAVING',
            sintaxis: 'SELECT columna, COUNT(*) FROM tabla GROUP BY columna HAVING COUNT(*) > n;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT categoria_id, COUNT(*) FROM productos GROUP BY categoria_id HAVING COUNT(*) > 4;',
            pistas: [
                'WHERE filtra filas ANTES de agrupar; HAVING filtra grupos DESPUÉS de agrupar. Para condiciones sobre COUNT/SUM/AVG, usa HAVING.',
                'SELECT categoria_id, COUNT(*) FROM productos GROUP BY categoria_id HAVING COUNT(*) > 4;',
            ],
        },
      ],
    },
    // =========================================================
    { id: 'm3', titulo: 'Relaciones entre tablas', insignia: '🔗',
      descripcion: 'La tienda tiene varias tablas conectadas por claves. Aprende a combinarlas con JOIN.',
      niveles: [
        {
            id: 'm3n1', titulo: 'Nombre de la categoría',
            mision: 'La tabla productos solo guarda categoria_id (un número). Muestra el nombre de cada producto junto con el NOMBRE de su categoría (no el número), combinando productos con categorias.',
            concepto: 'Combinar tablas con INNER JOIN',
            sintaxis: 'SELECT ... FROM tablaA JOIN tablaB ON tablaA.clave = tablaB.clave;',
            tablas: ['productos', 'categorias'], tipo: 'consulta',
            solucion: 'SELECT productos.nombre, categorias.nombre FROM productos JOIN categorias ON productos.categoria_id = categorias.id;',
            pistas: [
                'JOIN une filas de dos tablas cuando una condición ON se cumple (aquí, cuando el id de categoría coincide).',
                'Como ambas tablas tienen una columna "nombre", debes escribir tabla.columna para distinguirlas.',
                'SELECT productos.nombre, categorias.nombre FROM productos JOIN categorias ON productos.categoria_id = categorias.id;',
            ],
        },
        {
            id: 'm3n2', titulo: 'Menos texto, alias de tabla',
            mision: 'Repite el ejercicio pero para proveedores: muestra el nombre del producto y el nombre de su proveedor, usando alias cortos para las tablas ("p" para productos, "pr" para proveedores) para que la consulta sea más legible.',
            concepto: 'Alias de tabla',
            sintaxis: 'SELECT p.columna FROM productos AS p JOIN proveedores AS pr ON p.proveedor_id = pr.id;',
            tablas: ['productos', 'proveedores'], tipo: 'consulta',
            solucion: 'SELECT p.nombre, pr.nombre FROM productos p JOIN proveedores pr ON p.proveedor_id = pr.id;',
            pistas: [
                'Puedes ponerle un alias a una tabla escribiendo el alias justo después de su nombre (el AS es opcional).',
                'SELECT p.nombre, pr.nombre FROM productos p JOIN proveedores pr ON p.proveedor_id = pr.id;',
            ],
        },
        {
            id: 'm3n3', titulo: 'Pedidos de un cliente',
            mision: 'Atención al cliente necesita revisar los pedidos de "Luis Fernández". Combina pedidos con clientes y muestra todos los datos de sus pedidos.',
            concepto: 'JOIN + WHERE',
            sintaxis: "SELECT tablaA.* FROM tablaA JOIN tablaB ON ... WHERE tablaB.columna = 'valor';",
            tablas: ['pedidos', 'clientes'], tipo: 'consulta',
            solucion: "SELECT pedidos.* FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id WHERE clientes.nombre = 'Luis Fernández';",
            pistas: [
                'Primero une pedidos con clientes por cliente_id = id, luego filtra con WHERE por el nombre.',
                "SELECT pedidos.* FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id WHERE clientes.nombre = 'Luis Fernández';",
            ],
        },
        {
            id: 'm3n4', titulo: 'Ningún cliente se queda fuera',
            mision: 'Gerencia quiere una lista de TODOS los clientes con el id de sus pedidos, INCLUYENDO a los clientes que todavía no han hecho ningún pedido (para esos, el id de pedido debe verse vacío/NULL).',
            concepto: 'Incluir todo con LEFT JOIN',
            sintaxis: 'SELECT ... FROM tablaA LEFT JOIN tablaB ON tablaA.clave = tablaB.clave;',
            tablas: ['clientes', 'pedidos'], tipo: 'consulta',
            solucion: 'SELECT clientes.nombre, pedidos.id FROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id;',
            pistas: [
                'INNER JOIN (JOIN normal) descarta clientes sin pedidos. LEFT JOIN los conserva, rellenando con NULL lo que falte de la tabla derecha.',
                'La tabla de la izquierda (la que quieres conservar completa) va primero: FROM clientes LEFT JOIN pedidos ...',
                'SELECT clientes.nombre, pedidos.id FROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id;',
            ],
        },
        {
            id: 'm3n5', titulo: 'Qué compró cada quién',
            mision: 'Genera una lista con el nombre del cliente y el nombre del producto de cada línea de compra, combinando clientes, pedidos y detalle_pedidos con productos (¡cuatro tablas!).',
            concepto: 'JOIN de varias tablas',
            sintaxis: 'SELECT ... FROM a JOIN b ON ... JOIN c ON ... JOIN d ON ...;',
            tablas: ['clientes', 'pedidos', 'detalle_pedidos', 'productos'], tipo: 'consulta',
            solucion: 'SELECT c.nombre, prod.nombre FROM clientes c JOIN pedidos pe ON c.id = pe.cliente_id JOIN detalle_pedidos d ON pe.id = d.pedido_id JOIN productos prod ON d.producto_id = prod.id;',
            pistas: [
                'Encadena los JOIN uno tras otro: clientes → pedidos → detalle_pedidos → productos.',
                'Usa alias cortos para cada tabla para no escribir nombres largos varias veces.',
                'SELECT c.nombre, prod.nombre FROM clientes c JOIN pedidos pe ON c.id = pe.cliente_id JOIN detalle_pedidos d ON pe.id = d.pedido_id JOIN productos prod ON d.producto_id = prod.id;',
            ],
        },
        {
            id: 'm3n6', titulo: 'Los clientes que más gastan',
            mision: 'Contabilidad quiere saber cuánto ha gastado cada cliente en total (cantidad × precio_unitario, sumado). Muestra el nombre del cliente y su gasto total.',
            concepto: 'JOIN + GROUP BY combinados',
            sintaxis: 'SELECT c.nombre, SUM(d.cantidad * d.precio_unitario) FROM clientes c JOIN ... GROUP BY c.nombre;',
            tablas: ['clientes', 'pedidos', 'detalle_pedidos'], tipo: 'consulta',
            solucion: 'SELECT c.nombre, SUM(d.cantidad * d.precio_unitario) FROM clientes c JOIN pedidos p ON c.id = p.cliente_id JOIN detalle_pedidos d ON p.id = d.pedido_id GROUP BY c.nombre;',
            pistas: [
                'Primero conecta las tres tablas con JOIN, después agrupa por cliente y suma cantidad * precio_unitario.',
                'SELECT c.nombre, SUM(d.cantidad * d.precio_unitario) FROM clientes c JOIN pedidos p ON c.id = p.cliente_id JOIN detalle_pedidos d ON p.id = d.pedido_id GROUP BY c.nombre;',
            ],
        },
        {
            id: 'm3n7', titulo: '¿Quién es el jefe de quién?',
            mision: 'Recursos Humanos quiere el organigrama: el nombre de cada empleado junto con el nombre de SU JEFE (que también está en la tabla empleados).',
            concepto: 'Autounión (SELF JOIN)',
            sintaxis: 'SELECT e.nombre, j.nombre FROM empleados e JOIN empleados j ON e.jefe_id = j.id;',
            tablas: ['empleados'], tipo: 'consulta',
            solucion: 'SELECT e.nombre, j.nombre FROM empleados e JOIN empleados j ON e.jefe_id = j.id;',
            pistas: [
                'Puedes unir una tabla consigo misma usando dos alias distintos, como si fueran dos tablas diferentes.',
                'La condición de unión es: el jefe_id de un empleado coincide con el id de otro.',
                'SELECT e.nombre, j.nombre FROM empleados e JOIN empleados j ON e.jefe_id = j.id;',
            ],
        },
      ],
    },
    // =========================================================
    { id: 'm4', titulo: 'Modificar datos', insignia: '✏️',
      descripcion: 'No todo es consultar: aprende a agregar, actualizar y eliminar datos de forma segura.',
      niveles: [
        {
            id: 'm4n1', titulo: 'Nuevo producto en catálogo',
            mision: "Acaba de llegar un producto nuevo: 'Auriculares Gamer', categoría Electrónica (1), precio 45.00, stock 10, proveedor 1. Agrégalo a la tabla productos (usa el id 25).",
            concepto: 'Insertar filas con INSERT INTO',
            sintaxis: 'INSERT INTO tabla (col1, col2, ...) VALUES (val1, val2, ...);',
            tablas: ['productos'], tipo: 'mutacion',
            solucion: "INSERT INTO productos (id, nombre, categoria_id, precio, stock, proveedor_id) VALUES (25, 'Auriculares Gamer', 1, 45.00, 10, 1);",
            verificacion: "SELECT nombre, categoria_id, precio, stock, proveedor_id FROM productos WHERE nombre = 'Auriculares Gamer';",
            pistas: [
                'INSERT INTO tabla (columnas) VALUES (valores) agrega una fila nueva.',
                "INSERT INTO productos (id, nombre, categoria_id, precio, stock, proveedor_id) VALUES (25, 'Auriculares Gamer', 1, 45.00, 10, 1);",
            ],
        },
        {
            id: 'm4n2', titulo: 'Llegó reabastecimiento',
            mision: "Llegó un envío: el 'Mouse Inalámbrico' ahora tiene 25 unidades en stock. Actualiza su stock.",
            concepto: 'Actualizar filas con UPDATE',
            sintaxis: 'UPDATE tabla SET columna = nuevo_valor WHERE condicion;',
            tablas: ['productos'], tipo: 'mutacion',
            solucion: "UPDATE productos SET stock = 25 WHERE nombre = 'Mouse Inalámbrico';",
            verificacion: "SELECT stock FROM productos WHERE nombre = 'Mouse Inalámbrico';",
            pistas: [
                'UPDATE tabla SET columna = valor WHERE ... cambia solo las filas que cumplen la condición. ¡Nunca olvides el WHERE, o cambiarás TODAS las filas!',
                "UPDATE productos SET stock = 25 WHERE nombre = 'Mouse Inalámbrico';",
            ],
        },
        {
            id: 'm4n3', titulo: 'Descuento de temporada',
            mision: 'Se lanza un 10% de descuento para toda la categoría Ropa (categoria_id = 3). Actualiza el precio de esos productos multiplicándolo por 0.9.',
            concepto: 'UPDATE con cálculo',
            sintaxis: 'UPDATE tabla SET columna = columna * factor WHERE condicion;',
            tablas: ['productos'], tipo: 'mutacion',
            solucion: 'UPDATE productos SET precio = precio * 0.9 WHERE categoria_id = 3;',
            verificacion: 'SELECT id, ROUND(precio, 2) AS precio FROM productos WHERE categoria_id = 3 ORDER BY id;',
            pistas: [
                'Puedes usar la propia columna en el cálculo: precio = precio * 0.9 la reduce un 10%.',
                'UPDATE productos SET precio = precio * 0.9 WHERE categoria_id = 3;',
            ],
        },
        {
            id: 'm4n4', titulo: 'Fuera de catálogo',
            mision: 'Los productos sin stock (0 unidades) se descontinúan. Elimínalos de la tabla productos.',
            concepto: 'Eliminar filas con DELETE',
            sintaxis: 'DELETE FROM tabla WHERE condicion;',
            tablas: ['productos'], tipo: 'mutacion',
            solucion: 'DELETE FROM productos WHERE stock = 0;',
            verificacion: 'SELECT (SELECT COUNT(*) FROM productos WHERE stock = 0) AS con_stock_cero, (SELECT COUNT(*) FROM productos) AS total;',
            pistas: [
                'DELETE FROM tabla WHERE condicion borra las filas que cumplen la condición (¡y solo esas!).',
                'DELETE FROM productos WHERE stock = 0;',
            ],
        },
        {
            id: 'm4n5', titulo: 'Cancelación de pedido',
            mision: "El cliente del pedido con id = 6 llamó para cancelarlo. Cambia el estado de ese pedido a 'cancelado'.",
            concepto: 'UPDATE dirigido por id',
            sintaxis: "UPDATE tabla SET columna = 'valor' WHERE id = n;",
            tablas: ['pedidos'], tipo: 'mutacion',
            solucion: "UPDATE pedidos SET estado = 'cancelado' WHERE id = 6;",
            verificacion: 'SELECT estado FROM pedidos WHERE id = 6;',
            pistas: [
                'Filtra por el id exacto del pedido con WHERE id = 6.',
                "UPDATE pedidos SET estado = 'cancelado' WHERE id = 6;",
            ],
        },
        {
            id: 'm4n6', titulo: 'Ajuste seguro de inventario',
            mision: 'Vas a corregir el stock del producto id = 1 (Audífonos Bluetooth), restándole 5 unidades por una devolución a proveedor. Hazlo dentro de una transacción: inicia con BEGIN TRANSACTION, aplica el UPDATE y confirma con COMMIT.',
            concepto: 'Transacciones (BEGIN / COMMIT)',
            sintaxis: 'BEGIN TRANSACTION;\nUPDATE tabla SET columna = columna - n WHERE condicion;\nCOMMIT;',
            tablas: ['productos'], tipo: 'mutacion',
            solucion: 'BEGIN TRANSACTION; UPDATE productos SET stock = stock - 5 WHERE id = 1; COMMIT;',
            verificacion: 'SELECT stock FROM productos WHERE id = 1;',
            pistas: [
                'Una transacción agrupa varias operaciones: si algo falla puedes deshacerlo todo con ROLLBACK; si todo va bien, confirmas con COMMIT.',
                'Puedes escribir varias sentencias separadas por punto y coma en el mismo bloque.',
                'BEGIN TRANSACTION; UPDATE productos SET stock = stock - 5 WHERE id = 1; COMMIT;',
            ],
        },
      ],
    },
    // =========================================================
    { id: 'mddl', titulo: 'Sentencias DDL', insignia: '🏗️',
      descripcion: 'Antes de guardar datos hay que definir dónde viven: crea, modifica y elimina la estructura de las tablas con DDL (Data Definition Language).',
      niveles: [
        {
            id: 'mddln1', titulo: 'Una tabla nueva para el almacén',
            mision: "Almacén quiere empezar a registrar las entregas que hacen los proveedores. Crea una tabla llamada 'entregas' con las columnas: id (INTEGER, clave primaria), proveedor_id (INTEGER), fecha (TEXT) y cantidad (INTEGER).",
            concepto: 'Crear tablas con CREATE TABLE',
            sintaxis: 'CREATE TABLE tabla (\n    columna1 TIPO,\n    columna2 TIPO,\n    ...\n);',
            tablas: ['proveedores'], tipo: 'mutacion',
            solucion: 'CREATE TABLE entregas (id INTEGER PRIMARY KEY, proveedor_id INTEGER, fecha TEXT, cantidad INTEGER);',
            pruebas: [
                { sql: "INSERT INTO entregas (id, proveedor_id, fecha, cantidad) VALUES (1, 1, '2026-01-10', 50);", debeFallar: false },
                { sql: "INSERT INTO entregas (id, proveedor_id, fecha, cantidad) VALUES (2, 2, '2026-01-12', 30);", debeFallar: false },
            ],
            pistas: [
                'CREATE TABLE nombre (columna1 TIPO, columna2 TIPO, ...); define una tabla nueva y vacía.',
                'La columna id debe llevar PRIMARY KEY justo después de su tipo.',
                'CREATE TABLE entregas (id INTEGER PRIMARY KEY, proveedor_id INTEGER, fecha TEXT, cantidad INTEGER);',
            ],
        },
        {
            id: 'mddln2', titulo: 'Un dato que faltaba',
            mision: "Atención al Cliente quiere poder guardar el teléfono de cada cliente, pero la tabla clientes no tiene esa columna. Agrégale una columna 'telefono' de tipo TEXT, sin tocar los datos que ya existen.",
            concepto: 'Agregar columnas con ALTER TABLE ADD COLUMN',
            sintaxis: 'ALTER TABLE tabla ADD COLUMN columna_nueva TIPO;',
            tablas: ['clientes'], tipo: 'mutacion',
            solucion: 'ALTER TABLE clientes ADD COLUMN telefono TEXT;',
            verificacion: 'SELECT id, nombre, telefono FROM clientes ORDER BY id;',
            pistas: [
                'ALTER TABLE tabla ADD COLUMN columna TIPO; añade una columna nueva sin borrar las filas existentes.',
                'La columna nueva empieza vacía (NULL) para todas las filas ya guardadas.',
                'ALTER TABLE clientes ADD COLUMN telefono TEXT;',
            ],
        },
        {
            id: 'mddln6', titulo: 'Un dato que ya no hace falta',
            mision: "Todos los proveedores de TiendaSQL son ahora locales, así que la columna 'pais' de la tabla proveedores quedó obsoleta. Elimínala por completo (sin borrar la tabla ni las demás columnas).",
            concepto: 'Eliminar columnas con ALTER TABLE DROP COLUMN',
            sintaxis: 'ALTER TABLE tabla DROP COLUMN columna;',
            tablas: ['proveedores'], tipo: 'mutacion',
            solucion: 'ALTER TABLE proveedores DROP COLUMN pais;',
            pruebas: [
                { sql: 'SELECT pais FROM proveedores;', debeFallar: true },
                { sql: 'SELECT id, nombre FROM proveedores;', debeFallar: false },
            ],
            pistas: [
                'ALTER TABLE tabla DROP COLUMN columna; quita una columna de una tabla ya existente, con todo y sus datos.',
                'Las demás columnas y filas de la tabla no se ven afectadas.',
                'ALTER TABLE proveedores DROP COLUMN pais;',
            ],
        },
        {
            id: 'mddln3', titulo: 'Cambio de vocabulario',
            mision: "Recursos Humanos actualizó su terminología interna: lo que antes se llamaba 'puesto' ahora se llama 'cargo'. Renombra esa columna en la tabla empleados, conservando los datos.",
            concepto: 'Renombrar columnas con ALTER TABLE RENAME COLUMN',
            sintaxis: 'ALTER TABLE tabla RENAME COLUMN columna_actual TO columna_nueva;',
            tablas: ['empleados'], tipo: 'mutacion',
            solucion: 'ALTER TABLE empleados RENAME COLUMN puesto TO cargo;',
            verificacion: 'SELECT id, nombre, cargo FROM empleados ORDER BY id;',
            pistas: [
                'ALTER TABLE tabla RENAME COLUMN actual TO nueva; cambia el nombre de una columna sin afectar sus datos.',
                'ALTER TABLE empleados RENAME COLUMN puesto TO cargo;',
            ],
        },
        {
            id: 'mddln4', titulo: 'Un nombre más claro',
            mision: "El nuevo sistema de reportes va a manejar varios tipos de categorías (clientes, proveedores...), así que la tabla 'categorias' necesita un nombre menos ambiguo. Renómbrala a 'categorias_producto'.",
            concepto: 'Renombrar tablas con ALTER TABLE RENAME TO',
            sintaxis: 'ALTER TABLE nombre_actual RENAME TO nombre_nuevo;',
            tablas: ['categorias'], tipo: 'mutacion',
            solucion: 'ALTER TABLE categorias RENAME TO categorias_producto;',
            pruebas: [
                { sql: 'SELECT COUNT(*) FROM categorias_producto;', debeFallar: false },
                { sql: 'SELECT COUNT(*) FROM categorias;', debeFallar: true },
            ],
            pistas: [
                'ALTER TABLE actual RENAME TO nuevo; cambia el nombre de toda la tabla, con todo y sus datos.',
                'Tras el cambio, el nombre viejo ya no existe: solo se puede consultar con el nombre nuevo.',
                'ALTER TABLE categorias RENAME TO categorias_producto;',
            ],
        },
        {
            id: 'mddln5', titulo: 'Fin del experimento',
            mision: "La empresa va a migrar el detalle de cada pedido a un sistema externo de facturación; ya no hace falta guardarlo en esta base. Elimina por completo la tabla 'detalle_pedidos'.",
            concepto: 'Eliminar tablas con DROP TABLE',
            sintaxis: 'DROP TABLE tabla;',
            tablas: ['detalle_pedidos'], tipo: 'mutacion',
            solucion: 'DROP TABLE detalle_pedidos;',
            pruebas: [
                { sql: 'SELECT * FROM detalle_pedidos;', debeFallar: true },
            ],
            pistas: [
                'DROP TABLE tabla; elimina la tabla ENTERA, con su estructura y todos sus datos. No hay vuelta atrás (a diferencia de DELETE, que solo borra filas).',
                'DROP TABLE detalle_pedidos;',
            ],
        },
      ],
    },
    // =========================================================
    { id: 'm5', titulo: 'Consultas avanzadas', insignia: '🚀',
      descripcion: 'Preguntas más sofisticadas: subconsultas, combinaciones y funciones de ventana.',
      niveles: [
        {
            id: 'm5n1', titulo: 'Por encima de la media',
            mision: 'Encuentra los productos cuyo precio sea MAYOR al precio PROMEDIO de todo el catálogo (sin calcular el promedio a mano).',
            concepto: 'Subconsulta en WHERE',
            sintaxis: 'SELECT * FROM tabla WHERE columna > (SELECT AVG(columna) FROM tabla);',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT * FROM productos WHERE precio > (SELECT AVG(precio) FROM productos);',
            pistas: [
                'Una subconsulta es un SELECT dentro de otro SELECT, entre paréntesis. Aquí reemplaza al número del promedio.',
                'SELECT * FROM productos WHERE precio > (SELECT AVG(precio) FROM productos);',
            ],
        },
        {
            id: 'm5n2', titulo: 'Clientes que sí compraron',
            mision: 'Encuentra todos los clientes que han hecho AL MENOS un pedido, usando una subconsulta sobre la tabla pedidos (sin usar JOIN).',
            concepto: 'Subconsulta con IN',
            sintaxis: 'SELECT * FROM tabla WHERE columna IN (SELECT columna FROM otra_tabla);',
            tablas: ['clientes', 'pedidos'], tipo: 'consulta',
            solucion: 'SELECT * FROM clientes WHERE id IN (SELECT DISTINCT cliente_id FROM pedidos);',
            pistas: [
                'IN también acepta el resultado de una subconsulta, no solo una lista escrita a mano.',
                'SELECT * FROM clientes WHERE id IN (SELECT DISTINCT cliente_id FROM pedidos);',
            ],
        },
        {
            id: 'm5n3', titulo: 'Categorías por encima de 20',
            mision: 'Primero calcula el precio promedio por categoría, y luego, sobre ese resultado, muestra solo las categorías cuyo promedio sea mayor a 20. Hazlo usando una subconsulta en el FROM (no HAVING).',
            concepto: 'Subconsulta en FROM',
            sintaxis: 'SELECT * FROM (SELECT ... FROM tabla GROUP BY ...) WHERE condicion;',
            tablas: ['productos'], tipo: 'consulta',
            solucion: 'SELECT * FROM (SELECT categoria_id, AVG(precio) AS promedio FROM productos GROUP BY categoria_id) WHERE promedio > 20;',
            pistas: [
                'Puedes usar el resultado de una consulta como si fuera una tabla, escribiéndola entre paréntesis después de FROM.',
                'Dale un alias a la columna calculada (AVG(precio) AS promedio) para poder filtrarla después con WHERE.',
                'SELECT * FROM (SELECT categoria_id, AVG(precio) AS promedio FROM productos GROUP BY categoria_id) WHERE promedio > 20;',
            ],
        },
        {
            id: 'm5n4', titulo: 'Directorio combinado',
            mision: 'Recursos Humanos quiere un único listado con los nombres de todos los clientes Y todos los empleados juntos, sin duplicados.',
            concepto: 'Combinar resultados con UNION',
            sintaxis: 'SELECT columna FROM tablaA UNION SELECT columna FROM tablaB;',
            tablas: ['clientes', 'empleados'], tipo: 'consulta',
            solucion: 'SELECT nombre FROM clientes UNION SELECT nombre FROM empleados;',
            pistas: [
                'UNION junta los resultados de dos SELECT (con el mismo número de columnas) y elimina duplicados automáticamente.',
                'SELECT nombre FROM clientes UNION SELECT nombre FROM empleados;',
            ],
        },
        {
            id: 'm5n5', titulo: 'Semáforo de inventario',
            mision: "Crea un 'semáforo' de stock: por cada producto, muestra su nombre, su stock, y una columna extra llamada nivel con 'Bajo' si stock < 10, 'Medio' si stock < 50, y 'Alto' en cualquier otro caso.",
            concepto: 'Lógica condicional con CASE WHEN',
            sintaxis: "SELECT columna, CASE WHEN cond1 THEN 'a' WHEN cond2 THEN 'b' ELSE 'c' END AS nivel FROM tabla;",
            tablas: ['productos'], tipo: 'consulta', ignorarNombresColumnas: false,
            solucion: "SELECT nombre, stock, CASE WHEN stock < 10 THEN 'Bajo' WHEN stock < 50 THEN 'Medio' ELSE 'Alto' END AS nivel FROM productos;",
            pistas: [
                'CASE WHEN ... THEN ... WHEN ... THEN ... ELSE ... END funciona como un if/elif/else dentro del SELECT.',
                'Recuerda darle el alias exacto "nivel" a la columna calculada.',
                "SELECT nombre, stock, CASE WHEN stock < 10 THEN 'Bajo' WHEN stock < 50 THEN 'Medio' ELSE 'Alto' END AS nivel FROM productos;",
            ],
        },
        {
            id: 'm5n6', titulo: 'Ranking de precios',
            mision: "Genera un ranking de TODOS los productos del más caro al más barato, mostrando nombre, precio y un número de posición (columna 'posicion') que indique su lugar en el ranking.",
            concepto: 'Función de ventana ROW_NUMBER',
            sintaxis: 'SELECT columna, ROW_NUMBER() OVER (ORDER BY columna DESC) AS posicion FROM tabla ORDER BY columna DESC;',
            tablas: ['productos'], tipo: 'consulta', ordenImporta: true, ignorarNombresColumnas: false,
            solucion: 'SELECT nombre, precio, ROW_NUMBER() OVER (ORDER BY precio DESC) AS posicion FROM productos ORDER BY precio DESC;',
            pistas: [
                'ROW_NUMBER() OVER (ORDER BY columna DESC) numera las filas según ese orden, sin agruparlas.',
                'No olvides también poner un ORDER BY al final para que la tabla se muestre en ese mismo orden.',
                'SELECT nombre, precio, ROW_NUMBER() OVER (ORDER BY precio DESC) AS posicion FROM productos ORDER BY precio DESC;',
            ],
        },
        {
            id: 'm5n7', titulo: 'El más caro de cada categoría',
            mision: "Ahora haz un ranking de precio, pero separado POR CATEGORÍA: muestra nombre, categoria_id, precio y una columna 'posicion' que indique el puesto del producto dentro de su propia categoría (el más caro de cada categoría es el puesto 1).",
            concepto: 'PARTITION BY en funciones de ventana',
            sintaxis: 'SELECT ..., RANK() OVER (PARTITION BY columnaGrupo ORDER BY columnaOrden DESC) AS posicion FROM tabla;',
            tablas: ['productos'], tipo: 'consulta', ignorarNombresColumnas: false,
            solucion: 'SELECT nombre, categoria_id, precio, RANK() OVER (PARTITION BY categoria_id ORDER BY precio DESC) AS posicion FROM productos;',
            pistas: [
                'PARTITION BY reinicia el conteo/ranking para cada grupo (aquí, cada categoría).',
                'RANK() funciona como ROW_NUMBER(), pero da el mismo puesto a los empates.',
                'SELECT nombre, categoria_id, precio, RANK() OVER (PARTITION BY categoria_id ORDER BY precio DESC) AS posicion FROM productos;',
            ],
        },
        {
            id: 'm5n8', titulo: 'Misión final: mejores clientes',
            mision: "Genera el reporte estrella para Gerencia: nombre del cliente, total gastado (suma de cantidad × precio_unitario) y número de pedidos completados. Incluye SOLO clientes con MÁS DE 1 pedido 'completado', y ordena de mayor a menor gasto total.",
            concepto: 'Todo junto: JOIN + GROUP BY + HAVING + ORDER BY',
            sintaxis: 'Combina JOIN, GROUP BY, HAVING y ORDER BY en una sola consulta.',
            tablas: ['clientes', 'pedidos', 'detalle_pedidos'], tipo: 'consulta', ordenImporta: true, ignorarNombresColumnas: false,
            solucion: "SELECT c.nombre, SUM(d.cantidad * d.precio_unitario) AS total, COUNT(DISTINCT p.id) AS pedidos FROM clientes c JOIN pedidos p ON c.id = p.cliente_id JOIN detalle_pedidos d ON p.id = d.pedido_id WHERE p.estado = 'completado' GROUP BY c.id HAVING COUNT(DISTINCT p.id) > 1 ORDER BY total DESC;",
            pistas: [
                'Filtra primero por estado = \'completado\' con WHERE, luego agrupa por cliente, filtra los grupos con HAVING y finalmente ordena.',
                'Usa COUNT(DISTINCT p.id) para contar pedidos distintos (una misma orden puede tener varias líneas en detalle_pedidos).',
                "SELECT c.nombre, SUM(d.cantidad * d.precio_unitario) AS total, COUNT(DISTINCT p.id) AS pedidos FROM clientes c JOIN pedidos p ON c.id = p.cliente_id JOIN detalle_pedidos d ON p.id = d.pedido_id WHERE p.estado = 'completado' GROUP BY c.id HAVING COUNT(DISTINCT p.id) > 1 ORDER BY total DESC;",
            ],
        },
      ],
    },
    // =========================================================
    { id: 'm6', titulo: 'Diseño y buenas prácticas', insignia: '🏆',
      descripcion: 'Bonus: cómo se diseñan las tablas por dentro para que los datos sean confiables y rápidos.',
      niveles: [
        {
            id: 'm6n1', titulo: 'Una tabla con reglas',
            mision: "Vas a lanzar reseñas de producto. Crea la tabla 'resenas' con: id (INTEGER, clave primaria), producto_id (INTEGER), puntuacion (INTEGER, que solo permita valores entre 1 y 5) y comentario (TEXT, obligatorio, no puede quedar vacío/NULL).",
            concepto: 'CREATE TABLE con restricciones (CHECK, NOT NULL)',
            sintaxis: 'CREATE TABLE tabla (\n  id INTEGER PRIMARY KEY,\n  columna INTEGER CHECK (columna BETWEEN 1 AND 5),\n  otra TEXT NOT NULL\n);',
            tablas: [], tipo: 'mutacion',
            solucion: 'CREATE TABLE resenas (id INTEGER PRIMARY KEY, producto_id INTEGER, puntuacion INTEGER CHECK (puntuacion BETWEEN 1 AND 5), comentario TEXT NOT NULL);',
            pruebas: [
                { sql: "INSERT INTO resenas (id, producto_id, puntuacion, comentario) VALUES (1, 1, 5, 'Excelente producto');", debeFallar: false },
                { sql: "INSERT INTO resenas (id, producto_id, puntuacion, comentario) VALUES (2, 1, 8, 'Puntuación fuera de rango');", debeFallar: true },
                { sql: "INSERT INTO resenas (id, producto_id, puntuacion) VALUES (3, 1, 4);", debeFallar: true },
            ],
            pistas: [
                'CHECK (condicion) valida cada fila antes de guardarla; NOT NULL exige que la columna siempre tenga un valor.',
                'PRIMARY KEY se declara justo después del tipo de la columna id.',
                'CREATE TABLE resenas (id INTEGER PRIMARY KEY, producto_id INTEGER, puntuacion INTEGER CHECK (puntuacion BETWEEN 1 AND 5), comentario TEXT NOT NULL);',
            ],
        },
        {
            id: 'm6n2', titulo: 'Favoritos con integridad referencial',
            mision: "Crea la tabla 'favoritos' con: id (INTEGER, clave primaria), cliente_id (INTEGER, debe referenciar a clientes.id) y producto_id (INTEGER, debe referenciar a productos.id). Así ningún favorito podrá apuntar a un cliente o producto inexistente.",
            concepto: 'Claves foráneas (FOREIGN KEY / REFERENCES)',
            sintaxis: 'CREATE TABLE tabla (\n  id INTEGER PRIMARY KEY,\n  otra_id INTEGER REFERENCES otra_tabla(id)\n);',
            tablas: ['clientes', 'productos'], tipo: 'mutacion',
            solucion: 'CREATE TABLE favoritos (id INTEGER PRIMARY KEY, cliente_id INTEGER REFERENCES clientes(id), producto_id INTEGER REFERENCES productos(id));',
            pruebas: [
                { sql: 'INSERT INTO favoritos (id, cliente_id, producto_id) VALUES (1, 1, 1);', debeFallar: false },
                { sql: 'INSERT INTO favoritos (id, cliente_id, producto_id) VALUES (2, 999, 1);', debeFallar: true },
                { sql: 'INSERT INTO favoritos (id, cliente_id, producto_id) VALUES (3, 1, 999);', debeFallar: true },
            ],
            pistas: [
                'columna REFERENCES tabla(columna) declara una clave foránea: solo se aceptan valores que existan en esa otra tabla.',
                'CREATE TABLE favoritos (id INTEGER PRIMARY KEY, cliente_id INTEGER REFERENCES clientes(id), producto_id INTEGER REFERENCES productos(id));',
            ],
        },
        {
            id: 'm6n3', titulo: 'Búsquedas más rápidas',
            mision: 'Almacén hace constantemente búsquedas de productos con poco stock, y son lentas. Crea un índice sobre la columna stock de productos para acelerarlas.',
            concepto: 'Acelerar consultas con CREATE INDEX',
            sintaxis: 'CREATE INDEX nombre_indice ON tabla(columna);',
            tablas: ['productos'], tipo: 'mutacion',
            solucion: 'CREATE INDEX idx_productos_stock ON productos(stock);',
            verificacion: "SELECT COUNT(*) AS num_indices FROM pragma_index_list('productos');",
            pistas: [
                'Un índice es como el índice de un libro: permite encontrar filas por esa columna sin revisarlas todas.',
                'CREATE INDEX un_nombre_que_elijas ON productos(stock);',
                'CREATE INDEX idx_productos_stock ON productos(stock);',
            ],
        },
        {
            id: 'm6n4', titulo: 'Un atajo reutilizable',
            mision: "Vas a crear un atajo para no repetir siempre la misma consulta: una vista llamada 'resumen_categorias' que muestre categoria_id y el precio promedio (AVG) de sus productos, agrupado por categoría.",
            concepto: 'Vistas con CREATE VIEW',
            sintaxis: 'CREATE VIEW nombre_vista AS SELECT ... FROM ... GROUP BY ...;',
            tablas: ['productos'], tipo: 'mutacion',
            solucion: 'CREATE VIEW resumen_categorias AS SELECT categoria_id, AVG(precio) AS promedio FROM productos GROUP BY categoria_id;',
            verificacion: 'SELECT categoria_id, ROUND(promedio, 2) AS promedio FROM resumen_categorias ORDER BY categoria_id;',
            ordenImporta: true,
            pistas: [
                'CREATE VIEW nombre AS SELECT ... guarda una consulta con un nombre, para poder usarla luego como si fuera una tabla (SELECT * FROM nombre).',
                'La vista debe llamarse exactamente resumen_categorias y su columna calculada, promedio.',
                'CREATE VIEW resumen_categorias AS SELECT categoria_id, AVG(precio) AS promedio FROM productos GROUP BY categoria_id;',
            ],
        },
      ],
    },
];

// Aplana la estructura de mundos para búsquedas rápidas por id de nivel.
function obtenerTodosLosNiveles() {
    const lista = [];
    for (const mundo of MUNDOS) {
        for (const nivel of mundo.niveles) {
            lista.push({ ...nivel, mundoId: mundo.id });
        }
    }
    return lista;
}

function buscarNivelPorId(idNivel) {
    return obtenerTodosLosNiveles().find((n) => n.id === idNivel) || null;
}
