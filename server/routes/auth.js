var express = require("express");
var router = express.Router();

var passport = require("passport");
var jwt = require("jsonwebtoken");

const jwtSettings = require("../constant/jwtSetting");
const { Customer } = require("../models/customer");

router.post("/login", function (req, res, next) {
  const { email, password } = req.body;
  if (email === "tungnt@softech.vn" && password === "123456789") {
    // login: OK
    // jwt
    var payload = {
      user: {
        email: email,
        fullName: "End User",
      },
      application: "ecommerce",
    };

    var secret = jwtSettings.SECRET;
    var token = jwt.sign(payload, secret, {
      expiresIn: 86400, // expires in 24 hours (24 x 60 x 60)
      audience: jwtSettings.AUDIENCE,
      issuer: jwtSettings.ISSUER,
      subject: email, // Thường dùng để kiểm tra JWT lần sau
      algorithm: "HS512",
    });

    res.status(200).json({
      ok: true,
      login: true,
      token: token,
    });
    return;
  }

  res.status(401).json({
    statusCode: 401,
    message: "Unauthorized",
  });
});

// router.post("/login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const dataLogin = await Customer.findOne({ email, password });
//     console.log("data: ", dataLogin);
//     console.log("email: ", dataLogin.email);
//     const id = dataLogin._id.toString();
//     if (!dataLogin) {
//       return res.status(404).send({ message: "not found" });
//     }
//     const {
//       firstName,
//       lastName,
//       age,
//       birthday,
//       email: empEmail,
//       phoneNumber,
//       address,
//     } = dataLogin;

//     if (dataLogin._id) {
//       const payload = {
//         message: "payload",
//       };

//       const secret = jwtSettings.SECRET;

//       // ACCESS TOKEN
//       const token = jwt.sign(payload, secret, {
//         expiresIn: 10, //24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
//         audience: jwtSettings.AUDIENCE,
//         issuer: jwtSettings.ISSUER,
//         subject: id, // Thường dùng để kiểm tra JWT lần sau
//         algorithm: "HS512",
//       });

//       return res.status(200).json({
//         payload: dataLogin,
//         ok: true,
//         login: true,
//         token: token,
//       });
//     }

//     return res.status(401).json({
//       statusCode: 401,
//       message: "Unauthorized",
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// setup jwt middleware

router.get(
  "/authentication",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    res.json({ ok: true });
  }
);

module.exports = router;

//link authenicate
//https://viblo.asia/p/authorization-va-authenticate-api-nodejs-voi-jwt-jvEla3exKkw
