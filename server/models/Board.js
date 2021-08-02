const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    get writer() {
        return this._writer;
    },
    set writer(value) {
        this._writer = value;
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Board = mongoose.model("Board", boardSchema);
module.exports = { Board };