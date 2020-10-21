const jwt = require('jsonwebtoken');
const { users, rols, Category, Product, Buy } = require('../models/index');
const Cart = require('../model/cart');
const { randomNumber } = require("../helpers/libs");
const fs = require("fs-extra");
import path from 'path';
const { check, validationResult } = require('express-validator');

const ctrl = {};

ctrl.buy = (req,res) => {

    try {

        if (req.session.cart) {

            var cart = new Cart(req.session.cart);

            const products = cart.generateArray();

            Buy.create({

                price: cart.totalPrice,
                userId: req.user.id

            }).then( async buy =>{

                for(var prod in products){

                    const product = [];
                    product = await Product.findByPk(products[prod].item.id);

                    if (product) {

                        await  buy.addProduct(product);

                    }else{

                        return res.status(402).json({
                            ok: false,
                            message: 'el producto no ha sido encontrado'
                        })

                    }

                }

                req.session.cart = null;

                return res.status(200).json({
                    ok: true,
                    message: 'Su compra ha sido realizada con exito'
                })

            }).catch(error => {

                return res.status(500).json({
                    ok: false,
                    menssage: "Ha ocurrido un error",
                    error
                })

            });  

        }else{

            return res.status(402).json({ 
                ok: false,
                menssage: "No posee productos en su carrito",
            })

        }

    } catch (error) {

        return res.status(500).json({ 
            ok: false,
            menssage: "Ha ocurrido un error",
            error
        })
        
    }

}

ctrl.listBuy = async (req,res) => {

    try {

        const buys = await Buy.findAll({

            where: {
                 userId: req.user.id 
            },
            include:[{
                model: Product,
                as: 'products'
            }]
        });
    
        return res.status(200).json({
            ok: true,
            message: 'Compras consultadas',
            buys
        })
        
    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un erro',
            error
        })

    }
    


}

module.exports = ctrl;