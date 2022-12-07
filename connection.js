var mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ocpp-users"
})
con.connect(function(error) {
    if (error) throw error;
    console.log("connected");
    
})

// exports.module = con;