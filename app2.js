const express = require('express');
const app2 = express();
const bodyParser = require('body-parser');


const postsRoute = require('./api/routes/postsRoute');


app2.use(bodyParser.urlencoded({ extended: true }));
app2.use(bodyParser.json());
app2.use(bodyParser.raw());


app2.use((req ,res ,next) => {
    res.header('Access-Control-Allow-Orgin','*');
    res.header('Access-Control-Allow-Headers','Orgin, X-Requested-With , Content-Type , Accept , Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods' , 'PUT, POST ,GET , DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});


app2.use( '/posts' ,postsRoute);

app2.use((req , res , next) => {
    const error = new Error('Not Found!');
    error.status = 404;
    next(error);
})

app2.use((error, req , res ,next) => {
    res.status( error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app2;