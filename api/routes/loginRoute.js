const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const conn = require('../../conn');
const router = express.Router();


router.post('/', async (req ,res ,next ) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    
    const sql = 'SELECT password, username, name FROM login WHERE username = ? OR email = ? ';
    conn.query(sql , [ user.username , user.email] , async (err, result1) => {
        const uname = { username: result1[0].username };
        if(err) {
            throw err;
        }
        if(!result1){
            res.status(404).json({
                message: 'User not found'
            })
        }
        try {
            if (await bcrypt.compare(user.password, result1[0].password)) {
                const accessToken = generateAccessToken(uname);
                const refreshToken = jwt.sign(uname , process.env.REFRESH_TOKEN_SECRET);
                const sql = 'UPDATE login SET refresh_token = ? WHERE username = ? OR email = ?'
                conn.query(sql , [refreshToken, user.username , user.email] , (err, result2) => {
                    if(err) {
                        throw err;
                    }
                    res.status(200).json({
                        message: "Login successfull !",
                        welcome: result1[0].name,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    })
                })
                
            } else {
                res.status(400).json({
                    message: 'Incorrect password'
                })
            }
        } catch {
            res.status(500).json({
                errorMessage: 'Error'
            })
        }

        
    })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '500s'});
}

module.exports = router;