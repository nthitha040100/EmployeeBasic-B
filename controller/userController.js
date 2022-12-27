const db = require("../db/dbConfig");
const error = require("../Error.json");
const modelDB = require("../Model/userModel");
const multer = require('multer');
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();

let storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './upload/')
  },
  filename: (req, file, callBack) => {
    const ext = file.mimetype.split('/')[1]
    callBack(null, `${file.fieldname}-${Date.now()}.${ext}`)
  }
})

let saveImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
}).single('photo')

module.exports = {

  homePage: (req, res) => {
    res.redirect('../signIn/signIn.html');
  },

  getAll: (req, res) => {

    db.con.query(
      "Select id,firstName,lastName, date_format(dob, '%d-%m-%Y') as dob, zipCode, state, country, password, profilePicPath from crud",
      (err, row) => {
        if (!err) {
          return res.send({
            status: { code: error[0].code, Message: error[0].message },
            Data: { Result: row },
          });
        } else {
          return res.send(err);
        }
      }
    );
  },

  getAccountInfo: (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let user = jwt.verify(token, process.env.ACCESS_PRIVATE_KEY);
    db.con.query(
      "Select id,firstName,lastName, date_format(dob, '%d-%m-%Y') as dob, zipCode, state, country, password, profilePicPath from crud where firstName = ?",
      [user.firstName],
      (err, row) => {
        if (!err) {
          return res.send({
            status: { code: error[0].code, Message: error[0].message },
            Data: { Result: row },
          });
        } else {
          return res.send(err);
        }
      }
    );
  },

  deleteAccount: (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let user = jwt.verify(token, process.env.ACCESS_PRIVATE_KEY);
    let password = req.body.password;


    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        res.status(401).json({ message: "Wrong password" });
      }
      else {
        if (result) {
          db.con.query(
            `Delete from crud where firstName = ?;`,
            [user.firstName],
            (err, row) => {

              if (!err) {
                return res.send({
                  status: { code: error[0].code, Message: error[0].message },
                  Data: { Result: "Deleted Successfully!" },
                });
              } else {
                return res.send(err);
              }
            }
          );
        } else {
          res.status(401).json({ message: "Wrong password" });
        }
      }
    });

  },

  uploadImage: (req, res) => {
    saveImage(req, res, function(err){
      if(err){
        res.status(400).json({message: err})
      }else{

        if (!req.file) {
          res.status(400).json({ message: "No file upload" });
        } else {
          
          const url = req.protocol + '://' + req.get('host')
          let firstName = req.body.firstName
          db.con.query('UPDATE crud SET ProfilePicPath = ? where firstName=?', 
          [url + /upload/ + req.file.filename, firstName], (err, row) => {
            if(err){
              console.log(`Err: ${err}`)
            }
          })
          res.status(200).json({ message: "Image uploaded successfully!" });
          
        }
        
      }
    });
    },

  editUser: (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let user = jwt.verify(token, process.env.ACCESS_PRIVATE_KEY);

    let id = user.id;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let dob = req.body.dob;
    let zipCode = req.body.zipCode;
    let state = req.body.state;
    let country = req.body.country;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      db.con.query(
        "SELECT * from crud where firstName= ?;",
        [firstName],
        (err, row) => {
          if (row.length > 0) {

            modelDB.editUserDB(
              id,
              firstName,
              lastName,
              dob,
              zipCode,
              state,
              country,
            )
            setTimeout(() => {
              if (modelDB.errorDb == null || Object.keys(modelDB.errorDb).length === 0) {
                res.status(200).json({ message: "User updated successfully!" });
              } else {
                console.log("in controller: " + modelDB.errorDb);
                res.status(400).json(modelDB.errorDb);
                modelDB.errorDb = undefined;
              }
            }, 1000);
          }
          else {
            res.status(400).json({ message: "User does not exists" });
          }
        }
      );
    }
  },

  signUp: (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let dob = req.body.dob;
    let zipCode = req.body.zipCode;
    let state = req.body.state;
    let country = req.body.country;
    let password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      db.con.query(
        "SELECT * from crud where BINARY firstName= ?;",
        [firstName],
        (err, row) => {
          if (row.length <= 0) {
            bcrypt.hash(password, saltRounds, function (err, hash) {
              modelDB.signUpDB(
                firstName,
                lastName,
                dob,
                zipCode,
                state,
                country,
                hash
              );
              setTimeout(() => {
                if (modelDB.errorDb == null || Object.keys(modelDB.errorDb).length === 0) {
                  res.status(200).json({ message: "User created successfully!" });
                } else {
                  console.log(modelDB.errorDb);
                  res.status(400).json(modelDB.errorDb);
                  modelDB.errorDb = undefined;
                }
              }, 1000);
            });
          } else {
            res.status(400).json({ message: "User exists" });
          }
        }
      );
    }
  },

  signIn: (req, res) => {
    let firstName = req.body.firstName;
    let password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      db.con.query(
        "Select password,id from crud where BINARY firstName = ?",
        [firstName],
        (err, row) => {
          if (row.length <= 0) {
            res.status(404).json({ message: "Username not found" });
          } else if (!err) {
            row.forEach((element) => {
              bcrypt.compare(
                password,
                element.password,
                function (err, result) {
                  if (result) {
                    let token = jwt.sign(
                      {
                        id: element.id,
                        firstName: firstName,
                        password: element.password
                      },
                      process.env.ACCESS_PRIVATE_KEY
                    );
                    res
                      .status(200)
                      .json({ message: "Welcome Back", token: token });
                  } else {
                    res.status(401).json({ message: "Invalid Password." });
                  }
                }
              );
            });
          }
        }
      );
    }
  },

  notfound: (req, res) => {
    res.send({ code: error[2].code, message: error[2].message });
  },

  internalServer: function (err, req, res, next) {
    console.log(err);
    res.status(500);
    res.send({
      code: error[3].code,
      message: error[3].message,
    });
  },
};
