require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();

//app.use(bodyParser.)
app.use(bodyParser.json());


app.post('/login', (req ,res) => {
    // Autheticate user here
    
    const username = req.body.username;
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
    console.log(accessToken);
});

function authenticateToken(req , res ,next ) {
    const authHeader =  req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        return res.sendStatus(401)
    }

    jwt.verify( token , process.env.ACCESS_TOKEN_SECRET , (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}

app.listen(4000);