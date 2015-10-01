

var preload = function(game){};

preload.prototype = {
  preload: function(){
    game.stage.backgroundColor = '#adc165';
    this.game.load.image('title', 'assets/title.png');
    this.game.load.image('play', 'assets/playButton.png');


  },

  create: function(){

    var gameTitle = this.game.add.sprite(game.world.width * (1/2), game.world.height * (1/3), 'title');
    socket.on("activate player", function(data){
      
      //This is the function called when the server is aware that a player pressed "start"
      game.state.start("Main");

    });

    gameTitle.anchor.setTo(0.5,0.5);
    var playButton = this.game.add.button(game.world.width * (1/2), game.world.height * (2/3), 'play',this.playTheGame,this);
    playButton.anchor.setTo(0.5,0.5);
  },

  playTheGame: function(){
    this.game.state.start('Main');
  }
};