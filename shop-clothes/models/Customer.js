const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
    fullname: String,
    telephone: String,
    fax: String,
    company: String,
    address: String,
    city: String,
    passCode: String,
    country: String,
    state: String,
    cart: Object
}, {collection: 'customer'});


module.exports = mongoose.model('Customer', CustomerSchema);
