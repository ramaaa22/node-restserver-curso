const jwt = require('jsonwebtoken');

//==============
//Verificar token
//==============
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    console.log(`el token es ${token}`);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

//==============
//Verificar role de usuario para creación
//==============
let verificaRol = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

}

module.exports = {
    verificaToken,
    verificaRol
}