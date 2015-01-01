PrincessVsPirates.Game = function(){
    this.playerDied = false;
    this.level = 0;
};

PrincessVsPirates.Game.prototype = {

    create: function() {
        this.game.physics.startSystem(Phaser.Physics.Arcade);
        this.game.physics.arcade.gravity.y = 465;
        this.game.physics.arcade.TILE_BIAS = 40;


        this.game.stage.backgroundColor = '#000';

        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('tileset', 'tileset');

        this.map.setCollision(2);
        this.map.setCollision(10);
        this.map.setCollisionBetween(21, 24);

        this.layer = this.map.createLayer('Tile Layer 1');

        this.layer.resizeWorld();

        this.player = this.add.sprite(20, this.game.height / 2, PrincessVsPirates.playerSelected, 8);
        this.game.physics.enable(this.player);
        this.player.anchor.setTo(0.5);

        this.player.body.bounce.y = 0.2;
        this.game.camera.follow(this.player);

        this.player.animations.add('walk-left', [4,5,6,7,4]);
        this.player.animations.add('walk-right', [8,9,10,11,8]);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.pirates = this.game.add.group();

        this.initSounds();
        this.makeSomePirates();
    },

    initSounds: function() {
        this.shoot = this.game.add.audio('shoot');
        this.jump = this.game.add.audio('jump');
        this.playerDie = this.game.add.audio('player_die');
    },

    makeSomePirates: function() {
        for (var i in levels.one.pirates) {
            var pirate = new Pirate(this.game, levels.one.pirates[i]);
            this.pirates.add(pirate);
        }
    },

    movePirates: function() {
        for (var i in this.pirates.children) {
            this.pirates.children[i].move();
        }
    },

    hitEnemy: function(player, pirate) {
        this.playerDied = true;
        this.pirates.setAll('body.velocity.x', 0);
        this.pirates.callAll('celebrate');
        this.playerDie.play();
        player.body.velocity.x = 0;
        player.body.velocity.y -= 200;
        player.tint = 0xD3E397;
        pirate.destroy();
        player.frame = 1;
        this.restartLevel(this);
    },

    update: function() {
        this.game.physics.arcade.collide(this.pirates, this.layer);
        this.game.physics.arcade.overlap(this.player, this.pirates, this.hitEnemy, null, this);

        if (!this.playerDied) {
            this.game.physics.arcade.collide(this.player, this.layer);
            this.player.body.velocity.x = 0;
            if (this.player.position.y >= this.game.world.height - this.player.height) {
                this.killPlayer();
                return;
            }

            if (this.jumpBtn.isDown && this.player.body.onFloor()) {
                this.jump.play();
                this.player.body.velocity.y = -300;
            }

            if (this.cursors.right.isDown && this.player.position.x < this.game.world.width - this.player.width) {
                if (this.player.body.onFloor() && !this.player.animations.isPlaying) {
                    this.player.animations.play('walk-right');
                } else {
                    this.player.frame = 8
                }
                this.player.body.velocity.x = 125;
            } else if (this.cursors.left.isDown && this.player.position.x > 0) {
                if (this.player.body.onFloor() && !this.player.animations.isPlaying) {
                    this.player.animations.play('walk-left');
                } else {
                    this.player.frame = 4;
                }
                this.player.body.velocity.x = -125;
            }
            this.movePirates();
        }
    },

    killPlayer: function() {
        this.player.destroy();
        this.playerDie.play();
        this.playerDied = true;
        this.pirates.callAll('celebrate');
        this.restartLevel(this);
    },

    restartLevel: function(that) {
        setTimeout(function(){
            that.playerDied = false;
            that.player.destroy();
            that.pirates.destroy();
            that.game.state.start('Game', true, false);
        }, 2000);
    }
};