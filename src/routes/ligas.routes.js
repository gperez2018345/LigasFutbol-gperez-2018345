const express = require('express');
const ligaController = require('../controllers/ligas.controller');
const md_autenticacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

var api = express.Router();

api.get('/obtenerLiga',[md_autenticacion.Auth, md_roles.verUsuario],ligaController.obtenerLiga);
api.get('/obtenerLigas',[md_autenticacion.Auth, md_roles.verAdmin],ligaController.obtenerLigas);
api.post('/agregarLiga',[md_autenticacion.Auth, md_roles.verUsuario],ligaController.agregarLiga);
api.put('/editarLiga/:idLiga',[md_autenticacion.Auth, md_roles.verUsuario],ligaController.editarLiga);
api.delete('/eliminarLiga/:idLiga',[md_autenticacion.Auth, md_roles.verUsuario],ligaController.eliminarLiga);
api.put('/editarLigaAdmin/:idLiga',[md_autenticacion.Auth, md_roles.verAdmin],ligaController.editarLigaAdmin);
api.delete('/eliminarLigaAdmin/:idLiga',[md_autenticacion.Auth, md_roles.verAdmin],ligaController.eliminarLigaAdmin);



module.exports =api;