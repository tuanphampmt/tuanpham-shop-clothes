const ShoppingCart = require('../models/ShoppingCart.js');
const Product = require('../models/Product.js');
module.exports = (app, passport) => {
    app.get('/register', checkAuthenticated, async (req, res, next) => {
        try {
            var shoppingCart = new ShoppingCart((req.session.cart) ? req.session.cart : {items: {}});
            var data = await Product.find({});
            req.session.cart = shoppingCart;
            res.render('register', {
                message: req.flash('signUpMessage'),
                cartData: shoppingCart.convertArray(),
                user: req.user,
                products: data,
            });
        } catch (e) {
            console.log(e);
            res.redirect('/')
        }
    });
    app.post('/register', passport.authenticate('local-Register', {
        successRedirect: '/login',
        failureRedirect: '/register',
        failureFlash: true
    }));
    app.get('/login', checkAuthenticated, async (req, res, next) => {
        try {
            var shoppingCart = new ShoppingCart((req.session.cart) ? req.session.cart : {items: {}});
            var data = await Product.find({});
            req.session.cart = shoppingCart;
            res.render('login', {
                message: req.flash('LoginMessage'),
                cartData: shoppingCart.convertArray(),
                products: data
            })
        } catch (e) {
            console.log(e);
            res.redirect('/')
        }
    });
    app.post('/login', passport.authenticate('local-Login', {
        successRedirect: '/information',
        failureRedirect: '/login',
        failureFlash: true
    }));

    function checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/information');
        }
        next();
    }
};


