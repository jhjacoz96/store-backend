const jwt = require('jsonwebtoken');
const { users, rols, Category, Product, Buy, Wish } = require('../models/index');
const Cart = require('../model/cart');
const { randomNumber } = require("../helpers/libs");
const fs = require("fs-extra");
import path from 'path';
const { check, validationResult } = require('express-validator');

const ctrl = {};

ctrl.add = async (req,res) => {

        var {id} = req.body;

        const existe = await Wish.findOne({
            where:{
                userId: req.user.id,
                productId: id
            }
        });

        if(existe){

            return res.status(402).json({
                ok: false,
                menssage: 'Esta aplicación ya se encuentr en su lista de deseos'
            })

        }

        Wish.create({
            userId: req.user.id,
            productId: id
        }).then( product => {
            
            res.status(200).json({
                ok: true,
                menssage: 'Aplicación agregada a la lista de deseo'
            })
    
        }).catch(error=>{
    
            res.status(500).json({
                ok: false,
                menssage: 'Ha ocurrido un error',
                error
            })

        })

    
    
}

ctrl.listWish = async (req,res) => {

        const wish = await Wish.findAll({
            where: {
                userId: req.user.id
            },
            include: [{
                model: Product,
                as: 'Products'
            }]
        })

        if(wish){

            return res.status(200).json({
                ok: true,
                message: 'Lista de deseos consultada',
                wish
            })

        }else{

            return res.status(402).json({
                ok: false,
                message: 'Lista de deseo no encontrada'
            })

        }

} 

ctrl.delete = async (req,res) => {

    try {


        const wish = await Wish.findOne({
            where: {
                userId: req.user.id,
                productId: req.params.id
            }
        })

        await wish.destroy();

        res.status(200).json({
            ok: true,
            message: 'Aplicación eliminada de la lista de deseos',
            wish
        })

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un error',
            error
        })

    }

}

module.exports = ctrl;