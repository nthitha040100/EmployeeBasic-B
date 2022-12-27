const db = require("../db/dbConfig");

//Creating table for user data
db.con.query("select * from crud", (err, row) => {
  if (err) {
    db.con.query(
      "CREATE TABLE crud(\
                id INT PRIMARY KEY AUTO_INCREMENT NOT NULL, \
                firstName VARCHAR(10) NOT NULL, \
                lastName VARCHAR(10) NOT NULL, \
                dob DATE NOT NULL, \
                zipCode INT(6) NOT NULL, \
                state VARCHAR(10) NOT NULL, \
                country VARCHAR(10) NOT NULL,\
                password VARCHAR(90) NOT NULL  \
                profilePicPath VARCHAR(255) \
            );"
    );
  }
});

//Creating table for user credentials
db.con.query("select * from credentials", (err, row) => {
  if (err) {
    db.con.query(
      "CREATE TABLE credentials(\
            id INT PRIMARY KEY AUTO_INCREMENT, \
            username VARCHAR(10) NOT NULL, \
            pass VARCHAR(90) NOT NULL \
            );"
    );
  }
});

let errorDb = Error();

signUpDB = function (
  firstName,
  lastName,
  dob,
  zipCode,
  state,
  country,
  password
) {
  db.con.query(
    "INSERT INTO crud(firstName, \
            lastName, \
            dob, \
            zipCode, \
            state, \
            country,\
            password) \
        VALUES(?,?,?,?,?,?,?); \
        ",
    [firstName, lastName, dob, zipCode, state, country, password],
    (err) => {
      if (err) {
        console.log(err);
        errorDb.message = err.message;
      }
    }
  );
};

editUserDB = function (
  id,
  firstName,
  lastName,
  dob,
  zipCode,
  state,
  country,
) {

  db.con.query(
    "UPDATE crud \
            SET firstName = ?, \
                lastName = ?,\
                dob = ?,\
                zipCode =?,\
                state = ?,\
                country = ?\
                \
            WHERE id = ?\
        ",
    [firstName,
      lastName,
      dob,
      zipCode,
      state,
      country,
      id
    ],
    (err, row) => {
      if (err) {
        console.log("model: " + err);
        errorDb.message = err.message;
      }
    }
  );
};


module.exports = { signUpDB, editUserDB, errorDb };
