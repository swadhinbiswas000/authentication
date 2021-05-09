//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require('md5');


const app = express();

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = mongoose.model("User", userSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((err)=>{
        if(err){
            res.send(err);
        }else{
            res.render("secrets")
        }
    });
});


app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email:username}, (err, foundUser)=>{
       if(err){
           res.send(err)
       }else{
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    }
    })
})









app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})