const express = require('express');
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();



//Obtener todos los productos
//traer todos los prod, populate: usuario categoria
//paginado
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 2;
    desde = Number(desde);
    hasta = Number(hasta);
    Producto.find({})
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Producto.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    cantidad: count,
                    productos
                })
            })

        })

})


//Obtener un producto por id
//traer el producto, populate: usuario categoria
//paginado


app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.find({ _id: id })
        .populate('usuario')
        .populate('categoria')
        //.where('_id').equals(id)
        //Tambien es valido lo de arriba!
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productoDB
            })
        })
})


//Buscar productos

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    //lo de arriba es una expresión regular, la i es para 
    //que no distinga mayus de minusculas
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productosDB
            })
        })
})





//Crear un producto
//grabar el usuario, grabar la categoria
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })


})


//Actualizar un producto
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query', useFindAndModify: false }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })

})


//Borrar un producto

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    body.disponible = false;
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                usuario: 'Producto no encontrado'
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })

})




module.exports = app;