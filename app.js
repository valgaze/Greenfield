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
  ROUTING
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


var globals = {};
globals.currentPlayers = [];

/*****************************
  SOCKET LISTENERS
*****************************/
  //This function sets up listeners for events coming from any socket.
  //Tells the srever what kind of event to emit for any event received. 

io.on('connection', function(socket){

  socket.on("disconnect", onClientDisconnect);

  socket.on("new player", onNewPlayer);  

  socket.on("left button", leftButton);

  socket.on("up button", upButton);

  socket.on("down button", downButton);

  socket.on("right button", rightButton);

});

app.set('port', process.env.PORT || 3000);

var port = process.env.PORT || 3000;

server.listen(app.get("port"), function(){
  console.log('listening on port', port);
});

/*****************************
  BUTTON PRESS HANDLERS 
*****************************/
  //These functions all follow the same pattern (see rightButton). 
  //They distribute button press events to all connected clients.

function rightButton(){
  this.broadcast.emit("right button", {id:this.id});
}

function leftButton(){
  this.broadcast.emit("left button", {id:this.id});
}

function upButton(){
  this.broadcast.emit("up button", {id:this.id});
}

function downButton(){
  this.broadcast.emit("down button", {id:this.id});
}


/*****************************
  CONNECT/DISCONNECT HANDLERS
*****************************/

// Emits "new player" event to all connected clients.
// Event payload is the id of the socket that created the new player.
function onNewPlayer() {

  if (globals.currentPlayers.length < 4){
    globals.currentPlayers.push(this.id);
    var playerNumber = exports.helpers.findArrayIndex(this.id, globals.currentPlayers) + 1;
    this.broadcast.emit("new player", {id: this.id, playerNumber: playerNumber});

    io.to(this.id).emit('confirmPlayer', {id: this.id, playerNumber: playerNumber, message: "You are player " + playerNumber});

    console.log("added you in!");
    console.log("all the players", globals.currentPlayers);
  }else{
    io.to(this.id).emit('rejectPlayer', {id: this.id, playerNumber: false, message: "Sorry, too many players"});

    console.log("Sorry fella all full!");
    console.log("all the players", globals.currentPlayers);
  }
};

// Emits "remove player" event to all connected clients.
// Event payload is the id of the socket that created the new player.
function onClientDisconnect() {
  console.log('this client left', this.id);
  console.log('Before dong anything, the array looks like this:', globals.currentPlayers);
  var id = this.id;

  var index = exports.helpers.findArrayIndex(id, globals.currentPlayers);
  if (index > -1){
    exports.helpers.removeFromArray(index, globals.currentPlayers);
    this.broadcast.emit("remove player", {id: this.id});
    console.log('player removed, now array looks like this:', globals.currentPlayers);    
  }

};