const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   name: {
            type: String,
            required: true,
   },
   email: {
             type: String,
             required: true,
             unique: true,
   },
   password: {
              type: String,
              required: true,
              
   },
   role: {
            type: Number,
            default: 0,
   },
   answer: {
      type: String,
      required: true,
   }
   
},
{timestamp: true})
module.exports = mongoose.model('users',userSchema)