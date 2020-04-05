const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoría es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El id del usuario es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    }
})


categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
})

module.exports = mongoose.model('Categoria', categoriaSchema);