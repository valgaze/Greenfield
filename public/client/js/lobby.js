/*****************************
 Lobby big screen view
*****************************/
  //This is the view displayed on the main screen before the game starts.
  //Upon receiving a start event from the server, the view will switch to the main game
  //Listens for: 'client start'
  //Emits: none

var preload = function(game){};

preload.prototype = {
  preload: function(){
    game.stage.backgroundColor = '#adc165';
    this.game.load.image('title', 'assets/title.png');
    this.game.load.image('play', 'assets/playButton.png');

    //Change to main game state when server triggers 'client start' event
    socket.on('client start', function(){game.state.start('Main');});
  },

  create: function(){

    //Add images to home screen
    var gameTitle = this.game.add.sprite(game.world.width * (1/2), game.world.height * (1/3), 'title');
    gameTitle.anchor.setTo(0.5,0.5);

    //This button is currently inactive. The change from the "lobby" state to the "main" game state is triggered 
    //from the server as described above.
    var playButton = this.game.add.button(game.world.width * (1/2), game.world.height * (2/3), 'play', null, this);
    playButton.anchor.setTo(0.5,0.5);
  },


};