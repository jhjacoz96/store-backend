const jwt = require('jsonwebtoken');
const { Category, Product, users } = require('../models/index');
const { randomNumber } = require("../helpers/libs");
const { getPagination, getPagingData } = require("../helpers/paginate");
const fs = require("fs-extra");
const slugify = require('slugify');
const { check, validationResult } = require('express-validator');

const ctrl = {};

ctrl.list = async (req,res) => {

    try {

        const category = await Category.findAll({
            include: [{
                model: Product,
                as: 'products'
            }]
        });

        return res.status(200).json({
            ok: true,
            message: 'ategorias encontradas',
            category
        })
        
    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un error'
        })

    }

}

ctrl.create = async (req,res) => {
    await check('name').notEmpty().withMessage('El nombre es requerido')
    .custom(async (name) => { 
        const existingCategory = 
            await Category.findOne({
                where: {
                    name
                }
            });

        if (existingCategory) { 
            throw new Error('Este nombre ya esta siendo usado') 
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

    const {name} = req.body;
    
    try {
        var slug = slugify(name, {
            replacement: '_',
            lower: true
        })
        const category = await Category.create({
            name,
            slug
        })

        if(category){
            return res.status(200).json({
                ok: true,
                message: 'Categoria creada con éxito',
                category
            });
        }else{
            return res.status(422).json({
                ok: false,
                message: 'No se ha podido agregar la categoria',
                category
            });
        }

    } catch (err) {
        res.status(500).json({
            ok: false,
            message: 'No se ha podido agregar la categoria',
            err
        });
    }

} 

ctrl.modify = async (req,res) => {

    await check('name').notEmpty().withMessage('El nombre es requerido')
    .custom(async (name) => { 

        const category = await Category.findByPk(req.params.id);

        if(category){

            const existingCategory = 
            await Category.findOne({
                where: {
                    name
                }
            });

            if (
                    existingCategory && 
                    existingCategory.name !== category.name
                ) { 
                throw new Error('Este nombre ya esta siendo usado') 
            }

        }else{
            throw new Error('La categoria no existe') 
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

    const {name} = req.body;
    
    try {
        
        const category = await Category.findByPk(req.params.id)

        category.name = name;

        await category.save();

        if(category){
            return res.status(200).json({
                ok: true,
                message: 'Categoria modificada con éxito',
                category
            });
        }else{
            return res.status(422).json({
                ok: false,
                message: 'No se ha podido agregar la categoria',
                category
            });
        }

    } catch (err) {
        res.status(500).json({
            ok: false,
            message: 'No se ha podido agregar la categoria',
            err
        });
    }

}

ctrl.show = async (req,res) => {
   
    var {slug} = req.params;
    var {page, size} = req.query;

    try {

    var {limit, offset} = getPagination(page,size);
        const category = await Category.findOne({
            where: {
                slug
            },
        });
        
        if(category){

            const appsFilter = await Product.findAndCountAll({
                where: {
                    categoryId: category.id
                },
                limit,
                offset,
                include: [{
                    model: users,
                    as: 'users'
                },
                {
                    model: Category,
                    as: 'categories'
                }]
            })

            const apps = getPagingData(appsFilter, page, limit);

            res.status(200).json({
                ok: true,
                message: 'Categoria encontrada',
                category,
                apps
            })

        }else{

            res.status(404).json({
                ok: false,
                message: 'Categoria no encontrada'
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

ctrl.delete = async (req,res) => {
   
    const id = req.params.id;

        const category = await Category.findOne({
            where: {
                id:id
            },
            include: [{
                model: Product,
                as: "products"
            }]
        });
        
        if(category){

            if(!category.products){

                await category.destroy();
        
                return res.status(200).json({
                    ok: true,
                    message: 'Categoria eliminada',
                    category
                })

            }else{

                return res.status(402).json({
                    ok: false,
                    message: 'No puede eliminar esta categoria ya que posee aplicaciones asociadas'
                })

            }

        }else{

            return res.status(404).json({
                ok: false,
                message: 'No se ha encontrado la categoria'
            })

        }

}

module.exports = ctrl;