const mongoose = require('mongoose');

const mongo_uri = "mongodb+srv://admin:1r4iUm6EaxeZkky8@cluster0.jxlhgv9.mongodb.net/?retryWrites=true&w=majority"

const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db_link = mongo_uri
mongoose.connect(db_link)
.then(function(db){
          console.log("DataBase Connected");
})
.catch(function(err){
          console.log(err);
})

const userSchema = mongoose.Schema({
          name : {
                    type : String,
                    required : true
          },
          email : {
                    type : String,
                    required : true,
                    unique : true,
                    validate : function(){
                              return emailValidator.validate(this.email); // this ke andar pura schema bankar aata hai
                    }
          },
          password : {
                    type : String ,
                    required : true,
                    minLength : 8
          },
          confirmPassword : {
                    type : String ,
                    required : true,
                    minLength : 8,
                    validate : function(){
                              return this.confirmPassword == this.password;
                    }
          } , 
          role : {
                    type : String , 
                    enum : ['admin' , 'user' , 'restaurantOwner' , 'deliveryboy'],
                    default : 'user'
          },
          profileImage : {
                    type : String,
                    default : 'img/users/default.jpeg'
          },
          resetToken : String
});

// userSchema.pre('save', function (){
//           console.log("Before saving in db");
// })

// userSchema.post('save' , function(){
//           console.log("After saving in db");
// })

userSchema.pre('save' , function(){
          this.confirmPassword = undefined;
});

// userSchema.pre('save' , async function(){
//           let salt = await bcrypt.genSalt();
//           let hashedString = await bcrypt.hash(this.password , salt);
//           this.password  = hashedString;
//           // console.log(hashedString);
// })

userSchema.methods.createResetToken = function(){
          // crypto unique token using npm i crypto
          const resetToken = crypto.randomBytes(32).toString('hex');
          this.resetToken = resetToken;
          return resetToken;
}

userSchema.methods.resetPasswordHandler=function(password,confirmPassword){
          this.password=password;
          this.confirmPassword=confirmPassword;
          this.resetToken=undefined;
}
        
        
// model
const userModel = mongoose.model('userModel' , userSchema);
module.exports = userModel
// (async function createUser(){
//           let user = {
//                     name : "Parul",
//                     email : "abcdefedg@gmail.com",
//                     password : "12345678",
//                     confirmPassword : "12345678"
//           };
//           let data = await userModel.create(user);
//           console.log(data)

// })();



