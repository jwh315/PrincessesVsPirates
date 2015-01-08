var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

game.state.add('Boot', PrincessVsPirates.Boot);
game.state.add('Preload', PrincessVsPirates.Preload);
game.state.add('MainMenu', PrincessVsPirates.MainMenu);
game.state.add('Game', PrincessVsPirates.Game);

game.state.start('Boot');