import express from 'express';
var router = express.Router();
const {Product,users} = require('../models/index');
const permisson = require('../middlewares/permisson');
const authController = require('../controllers/AuthController');
const ProductController = require('../controllers/ProductController');
const CategoryController = require('../controllers/CategoryController');
const CartController = require('../controllers/CartController');
const BuyController = require('../controllers/BuyController');
const auth = require('../middlewares/auth');
const WishController = require('../controllers/WishController');

const ap = '/api';

module.exports = (app) => {

    //router auth
    router.route(`${ap}/signIn`).post(authController.signIn);
    router.route(`${ap}/signUp`).post(authController.signUp);

    //router app
    router.route(`${ap}/app/search`).get(ProductController.search);
    router.route(`${ap}/app`).get(auth, permisson.isDeveloper, ProductController.meApp).post(auth, permisson.isDeveloper, ProductController.create);
    router.route(`${ap}/app/:slug`).get(ProductController.show).put(auth,  permisson.isDeveloper, ProductController.modify).delete(auth,  permisson.isDeveloper, ProductController.delete);
    router.route(`${ap}/apps/all`).get(ProductController.list);

    //router category
    router.route(`${ap}/category`).post(CategoryController.create).get(CategoryController.list);
    router.route(`${ap}/category/:slug`).put(CategoryController.modify).get(CategoryController.show).delete(CategoryController.delete);

    // router cart
    router.route(`${ap}/cart`).post(auth, CartController.add).get(auth,  CartController.list);
    router.route(`${ap}/cart/:id`).delete(auth, CartController.deleteCart);

    //router buy
    router.route(`${ap}/buy`).post(auth, BuyController.buy).get(auth,BuyController.listBuy);

    //router cart and list wish
    router.route(`${ap}/list-wish`).get(auth, WishController.listWish).post(auth, WishController.add);
    router.route(`${ap}/list-wish/:id`).delete(auth, WishController.delete);

    app.use(router);
}
