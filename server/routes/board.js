const express = require("express");
const router = express.Router();
const { Board } = require("../models/Board");

router.post("/delete", async (req, res) => {
  try {
    await Board.deleteOne({
      _id: req.body._id,
    });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

router.post("/update", async (req, res) => {
  try {
      await Board.updateOne(
        { _id: req.body._id },
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
          },
        }
      );
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

router.post("/upload", (req, res) => {
  const board = new Board(req.body);
  board.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res
      .status(200)
      .json({ success: true });
  });
});

router.post("/getBoardList", async (req, res) => {
  try {
    // 유저 한명의 게시글만 가져오는 경우
    // const _id = req.body._id,
    // board = await Board.find({writer: _id}).sort({ createdAt: -1 })

    //모든 게시물 가져옴
    board = await Board.find({}).sort({ createdAt: -1 })
    res.json({ list: board });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/detail", async (req, res) => {
  try {
    const _id = req.body._id, //게시글 고유 번호
    board = await Board.find({ _id });
    res.json({ board });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;
