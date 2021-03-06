const jwt = require('jsonwebtoken');
const { users, rols, Category, Product, Buy } = require('../models/index');
const Cart = require('../model/cart');
const { randomNumber } = require("../helpers/libs");
const fs = require("fs-extra");
import path from 'path';
const { check, validationResult } = require('express-validator');

const ctrl = {};

ctrl.buy = (req,res) => {
    const { cart, price } = req.body;

        // if (req.session.cart) {

            // var cart = new Cart(req.session.cart);

            // const products = cart.generateArray();

            /*Buy.findAll({
                where: {
                    userId: req.user.id
                },
                include: [{
                    model: Product,
                    as: 'products'
                }]
            }).then(buys => {
                var res = buys.some(buy => {
                    var res1 = buy.products.some(product => {
                        var res2 = cart.some(cart => {
                            if (cart.id === product.id) {
                                var prod = product
                                return cart.id === product.id
                            }
                        })
                        return res2
                    })
                    return res1
                })
                console.log(prod)
            })*/

            Buy.create({
                price,
                // price: cart.totalPrice,
                userId: req.user.id

            }).then(async buy =>{
                for(var prod in cart){

                    const product = await Product.findByPk(cart[prod].id);
                    if (product) {

                        await  buy.addProduct(product, {
                            through: {
                                price: Number(product.price)
                            }
                        })

                    }else{

                        return res.status(402).json({
                            ok: false,
                            message: 'el producto no ha sido encontrado',
                        })

                    }

                }

                return res.status(200).json({
                    ok: true,
                    message: 'Su compra ha sido realizada con ??xito'
                })

                // req.session.cart = null;

            }).catch(error => {

                return res.status(500).json({
                    ok: false,
                    message: "Ha ocurrido un error",
                    error,
                })

            });

        /* }else{

            return res.status(402).json({ 
                ok: false,
                menssage: "No posee productos en su carrito",
            })

        } */

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