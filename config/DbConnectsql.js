const MySql = require("mysql")




const connection = MySql.createConnection({
host:"localhost",
user:"root",
password:"",
database:"testdb"


});


const condb = () =>{

try{
connection.connect((error,result)=>{
if(error){
console.log(error)
return


}
console.log("dbconnection is working on mariadb")


});

}catch(err){

console.log(err);



}



}




module.exports={condb,connection};