const mongoose = require ("mongoose")



const User= mongoose.model("User",
{

Username :{
    type: String,
    required: true

},
Email:{
    type: String,
    required: true
} ,
Password :{
    type: String,
    required: true
}







}




);



module.exports = User