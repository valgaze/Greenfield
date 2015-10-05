var waitingState = function(game){};

waitingState.prototype = {
  preload: function(){
    this.game.load.image('start_button', '../assets/playButton.png');
  },

  create: function(){
   
    socket.on("flip controllers", function(data){
      //This is the function called when the server is aware that a player pressed "start"
      game.state.start("Main");
    });


    var style = { font: 'bold 12pt Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 };
    var text = game.add.text(game.world.centerX, game.world.centerY, "-Let's Sumo!!-", style);
    text.anchor.set(0.5);

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    buttonleft = game.add.button(game.world.centerX, game.world.centerY-45, 'start_button', this.startGame, this, 0, 1, 0, 1);
        buttonleft.events.onInputDown.add(function(){left=true;});
        buttonleft.events.onInputUp.add(function(){left=false;});
        buttonleft.anchor.set(0.5);
  },

  startGame: function(){
    socket.emit('player start', {});
  }

};
