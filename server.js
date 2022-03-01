// loading all dependencies

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
let players = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function (socket)  {

	console.log('A user connected:' + socket.id);

    players.push(socket.id);

    console.log(players.length);
    if (players.length === 1) {
        io.emit('isPlayerA');
        console.log('player A emitted');
    };

    socket.on('diskDropped', function(moveCol, isPlayerA){
        io.emit('moveMade', moveCol, isPlayerA);
    });

    socket.on('disconnect', () => {
          console.log('A user disconnected:' + socket.id);
          players = players.filter(player => player !== socket.id);
    });


});

server.listen(8081,  () => {
console.log(`Listening on ${server.address().port}`);
});