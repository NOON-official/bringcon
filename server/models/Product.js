const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0,
    },
    genres: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
    filePath: {
      type: String,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    s3thumbnail: {
      type: String,
    },
    tags: {
      type: Array,
      default: [],
    },
    judged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//검색할 때 title과 description에서 키워드가 더 잘 걸렸으면 좋겠음
productSchema.index(
  {
    title: "text",
    description: "text",
  },
  {
    weights: {
      title: 5, //title 중요도 훨씬 큼! (5배)
      description: 1, //중요도 비교적 낮음
    },
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
