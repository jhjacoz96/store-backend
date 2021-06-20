const jwt = require('jsonwebtoken');
const { users, rols, Category, Product, Buy } = require('../models/index');
const Cart = require('../model/cart');
const { randomNumber } = require("../helpers/libs");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
import {paginate, getPagination, getPagingData} from '../helpers/paginate';
const fs = require("fs-extra");
const slugify = require('slugify');
import path from 'path';
const { check, validationResult } = require('express-validator');

const ctrl = {};

ctrl.create = async (req, res) => {
    
    await check('name').notEmpty().withMessage('El nombre es obligatorio').run(req);

    await check('price').notEmpty().withMessage('El precio es obligatorio')
    .isDecimal().withMessage('El precio es un dato numérico').run(req);

    await check('description').notEmpty().withMessage('La descripción es obligatoria').run(req);

    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
            ok: false,
            message: `${errors.array()[0].msg}`
        });
    }

    const { name, price, description, categoryId } = req.body;

    try {
        
        if(req.file == null){

            return res.status(402).json({
                mensaje: "Debe insertar una imagen",
                ok: false
            });

        }else{

            const imagenes = req.file;
            const guardarImagen = async () => {

                const imgUrl = randomNumber();
                const imagen = await Product.findOne({
                    where: {
                        image : imgUrl
                    }
                });

                if (imagen) {
                    guardarImagen();
                } else {
                    const imageTempPath = imagenes['path'];
                    const ext = path.extname(imagenes.originalname).toLowerCase();
                    const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`);
                    
                    if (
                        ext === ".png" ||
                        ext === ".jpg" ||
                        ext === ".jpeg"||
                        ext === ".git"
                    ) {

                        await fs.rename(imageTempPath, targetPath);

                        const category = await Category.findByPk(categoryId);
            
                        if(category){

                            var slug = slugify(name, {
                                replacement: '_',
                                lower: true
                            })

                            Product.create({
                                name,
                                price,
                                image: imgUrl + ext,
                                description,
                                categoryId,
                                userId: req.user.id,
                                slug
                            }).then(product =>{

                                return res.status(200).json({
                                    ok: true,
                                    message: 'La aplicación se ha agregado con exito',
                                    product
                                });

                            }).catch(error => {
                                return res.status(500).json({ ok: false, mensaje: "Ha ocurrido un error",
                            error });
                            })
            
                        }else{
            
                            return res.status(404).json({
                                ok: false,
                                message: 'La categoria no se encuetra disponible'
                            });
            
                        }

                    }else{

                        await fs.unlink(imageTempPath);
                        return res.status(500).json({ ok: false, mensaje: "error solo imagenes" });

                    }
                }
            }
            guardarImagen();       
        }

    } catch (error) {

        return res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un error',
            error
        });

    }
    
}

ctrl.meApp = async (req, res) => {

    var userId = req.user.id;
        
        const product = await Product.findAll({
            where:{
                userId: userId
            },
            include: [{
                model: Category,
                as: 'categories'
            }]
        })

        if(product){

            return res.status(200).json({
                ok: true,
                message: 'Aplicaciones encontradas',
                product
            })

        }else{

            return res.status(404).json({
                ok: false,
                message: 'No hay aplicaciones disponibles'
            })

        }

}

ctrl.search = async (req, res) => {
    var { search } = req.query
        search = search.toLowerCase()
        console.log(search)
        const products = await Product.findAll({
            where: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('name')), 
                {
                  [Op.like]: `%${search}%`
                }
            )
        })
        if (products.length) {
            return res.status(200).json({
                ok: true,
                message: 'Aplicacioness encontradas',
                products,
            })
        } else {
            return res.status(403).json({
                ok: true,
                message: 'No se han encontrado aplicaciones',
            })
        }
}

ctrl.list = async (req, res) => {

    const { page, size } = req.query;
    try {

        const {  limit, offset } =  getPagination(page, size)
        const response = await Product.findAndCountAll({
                where: {},
                limit,
                offset,
                include: [{
                    model: Category,
                    as: 'categories',
                },
                {
                    model: users,
                    as: 'users',
                }]
        })

        const products = getPagingData(response, page, limit);

        return res.status(200).json({
            ok: true,
            message: 'Aplicaciones consultadas',
            products
        })

    } catch (error) {

        return res.status(500).json({
            ok: true,
            message: 'Ha ocurrido un error',
            error
        })

    }
    
}

ctrl.listAppCategory = async (req, res) => {

    const { page, size } = req.query;

    try {

        const {  limit, offset } =  getPagination(page, size)

        const response = await Product.findAndCountAll({
                where: {
                    slug
                },
                limit,
                offset,
                include: [{
                    model: Category,
                    as: 'categories',
                },
                {
                    model: users,
                    as: 'users',
                }]
        })

        const products = getPagingData(response, page, limit);

        return res.status(200).json({
            ok: true,
            message: 'Aplicaciones consultadas',
            products
        })

    } catch (error) {

        return res.status(500).json({
            ok: true,
            message: 'Ha ocurrido un error',
            error
        })

    }
    
}

ctrl.show = async (req,res) => {

    var slug = req.params.slug;
        
        const product = await Product.findOne({
            where: {
                slug
            },
            include: [{
                model: Category,
                as: 'categories' 
            },
            {
                model: users,
                as: 'users' 
            }]
        });

        if(product){

            const relatedProducts = await Product.findAll({
                where: {
                    categoryId: product.categories.id,
                    id: {
                        [Op.ne]: product.id
                    }
                },
                include: [{
                    model: Category,
                    as: 'categories' 
                },
                {
                    model: users,
                    as: 'users' 
                }]
            })

            res.status(200).json({
                ok: true,
                message: 'Aplicación encontrada',
               product,
               relatedProducts,
            }) 

        }else{

        res.status(404).json({
            ok: false,
            message: 'Aplicación no encontrada'
        }) 

    }

}

ctrl.modify = async (req,res) => {
    await check('price').notEmpty().withMessage('El precio es obligatorio')
    .isDecimal().withMessage('El precio es un dato numérico').run(req);

    await check('description').notEmpty().withMessage('La descripción es obligatoria').run(req);

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
            ok: false,
            message: `${errors.array()[0].msg}`
        });
    }
    try {
        
        const {price,description} = req.body;
        const slug = req.params.slug
        
        if(req.file === undefined){

            const product = await Product.findOne({
                where: {
                    slug
                }
            });

            if (product) {

                product.description = description;
                product.price = price;
                await product.save();
                return res.status(200).json({
                    ok: true,
                    message: 'Se han modificado los datos de la aplicación con exito',
                    product
                })

            } else {

                return res.status(404),json({
                    ok: false,
                    message: 'No se ha encontrado la aplicaciíón buscada'
                })

            }

        }else{

            const imagenes = req.file;

            const guardarImagen = async () => {

                const imgUrl = randomNumber();
                const imagen = await Product.findOne({
                    where: {
                        image : imgUrl
                    }
                });

                if (imagen) {
                    guardarImagen();
                } else {
                    const imageTempPath = imagenes['path'];
                    const ext = path.extname(imagenes.originalname).toLowerCase();
                    const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`);
        
                    if (
                        ext === ".png" ||
                        ext === ".jpg" ||
                        ext === ".jpeg"||
                        ext === ".git"
                    ) {

                        await fs.rename(imageTempPath, targetPath);

                        const product = await Product.findOne({
                            where: {
                                slug
                            }
                        });
                        if(product){

                            await fs.unlink(`src/public/uploads/${product.image}`);

                            product.description = description;
                            product.image = imgUrl + ext;
                            product.price = price;
                            await product.save();

                            return res.status(200).json({
                                ok: true,
                                message: 'Se han modificado los datos de la aplicación con exito',
                                product
                            })

                        }else{

                            return res.status(404),json({
                                ok: false,
                                message: 'No se ha encontrado la aplicaciíón buscada'
                            })

                        }

                    }else{

                        await fs.unlink(imageTempPath);
                        return res.status(500).json({ ok: false, mensaje: "error solo imagenes" });

                    }
                }
            }
            guardarImagen();       
        }

    } catch (error){
        return res.status(500).json({ 
            ok: false, 
            mensaje: "Ha ocurrido un error",
            error 
        });
    }

}

ctrl.delete = async (req,res) => {

    var id = req.params.id;

    try {
        
        const product = await Product.findByPk(id);

        if(product){

            await product.destroy();

            res.status(200).json({
                ok: true,
                message: 'Aplicación eliminada con exito',
                product
            }) 

        }else{

        res.status(404).json({
            ok: false,
            message: 'Aplicación no encontrada'
        }) 

    }

    } catch (error) {
        
        res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un error',
            error
        }) 

    }

}

module.exports = ctrl;