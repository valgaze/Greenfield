var game = new Phaser.Game(450, 250, Phaser.AUTO, 'gameContainer');

game.state.add("Lobby", lobby);
game.state.add("Dead", deadState);
game.state.add("Main", mainState);
game.state.add("Reject", rejectState);
game.state.add("Waiting", waitingState);
game.state.start("Lobby");
