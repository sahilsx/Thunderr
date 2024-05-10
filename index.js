const express =require ("express")
const mongoose = require ("mongoose")
const path = require ("path")
const dbConnect = require("./config/dbconnect");
const multMidWare = require("./middlewares/multer")

const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
// const exphbs = require('express-handlebars');
const port = 4000 
require("dotenv").config();
const {register, login, blog, getBlog} = require("./controllers/TestController");

const {registerController, loginController  } = require("./controllers/UserController");
const {condb} = require("./config/DbConnectsql");
const IsAuthenticated = require("./auth/Auth");






  const app = express();
  // dbConnect();
  condb();
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(express.json());
 app.use(cookieParser())




//  app.engine('hbs', exphbs.engine({
//   defaultLayout: 'layout',
//   extname: '.hbs'
    
// }));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// // setting static files directory
app.use(express.static(path.join(__dirname, "public")));





app.get('/' , (req,res) =>{res.sendFile(path.join(__dirname + "/views/index.html")) })

app.get('/login' , (req,res)=>{res.render('login')})
app.get("/register", (req, res) => {res.render("register")});
app.get('/home',(req,res)=>{res.render('Home')})
app.get('/blog',IsAuthenticated,(req,res)=>{res.render('blog')})
app.get('/profile',IsAuthenticated,(req,res)=>{res.render('myprofile')})
app.get('/myblogs',IsAuthenticated,getBlog,(req,res)=>{res.render('myposts')})
// app.get('/myblogs',IsAuthenticated,getBlog)
// app.get('/myblogs',IsAuthenticated, (req, res) => {
//   // Call your getBlog function to fetch the blog post data
//   getBlog(req.userid)
//     .then(blogPosts => {
//       res.render('myposts', { blogPosts });
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//     });
// });

app.post("/register", register);
app.post("/login", login);
app.post("/blog",IsAuthenticated,multMidWare, blog);




// app.get('/blogs', IsAuthenticated,async (req, res) => {
//   const userId = req.userid; // Assuming you have the userId available in the request object

//   try {
//     const allposts = await Post.find(userId);
//     res.render('myposts', { blogPosts });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });



app.listen(port , ()=>{

    console.log(`server listning on PORT ${port}`)
})