const express = require("express");
const router = express.Router();
const { Roles } = require("../models");

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    const newRole = new Roles({ name: name });
    await newRole.save().then(() => {
      res.send({ ok: true });
    });
  } catch {
    () => {
      res.sendStatus(500);
    };
  }
});
module.exports = router;
