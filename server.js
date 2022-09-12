require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const conn = require('./conn');

const port = process.env.PORT || 3000 ;

const app = express();

//app.use(bodyParser.)
app.use(bodyParser.json());

const post = [
    {
        "name": "sahil",
        "title": "post1"
    },
    {
        "name": "akhil",
        "title": "post2"
    }
]

app.get('/posts', authenticateToken, (req ,res) => {
    console.log(req.user)
    res.json(post.filter( post => post.name === req.user.name));
})


function authenticateToken(req , res , next ) {
    const authHeader =  req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        return res.sendStatus(401)
    }
    //console.log(token);
    jwt.verify( token , process.env.ACCESS_TOKEN_SECRET , (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        //console.log(user);
        next();
    })
}

app.listen(port,console.log(`Server running on port : ` + port));