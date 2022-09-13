require('dotenv').config();

const http = require('http');
const app = require('./app1');
const port = process.env.PORT || 4000 ;


const server = http.createServer(app);
server.listen(port,console.log(`Authentication Server running on port ${port} ` ));