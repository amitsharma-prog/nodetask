 const express = require("express");
 const hbs = require('hbs');
 const path = require("path");
 const app = express();
 var mysql = require("mysql");
 var bodyParser = require('body-parser');
 const dt = require("./dateTime");

const PORT = 3001;

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

// Current Date Time
const nDate = dt.dateTime();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const tamplatesPath = path.join(__dirname, 'view');
app.use(express.static('public'))

app.set('view engine', 'hbs');
app.set("views", tamplatesPath);

app.get('/', (req, res)=> {
    res.render("home");
})

// Add User INTO Database
app.post('/', (req,res) =>{
    // res.send(req.body);
    const {name, email, phone, password} = req.body;
    let query = "select * from users where email=? and phone=?";
    con.query(query, [email, phone], (err, result) =>{
        if(err) throw err;
        else {
            if(result.length > 0) {res.render('home', {msg2:true});}
            else {
                let insertData = "insert into users(name, email, phone, password, created_at) values(?,?,?,?,?)";
                con.query(insertData, [name, email, phone, password, nDate], function(err, result) {
                    if(result.affectedRows > 0) {
                        res.render('home', {msg:true});
                    }else {throw err;}
                })
            }
        }
    })
})

// Delete User
app.get('/users/:id', (req, res)=> {
    var userId = req.params.id;
    con.query("DELETE FROM users WHERE id="+userId +"", function(err, result) {
        if (err) throw err;
        res.status(202);
        res.redirect("/users")
    });
})

// View All Users 
app.get('/users', (req, res)=> {
    con.query("select * from users", function(err, result) {
        if (err) throw err;
        // res.send(result );
        res.render("users", {
            data:result
        });
    });
})
app.get('*', (req, res)=> {
    var userId = req.params.id;
    con.query("select * from users where id="+userId +"", function(err, result) {
        res.render('404');
    });
})

app.listen(PORT, ()=> {
    console.log("server run this ", PORT);
})
