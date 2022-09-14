const express = require('express');
const jwt = require('jsonwebtoken');
const conn = require('../../conn');
const router = express.Router();


router.post('/' , (req , res) => {
    const refreshToken = req.body.token; 
    if (refreshToken  == null ){
        return res.sendStatus(401);
    }
    jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET , (err, user) => {
        if(err){
            res.sendStatus(403);
        }
        console.log(user);
        const name = user.username;
        const uname = { username: name }
        const sql = 'SELECT refresh_token FROM login WHERE username = ? ;' ;;   
        conn.query(sql, [name] , (err, result) => {
            if(err) {
                res.sendStatus(400);
            }
            const refreshTokenDb = result[0].refresh_token;
            if (refreshTokenDb != refreshToken ) {
                return res.sendStatus(403);
            }
            const accessToken = generateAccessToken(uname);     
            const refreshTokenNew = jwt.sign(uname , process.env.REFRESH_TOKEN_SECRET);
            const sql = 'UPDATE login SET refresh_token = ? WHERE username = ? '
            conn.query(sql , [refreshTokenNew, name] , (err, result2) => {
                console.log(refreshTokenNew);
                if(err) {
                    throw err;
                }
                res.status(201).json({
                    message: 'Access token generated successfully!',
                    accessToken: accessToken,
                    refreshToken: refreshTokenNew
                })
            })           
        })
    }) 
})

function generateAccessToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '500s'});
}

module.exports = router;