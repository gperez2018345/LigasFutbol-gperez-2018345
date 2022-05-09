const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ligaSchema = Schema({
    nombreLiga: String,
    idUsuario:{type:Schema.Types.ObjectId, ref: 'usuarios'}
});

module.exports = mongoose.model('ligas', ligaSchema);