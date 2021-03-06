// IMPORTACIONES
const express = require('express');
const cors = require('cors');

var app = express();


// IMPORTACIONES RUTAS
const UsuarioRutas = require('./src/routes/usuarios.routes');
const LigaRutas = require('./src/routes/ligas.routes');
const EquipoRutas = require('./src/routes/equipos.routes');
const PartidosRutas = require('./src/routes/partidos.routes');


// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

/// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuarioRutas, LigaRutas, EquipoRutas, PartidosRutas);


module.exports = app;
