const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");

router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });
    Comment.find({ _id: comment._id })
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, result });
      });
  });
});

router.get("/getComments", (req, res) => {
  console.log(req.body);
  Comment.find({ postId: req.body.productId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.json({ success: false, comments });
    });
  return res.status(200).json({ success: true, comminets });
});

module.exports = router;
