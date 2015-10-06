/*****************************
  "Waiting" player view
*****************************/
  //This is the view displayed on the player's controller when there is enough room and they are waiting for other players to be ready
  //Listens for: "flip controllers"
  //Emits: "player start"
var waitingState = function(game){};

waitingState.prototype = {
  preload: function(){
    this.game.load.image('start_button', '../assets/playButton.png');
  },

  create: function(){
   
   //This event comes from the server if a sufficient number of players (>1) are ready. The controllers then become "active"
    socket.on("flip controllers", function(data){
      game.state.start("Main");
    });


    var style = { font: 'bold 12pt Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 };
    var text = game.add.text(game.world.centerX, game.world.centerY, "-Let's Sumo!!-", style);
    text.anchor.set(0.5);

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

  //Set up button
    buttonPlay = game.add.button(game.world.centerX, game.world.centerY-45, 'start_button', this.startGame, this, 0, 1, 0, 1);
        buttonPlay.anchor.set(0.5);
  },

  startGame: function(){
  //This event gets emitted on tap of the button
    socket.emit('player start', {});
  }

};
