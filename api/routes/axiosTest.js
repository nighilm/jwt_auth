const express = require('express');
const router = express.Router();
const axios = require('axios');
const app2 = require('../../app2');

const baseURL = 'https://jsonplaceholder.typicode.com/todos'
router.get('/', (req, res, next ) => {
    axios.get(baseURL)
    .then((response) => {
        const list = []
            response.data.forEach(element => {
                console.log(element)
                a.push(element)
                
            });
            res.json({
                response: list
            })
           // const list = (response.data[]completed ? 't' : 'f' )
           
       
    })
    .catch( console.error )
})

module.exports = router;