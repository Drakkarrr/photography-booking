// const passport = require("passport");
var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
var passport = require("passport");
var jwt = require("jsonwebtoken");
const jwtSettings = require("../constant/jwtSetting");
const verifyToken = require("../middleware/verifyToken");
const { Customer } = require("../models/index");
const { findDocument } = require("../helper/MongoDBHelper");
const { AuthPage } = require("../middleware/AuthPage");
const {
  validateSchema,
  customerBodySchema,
  customerIdSchema,
  getCustomersSchema,
  customerBodyPatchSchema,
  loginSchema,
} = require("../validation/customer");

//C1: Authorization nếu dùng middleware verifyToken lấy token từ header
router.get("/authentication_header", verifyToken, (req, res, next) => {
  res.send("OK");
});

//C2: nếu sử dụng passport.authenticate("jwt", { session: false }) thì phải có JwtStrategy
router.get(
  "/authentication",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    res.json({ ok: true });
  }
);

//sau khoảng thời gian ở mục expiresIn: 30, thì sẽ ko lấy được dữ liệu
router.get(
  "/",
  validateSchema(getCustomersSchema),
  passport.authenticate("jwt", { session: false }),
  AuthPage(["admin"]),
  async (req, res, next) => {
    try {
      let data = await Customer.find();
      res.send({ ok: true, result: data });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/:id",
  validateSchema(customerIdSchema),
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      let data = await Customer.findById(id).then((data) => {
        res.send({ ok: true, result: data });
      });
    } catch {
      (err) => {
        res.status({ error: error.message });
      };
    }
  }
);

//Authenticate customer
//Tạo taì khoản mới, nếu tài khoản đã trùng với tài khoản đã được đk trc đó thì báo lỗi,
//nếu ko trùng thì tiến hành mã hóa password rồi đẩy thông tin customer lên db
// để đơn giản dễ nhớ thì mọi mật khẩu đều là 123456
router.post("/", validateSchema(customerBodySchema), async (req, res, next) => {
  try {
    const data = req.body;
    console.log(req.body.email);
    // const emailCheck = new Customer({
    //   email: data.email,
    // });
    // console.log(emailCheck);
    const checkEmailExist = await Customer.findOne({ email: data.email });
    if (checkEmailExist) {
      return res.json({ message: "exist account" });
    }
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(data.password, salt);

    let newCustomer = new Customer({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      age: data.age,
      password: hasPassword,
    });
    let result = await newCustomer.save();
    res.send({ ok: true, result: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete(
  "/:id",
  validateSchema(customerIdSchema),
  async (req, res, next) => {
    try {
      const removeData = req.params.id;
      let found = await Customer.findByIdAndDelete(removeData);
      res.send({ ok: true });
    } catch {
      (err) => {
        return res.status(500).json({ error: error.message });
      };
    }
  }
);

router.patch(
  "/:id",
  validateSchema(customerBodyPatchSchema),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      let itemsBody = req.body;
      console.log(itemsBody);
      if (itemsBody.password) {
        const salt = await bcrypt.genSalt(10);
        const hasPassword = await bcrypt.hash(itemsBody.password, salt);
        itemsBody.password = hasPassword;
      }

      let data = await Customer.findByIdAndUpdate(id, itemsBody);
      res.send({ ok: true, message: "update" });
    } catch {
      (err) => {
        return res.status(500).json({ error: error.message });
      };
    }
  }
);

///////////LOGIN///////////////

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const dataLogin = await Customer.findOne({ email });
    // console.log("data: ", dataLogin);
    // console.log("email: ", dataLogin.email);
    const id = dataLogin._id.toString();
    if (!dataLogin) {
      return res.status(404).send({ message: "not found" });
    }
    //so sánh mk nhập từ khách hàng và mk đã được mã hóa bởi giao thức bcrypt.compare
    const checkPassword = await bcrypt.compare(password, dataLogin.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "login failed" });
    }
    if (checkPassword) {
      var payload = {
        user: {
          name: `${dataLogin.firstName} ${dataLogin.lastName}`,
          email: `${dataLogin.email}`,
        },
        application: "ecommerce",
      };
      // ACCESS TOKEN
      var secret = jwtSettings.SECRET;
      var token = jwt.sign(payload, secret, {
        expiresIn: 2 * 60,
        audience: jwtSettings.AUDIENCE,
        issuer: jwtSettings.ISSUER,
        subject: id,
        algorithm: "HS512",
      });
      // REFRESH TOKEN(token dự phòng)
      const refreshToken = jwt.sign(
        {
          id,
        },
        secret,
        {
          expiresIn: "1d", // expires in 24 hours (24 x 60 x 60)
        }
      );
      //nếu xác thực theo header(không dùng theo phương thức barer token) thì dùng thêm middleware verifyToken
      return res.header("token", token).status(200).json({
        resultId: dataLogin._id,
        payload: dataLogin,
        ok: true,
        login: true,
        token: token,
        refreshToken: refreshToken,
      });
    }
    res.send({ message: "login success" });
  } catch (error) {
    console.log("error");
  }
});

router.post("/refresh-token", async (req, res, next) => {
  const { refreshToken } = req.body;
  jwt.verify(refreshToken, jwtSettings.SECRET, async (err, decoded) => {
    //decoded là cái giải mã token
    if (err) {
      // return res.sendStatus(406);
      return res.status(401).json({ message: "refreshToken is invalid" });
    } else {
      console.log("🍎 decoded", decoded);
      const { id } = decoded;
      const user = await findDocument(id, "customers");
      console.log("hi", user);
      if (user) {
        const secret = jwtSettings.SECRET;

        const payload = {
          message: "payload",
        };

        const token = jwt.sign(payload, secret, {
          expiresIn: 2 * 60, //24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
          audience: jwtSettings.AUDIENCE,
          issuer: jwtSettings.ISSUER,
          subject: id, // Thường dùng để kiểm tra JWT lần sau
          algorithm: "HS512",
        });

        return res.json({ token });
      }
      return res.sendStatus(401);
    }
  });
});

////////////////////////////////////

//Nếu muốn thực hiện hàm get này thì nó phải có token đúng thì nó ms cho sử
//dụng(middleware passport.authenticate có nhiệm vụ kiểm tra token)
// router.get(
//   "/authentication",
//   passport.authenticate("jwt", { session: false }),
//   function (req, res, next) {
//     res.json({ ok: true });
//   }
// );

module.exports = router;
