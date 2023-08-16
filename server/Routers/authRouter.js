let express = require('express');
const authRouter = express.Router();
const userModel = require('../models/userModel');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const {JWT_KEY} = require('../secret.js')
// authRouter
//           .route("/signup")
//           .get(getSignUp)
//           .post(postSignUp)

authRouter
  .route('/login')
  .post(loginUser)




function getSignUp(req, res) {
  res.sendFile('/public/index.html', { root: __dirname })
}

async function postSignUp(req, res) {
  let obj = req.body;
  let user = await userModel.create(obj);
  console.log("backend", obj);
  res.json({
    message: "User Signed up",
    data: user
  });
}

async function loginUser(req, res) {
  let data = req.body;
  let user = await userModel.findOne({ email: data.email })
  try {
    if (data.email) {
      if (user) {
        //bcrypt -> compare
        if (user.password == data.password) {
          let uid = user['_id'];// uid
          let token = jwt.sign({ payload: uid }, JWT_KEY);
          res.cookie("login", token, { httpOnly: true });
          return res.json({
            message: "User has logged in",
            userDetails: data, // userDetails:data,
          });
        } else {
          return res.json({
            message: "wrong credentials",
          });
        }
      } else {
        return res.json({
          message: "User not found",
        });
      }
    }

  } catch (err) {
    return res.json({
      message: err.message,
    });
  }

}

module.exports = authRouter