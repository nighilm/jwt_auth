const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test_db'
});

conn.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Database connected successfully...')
});

module.exports = conn;