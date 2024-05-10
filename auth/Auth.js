const JWT = require("jsonwebtoken");
require("dotenv").config();
const secretkey = process.env.Secret_Key;

const IsAuthenticated = async (req, res , next) => {
    const token = req.cookies.token;
   
    console.log(token)
    if (!token) {
        return res.status(401).render("login", { message: "Unauthorized! You need to be LOgged in" })
    }
    JWT.verify(token, secretkey, (err, decoded) => {
        if (err) {
            if (err.name = "TOKENEXPIRED") {
                return res.status(401).render("login", { message: "Session Expired!Plesae login Again." })

            }
            return res.status(403).render('login', { message: "Forbidden! Some Server Error" });
        }

        req.userid = decoded.userId;
        console.log(decoded.id)
        next();





    })






}


module.exports = IsAuthenticated;
