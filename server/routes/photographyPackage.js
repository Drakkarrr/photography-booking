const express = require("express");
const router = express.Router();
const { photographyPackage } = require("../models");
const {
  validateSchema,
  photographyPackageIdSchema,
  photographyPackageSchema,
  photographyPackageBodySchema,
  phoneNumberUpdateSchema,
} = require("../validation/photographyPackage");
const { response } = require("../app");

router.get(
  "/",
  validateSchema(photographyPackageSchema),
  async (req, res, next) => {
    try {
      await photographyPackage.find().then((resopnse) => {
        res.send({ ok: true, results: resopnse });
      });
    } catch {
      (err) => {
        res.status(500).json({ error: error.message });
      };
    }
  }
);

///////////////////////QUERRY

router.get("/querry", async (req, res, next) => {
  // console.log("here");
  let { name, priceFrom, priceTo, discountFrom, discountTo, skip, limit } =
    req.query;

  let querry = {
    $and: [
      name ? { package: new RegExp(`${name}`) } : {},
      priceFrom ? { price: { $gte: Number(priceFrom) } } : {},
      priceTo ? { price: { $lte: Number(priceTo) } } : {},
      discountFrom ? { discount: { $gte: Number(discountFrom) } } : {},
      discountTo ? { discount: { $lte: Number(discountTo) } } : {},
    ],
  };
  let result = await photographyPackage
    .find(querry)
    .limit(Number(limit))
    .skip(Number(skip));
  let amountResults = await photographyPackage.countDocuments(querry);
  if (result) {
    res.send({ oke: true, results: result, numberItems: amountResults });
  } else {
    res.sendStatus(400);
  }
});

/////////////////////////////////////////////

router.get(
  "/:id",
  validateSchema(photographyPackageIdSchema),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      await photographyPackage.findById(id).then((response) => {
        res.send({ ok: true, results: response });
      });
    } catch {
      (err) => {
        res.status(400).json({ error: error.message });
      };
    }
  }
);

router.post(
  "/",
  validateSchema(photographyPackageBodySchema),
  async (req, res, next) => {
    try {
      console.log("here: ", req.body);
      let itemsBody = req.body;
      let newData = new photographyPackage(itemsBody);
      const results = await newData.save();
      res.send({ ok: true, message: "create success", results: results });
    } catch {
      (err) => {
        res.status(500).json({ error: error.message });
      };
    }
  }
);
router.delete(
  "/:id",
  validateSchema(photographyPackageIdSchema),
  async (req, res, next) => {
    try {
      const deleteItems = req.params.id;
      let found = await photographyPackage
        .findByIdAndDelete(deleteItems)
        .then((response) => {
          res.send({ ok: true, results: response });
        })
        .catch((err) => {
          res.status(400).send({ ok: false, message: "failure" });
        });
    } catch {
      (err) => {
        res.status(500).json({ error: error.message });
      };
    }
  }
);

router.patch(
  "/:id",
  validateSchema(phoneNumberUpdateSchema),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const itemsBody = req.body;
      console.log(itemsBody);
      let data = await photographyPackage.findByIdAndUpdate(id, itemsBody);
      res.send({ ok: true, message: "update", results: data });
    } catch {
      (err) => {
        return res.status(500).json({ error: error.message });
      };
    }
  }
);

module.exports = router;
