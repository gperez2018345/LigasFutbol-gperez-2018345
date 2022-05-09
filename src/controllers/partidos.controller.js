const express = require('express');
const Usuarios = require('../models/usuarios.model');
const Partidos = require('../models/partidos.model');
const Equipos = require('../models/equipos.model');
const Ligas = require('../models/ligas.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

function partidos (req, res) {

    var partidosModel = new Partidos();
    var jornadaUnica;
    var partidoUnico;
    var puntos1;
    var puntos2;
    var parametros  = req.body;

    if(parametros.equipoA,parametros.equipoB,parametros.golesEquipoA, parametros.golesEquipoB, parametros.jornada){

        partidosModel.equipoA = parametros.equipoA;
        partidosModel.equipoB = parametros.equipoB;
        partidosModel.golesEquipoA = parametros.golesEquipoA;
        partidosModel.golesEquipoB = parametros.golesEquipoB;
        partidosModel.jornada = parametros.jornada;
    }
        Partidos.findOne({equipoA: parametros.equipoA, equipoB: parametros.equipoB, jornada: parametros.jornada},(err, partidoGuardado)=>{
            if (err) return res.status(500).send({ message: "error en la peticion de partidos" });
            if(partidoGuardado<=0){

            Equipos.find((err, equiposEncontrados)=>{
                if(equiposEncontrados.length %2 == 0){
                    partidoUnico = equiposEncontrados.length /2;
                    jornadaUnica = (equiposEncontrados.length -1)
                }else{
                    partidoUnico = (equiposEncontrados.length -1)/2
                    jornadaUnica = equiposEncontrados.length 
                }
                
                Partidos.findOne({jornada: parametros.jornada},(err, jornadaJugada)=>{

                    if(parametros.jornada <= jornadaUnica){
                        if (err) return res.status(500).send({ message: "error en la peticion de partidos" });
    
                        partidosModel.save((err, partidoG)=>{
    
                            if(parametros.golesEquipoA>parametros.golesEquipoB){
                                puntos1 = 3;
                                puntos2 = 0;
    
                            }else if(parametros.golesEquipoB > parametros.golesEquipoA){
                                puntos1 = 0;
                                puntos2 = 3;
                            }else{
                                puntos1 = 1;
                                puntos2 = 1;
                            }
                            Equipos.findOneAndUpdate({ _id: parametros.equipoA }, { $inc: { golesAFavor: parametros.golesEquipoA, golesEnContra: parametros.golesEquipoB, numPartidos: 1, diferenciaDeGoles:parametros.golesEquipoA-parametros.golesEquipoB, puntos:puntos1}},(err,golesfavor1)=>{
    
                                if (err) return res.status(500).send({ message: "error en la peticion equipo1" });
                                
                                Equipos.findOneAndUpdate({ _id: parametros.equipoB }, { $inc: { golesAFavor: parametros.golesEquipoB, golesEnContra: parametros.golesEquipoA, numPartidos: 1,diferenciaDeGoles:parametros.golesEquipoB-parametros.golesEquipoA, puntos:puntos2}},(err,golesfavor2)=>{
    
                                    if (err) return res.status(500).send({ message: "error en la peticion de equipo2" });
                                })
                            })
    
                            return res.status(200).send({ partidos:partidoG});
                        })
    
                    } else {
                        return res.status(500).send({ message: 'La jornada es mayor a la cantidad de partidos' });
                    }
                }) 

            })

            } else {
                return res.status(500).send({ message: 'Partido jugado en esta jornada' });
            }
            
        })

}

module.exports ={
    partidos
}