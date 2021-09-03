const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");
const { User } = require("../models/User");

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

router.post("/getComments", (req, res) => {
  Comment.find({ postId: req.body.productId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

router.post("/myReview", (req, res) => {
  Comment.find({ writer: req.body.userId })
    .populate("writer")
    .exec((err, reviews) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, reviews });
    });
});

router.post("/delete", (req, res) => {
  Comment.deleteOne({ _id: req.body.reviewId })
    .exec((err, result) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true });
    });
});

router.post("/comment_by_id", (req, res) => {
  Comment.find({ _id: req.body.reviewId })
    .populate("writer")
    .populate("postId")
    .exec((err, comment) => {
      if (err) return res.status(400).send(err);

      User.find({_id: comment[0].postId.writer})
      .exec((err, writer) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, comment: comment, writer: writer});
      })
    });
});

router.post("/update", (req, res) => {
  Comment.findOneAndUpdate(
    { _id: req.body.reviewId },
    {
      $set: {
        content: req.body.content
      }
    },
    (err, result) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    }
  );
});

module.exports = router;
