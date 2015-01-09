var game = new Phaser.Game(1000, 650, Phaser.AUTO, '');

game.state.add('Boot', PrincessVsPirates.Boot);
game.state.add('Preload', PrincessVsPirates.Preload);
game.state.add('MainMenu', PrincessVsPirates.MainMenu);
game.state.add('Game', PrincessVsPirates.Game);

game.state.start('Boot');