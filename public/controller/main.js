
  var socket = io();

    //some global vars 
    var left=false;
    var right=false;
    var up = false;
    var jump=false;
    var shoot=false;
    var playerNumber = false;
    var textRef;

    var mainState = {
      preload: function () {
        game.stage.backgroundColor = '#666';
        game.load.image('player', 'assets/player.png');
     







        game.load.image('jump_button', 'assets/jump.png');
        game.load.image('fire_button', 'assets/fire.png');
        game.load.image('left_button', 'assets/left.png');
        game.load.image('right_button', 'assets/right.png');


        game.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setMinMax(480, 260, 1024, 768);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(true, false);
        this.scale.setResizeCallback(this.gameResized, this);
        this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);


    // // fullscreen setup
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

      },
      create: function () {

        socket.on("confirmPlayer", function(data){
          if (!playerNumber){
            playerNumber = data.playerNumber;
          }
          addText(game, "Player_num: " + playerNumber +
          "\n Strength: 5");
        });

        socket.on("rejectPlayer", function(data){
          addText(game, data.message);

          console.log(data.message);
        });

        socket.on("player shot", function(data){
          onPlayerShot(data);
        });

        socket.on("controller killed", onPlayerDeath);

        socket.on("reset controllers", function(data){
          game.state.start("Lobby");
        });

      //left
      var topRow = 65; //Common shifting amount

        buttonleft = game.add.button(0, topRow, 'left_button', null, this, 0, 1, 0, 1);
            buttonleft.events.onInputDown.add(function(){left=true;});
            buttonleft.events.onInputUp.add(function(){left=false;});
            // buttonleft.height = game.height - topRow;
            // buttonleft.width = buttonleft.height/2

      //right
        buttonright = game.add.button(150, topRow, 'right_button', null, this, 0, 1, 0, 1);
            buttonright.events.onInputDown.add(function(){right=true;});
            buttonright.events.onInputUp.add(function(){right=false;});
            // buttonright.height = game.height - topRow;
            // buttonright.width = buttonright.height/2

      //jump
        buttonB = game.add.button(300, 0, 'jump_button', null, this, 0, 1, 0, 1);
            buttonB.events.onInputDown.add(function(){up=true;});
            buttonB.events.onInputUp.add(function(){up=false;});
      

      //Special_A
        buttonA = game.add.button(300, 100, 'fire_button', null, this, 0, 1, 0, 1);
            buttonA.events.onInputDown.add(function(){shoot=true;});
            buttonA.events.onInputUp.add(function(){shoot=false;});

      // //Start button
      //   buttonStart = game.add.button(0, 200, 'player', null, this, 0, 1, 0, 1);
      //       buttonStart.events.onInputDown.add(function(){shoot=true;});
      //       buttonStart.events.onInputUp.add(function(){shoot=false;});      
      },
      update: function () {

        if (left) {
         socket.emit('left button', {});
        }
        if (right) {
          socket.emit('right button', {});      
        }
        if (up) {
         socket.emit('up button', {});
        }
        if (shoot) {
         socket.emit('shoot button', {});
        }
        if (game.input.currentPointers == 0 && !game.input.activePointer.isMouse){right=false; left=false; jump=false; shoot=false;
        } //this works around a "bug" where a button gets stuck in pressed state

      },
      enterIncorrectOrientation: function () {
          document.getElementById('orientation').style.display = 'block';
      },

      leaveIncorrectOrientation: function () {
          document.getElementById('orientation').style.display = 'none';
      }

    };




function gofull() { game.scale.startFullScreen(false);}
function addText(game, message, configObj){

  if (!configObj){
    var style = { font: 'bold 15pt Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450};
  }else{
    var style = configObj;
  }

  var text = game.add.text(0, 0, message, style);
  text.anchor.set(0);
  textRef = text;

}

function onPlayerDeath (){
  game.state.start("Dead");
}
function onPlayerShot (data) {
  //Callback for player shot events
  console.log(data.health);
}
