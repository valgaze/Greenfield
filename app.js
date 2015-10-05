var express = require('express'); 
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

exports.helpers = {
  findArrayIndex : function(item, array){
    return array.indexOf(item);
  },
  removeFromArray : function(index, array){
    return array.splice(index, 1);
  }
};


/*****************************
  ROUTING & SETUP
*****************************/

// Serves up the game html when the a GET request is
// sent to the '/' path.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/client/index.html');
});


// Serves up the controller html when the a GET request is
// sent to the '/' path.
app.get('/controller', function(req, res){
  res.sendFile(__dirname + '/public/controller.html');
});


app.use(express.static(path.join(__dirname, 'public/client')));
app.use('/js', express.static(path.join(__dirname, 'public/client/js')));
app.use('/lib', express.static(path.join(__dirname, 'public/client/lib')));
app.use('/controller', express.static(path.join(__dirname, 'public/controller')));


//Creates globals object, which will store socket IDs of first 4 ready players.
var globals = {};
globals.currentPlayers = [];


/*****************************
  SOCKET LISTENERS
*****************************/
  //This function sets up listeners for events coming from any socket.
  //Tells the srever what kind of event to emit for any event received. 

io.on('connection', function(socket){

  socket.on("disconnect", onClientDisconnect);

  socket.on("game started", onGameStarted);

  socket.on("left button", leftButton);

  socket.on("up button", upButton);

  socket.on("shoot button", shootButton);

  socket.on("right button", rightButton);

  socket.on("player killed", playerKilled);

  socket.on("player shot", playerShot);

  socket.on("player ready", onNewPlayer);

  socket.on("player start", onPlayerStart);

  socket.on("game over", onGameOver);

  socket.on("reset game", onResetGame);
  
});

//Sets up server ports, for deployed version or local version.
app.set('port', process.env.PORT || 3000);

var port = process.env.PORT || 3000;

//Starts listening on designated port.
server.listen(app.get("port"), function(){
  console.log('listening on port', port);
});

/*****************************
  BUTTON PRESS HANDLERS 
*****************************/
  //These functions all follow the same pattern (see rightButton). 
  //They distribute button press events to all connected clients.

//When server recieves "right button" event, rightButton is triggered. 
//This broadcasts a"right button" event to all other connected sockets.
//One of these sockets is the game view client.
//The ID of the socket that triggers the event is sent with this broadcast.
//The client uses that to know which player to perform an action on.
function rightButton(){
  this.broadcast.emit("right button", {id:this.id});
}

function leftButton(){
  this.broadcast.emit("left button", {id:this.id});
}

function upButton(){
  this.broadcast.emit("up button", {id:this.id});
}

function shootButton(){
  this.broadcast.emit("shoot button", {id:this.id});
}

/*****************************
  GAME EVENT HANDLERS
*****************************/

//Emits "controller killed" event to controller whose socket ID matches ID of
//player who was killed in game view client.
function playerKilled(data){
  io.to(data.id).emit("controller killed", {id: data.id, message: "You've been tomato'ed"});
}

//Emits "player shot" event to controller whose socket ID matches ID of
//player who was shot in game view client. Currently not used?
function playerShot(data){
  io.to(data.id).emit('player shot', {id: data.id, health: data.health});
}

//Checks if more than one player is in "ready" state (added to globals.currentPlayers).
//If so, emits "client start" event to all connected sockets.
//Game view client will flip from "Lobby" state into "Main" state when it hears this event.
function onPlayerStart(){
  if(globals.currentPlayers.length > 1){
    io.sockets.emit("client start",{});
  }
};

//Clears out globals.currentPlayers array.
function onGameOver(data){
  console.log("ALERT: The winner was...", data.id);
  globals.currentPlayers = [];
  //io.sockets.emit("activate player", {});    
}

//Emits "reset controllers" event, which will send controllers back to controller "Lobby" state.
function onResetGame(){
  io.sockets.emit("reset controllers",{});
};


// Emits "new player" event to all connected clients.
// Event payload is the id of the socket that created the new player.
function onNewPlayer() {

  if (globals.currentPlayers.length < 4){

    if (globals.currentPlayers.indexOf(this.id) === -1){
      globals.currentPlayers.push(this.id);
      var playerNumber = exports.helpers.findArrayIndex(this.id, globals.currentPlayers) + 1;

      io.to(this.id).emit("confirm player", {id: this.id, playerNumber: playerNumber, message: "You are player " + playerNumber});

      console.log("New player added, all players:", globals.currentPlayers);      
    }

  }else{
    io.to(this.id).emit("reject player", {id: this.id, playerNumber: false, message: "Sorry, too many players"});

    console.log("Player rejected because full, all players: ", globals.currentPlayers);
  }
};

//Emits one "new player" event for each player in currentPlayers, with payload of that player's
//socket ID. When game view client hears this, it will create a player in the game space for that
//controller. Also emits "flip controllers" event to all connected sockets. This will cause any
//controller in "Waiting" (ready) state to flip into "Main" (game pad) state.
function onGameStarted() {

  for (var i = 0; i < globals.currentPlayers.length; i++){
    this.emit("new player", {id: globals.currentPlayers[i],playerNumber: i+1});
  }

  io.sockets.emit("flip controllers",{});

};

// Emits "remove player" event to all connected clients.
// Event payload is the id of the socket that created the new player.
function onClientDisconnect() {
  var id = this.id;

  var index = exports.helpers.findArrayIndex(id, globals.currentPlayers);
  if (index > -1){
    exports.helpers.removeFromArray(index, globals.currentPlayers);
    this.broadcast.emit("remove player", {id: this.id});  
  }

};