import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
const Sequelizee = require('sequelize');
import path from 'path';
import multer from 'multer';
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const {sequelize, rols} = require('../models/index');

import routes from '../routes/index';

module.exports = app => { 

    app.use(morgan('dev'));
    app.use(cors());

    /*const storage =  multer.diskStorage({
        destination:  path.join(__dirname, 'public/uploads'),
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })

    app.use(multer({
         storage,
        dest: path.join(__dirname, 'public/uploads'),
        fileFilter: (req, file, cb) => {
            const filetypes = /jpeg|jpg|png/;
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(path.extname(file.originalname));
            if( mimetype &&  extname ){
                return cb(null, true);
            }
            cb("El archivo debe ser tipo imagen");
        }
    }).single('image'));*/

    app.use(multer({
       dest: path.join(__dirname, '../public/uploads')
    }).single('image'));
 
    app.use(express.urlencoded({
        extended:false,
        useUnifiedTopology: true
    }));

    app.use(json());
    
      // configurar session

      var Session = sequelize.define('Sessions', {
        sid: {
          type: Sequelizee.STRING,
          primaryKey: true
        },
        expires: Sequelizee.DATE,
        data: Sequelizee.STRING
      });

    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1); 

    app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false, 
        proxy: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 180 * 60 * 1000,
        },
        store: new SequelizeStore({
            db: sequelize,
            table: 'Sessions',
        })
    })
    );

    rols.count().then(c =>{
        if (c <= 0) {
            rols.bulkCreate([
                {name: 'Compreador'},
                {name: 'Desarrollador'}
            ]).then(rols => console.log(rols))
            .catch(error => console.log(error))
        }else{
            console.log(`Hay ${c} roles disponibles`)
        }
    }).catch(error => console.log(error))

    routes(app);

    app.use(express.static(path.join(__dirname, '../public')));

    return app;
}