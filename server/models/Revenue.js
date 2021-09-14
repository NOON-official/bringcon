const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const revenueSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    product: {
        type: Array,
        default: []
    }
}, { timestamps: true, versionKey: false })

const Revenue = mongoose.model('Revenue', revenueSchema);

module.exports = { Revenue }