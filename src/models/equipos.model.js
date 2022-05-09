const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var equipoSchema = Schema({
    nombreEquipo: String,
    golesAFavor: Number,
    golesEnContra: Number, 
    diferenciaDeGoles: Number,
    numPartidos: Number,
    puntos: Number,
    idUsuario:{type:Schema.Types.ObjectId, ref: 'usuarios'},
    idLigas: {type:Schema.Types.ObjectId, ref: 'ligas'}
});

module.exports = mongoose.model('equipos', equipoSchema);