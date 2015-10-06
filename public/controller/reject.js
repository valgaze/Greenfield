/*****************************
  "Reject" player view
*****************************/
  //This is the view displayed on the player's controller when the game is "full"
  //We actually use another phaser game to be able to use Phaser's touch library
  //Listens for: "reset controllers"
  //Emits: Nothing

var rejectState = function(game){};

rejectState.prototype = {
  preload: function(){
  },

  create: function(){
   //This event comes from the server and when received will put player back to lobby
    socket.on("reset controllers", function(data){
      game.state.start("Lobby");
    });

    var style = { font: 'bold 12pt Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 };
    var text = game.add.text(game.world.centerX, game.world.centerY, "- Sorry, sumo, too many players. -", style);
    text.anchor.set(0.5);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  }

};
