const express = require('express');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
const underscore = require('underscore');

const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

const app = express();

//Mostrar todas las categorías
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('nombre')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    cantidad: count,
                    categorias
                })
            })

        })


});

//Mostrar una categoría por id
app.get('/categoria/:id', [verificaToken, verificaRol], (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No es posible encontrar la categoria'
                }
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })


});

//Crear una nueva categoria
app.post('/categoria', [verificaToken, verificaRol], (req, res) => {
    //regresa la categoria creada
    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })


});

//Actualiza una categoria
app.put('/categoria/:id', [verificaToken, verificaRol], (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let nuevoNombreCategoria = {
        nombre: body.nombre
    };
    console.log(`el nuevo nombre de categoria es ${nuevoNombreCategoria.nombre}`);
    Categoria.findByIdAndUpdate(id, nuevoNombreCategoria, { new: true, runValidators: true, context: 'query', useFindAndModify: false }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//Elimina una categoria
app.delete('/categoria/:id', [verificaToken, verificaRol], (req, res) => {
    //solo la puede borrar un admin
    //la eliminacion es logica

    let id = req.params.id;
    console.log(`La categoría es ${id}`);
    let body = req.body;
    body.estado = false;
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                usuario: 'Categoría no encontrada'
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});

module.exports = app;