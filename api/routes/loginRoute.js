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
   // console.log(user);
    const sql = 'SELECT password  FROM login WHERE username = ? OR email = ? ;' ;
    conn.query(sql , [user.username , user.email] , async (err, result) => {
        if(err) {
            throw err;
        }
        if (result == null) {
            res.status(400).json({
                message: 'User not found'
            })
        }
        try {
            if( await bcrypt.compare(user.password, result[0].password)){
                res.status(200).json({
                    message: 'Login successfull!'
                })
        // 

        // 
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

module.exports = router;