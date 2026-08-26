-- ============================================================
-- TiendaSQL — esquema y datos semilla de la base de datos de la tienda
-- Este script se ejecuta completo cada vez que se (re)inicia un nivel,
-- así que cada intento del jugador parte siempre del mismo estado limpio.
-- ============================================================

DROP TABLE IF EXISTS detalle_pedidos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS empleados;

CREATE TABLE categorias (
    id      INTEGER PRIMARY KEY,
    nombre  TEXT NOT NULL UNIQUE
);

CREATE TABLE proveedores (
    id      INTEGER PRIMARY KEY,
    nombre  TEXT NOT NULL,
    pais    TEXT
);

CREATE TABLE productos (
    id              INTEGER PRIMARY KEY,
    nombre          TEXT NOT NULL,
    categoria_id    INTEGER REFERENCES categorias(id),
    precio          REAL NOT NULL CHECK (precio >= 0),
    stock           INTEGER NOT NULL DEFAULT 0,
    proveedor_id    INTEGER REFERENCES proveedores(id)
);

CREATE TABLE clientes (
    id              INTEGER PRIMARY KEY,
    nombre          TEXT NOT NULL,
    email           TEXT UNIQUE,
    ciudad          TEXT,
    fecha_registro  TEXT
);

CREATE TABLE empleados (
    id       INTEGER PRIMARY KEY,
    nombre   TEXT NOT NULL,
    puesto   TEXT NOT NULL,
    salario  REAL NOT NULL,
    jefe_id  INTEGER REFERENCES empleados(id)
);

CREATE TABLE pedidos (
    id           INTEGER PRIMARY KEY,
    cliente_id   INTEGER REFERENCES clientes(id),
    empleado_id  INTEGER REFERENCES empleados(id),
    fecha        TEXT NOT NULL,
    estado       TEXT NOT NULL CHECK (estado IN ('completado', 'pendiente', 'cancelado'))
);

CREATE TABLE detalle_pedidos (
    id               INTEGER PRIMARY KEY,
    pedido_id        INTEGER REFERENCES pedidos(id),
    producto_id      INTEGER REFERENCES productos(id),
    cantidad         INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario  REAL NOT NULL
);

-- ---------------------------------------------------------------
-- Datos semilla
-- ---------------------------------------------------------------

INSERT INTO categorias (id, nombre) VALUES
    (1, 'Electrónica'),
    (2, 'Hogar'),
    (3, 'Ropa'),
    (4, 'Alimentos'),
    (5, 'Juguetes'),
    (6, 'Deportes');

INSERT INTO proveedores (id, nombre, pais) VALUES
    (1, 'TecnoGlobal', 'España'),
    (2, 'CasaFeliz', 'México'),
    (3, 'ModaViva', 'Colombia'),
    (4, 'NutriMax', 'Argentina');

INSERT INTO productos (id, nombre, categoria_id, precio, stock, proveedor_id) VALUES
    (1, 'Audífonos Bluetooth', 1, 29.99, 45, 1),
    (2, 'Cargador USB-C', 1, 12.50, 120, 1),
    (3, 'Mouse Inalámbrico', 1, 15.00, 8, 1),
    (4, 'Teclado Mecánico', 1, 55.00, 3, 1),
    (5, 'Parlante Portátil', 1, 34.99, 20, 1),
    (6, 'Smartwatch', 1, 89.99, 5, 1),
    (7, 'Sartén Antiadherente', 2, 22.00, 30, 2),
    (8, 'Juego de Toallas', 2, 18.50, 4, 2),
    (9, 'Lámpara de Mesa', 2, 25.00, 12, 2),
    (10, 'Set de Cuchillos', 2, 40.00, 2, 2),
    (11, 'Camiseta Básica', 3, 9.99, 100, 3),
    (12, 'Jeans Slim', 3, 35.00, 6, 3),
    (13, 'Chaqueta Impermeable', 3, 60.00, 9, 3),
    (14, 'Gorra Deportiva', 3, 12.00, 50, 3),
    (15, 'Café Molido 500g', 4, 8.50, 3, 4),
    (16, 'Aceite de Oliva 1L', 4, 11.00, 40, 4),
    (17, 'Chocolate Amargo', 4, 5.50, 0, 4),
    (18, 'Pasta Integral', 4, 2.50, 60, 4),
    (19, 'Robot de Juguete', 5, 27.00, 15, 2),
    (20, 'Rompecabezas 1000pz', 5, 14.00, 7, 2),
    (21, 'Pelota de Fútbol', 6, 19.99, 25, 3),
    (22, 'Mancuernas 5kg (par)', 6, 32.00, 4, 3),
    (23, 'Colchoneta de Yoga', 6, 21.00, 18, 3),
    (24, 'Bicicleta Estática', 6, 250.00, 1, 3);

