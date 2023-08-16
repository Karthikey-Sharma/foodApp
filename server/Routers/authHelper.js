const jwt = require('jsonwebtoken')
const JWT_KEY = require('../secret.js')
// let flag = false; // user logged in or not
function protectRoute(req, res, next) {
          if (req.cookies.login) {
                    console.log(req.cookies)
                    let isVerified = jwt.verify(req.cookies.login, JWT_KEY.JWT_KEY);
                    if (isVerified) {
                              next();
                    } else {
                              return res.json({
                                        message: 'user not verified',
                              })
                    }
          } else {
                    return res.json({
                              message: "Operation not allowed"
                    })
          }
}
module.exports = protectRoute