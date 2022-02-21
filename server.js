// loading all dependencies

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    socket.join('room' + toString(Math.random() * 1000));

	console.log('A user connected:' + socket.id);

    socket.on('disconnect', () => {
          console.log('A user disconnected:' + socket.id);
    })

    socket.on('send', function (text) {
        let newText = '<' + socket.id + '> ' + text;
        io.emit('receive', newText);
    });

});

server.listen(8081,  () => {
console.log(`Listening on ${server.address().port}`);
});



