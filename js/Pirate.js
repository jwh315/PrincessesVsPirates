var Pirate = function(game, layer, params) {
    Phaser.Sprite.call(this, game, params.x, params.y, params.key, params.startFrame);
    game.physics.arcade.enableBody(this);
    this.game = game;
    this.layer = layer;
    this.animations.add('left', [4,5,6,7,4]);
    this.animations.add('right', [8,9,10,11,8]);
    this.body.bounce.y = 0.2;
    this.anchor.setTo(0.5);

    this.startingY = params.y;
    this.minX = params.minX;
    this.maxX = params.maxX;
    this.direction = params.direction;
    this.speed = params.speed;
    this.weaponType = params.weapon;
    this.weaponVelocity = params.weaponVelocity;
    this.attackInterval = params.attackInterval;

    this.animations.play(this.direction, 10, true);
    this.dead = false;
    this.pointsRewarded = false;
    this.lastShot = 0;
    this.initWeapons();
    this.killedPlayer = false;
};

Pirate.prototype = Object.create(Phaser.Sprite.prototype);
Pirate.prototype.constructor = Pirate;

Pirate.prototype.onRevived = function() {

};

Pirate.prototype.onKilled = function() {
    this.animations.stop();
};

Pirate.prototype.celebrate = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    this.frame = 1;
    this.body.velocity.y -= this.game.rnd.integerInRange(100, 250);
};

Pirate.prototype.decompose = function() {
    this.dead = true;
    this.loadTexture('flowers_full', this.game.rnd.integerInRange(1, 16));
    this.body.setSize(9, 9);
    this.position.y += 15;
};

Pirate.prototype.initWeapons = function() {
    this.weapons = this.game.add.group();
    if (this.weaponType) {
        this.weapons.enableBody = true;
        this.weapons.physicsBodyType = Phaser.Physics.ARCADE;
        this.weapons.createMultiple(20, this.weaponType, 0, false);
        this.weapons.setAll('anchor.x', 0.5);
        this.weapons.setAll('anchor.y', 0.5);
        this.weapons.setAll('outOfBoundsKill', true);
        this.weapons.setAll('checkWorldBounds', true);

        this.weapons.forEach(function(weapon){
            weapon.body.setSize(5, 5);
            weapon.body.bounce.y = 0.75;
        });
    }
};

Pirate.prototype.hitPlayer = function(weapon, player) {
    this.killedPlayer = true;
};

Pirate.prototype.move = function() {
    this.body.velocity.x = 0;
    this.game.physics.arcade.collide(this.weapons, this.layer);
    this.game.physics.arcade.overlap(this.weapons, this.game.state.states.Game.player, this.hitPlayer, null, this);
    if (!this.dead){
        if (this.direction == 'left') {
            this.body.velocity.x = -75;
        } else {
            this.body.velocity.x = 75;
        }

        if (this.position.x <= this.minX) {
            this.direction = 'right';
            this.animations.play('right', 10, true);
        }

        if (this.position.x >= this.maxX) {
            this.direction = 'left';
            this.animations.play('left', 10, true);
        }

        if (this.weapons.length && (this.game.time.now - this.lastShot) > this.attackInterval) {
            this.lastShot = this.game.time.now;
            var weapon = this.weapons.getFirstExists(false);
            var velocity, padding;
            if (this.direction == 'right') {
                padding = -20;
                velocity = this.weaponVelocity;
            } else {
                padding = 20;
                velocity = -this.weaponVelocity;
            }

            weapon.reset(this.position.x - padding, this.position.y - 10);
            weapon.body.velocity.x = velocity;

        }
    }

    this.weapons.forEach(function(weapon){
        weapon.angle -= 3;
        if (weapon.body.velocity.x == 0) {
            weapon.kill();
        }
    });
};
