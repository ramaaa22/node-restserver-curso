//=========
//Puerto
//=========
process.env.PORT = process.env.PORT || 3000;

//conexion local
//localhost:27017/cafe


//====================
//Vencimiento del Token
//====================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//====================
//Seed o semilla
//====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//conexion remota
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //urlDB = 'mongodb+srv://ramaaa22:1347112@cluster0-fkfhn.mongodb.net/cafe?retryWrites=true&w=majority'
    urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;

//====================
//GOOGLE CLIENT ID
//====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '985996345091-pu0124gt9e21rp15l4mri6qjcmph9k7q.apps.googleusercontent.com';