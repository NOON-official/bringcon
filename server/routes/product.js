const express = require("express");
const router = express.Router();
const multer = require("multer");
const aws = require("aws-sdk");
const ffmpeg = require("fluent-ffmpeg");
const { Product } = require("../models/Product");
const path = require("path");
const fs = require("fs");
const config = require("../config/s3.json");
const { User } = require("../models/User");

//=================================
//             Product
//=================================

const awsLoadPath = path.join(__dirname, "/../config/s3.json");
aws.config.loadFromPath(awsLoadPath);
aws.config.update({ httpOptions: { timeout: 60000 * 5 } }); //5분

let s3 = new aws.S3();

//로컬에 비디오 업로드
// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    ext === ".mp4" ||
    ext === ".mov" ||
    ext === ".wmv" ||
    ext === ".avi" ||
    ext === ".avchd" ||
    ext === ".flv" ||
    ext === ".f4v" ||
    ext === ".swf" ||
    ext === ".mkv"
  ) {
    return cb(null, true);
  } else {
    return cb("not allowed format", false);
  }
};

const uploadVideo = multer({ storage: storage, fileFilter: fileFilter }).single(
  "file"
);

router.post("/video", (req, res) => {
  //비디오를 서버에 저장
  uploadVideo(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    } else {
      //Watermark
      const wm_filename = `wm_${res.req.file.filename}`;
      const wm_filepath = `uploads/watermark/${wm_filename}`;

      ffmpeg()
        .input(res.req.file.path)
        .input("resource/watermark(trans70)-01.png")
        .addOption(
          "-filter_complex",
          "[1:v][0:v]scale2ref=iw:iw*sar/5[wm][base];[base][wm]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2"
        )
        .save(wm_filepath)
        .on("end", function () {
          uploadWatermarkToS3(wm_filepath, wm_filename, req.file.mimetype);
        });

      uploadVideoToS3(
        res.req.file.path,
        res.req.file.filename,
        req.file.mimetype
      );

      let s3VideoPath = `https://bringcon-bucket.s3.ap-northeast-2.amazonaws.com/uploads/${encodeURIComponent(
        res.req.file.filename
      )}`;

      let wm_s3VideoPath = `https://bringcon-bucket.s3.ap-northeast-2.amazonaws.com/uploads/watermark/${encodeURIComponent(
        wm_filename
      )}`;

      return res.json({
        success: true,
        s3VideoPath: s3VideoPath,
        wm_s3VideoPath: wm_s3VideoPath,
        filePath: res.req.file.path,
        fileName: res.req.file.filename,
      });
    }
  });
});

