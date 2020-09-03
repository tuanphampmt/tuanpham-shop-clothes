module.exports = function ShoppingCart(cartItems) {
    this.items = cartItems.items || {};
    this.totalItems = cartItems.totalItems || 0;
    this.totalPrice = cartItems.totalPrice || 0;
    
    this.add = (id, item) => {
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = {
                item: item,
                quantity: 0,
                total: 0
            };
        }
        cartItem.quantity++;
        cartItem.total = cartItem.quantity * cartItem.item.price;
        this.totalItems++;
        this.totalPrice += cartItem.item.price;
    };
    this.remove = (id) => {
        var cart = this.items[id];
        this.totalItems -= cart.quantity;
        this.totalPrice -= cart.total;
        delete this.items[id];
    };

    this.update = (id, quantity) => {
        var cart = this.items[id];
        cart.quantity = parseInt(quantity);
        cart.total = cart.item.price * parseInt(quantity);
        this.totalItems += cart.quantity;
        this.totalPrice += cart.total;
    };
    this.convertArray = () => {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
};
