// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');

var socket = io();

var alive = [];
var dead = [];

var projectiles;

// var nextFire = 0;
// var fireRate = 100;
// var shotsFired = false;

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

    socket.on("shoot button", function(data){
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
              projectile.reset(player.x + 50 * player.facing, player.y);
              game.physics.arcade.enable(projectile);
              projectile.body.velocity.x = 1000 * player.facing;
            }
          }

        }
        alive.push(player.theId);
        //console.log("group", players)
      
     });


    projectiles = game.add.group();  // add a new group for fireballs
    projectiles.createMultiple(500, 'projectile', 0, false);




  },


  update: function () {

    game.physics.arcade.collide(players);
    //game.physics.arcade.collide(players,projectiles);

    game.physics.arcade.overlap(players, projectiles, function(player,projectile) {
      projectile.kill();
      player.health--;
      console.log('Someone got shot and now they have ' + player.health + ' health left.')
    }, null, this);



    //Check for collisions between any players and the ground.
    
    for (var i = 0; i < this.ground.length; i++) {
      //game.physics.arcade.collide(this.player, this.ground[i]);
      for (var j = 0; j < players.children.length; j++){
        game.physics.arcade.collide(players.children[j], this.ground[i]);
        players.children[j].body.velocity.x = 0;
      }
    }


    for (var i = 0; i< players.children.length; i++){
      if (players.children[i].health <= 0){

        dead.push(alive.splice(alive.indexOf(players.children[i].theId),1));
        players.children[i].kill();

      }
    }

    if (alive.length === 1){
      console.log('Player ' + players.children[0].theId + ' won the game.');
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



