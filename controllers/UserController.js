const JWT = require("jsonwebtoken")
const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
require("dotenv").config();
 const secretkey = process.env.Secret_key



const registerController = async (req, res) => {
    const { Username, Email, Password } = req.body;

    const isuser = await User.findOne({ Email });

    const hashedpss = await bcrypt.hash(Password, 10);

    if (!isuser) {
        const newuser = await new User({ Username, Email, Password : hashedpss })
        const Cuser = await newuser.save();

        if (Cuser) {
            res.redirect('/login')

        }
        else {
            res.render('register', { message: 'user already exists' });

        }

    }





}


const loginController = async (req, res) => {
    const {Email,Password } = req.body;
    
    let user = await User.findOne({Email});

   console.log(user)
    if (user) {
        const verifyPass = await bcrypt.compare(Password , user.Password)
        console.log(verifyPass)
        if (verifyPass) {
            const token = JWT.sign({ userId: user._Id }, secretkey)
            
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000


            });
            res.render("home", { Username: user.Username })


        }
        else {
            res.render("login", { message: "password incorrect" })


        }

    }
    else {
        res.render("login", { message: "User not found! Try with a valid email" })




    }




}


module.exports = { registerController, loginController };