/*****************************
  State setup for controller
*****************************/
  //This is where all the views for the controller are connected together
  //IMPORTANT: this file must be the LAST file added to controller.html so it gets access to all the items above
  //Listens: Nothing
  //Emits: Nothing

//Create the game view
var game = new Phaser.Game(450, 250, Phaser.AUTO, 'gameContainer');

game.state.add("Lobby", lobby);
game.state.add("Dead", deadState);
game.state.add("Main", mainState);
game.state.add("Reject", rejectState);
game.state.add("Waiting", waitingState);

//Set the starting state
game.state.start("Lobby");