INSERT INTO clientes (id, nombre, email, ciudad, fecha_registro) VALUES
    (1, 'Ana Torres', 'ana.torres@mail.com', 'Madrid', '2023-01-15'),
    (2, 'Luis Fernández', 'luis.fernandez@mail.com', 'Barcelona', '2023-02-20'),
    (3, 'María González', 'maria.gonzalez@mail.com', 'Sevilla', '2023-03-05'),
    (4, 'Carlos Ruiz', 'carlos.ruiz@mail.com', 'Madrid', '2023-03-22'),
    (5, 'Elena Sánchez', 'elena.sanchez@mail.com', 'Valencia', '2023-04-10'),
    (6, 'Jorge Ramírez', 'jorge.ramirez@mail.com', 'Bilbao', '2023-04-28'),
    (7, 'Lucía Morales', 'lucia.morales@mail.com', 'Madrid', '2023-05-14'),
    (8, 'Pedro Jiménez', 'pedro.jimenez@mail.com', 'Zaragoza', NULL),
    (9, 'Sofía Herrera', 'sofia.herrera@mail.com', 'Barcelona', '2023-06-02'),
    (10, 'Diego Castro', 'diego.castro@mail.com', 'Málaga', '2023-06-19'),
    (11, 'Valentina Ortiz', 'valentina.ortiz@mail.com', 'Madrid', '2023-07-01'),
    (12, 'Andrés Vargas', 'andres.vargas@mail.com', 'Sevilla', '2023-07-15'),
    (13, 'Camila Reyes', 'camila.reyes@mail.com', 'Valencia', '2023-08-03'),
    (14, 'Miguel Ángel Soto', 'miguel.soto@mail.com', 'Bilbao', NULL),
    (15, 'Isabel Navarro', 'isabel.navarro@mail.com', 'Madrid', '2023-09-10');

INSERT INTO empleados (id, nombre, puesto, salario, jefe_id) VALUES
    (1, 'Rosa Delgado', 'Gerente General', 4500, NULL),
    (2, 'Tomás Vega', 'Gerente de Ventas', 3200, 1),
    (3, 'Patricia Luna', 'Gerente de Almacén', 3100, 1),
    (4, 'Andrea Paz', 'Vendedor', 1800, 2),
    (5, 'Iván Cruz', 'Vendedor', 1750, 2),
    (6, 'Marta Rojas', 'Vendedor', 1900, 2),
    (7, 'Sergio Peña', 'Almacenista', 1600, 3),
    (8, 'Natalia Ibarra', 'Almacenista', 1650, 3);

