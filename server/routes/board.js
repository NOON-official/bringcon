const express = require('express');
const router = express.Router();
const { Board } = require('../models/Board');

router.post("/delete", async(req, res) =>{
    try {
        await Board.remove({
            _id: req.body._id
        });
        res.json({message: true});
    } catch(err) {
        res.json({message: false});
    }
});

router.post("/update", async(req, res) => {
    try {
        console.log('heyyyyy'),
        await Board.update(
            {_id: req.body._id},
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content
                }
            }
        );
        res.json({message:"게시글이 수정되었습니다."});
    } catch(err) {
        console.log(err);
        res.json({message: false});
    }
});

router.post("/", async(req, res) => {
    try {
        let obj;
        obj = {
            writer: req.body._id,
            title: req.body.title,
            content: req.body.content
        };
        const board = new Board(obj);
        await board.save();
        res.json({message: "게시글이 업로드되었습니다."});
    } catch(err) {
        console.log(err);
        res.json({message: false});
    }
});

router.post("/getBoardList", async(req, res) => {
    try {
        const _id = req.body._id,
        board = await Board.find({writer: _id}, null, {
            sort: {createdAt: -1}
        });
        res.json({list: board});
    } catch(err) {
        console.log(err);
        res.json({message: false});
    }
});

router.post("/detail", async(req, res) => {
    try {
        const _id = req.body._id,
        board = await Board.find({_id});
        res.json({board});
    } catch(err) {
        console.log(err);
        res.json({message: false})
    }
});

module.exports = router;