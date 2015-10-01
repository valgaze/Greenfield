var lobby = function(game){};

lobby.prototype = {
  preload: function(){
    this.game.load.image('title', '../assets/title.png');
    this.game.load.image('start_button', '../assets/startgamebutton.png');

  },

  create: function(){
    //var gameTitle = this.game.add.sprite(160,160,'title');
    //gameTitle.anchor.setTo(0.5,0.5);

    var style = { font: 'bold 12pt Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 };
    var text = game.add.text(game.world.centerX, game.world.centerY, "-Press Start Below-", style);
    text.anchor.set(0.5);

    buttonleft = game.add.button(0, 30, 'start_button', this.playTheGame, this, 0, 1, 0, 1);
        buttonleft.events.onInputDown.add(function(){left=true;});
        buttonleft.events.onInputUp.add(function(){left=false;});
  },

  playTheGame: function(){
    alert('button pressed');
    socket.emit("player ready")
  }
};