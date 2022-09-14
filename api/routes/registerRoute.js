const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conn = require('../../conn');
const router = express.Router();


router.post('/', async (req ,res) => {
    // Autheticate user 
    const password = req.body.password;
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password , salt);
        const uname = { username: req.body.username };
        const accessToken = generateAccessToken(uname);
        const refreshToken = jwt.sign(uname , process.env.REFRESH_TOKEN_SECRET);
        const user = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            refreshToken: refreshToken
        }
        const sql = 'INSERT INTO login (name, username , email , password , refresh_token ) VALUES (? , ? , ? , ? , ?)'
        conn.query(sql , [user.name, user.username , user.email , user.password , user.refreshToken ] , (err, result) => {
            if(err) {
                res.status(400).json({
                    errorMessage: "User already exists or insufficient details provided !",
                    error: err
                })
                return;
            }
            res.status(201).json({
                message: "User registered successfully !",
                refreshToken: refreshToken,
                accessToken: accessToken
            })
        })
    } catch  {
        res.status(500).json({
            error: 'ERROR'
        })
    }
 });

function generateAccessToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s'});
}


module.exports = router ;