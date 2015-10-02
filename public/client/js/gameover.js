var gameOver = function(game){};
 
gameOver.prototype = {
  init: function(){
    // alert("Winner: ", winner);
  },

  preLoad: function(){
    this.game.load.image('gameover', 'assets/gameover.png');
    this.game.load.image('play', 'assets/playButton.png');

  },
  create: function(){
  var gameOverTitle = this.game.add.sprite(game.world.width * (1/2), game.world.height * (1/3),'gameover');
  gameOverTitle.anchor.setTo(0.5,0.5);
  var playButton = this.game.add.button(game.world.width * (1/2), game.world.height * (2/3),"play",this.playTheGame,this);
  playButton.anchor.setTo(0.5,0.5);
  },
  playTheGame: function(){

    this.game.state.start("Lobby", true, false);
  }
};