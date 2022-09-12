require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000 ;
const conn = require('./conn');

const app = express();

//app.use(bodyParser.)
app.use(bodyParser.json());

let refreshTokens = [];

app.post('/token' , (req , res) => {
    const refreshToken = req.body.token; 
    if (refreshToken  == null ){
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET , (err, user) => {
        console.log(user);
        const name = user.name;
        if(err){
            res.sendStatus(403);
        }
        const accessToken = generateAccessToken({ name: name });
        console.log(user);
        /*
        const sql = 'UPDATE login SET access_token = ? WHERE username = hi ;'
        conn.query(sql, [accessToken] , (err,result) => {
            if (err) {
                res.status(400).json({
                    errorMessage: 'Error registering, try agin...',
                    error: err
                });
            } else {
                res.status(201).json({
                    message: 'User registered successfully!'
                })
            }
        })
        */
        return res.json({
            accessToken: accessToken
        })
        
    })
})

app.post('/register', (req ,res) => {
    // Autheticate user here
    
    

    //
    const username = req.body.username;
    const user = { name: username };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    const sql = 'UPDATE login SET refresh_token = ?  WHERE username = "hi" ;' ;
    conn.query(sql , [refreshToken] , (err, result) => {
        console.log(refreshToken);
        
        if (err) {
           return res.json({
                errorMessage: 'Error registering, try agin...',
                error: err
            });
        } else {
            return res.json({
                message: 'User registered successfully!'
            })
        }
        
       
    });
    //res.json({ 
    //    accessToken: accessToken ,
    //    refreshToken: refreshToken
   // });
    console.log('ede');
    refreshTokens.push(refreshToken);
   
   
    console.log(accessToken);
});

function generateAccessToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s'});
}

app.listen(port,console.log(`Authentication Server running on port : ` + port));