// importaciones
const express = require('express');
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

function obtenerUsuarios(req,res){
    Usuarios.find((err, usuariosObtenidos) =>{
        if(err) return res.send({mensaje:"Error: "+err})
        return res.send({usuarios: usuariosObtenidos})
    })
}

function obtenerUsuarioId(req,res){
    var idUs = req.params.idUsuario;

    Usuarios.findById(idUs,(err,usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!usuarioEncontrado) return res.status(404).send({mensaje:'Error, no se encontraron usuarios'});
        return res.send({usuarios: usuarioEncontrado});
    })
}

function registrarAdminDefault(req, res) {
  var usuarioModelo = new Usuarios();

  usuarioModelo.nombre = "ADMIN";
  usuarioModelo.email = "admin@kinal.edu.gt";
  usuarioModelo.rol = "ROL_ADMIN";

  Usuarios.find({ email: "admin@kinal.edu.gt", nombre: "ADMIN" }, (err, usuarioAgregado) => {
    if (usuarioAgregado.length == 0) {
      bcrypt.hash("deportes123", null, null, (err, passwordEncriptada) => {
        usuarioModelo.password = passwordEncriptada;
        usuarioModelo.save((err, usuarioGuardado) => {
          console.log(err);
        });
      });
    } else {
      console.log("Este usuario ya está creado");
    }
  });
}

function registrarAdmin(req, res){
    var parametros = req.body;
    var usuarioModelo = new Usuarios();
  
    if(parametros.nombre, parametros.email, parametros.password){
        usuarioModelo.nombre = parametros.nombre;
        usuarioModelo.email =  parametros.email;
        usuarioModelo.password = parametros.password;
        usuarioModelo.rol = 'ROL_ADMIN';
    }
            Usuarios.find({nombre: parametros.nombre, email: parametros.email, password: parametros.password, rol: parametros.rol}, (err, clienteGuardado)=>{
                if(clienteGuardado.length == 0){
                    bcrypt.hash(parametros.password, null,null, (err, passwordEncriptada)=>{
                        usuarioModelo.password = passwordEncriptada;
                        usuarioModelo.save((err, clienteGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!clienteGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});
  
                            return res.status(201).send({usuarios: clienteGuardado});
                         })
                    })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
        
}

function registrarUsuarioAdmin(req, res){
    var paramentros = req.body;
    var usuariosModel = new Usuarios();

    if(paramentros.nombre, paramentros.email, paramentros.password){
        usuariosModel.nombre = paramentros.nombre;
        usuariosModel.email =  paramentros.email;
        usuariosModel.password = paramentros.password;
        usuariosModel.rol = "ROL_USUARIO";

            Usuarios.find({nombre: paramentros.nombre, email: paramentros.email, password: paramentros.password}, (err, usuarioGuardado)=>{
                if(usuarioGuardado.length == 0){
                    bcrypt.hash(paramentros.password, null,null, (err, passwordEncriptada)=>{
                        usuariosModel.password = passwordEncriptada;
                        usuariosModel.save((err, usuarioGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!usuarioGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});

                            return res.status(201).send({usuarios: usuarioGuardado});
                         })
                    })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
    }
}

function registrarUsuarioUsuario(req, res){
    var paramentros = req.body;
    var usuariosModel = new Usuarios();

    if(paramentros.nombre, paramentros.email, paramentros.password){
        usuariosModel.nombre = paramentros.nombre;
        usuariosModel.email =  paramentros.email;
        usuariosModel.password = paramentros.password;
        usuariosModel.rol = 'ROL_USUARIO';

            Usuarios.find({nombre: paramentros.nombre, email: paramentros.email, password: paramentros.password}, (err, clienteGuardado)=>{
                if(clienteGuardado.length == 0){
                    bcrypt.hash(paramentros.password, null,null, (err, passwordEncriptada)=>{
                        usuariosModel.password = passwordEncriptada;
                        usuariosModel.save((err, clienteGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!clienteGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});

                            return res.status(201).send({usuarios: clienteGuardado});
                         })
                    })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
    }
}

function login(req, res) {
    var parametros = req.body;

    Usuarios.findOne({ nombre: parametros.nombre }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ message: "error en la peticion" });
        if (usuarioEncontrado) {

            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, verificacionPassword) => {
                if (verificacionPassword) {

                    if (parametros.obtenerToken === 'true') {
                        return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuario: usuarioEncontrado })
                    }


                } else {
                    return res.status(500).send({ mensaje: 'las contraseñas no coinciden' });
                }
            })

        } else {
            return res.status(404).send({ message: "Error, usuario no registrado" })
        }
    })
}

function editarPerfilUsuario(req,res){
    var idUs = req.params.id;
    var parametros = req.body;

    if ( idUs !== req.user.sub ) 
    return res.status(500).send({ mensaje: 'id de perfil inválido'});

    Usuarios.findByIdAndUpdate({ _id: idUs },parametros,{ new:true },(err, perfilEditado) => {

        if(err) return res.status(500).send({mensaje:'error en la peticion'});
        if(!perfilEditado) return res.status(404).send({mensaje:'No se pudo editar el perfil'});

        return res.status(500).send({ usuario: perfilEditado});
    })
}

function eliminarPerfilUsuario(req,res){
    var idUs = req.params.id;
    var parametros = req.body;

    if ( idUs !== req.user.sub ) 
    return res.status(500).send({ mensaje: 'id de perfil inválido'});

    Usuarios.findByIdAndDelete({ _id: idUs }, parametros, (err, perfilEliminado) => {
        
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!perfilEliminado) return res.status(404).send({mensaje:'No se pudo eliminar el perfil'});

        return res.status(500).send({ usuario: perfilEliminado});

    });

}

function editarPerfilAdmin(req, res) {
    var idUs = req.params.id;
    var parametros = req.body;

        Usuarios.findById(idUs, (err, usuarioReg) => {
            if (usuarioReg.rol == "ROL_ADMIN") {
                return res.status(500).send({ mensaje: 'No se puede editar' });
            } else {
                Usuarios.findByIdAndUpdate( { _id: idUs }, parametros, (err, usuarioEditado) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                    if (!usuarioEditado) return res.status(400).send({ mensaje: 'no se pudo editar el cliente' });
                    return res.status(200).send({ usuarios: usuarioEditado });
                })
            }
        })
}

function eliminarPerfilAdmin(req, res) {
    var idUs = req.params.id;
    var parametros = req.body;

        Usuarios.findById(idUs, (err, usuarioReg) => {
            if (usuarioReg.rol == "ROL_ADMIN") {
                return res.status(500).send({ mensaje: 'No se puede eliminar' });
            } else {
                Usuarios.findByIdAndDelete( { _id: idUs }, parametros, (err, usuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                    if (!usuarioEliminado) return res.status(400).send({ mensaje: 'no se pudo eliminar el cliente' });
                    return res.status(200).send({ usuarios: usuarioEliminado });
                })
            }
        })
}



module.exports = {
    registrarAdminDefault,
    registrarAdmin,
    registrarUsuarioAdmin,
    registrarUsuarioUsuario,
    login,
    editarPerfilUsuario,
    eliminarPerfilUsuario,
    editarPerfilAdmin,
    eliminarPerfilAdmin,
    obtenerUsuarios,
    obtenerUsuarioId
}