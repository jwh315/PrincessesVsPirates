PrincessVsPirates.MainMenu = function() {};

PrincessVsPirates.MainMenu.prototype = {

    create: function() {
        this.game.stage.backgroundColor = '#e2e2e2';

        princesses = this.game.add.bitmapText(0, this.game.world.centerY - 150, 'minecraftia', 'Princesses', 42);
        princesses.tint = 0xffb1cf;
        princesses.x = this.game.world.centerX - princesses.textWidth / 2;

        versus = this.game.add.bitmapText(0, princesses.y + 60, 'minecraftia', 'vs', 42);
        versus.tint = 0xffffff;
        versus.x = this.game.world.centerX - versus.textWidth / 2;

        pirates = this.game.add.bitmapText(0, versus.y + 60, 'minecraftia', 'Pirates', 42);
        pirates.tint = '#000000';
        pirates.x = this.game.world.centerX - pirates.textWidth / 2;

        choose = this.game.add.bitmapText(0, pirates.y + 210, 'minecraftia', 'select player', 18);
        choose.tint = 0x4ebef7;
        choose.x = this.game.world.centerX - choose.textWidth / 2;

        var buttons = [];
        var characters = ['snowwhite', 'belle', 'ariel', 'tiana', 'mulan', 'jasmine'];
        var buttonRowWidth = characters.length * 40;
        for (var i in characters) {
            var x = (this.game.world.centerX - (buttonRowWidth / 2)) + i * 40;
            var b = this.game.add.button(x, pirates.y + 150, characters[i], this.choosePlayer, this, 2, 1, 0)
            b.name = characters[i];
            buttons.push(b);
        }
        this.menuclick = this.game.add.audio('menu_click');
    },

    update: function() {
    },

    choosePlayer: function(player) {
        this.menuclick.play();
        PrincessVsPirates.playerSelected = player.name;
        this.game.state.start('Game');
    }
}