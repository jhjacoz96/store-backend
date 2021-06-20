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

        const wish = await Wish.findOne({
            where:{
                userId: req.user.id,
                productId: id,
            },
            include: [{
                model: Product,
                as: 'Products',
            }],
        });

        if(wish){
            await wish.destroy();
            return res.status(200).json({
                ok: true,
                message: 'Aplicacion removida de la lista de deseos',
                wish,
            })

        } else {
            let arg = {
                userId: req.user.id,
                productId: id
            }
            Wish.create(arg, {
                include: [{
                    model: Product,
                    as: 'Products',
                }]
            }).then(async wishh => {

                const wish = await Wish.findByPk(wishh.id, {
                    include: [{
                        model: Product,
                        as: 'Products',
                    }]
                })
                
                res.status(200).json({
                    ok: true,
                    message: 'Aplicación agregada a la lista de deseo',
                    wish,
                })
        
            }).catch(error=>{
        
                res.status(500).json({
                    ok: false,
                    message: 'Ha ocurrido un error',
                    error
                })

            })

        }

}

ctrl.listWish = async (req,res) => {

    try {

        const listWish = await Wish.findAll({
            where: {
                userId: req.user.id
            },
            include: [{
                model: Product,
                as: 'Products',
                include: [{
                    model: Category,
                    as: 'categories'
                }]
            }]
        })

        if(listWish){
            console.log(listWish)
            return res.status(200).json({
                ok: true,
                message: 'Lista de deseos consultada',
                listWish,
            })

        }else{

            return res.status(402).json({
                ok: false,
                message: 'Lista de deseo no encontrada'
            })

        }

    } catch (error) {

        return res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un error',
            error,
        })

    }

} 

ctrl.delete = async (req,res) => {

    try {

        const wish = await Wish.findByPk(req.params.id)

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