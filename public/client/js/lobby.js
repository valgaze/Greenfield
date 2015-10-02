

var preload = function(game){};

preload.prototype = {
  preload: function(){
    this.game.load.image('title', 'assets/title.png');
    this.game.load.image('play', 'assets/playButton.png');


  },

  create: function(){
    socket.on("activate player", function(data){
      var style = { font: 'bold 12pt Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 };
      var text = game.add.text(game.world.centerX, game.world.centerY, "Loading game...", style);
      text.anchor.set(0.5);
      //This is the function called when the server is aware that a player pressed "start"

      //Super hacky-- need to come up with triggers to make sure controllers all finish emitting and change state. Without this delay, controllers are synched up only 60% of the time. This is far too long and an undesirable
      var starter = setTimeout(function(){
        game.state.start("Main");
      }, 3000);


    });
    var gameTitle = this.game.add.sprite(160,160,'title');
    gameTitle.anchor.setTo(0.5,0.5);
    var playButton = this.game.add.button(160,320,'play',this.playTheGame,this);
    playButton.anchor.setTo(0.5,0.5);
  },

  playTheGame: function(){
    this.game.state.start('Main');
  }
};