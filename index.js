var express = require("express");
const multer = require("multer");
const path = require("path");
var cors = require("cors");
require("dotenv").config();

var app = express();

var storage = multer.diskStorage({
  destination: path.resolve(process.cwd(), "uploads"),
  filename: function (req, file, callback) {
    console.log(file);
    const ext = path.extname(file.originalname);
    const name = path.parse(file.originalname).name;
    callback(null, `${+new Date()}${name + ext}`);
  },
});
var upload = multer({ storage: storage }).single("upfile");

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err) {
      res.send({ error: err.message || "Error on uploading the file" });
    }
    res.send({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
