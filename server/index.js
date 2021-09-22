const express = require("express");
const app = express();
const https = require("https");
const http = require("http");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.use(cors());

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
//to get json data
// support parsing of application/json type post data
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use("/api/users", require("./routes/users"));
app.use("/api/product", require("./routes/product"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/board", require("./routes/board"));
app.use("/api/comment", require("./routes/comment"));

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
// app.use('/thumbnails', express.static('thumbnails'));
app.use("/uploads", express.static("uploads"));
app.use("/resource", express.static("resource"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 443;

const option =
  process.env.NODE_ENV === "production"
    ? {
        key: fs.readFileSync("/etc/letsencrypt/live/bringcon.shop.privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/bringcon.shop.cert.pem"),
        ca: fs.readFileSync(
          "/etc/letsencrypt/live/bringcon.shop.fullchain.pem"
        ),
      }
    : undefined;

// production 모드에서는 https 서버를
// development 모드에서는 http 서버를 사용합니다
option
  ? https.createServer(option, app).listen(port, () => {
      console.log(`Server is running at port ${port}`);
    })
  : http.createServer(app).listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
