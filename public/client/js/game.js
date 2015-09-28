var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');

var socket = io();


var mainState = {
  preload: function () {
    game.stage.backgroundColor = '#666';
    game.load.image('player', 'assets/player.png'); 
    game.load.image('ground', 'assets/ground.png');
    game.stage.disableVisibilityChange = true;
  },
  create: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    pineapples = game.add.group();
    pineapples.enableBody = true;
    //game.physics.enable(pineapples, Phaser.Physics.ARCADE);

    //Player ceation handled below
    // this.player = this.game.add.sprite(100, 245, 'player');
    // game.physics.arcade.enable(this.player);
    // this.player.body.gravity.y = 1000; 
    // this.player.body.bounce.y = 0.5;
    // this.player.body.collideWorldBounds = true;
    

    this.platforms = game.add.group();
    this.platforms.enableBody = true;
    
    //Create Ground
      this.ground = [];
      for (var i = 0; i < game.world.width; i+=70) {
        this.ground.push(this.platforms.create(i, game.world.height - 70, 'ground'));
      }
      for (var j = 0; j < this.ground.length; j++) {
        this.ground[j].body.immovable = true;
      }
    //Listeners
   // var that = this;


    socket.on("remove player", function(data){

          // that.player.body.velocity.x = -200;
          for (var i = 0; i < pineapples.children.length; i++){
              if (pineapples.children[i].theId === data.id){
                  pineapples.children[i].destroy();
              }else{
                console.log(pineapples.children[i], i);
                console.log("instanceid:", pineapples.children[i].theId);
                console.log("targetid", data.id);
              }
            }
     });
    socket.on("left button", function(data){

          // that.player.body.velocity.x = -200;
          for (var i = 0; i < pineapples.children.length; i++){
              if (pineapples.children[i].theId === data.id){
                  pineapples.children[i].body.velocity.x = -200;
              }else{
                console.log(pineapples.children[i], i);
                console.log("instanceid:", pineapples.children[i].theId);
                console.log("targetid", data.id);
              }
            }
     });

    socket.on("right button", function(data){
         // that.player.body.velocity.x = 200;
        for (var i = 0; i < pineapples.children.length; i++){
            if (pineapples.children[i].theId === data.id){
                pineapples.children[i].body.velocity.x = 200;
            }else{
              console.log(pineapples.children[i], i);
              console.log("instanceid:", pineapples.children[i].theId);
              console.log("targetid", data.id);
            }
          }
     });
    
    socket.on("up button", function(data){
          // that.player.body.velocity.y = -600;
          for (var i = 0; i < pineapples.children.length; i++){
              if (pineapples.children[i].theId === data.id){
                  pineapples.children[i].body.velocity.y = -600;
              }else{
                console.log(pineapples.children[i], i);
                console.log("instanceid:", pineapples.children[i].theId);
                console.log("targetid", data.id);
              }
            }
     });

    socket.on("down button", function(data){
          // console.log(data.payload)
          that.player.body.velocity.y = -600;

     });

    socket.on("new player", function(data){
        //players.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'player');
        console.log("from server", data.id);
        var pineapple = pineapples.create(200,50, 'player');
        pineapple.theId = data.id;
        game.physics.arcade.enable(pineapple);
        pineapple.body.gravity.y = 1000; 
        pineapple.body.bounce.y = 0.5;
        pineapple.body.collideWorldBounds = true;
        console.log("group", pineapples)
      
     });
  },
  update: function () {

    //Check for collisions between any players and the ground.
    
    for (var i = 0; i < this.ground.length; i++) {
      //game.physics.arcade.collide(this.player, this.ground[i]);
      for (var j = 0; j < pineapples.children.length; j++){
        game.physics.arcade.collide(pineapples.children[j], this.ground[i]);
        pineapples.children[j].body.velocity.x = 0;
      }
    }


/*******************
Code below handles non-socket inputs. Consider changing input format
so that controllers only emit on button up/down events, and toggle the 
status of buttons here in phaser. Then button press consequences would 
be run in the phaser update loop rather than on socket emit events.
********************/

  //   this.player.body.velocity.x = 0;

  //   var cursors = game.input.keyboard.createCursorKeys();
  //   if (cursors.left.isDown)
  //   { 
  //       socket.emit("left button", {somedata:"some value"});
  //       this.player.body.velocity.x = -150;

  //   }
  //   else if (cursors.right.isDown)
  //   {
  //       this.player.body.velocity.x = 150;
  //       // cursors.up.isDown = false;

  //   }
  //   if (cursors.up.isDown && this.player.body.touching.down)
  //   {
  //       socket.emit("up button", {somedata:"some value"});

  //       this.player.body.velocity.y = -600;
  //   }
  }
};

game.state.add('main', mainState);
game.state.start('main');

