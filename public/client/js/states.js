var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');

game.state.add("Lobby", preload);
game.state.add("Main", mainState);
game.state.add("GameOver", gameOver);
game.state.start("Lobby");
