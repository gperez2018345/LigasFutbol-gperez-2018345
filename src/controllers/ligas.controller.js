// importaciones
const express = require('express');
const Usuarios = require('../models/usuarios.model');
const Ligas = require('../models/ligas.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

function obtenerLiga(req,res){

    Ligas.find({idUsuario: req.user.sub},(err,ligaEncontrada)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!ligaEncontrada) return res.status(404).send({mensaje:'Error, no se encontraron empleados'});
        return res.send({ligas: ligaEncontrada});
    })
}

function obtenerLigas(req,res){
    Ligas.find((err, ligasObtenidas) =>{
        if(err) return res.send({mensaje:"Error: "+err})
        return res.send({ligas: ligasObtenidas})
    })
}

function agregarLiga(req, res) {
    var parametros = req.body;
    var ligaModel = new Ligas();

    if (parametros.nombreLiga) {
        ligaModel.nombreLiga = parametros.nombreLiga;
        ligaModel.idUsuario = req.user.sub;
    }else {
        return res.status(500).send({ message: "error" })
    }

    Ligas.find({ nombreLiga: parametros.nombre, idUsuario:req.user.sub},
        (err, ligaGuardada) => {
        if (ligaGuardada.length==0) {
            ligaModel.save((err, ligasGuardadas) => {
                console.log(err)
                if (err) return res.status(500).send({ message: "error en la peticion" });
                if (!ligasGuardadas) return res.status(404).send({ message: "No se puede agregar una liga" });
                return res.status(200).send({ ligas: ligasGuardadas  });
            });
            
        } else {
            return res.status(500).send({ message: 'liga existente' });
        }
    })
}
    
function editarLiga(req,res){
    var idLi = req.params.idLiga; 
    var parametros = req.body; 

    Ligas.findOneAndUpdate({_id:idLi, idUsuario:req.user.sub},parametros,{new:true},
        (err,ligaEditada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!ligaEditada) return res.status(400).send({mensaje: 'No se puede editar la liga'});
        return res.status(200).send({ligas: ligaEditada});
    })
}

function eliminarLiga(req,res){
    var idLi = req.params.idLiga;

    Ligas.findOneAndDelete({_id:idLi, idUsuario:req.user.sub},
        (err,ligaEliminada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!ligaEliminada) return res.status(400).send({mensaje: 'No se puede eliminar la liga'});
        return res.status(200).send({ligas: ligaEliminada});

    })
}

function editarLigaAdmin(req,res){
    var idLi = req.params.idLiga; 
    var parametros = req.body; 

    Ligas.findOneAndUpdate({_id:idLi},parametros,{new:true}, (err,ligaEditada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!ligaEditada) return res.status(400).send({mensaje: 'No se puede editar la liga'});
        return res.status(200).send({ligas: ligaEditada});
    })
}

function eliminarLigaAdmin(req,res){
    var idLi = req.params.idLiga;

    Ligas.findOneAndDelete({_id:idLi},(err,ligaEliminada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!ligaEliminada) return res.status(400).send({mensaje: 'No se puede eliminar la liga'});
        return res.status(200).send({ligas: ligaEliminada});

    })
}


module.exports = {
    agregarLiga,
    editarLiga,
    eliminarLiga,
    obtenerLiga,
    obtenerLigas,
    editarLigaAdmin,
    eliminarLigaAdmin
}