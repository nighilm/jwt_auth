const express = require('express');
const jwt = require('jsonwebtoken');
const conn = require('../../conn');
const router = express.Router();

router.post('/', (req ,res) => {
    // Autheticate user here
    
    

    //
    const username = req.body.username;
    const user = { name: username };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    const sql = 'UPDATE login SET refresh_token = ?  WHERE username = ? ;' ;
    conn.query(sql , [refreshToken ,user.name ] , (err, result) => {    
        if (err) {
            res.status(400).json({
                errorMessage: 'Error registering, try agin...',
                error: err
            });
        } else {
            res.status(201).json({
                message: 'User registered successfully!',
                accessToken: accessToken          
            })
        }    
    });
});

function generateAccessToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s'});
}


module.exports = router ;