const express = require('express');
const jwt = require('jsonwebtoken');
const conn = require('../../conn');
const router = express.Router();


router.get('/', authenticateToken, (req ,res) => {
    const sql = 'SELECT name FROM login WHERE username = ? '
    conn.query(sql, [req.user.username] , (err, result) => {
        if(err) {
            res.sendStatus(400);
        }
        console.log(result);
        res.status(200).json({
            message : "welcome " + result[0].name
        })
    })
})

function authenticateToken(req , res , next ) {
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
        console.log(req.user);
        next();
    })
}

module.exports = router; 