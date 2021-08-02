const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({
    orderName: {
        type: String,
        default: `bringcon_${new Date().getTime()}`
    },
    pg: {
        type: String,
        default: 'html5_inicis'
    },
    payMethod: {
        type: String,
        default: 'card'
    },
    amount: {
        type: Number,
        default: 0
    },
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    buyerName: {
        type: String,
    },
    buyerEmail: {
        type: String,
    },
    buyerTel: {
        type: String,
        default: ''
    },
    paymentData: {
        type: Object
    },
    product: {
        type: Array,
        default: []
    }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order }