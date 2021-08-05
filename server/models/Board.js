const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = mongoose.Schema({
    writer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  }, { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);
module.exports = { Board };
