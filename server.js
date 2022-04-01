// loading all dependencies

var crypto = require('crypto');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
// create variables and object for rooms
let players = [];
const openRankedRooms = [];
const friendRooms = [];
const openRooms = [];
const activeRooms = [];
let gameRoom = {
    roomId: '',
    playerAId: '',
    playerBId: '',
    playerAUsername: '',
    playerBUsername: '',
    gameIsOver: null,
    isRankedGame: null
};


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// do this if user connects
io.on('connection', async (socket) =>  {

	console.log('A user connected:' + socket.id);
    // if there are no rooms available to join
    // IF (current URL points to /unranked)
        if (openRooms.length < 1){
            // create new room, let socket join it, and set that player as red
            let newRoom = createNewRoom(socket, 'unranked');
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
    /*
    else if (current URL points to /ranked) {
        // CALL DATABASE TO GET RANK FOR CURRENT PLAYER on next line
        let currPlayerRankPoints;
        if (openRankedRooms.length < 1){
            //create new room, let socket join it, set this player as red
            let newRoom = createNewRoom(socket, 'ranked');
            newRoom.playerARankPoints = **rank variable defined at top of else if**
            await socket.join(newRoom.roomId);
            io.to(socket.id).emit('isPlayerA');
        }
        else{
            let diff, min;
            let index = 0;
            for (let i = 0; i < openRankedRooms.length; i++){
                if (i === 0){
                    min = Math.abs(openRankedRooms[i].playerARankPoints - currPlayerRankPoints);
                }
                diff = Math.abs(openRankedRooms[i].playerARankPoints - currPlayerRankPoints);
                if (diff < min){
                    min = diff;
                    index = i;
                }
            }
            await socket.join(openRankedRooms[index].roomId);
            // do coin flip for whose turn it is, send that to client
            let coinFlip = Math.floor(Math.random() * 2);
            io.in(openRankedRooms[index].roomId).emit('whoseTurn', coinFlip);
            activeRooms.push(openRankedRooms[index]);
            openRankedRooms.splice(index);
        }
    }
    else if (*play with friends*){
        let friendName = *name of friend searched for*;
        let roomIndex;
        let joining = false;
        if (friendRooms.length > 0){
            for (int i = 0; i < friendRooms.length; i++){
                if (friendRooms[i].playerAUsername === friendName){
                    roomIndex = i;
                    joining = true;
                }
            }
            if (joining){
                await socket.join(friendRooms[roomIndex].roomId);
                // do coin flip for whose turn it is, send that to client
                let coinFlip = Math.floor(Math.random() * 2);
                io.in(friendRooms[roomIndex].roomId).emit('whoseTurn', coinFlip);
                activeRooms.push(friendRooms[roomIndex]);
                friendRooms.splice(roomIndex);
            }
            else {
                //create new room, let socket join it, set this player as red
                let newRoom = createNewRoom(socket, 'friends');
                await socket.join(newRoom.roomId);
                io.to(socket.id).emit('isPlayerA');
            }
        }
    }
        
    */
    players.push(socket.id);

    // when event is received, send it out to the room of the client it is from
    socket.on('diskDropped', function(moveCol, isPlayerA){
        io.to(Array.from(socket.rooms)[1]).emit('moveMade', moveCol, isPlayerA);
    });

    socket.on('chatMsg', function(message, wasPlayerA){
        io.to(Array.from(socket.rooms)[1]).emit('chatMsg', message, wasPlayerA);
    });

    socket.on('gameOver', (winner) => {
        let roomId = Array.from(socket.rooms)[1];
        let roomObj = getRoomObjFromId(socket.id);
        roomObj.gameIsOver = true;
        io.to(roomId).emit('gameOver', winner);
        // run database call to change stats based on who won **********************************************************
        /* check if it is a ranked match, if so grab the users' multipliers.  Add points to winner, subtract points
           from loser based on multiplier.  */
        
    });


    socket.on('disconnect', () => {
          console.log('A user disconnected:' + socket.id);
          // call function to get the room object of the room that was left
          leftRoomObj = getRoomObjFromId(socket.id);
          if (leftRoomObj != undefined){
            // if the room was an open room, remove that from the open rooms array
            if (leftRoomObj.playerBId === null ){
                openRooms.splice([openRooms.indexOf(leftRoomObj)]);
            }
            else{
                // send to room: if player A left then B won, if B left then A won
                if (leftRoomObj.gameIsOver === false){
                    io.to(leftRoomObj.roomId).emit('gameOver', leftRoomObj.playerAId === socket.id ? 'yellow' : 'red');
                }
                activeRooms.splice(activeRooms.indexOf(leftRoomObj));
          }
          players = players.filter(player => player !== socket.id);
        }
          // run database call to change stats based on who won *********************************************************
          /* check if it is a ranked match, if so grab the users' multipliers.  Add points to winner, subtract points
           from loser based on multiplier.  */
    });


});

server.listen(8081,  () => {
console.log(`Listening on ${server.address().port}`);
});

// create a new room object based around the socket rooms for the game
createNewRoom = (socket,gameType) => {
    let a = Object.create(gameRoom);
    a.roomId = crypto.randomBytes(5).toString('hex');
    a.playerAId = socket.id;
    a.playerBId = null; a.playerAUsername = null; a.playerBUsername = null; a.gameIsOver = null; a.gameType = gameType;
    a.playerARankPoints = null;
    if (gameType === 'ranked'){
        openRankedRooms.push(a);
    }
    else if (gameType === 'unranked'){
        openRooms.push(a);
    }
    else if (gameType === 'friends'){
        friendRooms.push(a);
    }
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