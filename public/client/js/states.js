var game = new Phaser.Game(window.innerWidth-20, window.innerHeight-20, Phaser.AUTO, 'gameContainer');

game.state.add("Lobby", preload);
game.state.add("Main", mainState);
game.state.add("GameOver", gameOver);
game.state.start("Lobby");
