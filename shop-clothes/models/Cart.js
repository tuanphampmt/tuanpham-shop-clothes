var mongoose = require('mongoose');
var CustomerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    telephone: String,
    fax: String,
    company: String,
    address01: String,
    address02: String,
    city: String,
    passCode: String,
    country: String,
    state: String,
    cart: Object
}, {collection: 'customer'});
module.exports = mongoose.model('Customer', CustomerSchema);
