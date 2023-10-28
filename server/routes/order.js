const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var passport = require("passport");
var jwt = require("jsonwebtoken");
const jwtSettings = require("../constant/jwtSetting");
const verifyToken = require("../middleware/verifyToken");
// const { ObjectId } = require("mongodb");
const { Order } = require("../models/index");
const {
  validateSchema,
  OrderIdSchema,
  OrderBodySchema,
} = require("../validation/order");

// router.get("/", async (req, res, next) => {
//   try {
//     await Order.find().then((response) => {
//       res.send({ ok: true, results: response });
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

router.get("/", async (req, res, next) => {
  try {
    await Order.aggregate()
      .match({})
      .lookup({
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customerInfor",
      })
      .unwind("customerInfor")
      .lookup({
        from: "photographypackages",
        localField: "packageId",
        foreignField: "_id",
        as: "packageInfor",
      })
      .unwind("packageInfor")
      .project({
        _id: 1,
        customerFirstName: "$customerInfor.firstName",
        customerLastName: "$customerInfor.lastName",
        package: "$packageInfor.package",
        dateBooking: 1,
        createOrderDate: 1,
        status: 1,
        bookingPlace: 1,
      })
      .then((result) => [res.send({ ok: true, results: result })]);
  } catch {}
});

router.get(
  "/OrderDetail/:id",
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      // console.log(id);
      // var id = new mongoose.Types.ObjectId("64b0c3b4f886503eafa6ce5c");
      var objId = new mongoose.Types.ObjectId(id);
      const today = new Date();
      // console.log(id);
      await Order.aggregate()
        .match({ $expr: { $eq: ["$customerId", objId] } })
        .match({ $expr: { $lte: ["$createOrderDate", today] } })
        .match({ $expr: { $eq: ["$status", "WAITING"] } })
        .sort({ createOrderDate: -1 }) // Sắp xếp kết quả theo ngày giảm dần
        // .limit(1)
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerInfor",
        })
        .unwind("customerInfor")
        .lookup({
          from: "photographypackages",
          localField: "packageId",
          foreignField: "_id",
          as: "pakageInfor",
        })
        .unwind("pakageInfor")
        .addFields({
          primePrice: {
            $divide: [
              {
                $multiply: [
                  { $subtract: [100, "$pakageInfor.discount"] },
                  "$pakageInfor.price",
                ],
              },
              100,
            ],
          },
        })
        .project({
          _id: 1,
          bookingPlace: 1,
          // "customerInfor.firstName": 1,
          // "customerInfor.lastName": 1,
          firstName: "$customerInfor.firstName",
          lastName: "$customerInfor.lastName",
          package: "$pakageInfor.package",
          discount: "$pakageInfor.discount",
          primePrice: 1,
          createOrderDate: 1,
          status: 1,
          dateBooking: 1,
          phone: "$customerInfor.phoneNumber",
        })
        // .group({
        //   _id: "$customerInfor._id",
        //   firstName: { $first: "$customerInfor.firstName" },
        //   lastName: { $first: "$customerInfor.lastName" },
        //   phoneNumber: { $first: "$customerInfor.phoneNumber" },
        //   address: { $first: "$bookingPlace" },
        //   package: { $first: "$pakageInfor.package" },
        //   timeForPackage: { $first: "$pakageInfor.timeForPackage" },
        //   price: { $first: "$pakageInfor.price" },
        //   discount: { $first: "$pakageInfor.discount" },
        //   sellPrice: { $first: "$primePrice" },
        //   createDay: { $first: "$createOrderDate" },
        // })
        .then((response) => {
          res.send({ ok: true, results: response });
        });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/:id", validateSchema(OrderIdSchema), async (req, res, next) => {
  try {
    const id = req.params.id;
    await Order.findById(id).then((response) => {
      res.send({ ok: true, results: response });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", validateSchema(OrderIdSchema), async (req, res, next) => {
  try {
    const id = req.params.id;
    await Order.findByIdAndDelete(id).then((response) => {
      res.send({ ok: true, message: "delete success!" });
    });
  } catch (err) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/", validateSchema(OrderBodySchema), async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    let newData = new Order(data);
    await newData.save().then((response) => {
      res.send({ ok: true, results: response });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch(
  "/:id",
  validateSchema(OrderBodySchema),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const bodyItem = req.body;
      await Order.findByIdAndUpdate(id, bodyItem).then((response) => {
        res.send({ ok: true, message: "success", results: response });
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);
////////////////////////////////////

module.exports = router;
