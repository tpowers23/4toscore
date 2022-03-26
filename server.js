// loading all dependencies

var crypto = require('crypto');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
// create variables and object for rooms
let players = [];
const openRooms = [];
const activeRooms = [];
let gameRoom = {
    roomId: '',
    playerAId: '',
    playerBId: '',
};


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// do this if user connects
io.on('connection', async (socket) =>  {

	console.log('A user connected:' + socket.id);
    // if there are no rooms available to join
    if (openRooms.length < 1){
        // create new room, let socket join it, and set that player as red
        let newRoom = createNewRoom(socket);
        await socket.join(newRoom.roomId);
        io.to(socket.id).emit('isPlayerA');
    }
    else {
        // pick a random open room and join it
        let randomRoom = Math.floor(Math.random()*openRooms.length);
        await socket.join(openRooms[randomRoom].roomId);
        openRooms[randomRoom].playerBId = socket.id;
        // do coin flip for whose turn it is, send that to client
        let coinFlip = Math.floor(Math.random() * 2);
        let roomId = openRooms[randomRoom].roomId;
        io.in(roomId).emit('whoseTurn', coinFlip);
        // add room to active rooms and remove it from the list of open rooms
        activeRooms.push(openRooms[randomRoom]);
        openRooms.splice(randomRoom);
    }
    

    players.push(socket.id);

    // when event is received, send it out to the room of the client it is from
    socket.on('diskDropped', function(moveCol, isPlayerA){
        io.to(Array.from(socket.rooms)[1]).emit('moveMade', moveCol, isPlayerA);
    });

    socket.on('gameOver', (winner) => {
        let roomId = Array.from(socket.rooms)[1];
        io.to(roomId).emit('gameOver', winner);
        // run database call to change stats based on who won **********************************************************
        /* check if it is a ranked match, if so grab the users' multipliers.  Add points to winner, subtract points
           from loser based on multiplier.  */
        

    });


    // ADD IF STATEMENT FOR IF OPPONENT ALREADY DISCONNECTED*************************************************************************************************
    socket.on('disconnect', () => {
          console.log('A user disconnected:' + socket.id);
          // call function to get the room object of the room that was left
          leftRoomObj = getRoomObjFromId(socket.id);
          // if the room was an open room, remove that from the open rooms array
          if (leftRoomObj.playerBId === null){
            openRooms.splice([openRooms.indexOf(leftRoomObj)]);
          }
          else{
            // send to room: if player A left then B won, if B left then A won
            io.to(leftRoomObj.roomId).emit('gameOver', leftRoomObj.playerAId === socket.id ? 'yellow' : 'red');
            activeRooms.splice(activeRooms.indexOf(leftRoomObj));
          }
          players = players.filter(player => player !== socket.id);
          // run database call to change stats based on who won *********************************************************
          /* check if it is a ranked match, if so grab the users' multipliers.  Add points to winner, subtract points
           from loser based on multiplier.  */
    });


});

server.listen(8081,  () => {
console.log(`Listening on ${server.address().port}`);
});

// create a new room object based around the socket rooms for the game
createNewRoom = (socket) => {
    let a = Object.create(gameRoom);
    a.roomId = crypto.randomBytes(5).toString('hex');
    a.playerAId = socket.id;
    a.playerBId = null; a.playerAUsername = null; a.playerBUsername = null;
    openRooms.push(a);
    return a;
};

// returns room object from socket id
getRoomObjFromId = (sid) => {
    for (let i = 0; i < openRooms.length; i++){
        if (openRooms[i].playerAId === sid || openRooms[i].playerBId === sid){
            return openRooms[i];
        }
    }
    for (let i = 0; i < activeRooms.length; i++){
        if (activeRooms[i].playerAId === sid || activeRooms[i].playerBId === sid){
            return activeRooms[i];
        }
    }
}