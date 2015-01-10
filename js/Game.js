//access game objects in console like this - this.game.state.states.Game.{member}
PrincessVsPirates.Game = function(){
    this.playerDied = false;
    this.level = 1;

    this.fireRate = 500;
    this.nextFire = 0;

    this.playerDirection = 'right';
    this.gameScore = 0;
    this.levelScore = 0;
    this.lives = 3;
    this.levelComplete = false;
};

PrincessVsPirates.Game.prototype = {

    create: function() {

        this.game.physics.startSystem(Phaser.Physics.Arcade);
        this.game.physics.arcade.gravity.y = 465;
        this.game.physics.arcade.TILE_BIAS = 40;

        this.game.stage.backgroundColor = '#000';

        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('tileset', 'tileset');

        this.map.setCollision(68);
        this.map.setCollision(2);
        this.map.setCollision(10);
        this.map.setCollisionBetween(21, 24);

        this.layer = this.map.createLayer('Tile Layer 1');

        this.layer.resizeWorld();

        this.player = this.add.sprite(20, this.game.height / 2, PrincessVsPirates.playerSelected, 8);
        this.game.physics.enable(this.player);
        this.player.anchor.setTo(0.5);

        this.player.body.bounce.y = 0.2;
        this.player.body.collideWorldBounds = true;
        this.game.camera.follow(this.player);

        this.player.animations.add('walk-left', [4,5,6,7,4]);
        this.player.animations.add('walk-right', [8,9,10,11,8]);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.fireBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);

        this.pirates = this.game.add.group();
        this.decomposedPirates = this.game.add.group();

        this.initSounds();
        this.initFlowers();
        this.initPirates();
        this.initGameDisplay();

        this.playerDied = false;
        this.levelComplete = false;
    },

    initGameDisplay: function() {
        this.scoreText = this.game.add.bitmapText(10, 10, 'minecraftia', 'Score: ' + this.gameScore, 24);
        this.scoreText.tint = 0xffb1cf;
        this.scoreText.fixedToCamera = true;

        this.livesText = this.game.add.bitmapText(0, 10, 'minecraftia', 'Lives: ' + this.lives, 24);
        this.livesText.x = this.game.width - this.livesText.textWidth - 25;
        this.livesText.tint = 0xffb1cf;
        this.livesText.fixedToCamera = true;
    },

    initFlowers: function() {
        this.flowers = this.game.add.group();
        this.flowers.enableBody = true;
        this.flowers.physicsBodyType = Phaser.Physics.ARCADE;
        this.flowers.createMultiple(5, 'flower', 0, false);
        this.flowers.setAll('anchor.x', 0.5);
        this.flowers.setAll('anchor.y', 0.5);
        this.flowers.setAll('outOfBoundsKill', true);
        this.flowers.setAll('checkWorldBounds', true);

        this.flowers.forEach(function(flower){
            flower.body.setSize(5, 5);
            flower.body.bounce.y = 0.75;
            flower.animations.add('color', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1]);
        });
    },

    initSounds: function() {
        this.shoot = this.game.add.audio('shoot');
        this.jump = this.game.add.audio('jump');
        this.playerDie = this.game.add.audio('player_die');
        this.pickFlower = this.game.add.audio('pick_flower');
    },

    initPirates: function() {
        for (var i in levels[this.level].pirates) {
            var pirate = new Pirate(this.game, this.layer, levels[this.level].pirates[i]);
            this.pirates.add(pirate);
        }
    },

    movePirates: function() {
        for (var i in this.pirates.children) {
            if (this.pirates.children[i].killedPlayer) {
                this.killPlayer();
            } else {
                this.pirates.children[i].move();
            }
        }
    },

    collideEnemy: function(player, pirate) {
        if (!pirate.dead) {
            this.pirates.setAll('body.velocity.x', 0);
            this.pirates.callAll('celebrate');
            this.killPlayer();
            pirate.destroy();
        } else {
            this.pickFlower.play();
            var scoreTween = this.game.add.tween(pirate).to({x:  this.scoreText.x, y: this.scoreText.y}, 300, Phaser.Easing.Linear.NONE, true);

            if (!pirate.pointsRewarded) {
                this.levelScore += 10;
                pirate.pointsRewarded = true;
            }

            scoreTween.onComplete.add(function(){
                this.scoreText.text = "Score: " + (parseInt(this.gameScore) + parseInt(this.levelScore));
                pirate.destroy();
            }, this);
        }
    },

    hitEnemy: function(flower, pirate) {
        pirate.decompose();
        flower.kill();
    },

    checkLevelComplete: function(player, layer) {
        if (layer.index == 68) {
            this.levelComplete = true;
            this.gameScore += this.levelScore;
            //uncomment when we have more then one level ready
            // this.level++;
            this.restartLevel();
        }
    },

    update: function() {
        this.game.physics.arcade.collide(this.pirates, this.layer);
        this.game.physics.arcade.collide(this.flowers, this.layer);
        this.game.physics.arcade.overlap(this.flowers, this.pirates, this.hitEnemy, null, this);
        this.game.physics.arcade.overlap(this.player, this.pirates, this.collideEnemy, null, this);

        if (!this.playerDied && !this.playerHasFallen()) {
            this.game.physics.arcade.collide(this.player, this.layer, this.checkLevelComplete, null, this);
            if (!this.levelComplete) {
                this.player.body.velocity.x = 0;

                if (this.jumpBtn.isDown && this.player.body.onFloor()) {
                    this.jump.play();
                    this.player.body.velocity.y = -300;
                }

                if (this.cursors.right.isDown) {
                    if (this.player.body.onFloor() && !this.player.animations.isPlaying) {
                        this.player.animations.play('walk-right');
                    } else {
                        this.player.frame = 8
                    }
                    this.playerDirection = 'right';
                    this.player.body.velocity.x = 150;
                } else if (this.cursors.left.isDown) {
                    if (this.player.body.onFloor() && !this.player.animations.isPlaying) {
                        this.player.animations.play('walk-left');
                    } else {
                        this.player.frame = 4;
                    }
                    this.playerDirection = 'left';
                    this.player.body.velocity.x = -150;
                }

                if (this.fireBtn.isDown) {
                    this.fire();
                }
                this.movePirates();
            }

            this.flowers.forEach(function(flower){
                if (flower.body.velocity.x == 0) {
                    flower.kill();
                }
            });

        } else if(this.playerHasFallen()) {
            this.lives--;
            this.restartLevel();
        }
    },

    playerHasFallen: function() {
        return this.player.position.y >= this.game.world.height - this.player.height
    },

    fire: function() {
        if (game.time.now > this.nextFire && this.flowers.countDead() > 0) {
            this.nextFire = game.time.now + this.fireRate;

            var flower = this.flowers.getFirstExists(false);
            var velocity, padding;
            if (this.playerDirection == 'right') {
                padding = -20;
                velocity = 200;
            } else {
                padding = 20;
                velocity = -200;
            }

            flower.reset(this.player.position.x - padding, this.player.position.y - 10);
            flower.animations.play('color', 10, true);
            this.shoot.play();
            flower.body.velocity.x = velocity;
        }
    },

    killPlayer: function() {
        this.player.frame = 1;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y -= 200;
        this.player.tint = 0xD3E397;
        this.playerDie.play();
        this.playerDied = true;
        this.pirates.callAll('celebrate');
    },

    restartLevel: function() {
        if (this.lives) {
            this.game.camera.reset();
            this.game.state.restart();
        } else {
            this.game.state.start('MainMenu');
        }
    },

    shutdown: function() {
        if (!this.lives) {
            this.lives = 3;
            this.gameScore = 0;
            this.level = 1;
        }
        this.levelScore = 0;

        this.flowers = null;
        this.pirates = null;
        this.player = null;

        this.shoot = null;
        this.jump = null;
        this.playerDie = null;
        this.pickFlower = null;
    }
};