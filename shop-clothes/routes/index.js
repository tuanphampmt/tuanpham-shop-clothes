var express = require("express");
var router = express.Router();
var Product = require("../models/Product.js");
var ShoppingCart = require("../models/ShoppingCart.js");
var Customer = require("../models/Customer.js");
/* GET home page. */
const countJson = (json) => {
    var count = 0;
    for (var id in json) {
        count++;
    }
    return count;
};
router.get("/", async (req, res, next) => {
    try {
        const shoppingCart = new ShoppingCart(
            req.session.cart ? req.session.cart : {items: {}}
        );
        const data = await Product.find({});
        console.log(data);
        res.render("index", {
            products: data,
            cartData: shoppingCart.convertArray(),
            user: req.user
        });
    } catch (e) {
        console.log(e)

    }
});
router.get("/add.:id", async (req, res, next) => {
    try {
        var id = req.params.id;
        const shoppingCart = new ShoppingCart(
            req.session.cart ? req.session.cart : {items: {}}
        );
        const data = await Product.findById(id);
        shoppingCart.add(id, data);
        req.session.cart = shoppingCart;
        res.redirect("/");
    } catch (e) {
        console.log(e)
    }
});
router.get("/addDetails-:id", async (req, res, next) => {
    try {
        var id = req.params.id;
        const shoppingCart = new ShoppingCart(
            req.session.cart ? req.session.cart : {items: {}}
        );
        const data = await Product.findById(id);
        shoppingCart.add(id, data);
        req.session.cart = shoppingCart;
        res.redirect("/details" + "-" + id);
    } catch (e) {
        console.log(e);
        res.redirect("/");
    }
});
router.get("/addProductgird-:id", async (req, res, next) => {
    try {
        var id = req.params.id;
        const shoppingCart = new ShoppingCart(
            req.session.cart ? req.session.cart : {items: {}}
        );
        const data = await Product.findById(id);
        shoppingCart.add(id, data);
        req.session.cart = shoppingCart;
        res.redirect("/productgird");
    } catch (e) {
        console.log(e);
        res.redirect("/");
    }
});
router.get("/addProductlitst-:id", async (req, res, next) => {
    try {
        var id = req.params.id;
        const shoppingCart = new ShoppingCart(
            req.session.cart ? req.session.cart : {items: {}}
        );
        const data = await Product.findById(id);
        shoppingCart.add(id, data);
        req.session.cart = shoppingCart;
        res.redirect("/productlitst");
    } catch (e) {
        console.log(e);
        res.redirect("/");
    }
});
router.get("/remove.:id", function (req, res, next) {
    var id = req.params.id;
    const shoppingCart = new ShoppingCart(
        req.session.cart ? req.session.cart : {items: {}}
    );
    shoppingCart.remove(id);
    req.session.cart = shoppingCart;
    res.redirect("/");
});
router.get("/removeCart.:id", function (req, res, next) {
    var id = req.params.id;
    const shoppingCart = new ShoppingCart(
        req.session.cart ? req.session.cart : {items: {}}
    );
    shoppingCart.remove(id);
    req.session.cart = shoppingCart;
    res.redirect("/cart");
});
router.get("/details-:id", async (req, res, next) => {
    try {
        var id = req.params.id;
        var shoppingCart = new ShoppingCart(
            req.session.cart ? req.session.cart : {items: {}}
        );
        const dataOne = await Product.find({_id: id});
        const dataTwo = await Product.find({});
        res.render("details", {
            product: dataOne,
            products: dataTwo,
            cartData: shoppingCart.convertArray(),
            user: req.user
        });
    } catch (e) {
        console.log(e);
        res.redirect("/");
    }
});

router.get("/cart", function (req, res, next) {
    var shoppingCart = new ShoppingCart(
        req.session.cart ? req.session.cart : {items: {}}
    );
    if (req.session.cart) {
        if (countJson(req.session.cart.items) > 0) {
            return res.render("cart", {
                cartData: shoppingCart.convertArray(),
                user: req.user
            });
        }
        return res.redirect("/");
    }
    res.redirect("/");
});
router.get("/contact", function (req, res, next) {
    var shoppingCart = new ShoppingCart(
        req.session.cart ? req.session.cart : {items: {}}
    );
    res.render("contact", {
        cartData: shoppingCart.convertArray(),
        user: req.user
    });
});
router.get("/productgird", async (req, res, next) => {
    const shoppingCart = new ShoppingCart(
        req.session.cart ? req.session.cart : {items: {}}
    );
    const data = await Product.find({});
    res.render("productgird", {
        products: data,
        cartData: shoppingCart.convertArray(),
        user: req.user
    });
});
router.get("/productlitst", async (req, res, next) => {
    const shoppingCart = new ShoppingCart(
        req.session.cart ? req.session.cart : {items: {}}
    );
    const data = await Product.find({});
    res.render("productlitst", {
        products: data,
        cartData: shoppingCart.convertArray(),
        user: req.user
    });
});

router.get("/information", async (req, res, next) => {
    try {
        var shoppingCart = new ShoppingCart(
            req.session.cart ? req.session.cart : {items: {}}
        );
        var data = await Product.find({});
        if (req.session.cart) {
            if (countJson(req.session.cart.items) > 0) {
                return res.render("information", {
                    products: data,
                    cartData: shoppingCart.convertArray(),
                    user: req.user
                });
            }
            return res.redirect("/");
        }
        res.redirect("/");
    } catch (e) {
        console.log(e);
        res.redirect("/");
    }
});
router.post("/information", async (req, res, next) => {
    try {
        var shoppingCart = new ShoppingCart(
            req.session.cart ? req.session.cart : {items: {}}
        );
        const newCustomer = new Customer({
            fullname: req.user.username,
            telephone: req.body.telephone,
            fax: req.body.fax,
            company: req.body.company,
            address: req.body.address,
            city: req.body.city,
            passCode: req.body.passCode,
            country: req.body.country,
            state: req.body.state,
            cart: shoppingCart.convertArray()
        });
        console.log(newCustomer);
        await newCustomer.save();
        res.redirect("/");
    } catch (e) {
        console.log(e);
        res.redirect("/");
    }
});

router.post("/update", function (req, res, next) {
    var shoppingCart = new ShoppingCart(
        req.session.cart ? req.session.cart : {items: {}}
        ),
        totalItems = shoppingCart.totalItems,
        totalPrice = shoppingCart.totalPrice;
    if (typeof req.body.quantity === "string") {
        shoppingCart.convertArray().forEach((cart) => {
            shoppingCart.update(cart.item._id, req.body.quantity);
            req.session.cart = shoppingCart;
        });
    } else {
        var i = 0;
        shoppingCart.convertArray().forEach((cart) => {
            shoppingCart.update(cart.item._id, req.body.quantity[i++]);
            req.session.cart = shoppingCart;
        });
    }
    shoppingCart.totalItems -= totalItems;
    shoppingCart.totalPrice -= totalPrice;
    req.session.cart = shoppingCart;
    res.redirect("/cart");
});
module.exports = router;
