/*****************************
  SETUP
*****************************/

//reqires socket.io.
var socket = io();

//Creates arrays for living and dead players, and sets up flags
//to be used later.
var alive = [];
var dead = [];
var someoneKilled = false;
var winnerAnnounced = false;
var projectiles;
var playerSpots = {};

//Creates new players in game space when "new player" event is received
//from server. Was placed here, isolated from other listeners, because of
//unpredictable behavior when it was in create block.
socket.on("new player", function(data){

  console.log("from server", data.id, "player number is ",data.playerNumber);

  //Only runs if player is not already alive.
  if(alive.indexOf(data.id) === -1){
    var playerNumber = data.playerNumber;
    var player = players.create(playerSpots[playerNumber].x, playerSpots[playerNumber].y, playerColors[playerNumber]);
    
    //Sets middle of image as reference point.
    player.anchor.setTo(0.5,0.5);

    //Sets theId property of player to equal socket ID of corresponding controller.
    player.theId = data.id;

    //Sets up phaser physics for player, as well as other player properties that
    //affect gameplay.
    game.physics.arcade.enable(player);
    player.body.gravity.y = 1000;
    player.body.bounce.y = 0.5;
    player.body.collideWorldBounds = true;
    player.facing = 1;
    player.fireRate = 500;
    player.nextFire = 0;
    player.health = 5;

    //Sets up method that allows player to shoot tomatoes.
    player.fire_now = function(){
      if (game.time.now > player.nextFire){

        //Limits player's rate of tomato throwing.
        player.nextFire = game.time.now + player.fireRate;

        //Selects first available projectile which is not active in game space.
        //This projectile does not yet "exist" by phaser standards
        var projectile = projectiles.getFirstExists(false);
        if (projectile){

          //Toggles phaser existence of projectile.
          projectile.exists = true;

          //Removes the tomato after 2500 milliseconds. projectile.exists is now false.
          projectile.lifespan=2500;

          //Sets position of tomato near player.
          projectile.reset(player.x + 65 * player.facing, player.y - 40);

          //Gives tomato velocity away from player. Contingent on player.facing.
          game.physics.arcade.enable(projectile);
          projectile.body.velocity.x = 1000 * player.facing;
          projectile.body.velocity.y = 150;
        }
      }

    };

    //Adds player ID to the array of living players.
    alive.push(player.theId);
  }
});

/*****************************
  GAME MAIN STATE
*****************************/
  //This is the main gameplay state of the actual game. Properties of mainState.prototype
  //are phaser functions that help set up the game world.

mainState = function(game){};

mainState.prototype = {

  /*****************************
    PHASER PRELOAD FUNCTION
  *****************************/
  //Sets up pictures and other assets to be used in game.
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

  /*****************************
    PHASER CREATE FUNCTION
  *****************************/
  //Contains all functions that should run when Main state is booted up.
  create: function () {

    //Adds background image.
    game.add.tileSprite(0,0,game.world.width,game.world.height,'background');

    //Builds list of locations on the screen where players can start.
    playerSpots = {
      1:{x:60,y:1},
      2:{x:game.world.width-100, y:1},
      3:{x:60,y:game.world.height-200},
      4:{x:game.world.width-100,y:game.world.height-200}
    };

    //Builds list of a different-colored corresponding to each player.
    playerColors = {
      1: 'player1',
      2: 'player2',
      3: 'player3',
      4: 'player4'
    };

    //Emits "game started" event. When server hears this, it will send back a
    //series of "new player" events to populate game arena. Server will also 
    //tell all "ready" controllers to go into game mode at this point.
    socket.emit("game started");

    //Initializes phaser's "arcade" physics library.
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //Clears out any players lingering in group from previous round.
    players = null;

    //Creates players group in game.
    players = game.add.group();

    //Creates platforms group in game and allows them to have body physics.
    this.platforms = game.add.group();
    this.platforms.enableBody = true;
    
    //Create ground and add it to platforms group.
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

    /*****************************
      SOCKET EVENT HANDLERS
    *****************************/
    //Most of these functions listen for events from the server and then do something
    //in the game space.

    //Listens for "remove player" events and eliminates players from the players group.
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

    //Gives corresponding player leftward velocity on "left button" event.
    //Right, up, and shoot functions follow similar pattern.
    socket.on("left button", function(data){
      for (var i = 0; i < players.children.length; i++){
        if (players.children[i].theId === data.id){
          players.children[i].body.velocity.x = -200;
          players.children[i].facing = -1;
        }
      }
    });

    socket.on("right button", function(data){
        for (var i = 0; i < players.children.length; i++){
          if (players.children[i].theId === data.id){
            players.children[i].body.velocity.x = 200;
            players.children[i].facing = 1;
          }
        }
     });
    
    socket.on("up button", function(data){
      for (var i = 0; i < players.children.length; i++){
        if (players.children[i].theId === data.id){
          players.children[i].body.velocity.y = -600;
        }
      }
    });

    socket.on("shoot button", function(data){
      for (var i = 0; i < players.children.length; i++){
        if (players.children[i].theId === data.id){
          players.children[i].fire_now();
        }
      }
    });

    //Not a listener. Adds a new group for projectiles (tomatoes) and
    //creates 500 of them to draw from.
    projectiles = game.add.group();
    projectiles.createMultiple(500, 'projectile', 0, false);
  },

  /*****************************
    PHASER UPDATE FUNCTION
  *****************************/
  //Runs in a loop at high rate of speed (~60 times/sec). Contains all functions that
  //are checking second-to-second gameplay conditions.
  update: function () {

    //Phaser physics command - dictates that players will collide with one another, not pass through.
    game.physics.arcade.collide(players);

    //Kills any projectile that hits a platform.
    game.physics.arcade.overlap(this.platforms, projectiles, function(platform,projectile) {
      projectile.kill();
    }, null, this);

    //Kills projectile and subtracts health from player when projectile hits player.
    game.physics.arcade.overlap(players, projectiles, function(player,projectile) {
      player.body.velocity.x = projectile.body.velocity.x;
      projectile.kill();
      player.health--;
      console.log('Someone got shot and now they have ' + player.health + ' health left.');
      socket.emit("player shot", {id: player.theId, health: player.health});
    }, null, this);

    //Declares that players will collide with ground.
    //Reduces speed of players over time (friction).
    for (var i = 0; i < this.ground.length; i++) {
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

    //Kills players who run out of health.
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

    //If someoneKilled flag is true, emits "player killed" event to server.
    //Event payload is that player's ID (same as socket ID of corresponding controller).
    if (someoneKilled){
      console.log("Player " + dead[dead.length-1] + " has died.");
      someoneKilled = false;
      socket.emit("player killed", {id: dead[dead.length-1]});
    }

    //Sets winnerAnnounced flag to true if all but one players are dead.
    if (alive.length === 1 && dead.length !== 0 && !winnerAnnounced){
      console.log('Player ' + alive[0] + ' won the game.');
      winnerAnnounced = true;
    }

    //If winnerAnnounced flag is true, emits "game over" event to server.
    //Also clears out relevant game data.
    //Also sends game into "GameOver" state, leaving the "Main" state.
    if (winnerAnnounced) {
      socket.emit("game over", {id: alive[0]});
      game.state.start("GameOver", true, false);
      alive = [];
      dead = [];
      players.destroy(true);
      someoneKilled = false;
      winnerAnnounced = false;
    }
  },

  endGame: function () {
    game.state.start("GameOver");
  }
};



