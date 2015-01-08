var PrincessVsPirates = function() {};

PrincessVsPirates.Boot = function() {};

PrincessVsPirates.Boot.prototype = {

    preload: function() {
        this.load.image('preloadbar', 'assets/images/preloader-bar.png');
        this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia/minecraftia.png', 'assets/fonts/minecraftia/minecraftia.xml');
    },

    create: function() {
        this.game.stage.backgroundColor = '#ffb6c1';

        this.input.maxPointers = 1;

        if (this.game.device.desktop) {
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        } else {
            this.scale.scaleMod = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 568;
            this.scale.minHeight = 600;
            this.scale.maxWidth = 2048;
            this.scale.maxHeight = 1536;
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
        }

        this.state.start('Preload');
    }
};