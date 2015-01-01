PrincessVsPirates.Preload = function() {
    this.ready = false;
};

PrincessVsPirates.Preload.prototype = {

    preload: function() {
        this.game.stage.backgroundColor = '#e2e2e2';

        princesses = this.game.add.bitmapText(0, this.game.world.centerY - 150, 'minecraftia', 'Princesses', 42);
        princesses.tint = 0xffb1cf;
        princesses.x = this.game.world.centerX - princesses.textWidth / 2;

        versus = this.game.add.bitmapText(0, princesses.y + 60, 'minecraftia', 'vs', 42);
        versus.tint = 0xffffff;
        versus.x = this.game.world.centerX - versus.textWidth / 2;

        pirates = this.game.add.bitmapText(0, versus.y + 60, 'minecraftia', '  Pirates  ', 42);
        pirates.tint = '#000000';
        pirates.x = this.game.world.centerX - pirates.textWidth / 2;

        this.preloadBar = this.add.sprite(this.game.world.centerX, pirates.y + 140, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('tileset', 'assets/maps/tileset.png');
        this.load.tilemap('map', 'assets/maps/tilemap.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.spritesheet('snowwhite', 'assets/images/snowwhite.png', 32, 48, 16);
        this.load.spritesheet('ariel', 'assets/images/ariel.png', 32, 48, 16);
        this.load.spritesheet('belle', 'assets/images/belle.png', 32, 48, 16);
        this.load.spritesheet('jasmine', 'assets/images/jasmine.png', 32, 48, 16);
        this.load.spritesheet('mulan', 'assets/images/mulan.png', 32, 48, 16);
        this.load.spritesheet('tiana', 'assets/images/tiana.png', 32, 48, 16);

        this.load.spritesheet('pirate_1', 'assets/images/pirate_1.png', 32, 48, 16);
        this.load.spritesheet('pirate_2', 'assets/images/pirate_2.png', 32, 48, 16);
        this.load.spritesheet('pirate_3', 'assets/images/pirate_3.png', 32, 48, 16);
        this.load.spritesheet('pirate_4', 'assets/images/pirate_4.png', 32, 48, 16);
        this.load.spritesheet('pirate_5', 'assets/images/pirate_5.png', 32, 48, 16);
        this.load.spritesheet('pirate_6', 'assets/images/pirate_6.png', 32, 48, 16);
        this.load.spritesheet('pirate_7', 'assets/images/pirate_7.png', 32, 48, 16);
        this.load.spritesheet('pirate_8', 'assets/images/pirate_8.png', 32, 48, 16);

        this.load.audio('menu_click', 'assets/audio/menu_click.wav');
        this.load.audio('shoot', 'assets/audio/shoot.wav');
        this.load.audio('jump', 'assets/audio/jump.wav');
        this.load.audio('player_die', 'assets/audio/player_die.wav');


        this.load.onLoadComplete.add(this.onLoadComplete, this);
    },

    create: function() {
        this.preloadBar.cropEnabled = false;
    },

    update: function() {
        if (this.ready == true) {
            this.state.start('MainMenu');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};