const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var partidoSchema = Schema({
    equipoA:{type:Schema.Types.ObjectId, ref: 'equipos'},
    equipoB:{type:Schema.Types.ObjectId, ref: 'equipos'},
    golesEquipoA: Number,
    golesEquipoB: Number,
    numPartidos: Number,
    jornada: Number
});

module.exports = mongoose.model('partidos', partidoSchema);