const express = require("express");
const router = express.Router();
const { Employee } = require("../models/index");
const bcrypt = require("bcryptjs");
var passport = require("passport");
var jwt = require("jsonwebtoken");
const jwtSettings = require("../constant/jwtSetting");
const {
  employeeIdSchema,
  employeeBodySchema,
  validateSchema,
} = require("../validation/employee");

router.get(
  "/",
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      let data = await Employee.find();
      res.send({ ok: true, result: data });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/:id", validateSchema(employeeIdSchema), async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = await Employee.findById(id).then((data) => {
      res.send({ ok: true, result: data });
    });
  } catch {
    (err) => {
      res.status({ error: error.message });
    };
  }
});

///Authenticate customer:

router.post("/", async (req, res, next) => {
  try {
    console.log("data");
    const data = req.body;
    console.log(data);
    let checkEmailExist = await Employee.findOne({ email: data.email });
    if (checkEmailExist) {
      console.log("email exist!!");
      return res.json({ message: "email exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(data.password, salt);

    let newEmployee = new Employee({
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      birthday: data.birthday,
      password: hasPassword,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      position: data.position,
      // imageUrl: data.imageUrl,
    });
    console.log("hello: ", newEmployee);
    let result = await newEmployee.save();
    console.log("hello: ", result);
    res.send({ ok: true, results: result });
  } catch {
    (error) => {
      return res.sendStatus(500);
    };
  }
});

///////////////////////
// router.post("/", validateSchema(employeeBodySchema), async (req, res, next) => {
//   try {
//     const data = req.body;
//     console.log(data);
//     let newEmployee = new Employee(data);
//     let result = await newEmployee.save();
//     res.send({ ok: true, result: result });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

///Login

router.post("/login", async (req, res, next) => {
  try {
    let { EmployeeEmail, password } = req.body;
    const dataInfor = await Employee.findOne({ email: EmployeeEmail });
    console.log("data: ", dataInfor);
    if (!dataInfor) {
      return res.json({ message: "email not exist!!" });
    }
    // console.log("hello: ", EmployeeEmail);
    const id = dataInfor._id.toString();
    // console.log("pass: ", dataInfor.password);
    const checkPassword = await bcrypt.compare(password, dataInfor.password);
    // console.log("checkPassword: ", checkPassword);
    if (!checkPassword) {
      return res.json({ message: "login failed!!" });
    }
    if (checkPassword) {
      var payload = {
        user: {
          name: `${dataInfor.firstName} ${dataInfor.lastName}`,
          email: `${dataInfor.email}`,
        },
        application: "BookingPhotography",
      };
      //Access Token:
      var secret = jwtSettings.SECRET;
      var token = jwt.sign(payload, secret, {
        expiresIn: 2 * 60,
        audience: jwtSettings.AUDIENCE,
        issuer: jwtSettings.ISSUER,
        subject: id,
        algorithm: "HS512",
      });
      const refreshToken = jwt.sign(
        {
          id,
        },
        secret,
        {
          expiresIn: "1d", // expires in 24 hours (24 x 60 x 60)
        }
      );

      return res.header("token", token).status(200).json({
        resultId: dataInfor._id,
        payload: dataInfor,
        ok: true,
        login: true,
        token: token,
        refreshToken: refreshToken,
      });
    }
    res.send({ message: "login success!" });
  } catch (error) {
    console.log("error");
    return res.sendStatus(500);
  }
});

//Create token by refresh token

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    jwt.verify(refreshToken, jwtSettings.SECRET, async (err, decode) => {
      if (err) {
        return res.status(401).json({ message: "refreshToken is invalid" });
      } else {
        console.log("decoded", decoded);
        const { id } = decode;
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
  } catch {}
});
///////////////////////////////

router.delete(
  "/:id",
  validateSchema(employeeIdSchema),
  async (req, res, next) => {
    try {
      const removeData = req.params.id;
      let found = await Employee.findByIdAndDelete(removeData);
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
  // validateSchema(employeeBodySchema),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const itemsBody = req.body;
      // console.log(itemsBody);
      let data = await Employee.findByIdAndUpdate(id, itemsBody);
      res.send({ ok: true, message: "update", results: data });
    } catch {
      (err) => {
        return res.status(500).json({ error: error.message });
      };
    }
  }
);

router.patch("/loginToken/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const itemsBody = req.body;
    await Employee.findByIdAndUpdate(id, itemsBody);
    res.send({ ok: true, message: "update RefreshToken success!!" });
  } catch {
    (err) => {
      return res.sendStatus(500).json({ message: err.message });
    };
  }
});

module.exports = router;
