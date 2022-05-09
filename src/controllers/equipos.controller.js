const express = require('express');
const Usuarios = require('../models/usuarios.model');
const Ligas = require('../models/ligas.model');
const Equipos = require('../models/equipos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');
const console = require('console');

function obtenerEquiposPorLiga(req, res){
    var idLigas = req.params.idLigas;

    
        Ligas.findById({_id:idLigas},(err, ligaEncontrada)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion de ligas"});
            if(!ligaEncontrada) return res.status(404).send({mensaje : "Error, no se encuentran ligas"});
        
            //console.log(ligaEncontrada);

            Equipos.find({idLigas: torneoEncontrado._id, idUsuario:req.user.sub}, (err, equiposEncontrados)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion de equipos"});
                if(!equiposEncontrados) return res.status(404).send({mensaje : "Error, no se encuentran equipos"});

                //console.log(equiposEncontrados);

                return res.status(200).send({equipos : equiposEncontrados});
            }).populate('idLigas')
        })
}

function tablaDeLiga(req,res){
    var idLiga = req.params.idLiga;

    Ligas.findOne({_id:idLiga},(err, LigaEncontrada)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
        if(!LigaEncontrada) return res.status(404).send({mensaje : "Error, no se encuentran categorias con ese id"});

        Equipos.find({idLiga: LigaEncontrada._id, idUsuario:req.user.sub},(err,busqueda)=>{
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!busqueda) return res.status(500).send({ mensaje: 'Error al encontrar el equipo' });

                const fs = require('fs');
                const Pdfmake = require('pdfmake');
            
                var fonts = {
                    Roboto: {
                        normal: './fonts/Roboto-Regular.ttf',
                        bold: './fonts//Roboto-Medium.ttf',
                        italics: './fonts//Roboto-Italic.ttf',
                        bolditalics: './fonts/Roboto-MediumItalic.ttf'
                    }
                };
            
                let pdfmake = new Pdfmake(fonts);
            
                let content = [{
                    text:'Reporte de la liga: '+LigaEncontrada.nombreLiga,
                    alignment: 'center',
                    fontSize: 20,
                    color: '#000000',
                    bold: true,
                    margin: [0, 0, 0, 0]
                }]
            
                var titulos = new Array('Puesto', 'Equipo', 'Partidos jugados', 'Puntos', 'Goles a favor', 'Goles en contra', 'Diferencia de goles');
            
                var body = []
            
                body.push(titulos)
            
                for (let i = 0; i < busqueda.length; i++) {
                    var datosEquipos = new Array((i + 1), busqueda[i].nombreEquipo, busqueda[i].numPartidos, busqueda[i].puntos,  busqueda[i].golesAFavor, busqueda[i].golesEnContra, busqueda[i].diferenciaDeGoles)
                    body.push(datosEquipos)
                }
            
                content.push({
                    text: ' ',
                    margin: [0, 0, 0, 10]
                })
            
            
                content.push({
            
                    table: {
                        heights: 60,
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*', '*', '*'],
                        body: body
                    },
                    margin: [0, 0, 0, 10]
                })
            
            
                let documento = {
                    content: content,
                    pageSize: {
                        width: 595.28,
                        height: 841.89
                    },
                    background: function () {
                        return {
                            canvas: [
                                {
                                    type: 'rect',
                                    x: 40, y: 88, w: 75, h: 715,
                                    color: '#8CF56F'
                                }
                            ]
                        };
                    },
                    
                }
                let pdfDoc = pdfmake.createPdfKitDocument(documento, {});
            
                pdfDoc.pipe(fs.createWriteStream("./makePDF.pdf"));
                pdfDoc.end();

                return res.status(200).send({ mensaje:'pdf generado'});

        }).sort({
            puntos:-1
        })

    })

}


function agregarEquipo(req, res){
    var parametros = req.body;
    var equiposModel = new Equipos();

    if({nombreEquipo:parametros.nombreEquipo, golesAFavor:parametros.golesAFavor, golesEnContra:parametros.golesEnContra,
        diferenciaDeGoles:parametros.diferenciaDeGoles,numPartidos: parametros.numPartidos,puntos:parametros.puntos}){

            equiposModel.nombreEquipo = parametros.nombreEquipo;
            equiposModel.golesAFavor = 0;
            equiposModel.golesEnContra = 0;
            equiposModel.diferenciaDeGoles = 0;
            equiposModel.numPartidos = 0;
            equiposModel.puntos = 0;
            
            equiposModel.idUsuario = req.user.sub;
            equiposModel.idLigas = parametros.idLigas;

         Equipos.find({nombreEquipo: parametros.nombreEquipo, idLigas: parametros.idLigas, idUsuario: req.user.sub}, 
            (err, equipoGuardado)=>{
                Equipos.find({idLigas:parametros.idLigas},(err,equipoGuardadoCantidad)=>{
                if(equipoGuardadoCantidad.length >= 10){
                    return res.status(500).send({mensaje:'No se puede agregar mas de diez equipos por liga'})
                }else{    
                if(equipoGuardado.length == 0){
                    equiposModel.save((err, equipoGuardado)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                        if(!equipoGuardado) return res.status(404).send({mensaje: 'El equipo no se agrego'});
                        return res.status(201).send({equipos: equipoGuardado});
                     })
                } else {
                    return res.status(500).send({ message: 'Este equipo ya existe' });
                }
            }
        })
            })

    }else{
        return res.status(500).send({ mensaje: "Error al agregar" });
     }
}
    
function editarEquipo(req,res){
    var idEq = req.params.idEquipo; 
    var parametros = req.body;

    Equipos.findOneAndUpdate({_id:idEq, idUsuario:req.user.sub},parametros,{new:true},
        (err,equipoEditado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!equipoEditado) return res.status(400).send({mensaje: 'No se puede editar el equipo'});
        return res.status(200).send({equipos: equipoEditado});
    })
}

function eliminarEquipo(req,res){
    var idEq = req.params.idEquipo;

    Equipos.findOneAndDelete({_id:idEq, idUsuario:req.user.sub},
        (err,equipoEliminado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!equipoEliminado) return res.status(400).send({mensaje: 'No se puede eliminar el equipo'});
        return res.status(200).send({equipos: equipoEliminado});

    })
}



module.exports ={
    agregarEquipo,
    editarEquipo,
    eliminarEquipo,
    obtenerEquiposPorLiga,
    tablaDeLiga
}