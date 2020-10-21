const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const {users} = require('../models/index');

module.exports = ( req, res, next) => {

    if(!req.headers.authorization) {
        return res.status(401).json({
            ok: false,
            message: 'Acceso no autorizado'
        })
    }else{

        let token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, authConfig.secret, (err, decoded) => {

            if(decoded){

                users.findByPk(decoded.user.id, { include: "rols" } ).then(user => {

                    req.user = user;
                    next();

                })

            }else{

                return res.status(500).json({
                    ok: false,
                    message: "Ha ocurrido un error al decoficar el token",
                    err
                })

            }

        })

    }

}