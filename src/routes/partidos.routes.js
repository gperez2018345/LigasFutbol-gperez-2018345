const express = require('express');
const partidosController = require('../controllers/partidos.controller');
const md_autenticacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

var api = express.Router();

api.post('/partidos',[md_autenticacion.Auth, md_roles.verUsuario],partidosController.partidos);

/*api.get('/obtenerPorId/:idEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.ObtenerEmpleadoId);
api.get('/ObtenerEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.ObtenerEmpleados);*/

module.exports =api;