const { connection } = require("../config/DbConnectsql");
const { v4: uuidv4 } = require("uuid");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretkey = process.env.Secret_key;

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
          const token = await JWT.sign({ userId: result[0].userId }, secretkey);
          res.cookie("token", token, {
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

module.exports = { register, login };
