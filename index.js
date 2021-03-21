
const express = require("express");
const app = express();
var fs = require("fs");

var ssls = {
  key: fs.readFileSync('./chat.pem', 'utf8')
};
const http = require('https').createServer(ssls, app);
const io = require('socket.io')(http);
const path = require("path");
const { config } = require("./config");
app.use("/emoji_plugin",express.static(path.join(__dirname, 'emoji_plugin')));

app.get('/', (req, res) => {
    // res.sendStatus(200);    //  it by default sets the status code of the response and sends the response equivalent to the particular status code to the client.
    res.set('Content-Type', 'text/html');
    res.send('<h1>Hello world</h1><br> <a href = "http://' +config.appHost + ":" +config.appPort +'/home"><b><font color="red">Click here to go to our application.<font></b></a>'); // it by default set the content type field if it has not been set previosly 
});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.broadcast.emit('entry' , "-------------one more user connected ----------------");
  socket.on("connect", () => {
    console.log("socketid -->",socket.id);
    console.log(socket.id); 
  });
  console.log('one more connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message server backend', {content:msg});
    socket.emit("details",socket.id);
  });
  socket.on('disconnect', () => {
    console.log('This user disconnects');
  });
  
});

http.listen(config.appPort, () => {
  console.log('listening on *:3000');

});
