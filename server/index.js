const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

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
app.use(express.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(express.json());
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

const PORT = process.env.PORT || 443;

//aws load balabcer health checker
app.get("/healthCheck", function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("Health Check Page");
  res.end();
});

app.listen(PORT, () => {
  console.log(`Server Listening on ${port}`);
});



// server.keepAliveTimeout = 65000;
// server.headersTimeout = 66000;
