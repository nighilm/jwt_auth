const express = require('express');
const jwt = require('jsonwebtoken');
const conn = require('../../conn');
const router = express.Router();


router.get('/', authenticateToken, (req ,res) => {
    const sql = 'SELECT email FROM login WHERE username = ? '
    conn.query(sql, [req.user.name] , (err, result) => {
        if(err) {
            res.sendStatus(400);
        }
        res.status(200).json({
            message : "welcome" + req.user.name,
            email: result[0].email
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
        next();
    })
}

module.exports = router; 