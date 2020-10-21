const {users} = require('../models/index');

module.exports = {

    isBuyer  (req,res,next) {
        console.log(req.user.rols.name);
        if(req.user.rols.id === 1){
            next();
        }else{
            return res.status(403).json({
                ok: false,
                message: 'No posee los permisos para esta funcionalidad'
            })
        }

    },

    isDeveloper  (req,res,next) {

        if(req.user.rols.id === 2){
            next();
        }else{
            return res.status(403).json({
                ok: false,
                message: 'No posee los permisos para esta funcionalidad',
                
            })
        }

    }

}