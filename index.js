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
const {register, login, blog} = require("./controllers/TestController");

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



app.post("/register", register);
app.post("/login", login);
app.post("/blog",multMidWare, blog);




app.listen(port , ()=>{

    console.log(`server listning on PORT ${port}`)
})