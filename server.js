const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static("express"));// default URL for website

app.all('*', function (req, res, next) {
   res.sendFile(path.join(__dirname+req.url));
});

// app.all('/node_modules/*', function (req, res, next) {
//   res.sendFile(path.join(__dirname+req.url));
// });
// app.use('/', function(req,res){
//   res.sendFile(path.join(__dirname+'/index.html'));
//   //__dirname : It will resolve to your project folder.
// });

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
