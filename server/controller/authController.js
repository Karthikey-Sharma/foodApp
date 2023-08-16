let express = require('express');
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
const {JWT_KEY} = require('../secret.js')
const {sendMail} = require("../utility/nodemailer")

//sign up user
module.exports.signup = async function signup(req, res) {
  try {
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    sendMail("signup" , user)
    if (user) {
      return res.json({
        message: "user signed up",
        data: user,
      });
    } else {
      res.json({
        message: "error while signing up",
      });
    }
    // console.log('backend',user);
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.login = async function login(req, res) {
  try {

    let data = req.body;
    let user = await userModel.findOne({ email: data.email });
    if (data.email) {
      if (user) {
        //bcrypt -> compare
        console.log(user)
        if (user.password == data.password) {
          let uid = user['_id'];// uid
          data._id=uid;
          data.name=user['name'];
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
      hi: "nice"
    });
  }
};

module.exports.isAuthorised = function isAuthorised(roles) {
  console.log("hi is auth is running");
  return function (req, res, next) {
    console.log(req.role);
    if (roles.includes(req.role)) {
      next();
    } else {
      res.status(401).json({ // unauthorized access status role
        hi : "isAuthorised Error",
        message: "operation not allowed"
      });
    }
  };
};

//protectRoute
module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    let token;
    if (req.cookies.login) {
      console.log(req.cookies);
      token = req.cookies.login;
      let payload = jwt.verify(token, JWT_KEY);
      if (payload) { // jb bhi koi token verify hota hai wo payload return krta hai
        console.log("payload token", payload);
        const user = await userModel.findById(payload.payload);
        req.role = user.role;
        req.id = user.id;
        console.log(req.role, req.id);
        next();
      } else {
        return res.json({
          message: "please login again",
        });
      }
    } else {
      //browser
      const client=req.get('User-Agent');
      if(client.includes("Mozilla")==true){
        return res.redirect('/login');
      }
      //postman
      res.json({
        message: "please login",
      });
    }
  } catch (err) {
    return res.json({
      hi : "protect Route error",
      message: err.message
    });
  }
};

module.exports.forgetpassword = async function forgetpassword(req, res) {
  let { email } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      //createResetToken is used to create a new token
      const resetToken = user.createResetToken();
      // http://abc.com/resetpassword/resetToken
      let resetPasswordLink = `${req.protocol}://${req.get(
        "host"
      )}/resetpassword/${resetToken}`;
      //send email to the user
      //nodemailer
      let obj={
        resetPasswordLink:resetPasswordLink,
        email:email
      }
      sendMail("resetpassword",obj);
      return res.json({
        mesage: "reset password link sent",
        data:resetPasswordLink
      });
    } else {
      return res.json({
        mesage: "please signup",
      });
    }
  } catch (err) {
    res.status(500).json({
      mesage: err.message,
    });
  }
};

//resetPassword
module.exports.resetpassword = async function resetpassword(req, res) {
  try {
    const token = req.parmas.token;
    let { password, confirmPassword } = req.body;
    const user = await userModel.findOne({ resetToken: token });
    if (user) {
      //resetPasswordHandler will update user's password in db
      user.resetPasswordHandler(password, confirmPassword);
      await user.save();
      res.json({
        message: "password changed succesfully, please login again",
      });
    } else {
      res.json({
        message: "user not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};


module.exports.logout=function logout(req,res){
  res.cookie('login',' ',{maxAge:1});
  res.json({
    message:"user logged out succesfully"
  });
}


