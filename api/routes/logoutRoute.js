const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const conn = require('../../conn');

router.delete('/', (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if(!refreshToken) {
        res.sendStatus(401);
    }
    jwt.verify( refreshToken , process.env.REFRESH_TOKEN_SECRET , (err, user) => {
        if(err) {
            res.status(401).json({
                errorMessage: 'Error'
            })
        }
        console.log(user);
        const username = user.username;
        const sql = 'SELECT refresh_token FROM login WHERE username = ? '
        conn.query( sql , [username] , ( err, result ) => {
            if(err){
                res.sendStatus(400)
            }
            const refreshTokenDb = result[0].refresh_token;
            if( refreshTokenDb != refreshToken ){
                return res.sendStatus(403);
            }
            const sql = 'UPDATE login SET refresh_token = "NULL" WHERE username = ? '
            conn.query( sql, [username] , (err,result1) => {
                if(err){
                    throw err;
                }
                res.status(205).json({
                    message: " Logout Successfull !"
                })
            })
        })
    })
})

module.exports = router;