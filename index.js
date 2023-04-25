const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const session = require("express-session");

//連結MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("連結到mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use("/api/user", authRoute);
// course route 應被JWT保護
//如果request header內部沒有jet token，則request就會被視為unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

//僅登入系統的人，才可去新增課程或註冊課程
//jwt
app.listen(8080, () => {
  console.log("後端伺服器運行在port8080");
});
