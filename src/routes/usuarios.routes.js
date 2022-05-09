const express = require('express');
const usuarioController = require('../controllers/usuarios.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

var api = express.Router();

api.get('/obtenerUsuarios',[md_autentificacion.Auth, md_roles.verAdmin],usuarioController.obtenerUsuarios);
api.get('/obtenerUsuarioId/:idUsuario',[md_autentificacion.Auth,md_roles.verAdmin],usuarioController.obtenerUsuarioId);
api.post('/registrarAdminDef',md_autentificacion.Auth,usuarioController.registrarAdminDefault);
api.post('/registrarAdmin',[md_autentificacion.Auth, md_roles.verAdmin],usuarioController.registrarAdmin);
api.post('/login',usuarioController.login);
api.post('/registrarUsuarioAdmin',[md_autentificacion.Auth, md_roles.verAdmin], usuarioController.registrarUsuarioAdmin);
api.post('/registrarUsuario',usuarioController.registrarUsuarioUsuario);
api.put('/editarAdmin/:id',[md_autentificacion.Auth, md_roles.verAdmin], usuarioController.editarPerfilAdmin);
api.delete('/eliminarAdmin/:id',[md_autentificacion.Auth, md_roles.verAdmin], usuarioController.eliminarPerfilAdmin);
api.put('/editarUsuario/:id',[md_autentificacion.Auth, md_roles.verUsuario], usuarioController.editarPerfilUsuario);
api.delete('/eliminarUsuario/:id',[md_autentificacion.Auth, md_roles.verUsuario], usuarioController.eliminarPerfilUsuario);

module.exports =api;