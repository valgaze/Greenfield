

var preload = function(game){};

preload.prototype = {
  preload: function(){
    this.game.load.image('title', 'assets/title.png');
    this.game.load.image('play', 'assets/playButton.png');


  },

  create: function(){
    var gameTitle = this.game.add.sprite(160,160,'title');
    gameTitle.anchor.setTo(0.5,0.5);
    var playButton = this.game.add.button(160,320,'play',this.playTheGame,this);
    playButton.anchor.setTo(0.5,0.5);
  },

  playTheGame: function(){
    this.game.state.start('Main');
  }
};