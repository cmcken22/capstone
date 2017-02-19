var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  role: String,
  patients: [{ type:mongoose.Schema.ObjectId, ref: 'User' }],
  doctor: { type : mongoose.Schema.ObjectId, ref: 'User' }
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

// userSchema.pre("save",function(next, done) {
//     var self = this;
//     mongoose.models["User"].findOne({email : self.email},function(err, results) {
//         if(err) {
//             done(err);
//         } else if(results) { //there was a result found, so the email address exists
//             self.invalidate("email","email must be unique");
//             done(new Error("email must be unique"));
//         } else {
//             done();
//         }
//     });
//     next();
// });

mongoose.model('User', userSchema);
