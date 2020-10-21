const jwt = require('jsonwebtoken');
const { users, rols } = require('../models/index');
const authConfig = require('../../config/auth');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { validateEmail } = require("../helpers/validator");

 const ctrl = {};

ctrl.signIn = async (req, res) => {

    await check('username').trim()
    .notEmpty().withMessage('El username es obligatorio')
    .run(req)

    await check(`password`).notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener un mínimo de 8 caracteres')
    .run(req)

    const errors = validationResult(req) 

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
            ok: false,
            message: 'Ha ocurrido un error'
        });
    }

    const { username, password } = req.body;

    try {

        const user = await users.findOne({
            where: {
                username
            },
            include: "rols"
        }
        );

        if(user){

            if( await bcrypt.compareSync(password, user.password)){
              
                let token = jwt.sign(
                    { user: user }, 
                    authConfig.secret, {
                        expiresIn: authConfig.expires
                });
                
                res.status(200).json({
                    ok: true,
                    message: "Usuario autenticado",
                    token,
                    user
                });

            }else{

                res.status(401).json({
                    ok: false,
                    message: "Las credenciales no coinciden"
                });

            }

        }else{

            res.status(401).json({
                ok: false,
                message: "Las credenciales no coinciden"
            });

        }

    } catch (err) {

        res.status(500).json({
            ok: false,
            message: "Ha ocurrido un error",
            err
        });

    }

}

ctrl.signUp = async (req, res) => {
    await check(`password`).notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener un mínimo de 8 caracteres')
    .run(req)

    await check('rolId').notEmpty().withMessage('El rol es obligatorio')
    .isInt().withMessage('El rol debe ser un valor entero')
    .run(req)

    await check('username').trim().notEmpty().withMessage('El username es obligatorio')
    .custom(async (username) => { 
        const existingUser = 
            await users.findOne({
                where: {
                    username
                }
            });

        if (existingUser) { 
            throw new Error('Este username ya esta siendo usado') 
        } 
    }).run(req)

    await check('email').trim().normalizeEmail().isEmail().withMessage('El email no es válido') 
    .custom(async (email) => { 
        const existingUser =  
            await users.findOne({
                where: {
                    email
                }
            });

        if (existingUser) { 
            throw new Error('Este email ya esta siendo usado') 
        } 
    }).run(req)

    const errors = validationResult(req) 

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
            ok: false,
            message: 'Ha ocurrido un error'
        });
    }

    const { username, email, password, rolId } = req.body;

    try {

        let passwordd = bcrypt.hashSync(password, Number.parseInt(authConfig.rounds))

        const user = await users.create({
            username,
            email,
            password: passwordd,
            rolId
        });

        if(user){
            let token = jwt.sign(
                { user }, 
                authConfig.secret, {
                    expiresIn: authConfig.expires
            });

            const rol = await rols.findByPk(user.rolId);
            res.status(200).json({
                ok: true,
                message: "Registro realizado con éxito",
                token,
                user,
                rol
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Ha ocurrido un error",
            error
        });
    }

}

module.exports = ctrl;