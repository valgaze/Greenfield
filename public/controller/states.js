var game = new Phaser.Game(450, 250, Phaser.AUTO, 'gameContainer');

game.state.add("Lobby", lobby);
game.state.add("Main", mainState);
game.state.start("Lobby");
