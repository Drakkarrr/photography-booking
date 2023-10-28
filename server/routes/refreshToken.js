var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
var passport = require("passport");
var jwt = require("jsonwebtoken");
const jwtSettings = require("../constant/jwtSetting");
const verifyToken = require("../middleware/verifyToken");
const { RefreshToken } = require("../models/index");
const { findDocument } = require("../helper/MongoDBHelper");

router.get("/", async (req, res, next) => {
  try {
    const token = req.query.refreshToken;
    await RefreshToken.find(token)
      .then((result) => {
        res.send({ ok: true, results: result });
      })
      .catch((err) => {
        res.sendStatus.json({ message: err.message });
      });
  } catch {}
});

router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    let newData = new RefreshToken(data);
    await newData
      .save()
      .then((result) => {
        res.send({ ok: true, results: result });
      })
      .catch((err) => {
        res.sendStatus(400).json({ message: err.message });
      });
  } catch {
    (err) => {
      res.sendStatus(500).json({ message: err.message });
    };
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    let data = req.body;
    let id = req.params.id;
    console.log(id);
    console.log(data);

    await RefreshToken.findByIdAndUpdate(id, data)
      .then((result) => {
        res.send({ ok: true, results: result });
      })
      .catch((err) => {
        res.sendStatus(400).json({ message: err.message });
      });
  } catch {
    (err) => {
      res.sendStatus(500).json({ message: err.message });
    };
  }
});

module.exports = router;
