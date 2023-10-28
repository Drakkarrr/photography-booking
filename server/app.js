var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
//JWT
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtSettings = require("./constant/jwtSetting");

const { findDocument } = require("./helper/MongoDBHelper");

//định nghĩa - khai báo các router:

var customerRouter = require("./routes/customer");
var employeeRouter = require("./routes/employee");
var photographyPackageRouter = require("./routes/photographyPackage");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var orderRouter = require("./routes/order");
var uploadRouter = require("./routes/upload");
var authRouter = require("./routes/auth");
var reTokenRouter = require("./routes/refreshToken");
var rolesRouter = require("./routes/role");

// MONGOOSE
const { default: mongoose } = require("mongoose");
const { CONNECTION_STRING } = require("./constant/dbSetting");

const app = express();
app.use(express.static("public"));
// var path = require('path');
// app.use('/uploads', express["static"](path.join(__dirname, 'public/uploads')));
//ĐĂNG KÝ KHỞI TẠO CÁC ROUTERS
// view engine setup
//để tạo web trên node nhưng ta đã dùng react và next thay thế nên ko cần xài
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //cookie
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
  })
);

// Passport: jwt
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //jwtFromRequest yêu cầu khi client gửi lên các token thì đặt là header
opts.secretOrKey = jwtSettings.SECRET; //xác nhận SCRET
opts.audience = jwtSettings.AUDIENCE; //xác nhận AUDIENCE
opts.issuer = jwtSettings.ISSUER; //xác nhận ISSUER
// đây là midleWare
passport.use(
  //JwtStrategy là phương pháp kiểm soát có các option là opts
  new JwtStrategy(opts, async (payload, done) => {
    // payload là data nhận vào, done là một function báo thực hiện xong công việc
    // console.log(payload);
    const id = payload.sub;
    // console.log(payload);
    const found = await findDocument(id, "customers");
    // console.log('🐣', found)
    if (found) {
      //subject mà nằm trong WHITE_LIST thì thực thi các công việc ở dưới
      let error = null;
      let user = true;
      return done(error, user);
    } else {
      let error = null;
      let user = false;
      return done(error, user);
    }
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/customer", customerRouter);
app.use("/order", orderRouter);
app.use("/employee", employeeRouter);
app.use("/photographyPackage", photographyPackageRouter);
app.use("/upload", uploadRouter);
app.use("/auth", authRouter);
app.use("/reToken", reTokenRouter);
app.use("/roles", rolesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

mongoose.set("strictQuery", false);
mongoose.connect(CONNECTION_STRING);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
