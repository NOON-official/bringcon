const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const revenueSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    product: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
        title: {
            type: String
        },
        price: {
            type: Number
        },
        revenue: {
            type: Object
        },
    }]
}, { timestamps: true, versionKey: false })

const Revenue = mongoose.model('Revenue', revenueSchema);

module.exports = { Revenue }