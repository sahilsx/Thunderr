const mongoose = require("mongoose")
require("dotenv").config();


const url =process.env.Mongo_url

const dbconnect = async() =>{
try{
  await mongoose.connect(url,{  serverSelectionTimeoutMS: 50000 });

console.log (`Database connect on ${url}`)

}

catch (err){
console.log(err)

}





};
module.exports = dbconnect;