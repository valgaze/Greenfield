// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');

var socket = io();

var projectiles;
var nextFire = 0;
var fireRate = 100;
var mainState = {
  preload: function () {
    game.stage.backgroundColor = '#666';
    game.load.image('player', 'assets/player.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('projectile', 'assets/wall.png');
    game.load.image('gameover', 'assets/gameover.png');
    game.stage.disableVisibilityChange = true;
  },
  create: function () {

    

    game.physics.startSystem(Phaser.Physics.ARCADE);
    players = game.add.group();
    players.enableBody = true;
  

    this.platforms = game.add.group();
    this.platforms.enableBody = true;
    
    //Create Ground
      this.ground = [];
      for (var i = 0; i < game.world.width; i+=70) {
        this.ground.push(this.platforms.create(i, game.world.height - 70, 'ground'));
      }

      for (var i = game.world.width/4; i < game.world.width * (3/4); i+=70) {
        this.ground.push(this.platforms.create(i, game.world.height/2, 'ground'));
      }

      for (var i = 0; i < game.world.width * (1/4); i+=70) {
        this.ground.push(this.platforms.create(i, game.world.height/4 -70, 'ground'));
      }

      for (var i = game.world.width * (3/4); i < game.world.width; i+=70) {
        this.ground.push(this.platforms.create(i, game.world.height/4 - 70, 'ground'));
      }

      for (var j = 0; j < this.ground.length; j++) {
        this.ground[j].body.immovable = true;
      }
    //Listeners
  
    socket.on("remove player", function(data){

          // that.player.body.velocity.x = -200;
          for (var i = 0; i < players.children.length; i++){
              if (players.children[i].theId === data.id){
                  players.children[i].destroy();
              }else{
                console.log(players.children[i], i);
                console.log("instanceid:", players.children[i].theId);
                console.log("targetid", data.id);
              }
            }
     });
    socket.on("left button", function(data){

          // that.player.body.velocity.x = -200;
          for (var i = 0; i < players.children.length; i++){
              if (players.children[i].theId === data.id){
                  players.children[i].body.velocity.x = -200;
                  players.children[i].facing = -1;
              }else{
                console.log(players.children[i], i);
                console.log("instanceid:", players.children[i].theId);
                console.log("targetid", data.id);
              }
            }
     });

    socket.on("right button", function(data){
        for (var i = 0; i < players.children.length; i++){
            if (players.children[i].theId === data.id){
                players.children[i].body.velocity.x = 200;
                players.children[i].facing = 1;

            }else{
              console.log(players.children[i], i);
              console.log("instanceid:", players.children[i].theId);
              console.log("targetid", data.id);
            }
          }
     });
    
    socket.on("up button", function(data){
          for (var i = 0; i < players.children.length; i++){
              if (players.children[i].theId === data.id){
                  players.children[i].body.velocity.y = -600;
                  
              }else{
                console.log(players.children[i], i);
                console.log("instanceid:", players.children[i].theId);
                console.log("targetid", data.id);
              }
            }
     });

    socket.on("down button", function(data){
      for (var i = 0; i < players.children.length; i++){
        if (players.children[i].theId === data.id){
            players.children[i].fire_now();
        }else{
          console.log(players.children[i], i);
          console.log("instanceid:", players.children[i].theId);
          console.log("targetid", data.id);
        }
      }
    });

    socket.on("new player", function(data){
        console.log("from server", data.id);
        var player = players.create(200,50, 'player');
        player.theId = data.id;
        game.physics.arcade.enable(player);
        player.body.gravity.y = 1000;
        player.body.bounce.y = 0.5;
        player.body.collideWorldBounds = true;
        player.facing = 1;
        player.fire_now = function(){
          if (game.time.now > nextFire){
            nextFire = game.time.now + fireRate;
            var projectile = projectiles.getFirstExists(false); // get the first created fireball that no exists atm
            if (projectile){
              projectile.exists = true;  // come to existance !
              projectile.lifespan=2500;  // remove the fireball after 2500 milliseconds - back to non-existance
              projectile.reset(player.x + 20 * player.facing, player.y);
              game.physics.arcade.enable(projectile);
              projectile.body.velocity.x = 1000 * player.facing;
            }
          }
        };
        console.log("group", players);
      
     });


    projectiles = game.add.group();  // add a new group for fireballs
    projectiles.createMultiple(500, 'projectile', 0, false);




  },


  update: function () {

    //Check for collisions between any players and the ground.
    
    for (var i = 0; i < this.ground.length; i++) {
      //game.physics.arcade.collide(this.player, this.ground[i]);
      for (var j = 0; j < players.children.length; j++){
        game.physics.arcade.collide(players.children[j], this.ground[i]);
        players.children[j].body.velocity.x = 0;
      }
    }


    

/*******************
Code below handles non-socket inputs. Consider changing input format
so that controllers only emit on button up/down events, and toggle the 
status of buttons here in phaser. Then button press consequences would 
be run in the phaser update loop rather than on socket emit events.
********************/


    var cursors = game.input.keyboard.createCursorKeys();
    if (cursors.left.isDown){
      console.log("shoot button pressed");
      this.fire_now();
    }

    
  },

  //TODO: call this on end of game
  endGame: function () {
    game.state.start("GameOver");
  }
  
};



