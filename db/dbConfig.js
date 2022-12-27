const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"demoPass#00",
    database: "data",
    multipleStatements: true
});

con.connect((err)=>{
    if (err) throw err;
    console.log("Database Connected!");
});

module.exports = {con};
