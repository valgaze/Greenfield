// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');

var socket = io();

var alive = [];
var dead = [];
var someoneKilled = false;
var winnerAnnounced = false;
var projectiles;
var playerSpots = {};

socket.on("new player", function(data){

  console.log("from server", data.id, "player number is ",data.playerNumber);
  if(alive.indexOf(data.id) === -1){
    var playerNumber = data.playerNumber;
    var player = players.create(playerSpots[playerNumber].x, playerSpots[playerNumber].y, playerColors[playerNumber]);
    player.anchor.setTo(0.5,0.5); //set middle of image as reference point

    player.theId = data.id;
    game.physics.arcade.enable(player);
    player.body.gravity.y = 1000;
    player.body.bounce.y = 0.5;
    player.body.collideWorldBounds = true;
    player.facing = 1;
    player.fireRate = 500;
    player.nextFire = 0;
    player.health = 5;
    player.fire_now = function(){
      if (game.time.now > player.nextFire){
        player.nextFire = game.time.now + player.fireRate;
        var projectile = projectiles.getFirstExists(false); // get the first created fireball that no exists atm
        if (projectile){
          projectile.owner = player.theId;
          projectile.exists = true;  // come to existance !
          projectile.lifespan=2500;  // remove the fireball after 2500 milliseconds - back to non-existance

          projectile.reset(player.x + 65 * player.facing, player.y - 40);

          game.physics.arcade.enable(projectile);
          projectile.body.velocity.x = 1000 * player.facing;
          projectile.body.velocity.y = 150;
        }
      }

    };
    alive.push(player.theId);
  }
});

mainState = function(game){};

mainState.prototype = {

  
  preload: function () {
    game.stage.backgroundColor = '#adc165';
    game.load.image('player', 'assets/sumo_90.png');
    game.load.image('player1', 'assets/sumo_90_blue.png');
    game.load.image('player2', 'assets/sumo_90_orange.png');
    game.load.image('player3', 'assets/sumo_90_purple.png');
    game.load.image('player4', 'assets/sumo_90_red.png');
    game.load.image('ground', 'assets/sushi_50.png');
    game.load.image('projectile', 'assets/tomato_20.png');
    game.load.image('gameover', 'assets/gameover.png');
    game.load.image('background', 'assets/mtfuji.jpg');
    game.stage.disableVisibilityChange = true;

  },
  create: function () {

    game.add.tileSprite(0,0,game.world.width,game.world.height,'background');

    playerSpots = {
      1:{x:60,y:1},
      2:{x:game.world.width-100, y:1},
      3:{x:60,y:game.world.height-200},
      4:{x:game.world.width-100,y:game.world.height-200}
    };


    playerColors = {
      1: 'player1',
      2: 'player2',
      3: 'player3',
      4: 'player4'
    };

    socket.emit("game started");

    console.log('create function called');
    


    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    
    players = null;
    console.log('no players');
    players = game.add.group();

    this.platforms = game.add.group();
    this.platforms.enableBody = true;
    
    //Create Ground
      this.ground = [];
      for (var i = 0; i < game.world.width; i+=50) {
        this.ground.push(this.platforms.create(i, game.world.height - 50, 'ground'));
      }

      for (var i = game.world.width/4; i < game.world.width * (3/4); i+=50) {
        this.ground.push(this.platforms.create(i, game.world.height/2, 'ground'));
      }

      for (var i = 0; i < game.world.width * (1/4); i+=50) {
        this.ground.push(this.platforms.create(i, game.world.height/4 -50, 'ground'));
      }

      for (var i = 0; i < game.world.height * (1/10); i+=50) {
        this.ground.push(this.platforms.create(game.world.width/2, i, 'ground'));
      }

      for (var i = game.world.width * (3/4); i < game.world.width; i+=50) {
        this.ground.push(this.platforms.create(i, game.world.height/4 - 50, 'ground'));
      }

      for (var j = 0; j < this.ground.length; j++) {
        this.ground[j].body.immovable = true;
      }
    //Listeners
  
    socket.on("remove player", function(data){

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
              }
            }
     });

    socket.on("shoot button", function(data){
      for (var i = 0; i < players.children.length; i++){
        if (players.children[i].theId === data.id){
            players.children[i].fire_now();
        }else{
        }
      }
    });


    projectiles = game.add.group();  // add a new group for fireballs
    projectiles.createMultiple(500, 'projectile', 0, false);
  },


  update: function () {

    game.physics.arcade.collide(players);
    //game.physics.arcade.collide(players,projectiles);

    game.physics.arcade.overlap(this.platforms, projectiles, function(platform,projectile) {
      projectile.kill();
    }, null, this);

    game.physics.arcade.overlap(players, projectiles, function(player,projectile) {
      player.body.velocity.x = projectile.body.velocity.x;
      projectile.kill();
      player.health--;
      console.log('Someone got shot and now they have ' + player.health + ' health left.');
      socket.emit("player shot", {id: player.theId, health: player.health});
    }, null, this);



    //Check for collisions between any players and the ground.
    
    for (var i = 0; i < this.ground.length; i++) {
      //game.physics.arcade.collide(this.player, this.ground[i]);
      for (var j = 0; j < players.children.length; j++){
        game.physics.arcade.collide(players.children[j], this.ground[i]);
        if (players.children[j].body.velocity.x>0){
          players.children[j].body.velocity.x -= 1;   
        }
        else if (players.children[j].body.velocity.x<0){
          players.children[j].body.velocity.x += 1;
        }
      }
    }

    for (var i = 0; i< players.children.length; i++){
      if (players.children[i].health <= 0){
        if (dead.indexOf(players.children[i].theId)===-1){
          //console.log(alive.splice(alive.indexOf(players.children[i].theId),1));
          var justDead = alive.splice(alive.indexOf(players.children[i].theId),1);
          console.log(justDead[0]);
          dead.push(justDead[0]);
          someoneKilled = true;
        }
        players.children[i].kill();
      }
    }

    if (someoneKilled){
      console.log("Player " + dead[dead.length-1] + " has died.");
      someoneKilled = false;
      socket.emit("player killed", {id: dead[dead.length-1]});
    }

    if (alive.length === 1 && dead.length !== 0 && !winnerAnnounced){
      console.log('Player ' + alive[0] + ' won the game.');
      winnerAnnounced = true;
    }

    
    if (winnerAnnounced) {
      // var winner = alive[0];
      //change game state
      socket.emit("game over", {id: alive[0]});
      game.state.start("GameOver", true, false);
      //clear out old game data
      alive = [];
      dead = [];
      players.destroy(true);
      someoneKilled = false;
      winnerAnnounced = false;
    }


    

/*******************
Code below handles non-socket inputs. Consider changing input format
so that controllers only emit on button up/down events, and toggle the 
status of buttons here in phaser. Then button press consequences would 
be run in the phaser update loop rather than on socket emit events.
********************/


    var cursors = game.input.keyboard.createCursorKeys();
    if (cursors.left.isDown)
    { 
      players.scale = (2,2);
      // shotsFired = true;
    }

    
  },

  //TODO: call this on end of game
  endGame: function () {
    game.state.start("GameOver");
  }
  
};



