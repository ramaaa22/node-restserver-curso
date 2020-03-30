const express = require('express');
const bcrypt = require('bcrypt');
const underscore = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
const app = express();


app.get('/usuario', [verificaToken, verificaRol], (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 10;
    desde = Number(desde);
    limite = Number(limite);
    Usuario.find({}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    cantidad: count,
                    usuarios /*:usuarios */
                })
            })

        })

})

app.post('/usuario', [verificaToken, verificaRol], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })


})

app.put('/usuario/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id;
    //let body = req.body;
    let body = underscore.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

/*app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            })
        }


        res.json({
            ok: true,
            usuario: usuarioBorrado 
        });
    });
});*/

app.delete('/usuario/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id;
    console.log(`El usuario es ${id}`);
    let body = req.body;
    body.estado = false;
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                usuario: 'Usuario no encontrado'
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

module.exports = app;