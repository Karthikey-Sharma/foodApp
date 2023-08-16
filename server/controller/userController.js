const userModel = require('../models/userModel');

module.exports.getUser = async function getUser(req , res){
          let id = req.id;
          console.log(id);
          // findOne find One document ke liye
          let user = await userModel.findById(id); // gets all users
          if(user){
                    return res.json({
                              message : 'list of all users', 
                              data : user
                    })
          }else{
                    return res.json({
                              hi : "getUseError",
                              message : "Users not found"
                    });
          }
}
          
// frontend ->backend 
// module.exports.postUser = function postUser (req, res){
//                     console.log(req.body);
//                     users = req.body;
//                     res.json({
//                               message : "data recieved",
//                               user : req.body
//                     })
// }
          
          
module.exports.updateProfileImage=function updateProfileImage(req,res){
  res.json({
    message:'file uploaded succesfully'
  });
}

// update -> patch
module.exports.patchUser = async function patchUser(req , res){
            //update data in users obj
  try {
          let id = req.params.id;
          console.log(id);
          let user = await userModel.findById(id);
          console.log(user);
          let dataToBeUpdated = req.body;
          if (user) {
            console.log('inside user');
            const keys = [];
            for (let key in dataToBeUpdated) {
              console.log(key);
              keys.push(key);
            }
      
            for (let i = 0; i < keys.length; i++) {
              console.log(keys[i]);
              user[keys[i]] = dataToBeUpdated[keys[i]];
            }
            console.log(user);
            user.confirmPassword=user.password;
            const updatedData = await user.save();
            console.log(updatedData);
            res.json({
              message: "data updated successfully",
              data: updatedData,
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
      
     
}
// delete
module.exports.deleteUser = async function deleteUser(req , res){
          try{
                    let id = req.params.id;
                    let user = await userModel.findByIdAndDelete(id);
                    res.json({
                              message : "data deleted successfully",
                              data : user
                    })
                    if(!user){
                              res.json({
                                        message : "User not found"
                              })
                    }
          }catch(err){
                    res.json({
                              message : err.message
                    })
          }
          
};

module.exports.getAllUser = async function getAllUser(req, res){
          try {
                    let users = await userModel.find();
                    console.log(users)
                    if (users) {
                         return res.json({
                            message: 'users retrieved',
                            data: users
                        });
                    }
          } catch (err) {
                    return res.json({ message: err.message });
          }
          
}

module.exports.setCookies = function setCookies(req , res){
          //res.setHeader('Set-Cookie','isLoggedIn=true')
          res.cookie('isLoggedIn' , true , ({maxAge: 1000*60*60*24 , secure : true , httpOnly : true}));
          res.cookie('isLoggedIn' , false ,({secure : true}))
          console.log('Cookies: ', req.cookies)
          res.send("Cookies has been set")
}

module.exports.getCookies = function getCookies(req , res){
          let cookies = req.cookies.isLoggedIn;
          console.log(cookies);
          res.send('cookies recieved');
}

