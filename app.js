var express = require('express'); 
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

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

  socket.on("shoot button", shootButton);

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
  console.log("A RIGHT BUTTON WAS PRESSED!!");

  // Broadcast right button to connected socket clients
  // with socket id of the client who sent the 
  // right button event.

  this.broadcast.emit("right button", {id:this.id});
}

function leftButton(){
  console.log("A LEFT BUTTON WAS PRESSED!!");
  this.broadcast.emit("left button", {id:this.id});
}

function upButton(){
  console.log("A LEFT BUTTON WAS PRESSED!!");
  this.broadcast.emit("up button", {id:this.id});

}

function shootButton(){
  console.log("A SHOOT BUTTON WAS PRESSED!!");
  this.broadcast.emit("shoot button", {id:this.id});

}



/*****************************
  CONNECT/DISCONNECT HANDLERS
*****************************/

// Emits "new player" event to all connected clients.
// Event payload is the id of the socket that created the new player.
function onNewPlayer() {
  this.broadcast.emit("new player", {id: this.id});
};

// Emits "remove player" event to all connected clients.
// Event payload is the id of the socket that created the new player.
function onClientDisconnect() {
  this.broadcast.emit("remove player", {id: this.id});
};