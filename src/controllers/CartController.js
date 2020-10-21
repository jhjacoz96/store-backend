const jwt = require('jsonwebtoken');
const { users, rols, Category, Product, Buy } = require('../models/index');
const Cart = require('../model/cart');
const { randomNumber } = require("../helpers/libs");
const fs = require("fs-extra");
import path from 'path';
const { check, validationResult } = require('express-validator');

const ctrl = {};

ctrl.deleteCart = (req,res) => {
    
    try {
        
        if(req.session.cart){

            var cart = new Cart(req.session.cart);

            cart.deleteProduct(req.params.id);

            req.session.cart = cart;

                res.status(200).json({
                    ok: true,
                    message: 'Se ha eliminado la aplicación de su carrito',
                    product: cart.generateArray(),
                    totalPrice: cart.totalPrice,
                    totalQty: cart.totalQty
                });

        }else{

            res.status(402).json({
                ok: false,
                message: 'No hay carrito disponible'
            });

        }

    } catch (error) {
          
        res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un erro',
            error
        });
        
    }

}

ctrl.add = async (req,res) => {

    var {id} = req.body;

    try{

        if (req.session.cart) { 

            const items = req.session.cart.items;

            var arr = [];

            for (var idd in items) {
                arr.push(items[idd]);
            }

            const item = arr.filter( items => {

                var i = parseInt(items.item.id)
                var j = parseInt(id)
                return i == j

            })



            if (item.length>0) {

                return res.status(402).json({
                    ok: false,
                    message: 'Usted ya ha agregado esta aplicación a su carrito',
                    product: item
                })

            }

         }

        const prod = await Product.findByPk(id);

        if(prod.userId === req.user.id){
            return res.status(403).json({
                ok: false,
                message: 'No pude comprar una aplicación agregada por usted'
            })
        }

        var cart = new Cart(req.session.cart ? req.session.cart : {});

        Product.findByPk(id).then(product => {

            cart.add(product, product.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            return res.status(200).json({
                ok: true,
                message: 'Item agregado',
                cart
            })

        }).catch(error =>{

            return res.status(500).json({
                ok: false,
                message: 'Ha ocurrido un error',
                error
            })

        })

    } catch (error) {
          
        res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un erro',
            error
        });
        
    }
  

}

ctrl.list = async (req,res) => {

    //req.session.destroy();

    try {

        if(!req.session.cart) {

            return res.status(200).json({
                ok:true,
                message: 'Este usuario no posee un carrito activo',
                product: null
            });

        }else{

            var cart = new Cart(req.session.cart);

            return res.status(200).json({
                ok: true,
                message: 'Carrito generado',
                product: cart.generateArray(),
                totalPrice: cart.totalPrice
            });

        }
        
    } catch (error) {

        return res.status(500).json({
            ok:false,
            message: 'Ha ocurrido un erro',
            error
        });
        
    }

}

module.exports = ctrl;