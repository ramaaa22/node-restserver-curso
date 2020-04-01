require('./config/config');
const express = require('express');
const app = express();

const mongoose = require('mongoose');
//mongoose.set('useCreateIndex', true);
const path = require('path');


const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


//configuracion global de rutas
app.use(require('./routes/index'));

// PARA CONEXIÓN LOCAL!
/*mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) {
            console.log("ERROR AL CONECTAR");
            throw err;
        }
        console.log('BBDD Online');
    });*/

//PARA CONEXIÓN REMOTA
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) {
            console.log("ERROR AL CONECTAR");
            throw err;
        }
        console.log('BBDD Online');
    });



app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto:', 3000);
})