function uploadVideoToS3(source, target, mimetype) {
  fs.readFile(source, function (err, data) {
    if (!err) {
      var params = {
        Bucket: "bringcon-bucket/uploads",
        Key: target,
        Body: data,
        ContentType: mimetype,
        ACL: "public-read",
      };

      s3.putObject(params, function (err, data) {
        if (!err) {
          console.log("[s3] video file uploaded:");
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
}

function uploadWatermarkToS3(source, target, mimetype) {
  fs.readFile(source, function (err, data) {
    if (!err) {
      var params = {
        Bucket: "bringcon-bucket/uploads/watermark",
        Key: target,
        Body: data,
        ContentType: mimetype,
        ACL: "public-read",
      };

      s3.putObject(params, function (err, data) {
        if (!err) {
          console.log("[s3] watermark file uploaded:");
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
}

router.post("/thumbnail", (req, res) => {
  let filePath = "";
  let fileDuration = "";
  let fileName = "";
  let fileWidth = 0;
  let fileHeight = 0;
  let fileFormat = "";

  //비디오 duration 가져오기
  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    fileDuration = metadata.format.duration;
    fileWidth =
      metadata.streams[0].width === undefined
        ? metadata.streams[1].width
        : metadata.streams[0].width;
    fileHeight =
      metadata.streams[0].height === undefined
        ? metadata.streams[1].height
        : metadata.streams[0].height;
    fileFormat = metadata.format.filename.split(".")[1].toUpperCase();
  });

  // 썸네일 생성
  ffmpeg(req.body.filePath) //썸네일 파일 이름 생성
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      fileName = filenames[0];
      filePath = `uploads/thumbnails/${fileName}`;
    })
    .on("end", function () {
      //썸네일 생성 끝난 후
      console.log("Screenshots taken");
      uploadThumbnail(filePath, fileName); // S3에 업로드
      let s3FilePath = `https://bringcon-bucket.s3.ap-northeast-2.amazonaws.com/uploads/thumbnails/${encodeURIComponent(
        fileName
      )}`;
      return res.json({
        success: true,
        filePath: filePath,
        s3FilePath: s3FilePath,
        fileDuration: fileDuration,
        fileWidth: fileWidth,
        fileHeight: fileHeight,
        fileFormat: fileFormat,
      });
    })
    .screenshots({
      //옵션
      // Will take screenshots at 20%, 40%, 60% and 80% of the video
      count: 1, //썸네일 1개
      folder: "uploads/thumbnails",
      size: "336x189", // 16:9 비율
      //'%b': input basename (filename without extension)
      filename: "thumbnail-%b.png",
    });
});

function uploadThumbnail(source, target) {
  fs.readFile(source, function (err, data) {
    if (!err) {
      var params = {
        Bucket: "bringcon-bucket/uploads/thumbnails",
        Key: target,
        Body: data,
        ContentType: "image/png",
        ACL: "public-read",
      };

      s3.putObject(params, function (err, data) {
        if (!err) {
          console.log("[s3] thumbnail file uploaded:");
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
}

//현재 submit안하고 dropzone에 넣기만해도 로컬에 저장됨, 라우트 수정 필요
//상품 업로드 버튼 누른 직후 호출됨
router.post("/", (req, res) => {
  //받아온 정보들을 DB에 넣어 준다.
  const product = new Product(req.body);

  //Get Video Resolution and Extension
  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    product.width =
      metadata.streams[0].width === undefined
        ? metadata.streams[1].width
        : metadata.streams[0].width;
    product.height =
      metadata.streams[0].height === undefined
        ? metadata.streams[1].height
        : metadata.streams[0].height;
    product.format = metadata.format.filename.split(".")[1].toUpperCase();
  });

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });

  //로컬 파일 삭제
  const filename = decodeURIComponent(req.body.filePath.split("/uploads/")[1]);
  const wm_filename = decodeURIComponent(
    req.body.wmFilePath.split("/uploads/watermark/")[1]
  );
  const videoSource = `uploads/${filename}`;
  const wm_videoSource = `uploads/watermark/${wm_filename}`;
  const thumbnailSource = req.body.thumbnail;

  fs.unlink(videoSource, (err) => {
    if (err) console.log(err);
    else console.log("local video is successfully deleted");
  });

  fs.unlink(wm_videoSource, (err) => {
    if (err) console.log(err);
    else console.log("local watermark video is successfully deleted");
  });

  fs.unlink(thumbnailSource, (err) => {
    if (err) console.log(err);
    else console.log("local thumbnail is successfully deleted");
  });
});

//비디오 다운로드
router.post("/download", async (req, res) => {
  //1. 몽고디비에서 상품 찾기
  const doc = await Product.findById(req.body.product_id).exec();

  //2. 상품의  filePath 가져오기
  const filePath = doc.filePath;

  //2-2. key(fileName) 추출하기
  const key = "uploads/" + decodeURIComponent(filePath.split("uploads/")[1]);

  //3. 다운로드
  const downloadFile = async (key) => {
    aws.config.update({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
      signatureVersion: "v4",
    });

    const s3 = new aws.S3();
    const params = {
      Bucket: "bringcon-bucket",
      ResponseContentDisposition: "attachment;",
      Expires: 60,
      Key: key,
    };

    let url = s3.getSignedUrl("getObject", params);

    res.send({ success: true, url: url });
  };

  await downloadFile(key);

  //download시 download 속성을 1 늘려줌.

  //  user id 를 가지고 온다.
  const userId = req.body.userId;
  // user id 를 이용해서 user.history.cartDetail의 download를 1 늘려준다.
  User.find({ _id: { $in: userId } })
    .updateOne({ $inc: { history: { ProductInfo: { download: 1 } } } })
    .exec((err) => {
      if (err) return res.status(400).send(err);
      return res.status(200);
    });
});

//데이터에 filter 처리를 한 후 알맞은 데이터를 프론트로 보내줌
router.post("/products", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  // product collection에 들어 있는 모든 상품 정보를 가져오기
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm; //서치바에서 검색한 단어 ex) 'mexico'

  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log("key", key);

      if (key === "price") {
        findArgs[key] = {
          //Greater than equal
          $gte: req.body.filters[key][0],
          //Less than equal
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    //검색어가 있으면
    if (term.startsWith("#")) {
      //해쉬태그 검색하는 경우
      term = term.substring(1); //'#' 제거

      Product.find(findArgs)
        .find({ judged: true })
        .fine({ deleted: false })
        .find({ tags: term })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    } else {
      //문자열 검색
      Product.find(findArgs)
        .find({ judged: true })
        .find({ deleted: false })

        //find 조건 추가, 몽고디비에서 제공하는 $text, $search 이용
        //Product 컬렉션 안에 있는 데이터 중 term과 일치하는 자료 가져옴
        .find({ $text: { $search: term } })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    }
  } else {
    //검색어가 없으면, 원래대로 프로세스 수행
    Product.find(findArgs)
      .find({ judged: true })
      .find({ deleted: false })
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({
          success: true,
          productInfo,
          postSize: productInfo.length,
        });
      });
  }
});

//데이터에 filter 처리를 한 후 알맞은 데이터를 프론트로 보내줌
router.post("/products_admin", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  // product collection에 들어 있는 모든 상품 정보를 가져오기
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm; //서치바에서 검색한 단어 ex) 'mexico'

  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log("key", key);

      if (key === "price") {
        findArgs[key] = {
          //Greater than equal
          $gte: req.body.filters[key][0],
          //Less than equal
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    //검색어가 있으면
    if (term.startsWith("#")) {
      //해쉬태그 검색하는 경우
      term = term.substring(1); //'#' 제거

      Product.find(findArgs)
        .find({ judged: false })
        .find({ tags: term })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    } else {
      //문자열 검색
      Product.find(findArgs)
        .find({ judged: false })

        //find 조건 추가, 몽고디비에서 제공하는 $text, $search 이용
        //Product 컬렉션 안에 있는 데이터 중 term과 일치하는 자료 가져옴
        .find({ $text: { $search: term } })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    }
  } else {
    //검색어가 없으면, 원래대로 프로세스 수행
    Product.find(findArgs)
      .find({ judged: false })
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({
          success: true,
          productInfo,
          postSize: productInfo.length,
        });
      });
  }
});

//id=123123123,324234234,324234234  type=array
router.get("/products_by_id", (req, res) => {
  let type = req.query.type;
  let productIds = req.query.id;

  if (type === "array") {
    //id=123123123,324234234,324234234 이거를
    //productIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿔주기
    let ids = req.query.id.split(",");
    productIds = ids.map((item) => {
      return item;
    });
  }

  Product.find({ _id: { $in: productIds } })
    .updateOne({ $inc: { views: 1 } })
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200);
    });

  //productId를 이용해서 DB에서  productId와 같은 상품의 정보를 가져온다.

  Product.find({ _id: { $in: productIds } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(product);
    });
});

router.post("/products_by_hashtag", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  // product collection에 들어 있는 모든 상품 정보를 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm; //서치바에서 검색한 단어 ex) 'mexico'
  let tag = req.query.tag;
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log("key", key);

      if (key === "price") {
        findArgs[key] = {
          //Greater than equal
          $gte: req.body.filters[key][0],
          //Less than equal
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    //검색어가 있으면
    if (term.startsWith("#")) {
      //해쉬태그 검색하는 경우
      term = term.substring(1); //'#' 제거

      Product.find(findArgs)
        .find({ judged: true })
        .find({ deleted: false })
        .find({ tags: tag })
        .find({ tags: term })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    } else {
      //문자열 검색
      Product.find(findArgs)
        .find({ judged: true })
        .find({ deleted: false })
        .find({ tags: tag })

        //find 조건 추가, 몽고디비에서 제공하는 $text, $search 이용
        //Product 컬렉션 안에 있는 데이터 중 term과 일치하는 자료 가져옴
        .find({ $text: { $search: term } })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    }
  } else {
    //검색어가 없으면, 원래대로 프로세스 수행
    Product.find(findArgs)
      .find({ judged: true })
      .find({ deleted: false })
      .find({ tags: tag })
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({
          success: true,
          productInfo,
          postSize: productInfo.length,
        });
      });
  }
});

router.post("/products_by_userId", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  // product collection에 들어 있는 모든 상품 정보를 가져오기
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm; //서치바에서 검색한 단어 ex) 'mexico'
  let userId = req.query.userId;
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log("key", key);

      if (key === "price") {
        findArgs[key] = {
          //Greater than equal
          $gte: req.body.filters[key][0],
          //Less than equal
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    //검색어가 있으면
    if (term.startsWith("#")) {
      //해쉬태그 검색하는 경우
      term = term.substring(1); //'#' 제거

      Product.find(findArgs)
        .find({ judged: true })
        .find({ writer: { $in: userId } })
        .find({ tags: term })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    } else {
      //문자열 검색
      Product.find(findArgs)
        .find({ judged: true })
        .find({ writer: { $in: userId } })

        //find 조건 추가, 몽고디비에서 제공하는 $text, $search 이용
        //Product 컬렉션 안에 있는 데이터 중 term과 일치하는 자료 가져옴
        .find({ $text: { $search: term } })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    }
  } else {
    //검색어가 없으면, 원래대로 프로세스 수행
    Product.find(findArgs)
      .find({ judged: true })
      .find({ writer: { $in: userId } })
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({
          success: true,
          productInfo,
          postSize: productInfo.length,
        });
      });
  }
});

router.post("/permission", (req, res) => {
  const productId = req.query.id;

  Product.findOneAndUpdate(
    { _id: productId },
    {
      $set: {
        judged: true,
      },
    },
    { new: true },
    (err, doc) => {
      if (err) return res.json({ success: false, err });

      res.status(200).json({ success: true });
    }
  );
});

router.get("/product_by_id", (req, res) => {
  let productId = req.query.id;

  Product.find({ _id: productId })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, product });
    });
});

router.post("/delete", (req, res) => {
  const productId = req.body.product_id;

  Product.findOneAndUpdate(
    { _id: productId },
    {
      $set: {
        deleted: true,
        judged: false,
      },
    },
    { new: true },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json({ success: true });
    }
  );
});

router.post("/content_by_id", (req, res) => {
  let productId = req.body.productId;

  Product.find({ _id: productId }).exec((err, content) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, content });
  });
});

router.post("/update", (req, res) => {
  Product.findOneAndUpdate(
    { _id: req.body.productId },
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        genres: req.body.genres,
        tags: req.body.tags,
      },
    },
    (err, result) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    }
  );
});

module.exports = router;
