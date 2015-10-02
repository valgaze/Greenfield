

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
      
      var style = {
         font: 'bold 32pt Arial',
         fill: 'white',
         align: 'left',
         wordWrap: true,
         wordWrapWidth: 450
      };
      var text = game.add.text(game.world.centerX, game.world.centerY, "Loading game...", style);
      text.anchor.set(0.5);

      /* HACK: need to come up with trigger scheme to make sure controllers all finish emitting and change state. Without this delay, characters are ready only 60% of the time. This delay is too long and an undesirable hack, but loading status text can alleviate in meantime */ 

      var starter = setTimeout(function() {
         game.state.start("Main");
      }, 3000);

    });


    gameTitle.anchor.setTo(0.5,0.5);
    var playButton = this.game.add.button(game.world.width * (1/2), game.world.height * (2/3), 'play',this.playTheGame,this);
    playButton.anchor.setTo(0.5,0.5);
  },

  playTheGame: function(){
    this.game.state.start('Main');
  }
};