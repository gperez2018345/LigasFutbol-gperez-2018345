const express = require('express');
const equipoController = require('../controllers/equipos.controller');
const md_autenticacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

var api = express.Router();

api.post('/agregarEquipo',[md_autenticacion.Auth, md_roles.verUsuario],equipoController.agregarEquipo);
api.get('/obtenerEquiposLiga/:idLigas',[md_autenticacion.Auth, md_roles.verUsuario],equipoController.obtenerEquiposPorLiga);
api.put('/editarEquipo/:idEquipo',[md_autenticacion.Auth, md_roles.verUsuario],equipoController.editarEquipo);
api.delete('/eliminarEquipo/:idEquipo',[md_autenticacion.Auth, md_roles.verUsuario],equipoController.eliminarEquipo);
api.get('/pdf/:idLiga',[md_autenticacion.Auth, md_roles.verUsuario],equipoController.tablaDeLiga);


module.exports =api;