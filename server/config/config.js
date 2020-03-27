//=========
//Puerto
//=========
process.env.PORT = process.env.PORT || 3000;

//conexion local
//localhost:27017/cafe


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