INSERT INTO pedidos (id, cliente_id, empleado_id, fecha, estado) VALUES
    (1, 11, 4, '2023-01-15', 'completado'),
    (2, 2, 6, '2023-10-05', 'completado'),
    (3, 4, 6, '2024-02-10', 'completado'),
    (4, 4, 5, '2024-01-20', 'completado'),
    (5, 6, 5, '2023-04-05', 'completado'),
    (6, 10, 5, '2023-01-25', 'pendiente'),
    (7, 9, 5, '2024-03-10', 'cancelado'),
    (8, 13, 5, '2023-02-25', 'completado'),
    (9, 8, 6, '2023-08-25', 'completado'),
    (10, 11, 4, '2023-12-15', 'completado'),
    (11, 4, 6, '2023-07-25', 'completado'),
    (12, 2, 4, '2024-01-10', 'completado'),
    (13, 3, 5, '2023-03-25', 'completado'),
    (14, 4, 4, '2023-11-25', 'pendiente'),
    (15, 3, 6, '2023-04-15', 'pendiente'),
    (16, 10, 5, '2023-12-05', 'completado'),
    (17, 11, 6, '2023-06-25', 'completado'),
    (18, 3, 5, '2023-01-05', 'completado'),
    (19, 10, 4, '2023-04-05', 'completado'),
    (20, 6, 5, '2023-01-15', 'completado'),
    (21, 2, 6, '2023-11-15', 'completado'),
    (22, 3, 5, '2023-12-05', 'cancelado'),
    (23, 8, 6, '2023-10-15', 'completado'),
    (24, 10, 6, '2023-05-25', 'cancelado'),
    (25, 2, 4, '2023-08-05', 'completado'),
    (26, 9, 4, '2024-06-10', 'cancelado'),
    (27, 7, 5, '2023-10-25', 'completado'),
    (28, 12, 5, '2023-03-05', 'completado');

INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario) VALUES
    (1, 1, 8, 1, 18.5),
    (2, 1, 5, 5, 34.99),
    (3, 2, 3, 2, 15.0),
    (4, 3, 23, 5, 21.0),
    (5, 3, 21, 4, 19.99),
    (6, 4, 6, 4, 89.99),
    (7, 5, 4, 1, 55.0),
    (8, 5, 3, 3, 15.0),
    (9, 5, 13, 3, 60.0),
    (10, 6, 13, 1, 60.0),
    (11, 7, 19, 1, 27.0),
    (12, 7, 7, 1, 22.0),
    (13, 7, 23, 2, 21.0),
    (14, 8, 13, 3, 60.0),
    (15, 9, 12, 3, 35.0),
    (16, 9, 7, 1, 22.0),
    (17, 9, 22, 5, 32.0),
    (18, 10, 15, 3, 8.5),
    (19, 10, 13, 5, 60.0),
    (20, 11, 2, 4, 12.5),
    (21, 11, 11, 3, 9.99),
    (22, 12, 21, 4, 19.99),
    (23, 12, 16, 4, 11.0),
    (24, 13, 24, 5, 250.0),
    (25, 13, 19, 4, 27.0),
    (26, 13, 14, 3, 12.0),
    (27, 14, 2, 1, 12.5),
    (28, 15, 13, 4, 60.0),
    (29, 16, 22, 1, 32.0),
    (30, 17, 10, 4, 40.0),
    (31, 18, 18, 3, 2.5),
    (32, 18, 4, 5, 55.0),
    (33, 19, 18, 1, 2.5),
    (34, 19, 18, 5, 2.5),
    (35, 20, 10, 2, 40.0),
    (36, 20, 8, 5, 18.5),
    (37, 20, 2, 1, 12.5),
    (38, 21, 5, 4, 34.99),
    (39, 21, 22, 5, 32.0),
    (40, 22, 7, 2, 22.0),
    (41, 22, 18, 3, 2.5),
    (42, 22, 24, 4, 250.0),
    (43, 22, 23, 3, 21.0),
    (44, 23, 8, 3, 18.5),
    (45, 23, 3, 1, 15.0),
    (46, 24, 1, 1, 29.99),
    (47, 24, 3, 2, 15.0),
    (48, 25, 9, 4, 25.0),
    (49, 25, 22, 2, 32.0),
    (50, 26, 8, 1, 18.5),
    (51, 26, 16, 1, 11.0),
    (52, 26, 14, 4, 12.0),
    (53, 26, 7, 3, 22.0),
    (54, 27, 2, 4, 12.5),
    (55, 28, 7, 4, 22.0),
    (56, 28, 18, 2, 2.5);
