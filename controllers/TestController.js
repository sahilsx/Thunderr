const { connection } = require("../config/DbConnectsql");
const { v4: uuidv4 } = require("uuid");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { query } = require("express");
const secretkey = process.env.Secret_key;

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});





const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const id = uuidv4();
    const pass = await bcrypt.hash(password, 10);
    const values = [id, username, email, pass];
    const SelectQuery = `SELECT * FROM userx WHERE email =?`;
    const Query = `INSERT INTO userx VALUES (?,?,?,?)`;

    connection.query(SelectQuery, [email], (selecterr, selectresult) => {
      if (selecterr) {
        console.log(selecterr);
        return;
      }
      console.log(selectresult);
      if (selectresult.length > 0) {
        res.render("register", { message: "User already exists" });
      } else {
        connection.query(Query, values, (err, result) => {
          if (err) {
            console.log(err);
          }
          res.render("register", { message: "user created successfully" });
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const SelectQuery = `SELECT * FROM userx WHERE email = ?  `;

    connection.query(SelectQuery, [email], async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      if (result.length > 0) {
        console.log(result);
        const verify = await bcrypt.compare(password, result[0].password);
        if (verify) {
          const token = await JWT.sign({ userId : result[0].id }, secretkey);
          console.log(result[0].id,{message:"this is userid"} )
          const userId = result[0].id;
          res.cookie("token",token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.redirect("/home");
        } else {
          res.render("login", {
            message: "Wrong Password! Please try with a valid one.. ",
          });
        }

        // User found, redirect to dashboard or wherever you want
      } else {
        // User not found or password incorrect
        res.render("login", { message: "Invalid email " });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const blog = async (req, res) => {
  try {
    const userId = req.userid;
    console.log(userId)
    const { title, content } = req.body;

    console.log(req.body)

    const id = uuidv4();
    const image = req.file.path

    console.log(image)

    if(!image){
      return res.render("blog", { message: "select an image" })
    }

    const upload = await cloudinary.uploader.upload(image , {
      folderName : "test"
    }) 

    const imageUrl =  upload.secure_url




    const values = [id,userId , title, imageUrl, content];
    const Query = `INSERT INTO bloger VALUES (?,?,?,?,?)`;

    connection.query(Query, values, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
     
      res.render("blog", { message: "blog uploaded successfully" });
    });
  } catch (err) {
    console.log(err);
  }
};


const getBlog = async (req, res) => {
  try {
    const blogId = req.userid; 

    const query = 'SELECT title, image, content FROM bloger WHERE userId = ?';
    connection.query(query, [blogId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      const blogPosts = result; 
      res.render("myposts" , {blogPosts});
       console.log(blogPosts)
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getAllBlog = async(req,res)=>{
const query = 'SELECT * FROM bloger'
   

connection.query(query,"",(err,result)=>{
 if(err){
 console.log(err)

 }
 const blogAllPosts = result; 
 res.render("explore" , {blogAllPosts});
  console.log(blogAllPosts)

})



}







module.exports = { register, login, blog, getBlog, getAllBlog };
