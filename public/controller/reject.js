
var rejectState = function(game){};

rejectState.prototype = {
  preload: function(){
  },

  create: function(){
   
    socket.on("reset controllers", function(data){
      //This is the function called when the server is aware that a player pressed "start"
      game.state.start("Lobby");
    });

    var style = { font: 'bold 12pt Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 };
    var text = game.add.text(game.world.centerX, game.world.centerY, "- Sorry, sumo, too many players. -", style);
    text.anchor.set(0.5);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  }

};
