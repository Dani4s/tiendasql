# 🏪 TiendaSQL

Un pequeño juego web para aprender SQL de forma práctica y progresiva. Eres el
nuevo analista de datos de una tienda y resuelves misiones reales (reponer
stock, generar reportes, encontrar clientes...) escribiendo consultas SQL de
verdad contra una base de datos SQLite que corre completamente en tu
navegador (gracias a [sql.js](https://sql.js.org/)).

No necesitas instalar nada: ni servidor, ni base de datos externa, ni
dependencias de Node. Todo el juego es HTML/CSS/JavaScript + un motor SQLite
compilado a WebAssembly, incluido localmente en `lib/`.

## Cómo jugar

El navegador bloquea la carga del archivo `.wasm` cuando abres `index.html`
directamente con doble clic (protocolo `file://`), así que necesitas servir
la carpeta con un servidor local muy simple. Con **Python** ya instalado:

```bash
cd "sql conceptos basicos"
python -m http.server 8000
```

Y abre **http://localhost:8000** en tu navegador.

Alternativas si no tienes Python:

```bash
# Con Node.js instalado
npx http-server -p 8000

# Con la extensión "Live Server" de VS Code
# clic derecho sobre index.html → "Open with Live Server"
```

## Cómo se juega

1. En el **mapa de mundos**, elige un mundo desbloqueado (empiezas por
   "Fundamentos").
2. Dentro de cada mundo hay una lista de misiones. Cada una plantea una
   tarea de negocio concreta.
3. En la pantalla de la misión tienes: el enunciado, el esquema de las
   tablas involucradas, una chuleta de sintaxis, pistas progresivas (por si
   te atascas) y un editor donde escribes tu consulta SQL.
4. Pulsa **Ejecutar**: tu consulta corre de verdad contra la base de datos.
   El juego compara el RESULTADO de tu consulta contra el resultado
   esperado (no el texto), así que hay más de una forma correcta de
   resolver cada misión.
5. Al acertar, se desbloquea la siguiente misión. Completar todas las
   misiones de un mundo te da una insignia.
6. Tu progreso se guarda automáticamente en el navegador (localStorage): si
   recargas la página, sigues donde lo dejaste.
7. Cuando quieras practicar sin restricciones, usa **🧪 Modo libre** desde
   la barra superior: acceso completo a la base de datos de la tienda, sin
   misiones que validar.

## Progresión de contenidos

1. **Fundamentos** — `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, `LIKE`,
   `BETWEEN`, `IN`, `IS NULL`, alias.
2. **Funciones y agregación** — `COUNT`, `SUM`, `AVG`, `MIN`/`MAX`,
   `DISTINCT`, `GROUP BY`, `HAVING`.
3. **Relaciones entre tablas** — `INNER JOIN`, `LEFT JOIN`, JOIN múltiple,
   auto-unión (`SELF JOIN`).
4. **Práctica: de lo simple a los JOINs a fondo** — consultas simples de
   repaso, combinaciones complejas de 2 y 4 tablas, y un recorrido por
   `CROSS JOIN`, `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN` y `FULL JOIN`
   comparando cada uno con el producto cartesiano.
5. **Modificar datos** — `INSERT`, `UPDATE`, `DELETE`, transacciones.
6. **Sentencias DDL** — `CREATE TABLE`, `ALTER TABLE` (`ADD COLUMN`,
   `DROP COLUMN`, `RENAME COLUMN`, `RENAME TO`), `DROP TABLE`.
7. **Consultas avanzadas** — subconsultas, `UNION`, `CASE WHEN`, funciones
   de ventana (`ROW_NUMBER`, `RANK`).
8. **Diseño y buenas prácticas (bonus)** — restricciones (`CHECK`,
   `NOT NULL`, `FOREIGN KEY`), índices, vistas.

## Importar y exportar tablas SQL

Esto se maneja desde **🧪 Modo libre**, en el panel "📦 Importar y exportar".

### La idea general (no solo en este juego)

En cualquier motor de base de datos (SQLite, MySQL, PostgreSQL...), "exportar"
una base o una tabla normalmente significa generar un archivo de **texto
plano** con las sentencias SQL necesarias para recrearla desde cero:

```sql
CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT, precio REAL);
INSERT INTO productos (id, nombre, precio) VALUES (1, 'Audífonos Bluetooth', 29.99);
INSERT INTO productos (id, nombre, precio) VALUES (2, 'Cargador USB-C', 12.50);
```

A ese archivo se le suele llamar "volcado" o **dump**. "Importar" es lo
contrario: tomar ese archivo `.sql` y ejecutarlo contra una base de datos
(vacía o no) para que las tablas y los datos vuelvan a existir. Herramientas
reales que hacen exactamente esto:

| Motor | Exportar (dump) | Importar |
|---|---|---|
| MySQL / MariaDB | `mysqldump basedatos > copia.sql` | `mysql basedatos < copia.sql` |
| PostgreSQL | `pg_dump basedatos > copia.sql` | `psql basedatos < copia.sql` |
| SQLite (consola) | `.dump` (o `sqlite3 basedatos.db .dump > copia.sql`) | `sqlite3 nueva.db < copia.sql` |
| DB Browser for SQLite | Menú *File → Export → Database to SQL file* | Menú *File → Import → Database from SQL file* |

Otra forma de "exportar una tabla" muy común, sobre todo para llevar datos a
Excel/Google Sheets, es como **CSV** (valores separados por comas): ahí ya no
se exportan sentencias SQL, sino directamente las filas de un resultado.

### Cómo hacerlo dentro de TiendaSQL

En **🧪 Modo libre** tienes tres botones:

- **⬇️ Exportar base como .sql** — descarga un archivo `.sql` con
  `CREATE TABLE` + `INSERT` de absolutamente todas las tablas que existan en
  ese momento en tu base (las originales de la tienda y también cualquier
  tabla propia que hayas creado tú, por ejemplo con `CREATE TABLE`). Es tu
  copia de seguridad.
- **⬆️ Importar archivo .sql** — eliges un archivo `.sql` de tu computadora
  (por ejemplo, uno que hayas exportado antes, o uno escrito a mano con tus
  propias tablas) y se ejecuta contra la base del Modo libre. Si el archivo
  incluye `DROP TABLE IF EXISTS`, reemplaza esas tablas; si no, simplemente
  añade lo nuevo.
- **⬇️ Exportar como CSV** — aparece debajo de cualquier tabla de resultados
  (tanto en Modo libre como al resolver una misión) y descarga únicamente
  esas filas como `.csv`, listo para abrir en una hoja de cálculo.

Un flujo típico para practicar: ejecuta `SELECT * FROM productos;` en Modo
libre, pulsa "Exportar base como .sql", abre el archivo descargado en un
editor de texto para ver cómo se ve un `INSERT` real, modifícalo si quieres
(por ejemplo cambia un precio o añade una fila), y luego vuelve a importarlo
con "Importar archivo .sql" para ver el resultado reflejado en el juego.

> Nota: el visor de esquema solo describe las tablas originales de la
> tienda. Si importas tablas propias, consúltalas con
> `SELECT * FROM tu_tabla;` o revisa
> `SELECT name FROM sqlite_master WHERE type='table';` para ver el listado
> completo de tablas que existen en ese momento.

## Estructura del proyecto

```
index.html          Página principal
css/estilo.css       Estilos
js/main.js            Arranque y navegación entre pantallas
js/ui.js               Construcción de las pantallas (mapa, mundo, nivel, modo libre)
js/motor-juego.js       Validación de las respuestas del jugador
js/importar-exportar.js  Exportar la base a .sql/.csv e importar un archivo .sql
js/niveles.js            Contenido: mundos y misiones
js/progreso.js            Progreso del jugador en localStorage
js/db.js                   Inicialización de sql.js y creación de bases de datos frescas
data/esquema.sql             Esquema y datos semilla de la tienda
lib/sql-wasm.js, lib/sql-wasm.wasm   Motor SQLite compilado a WebAssembly (sql.js v1.10.3)
```

## Reiniciar tu progreso

Pulsa "Reiniciar progreso" en la barra superior, o borra la clave
`tiendasql_progreso_v1` de localStorage desde las herramientas de
desarrollador del navegador.
