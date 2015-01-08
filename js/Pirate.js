var Pirate = function(game, params) {
    Phaser.Sprite.call(this, game, params.x, params.y, params.key, params.startFrame);
    game.physics.arcade.enableBody(this);

    this.animations.add('left', [4,5,6,7,4]);
    this.animations.add('right', [8,9,10,11,8]);
    this.startingY = params.y;
    this.minX = params.minX;
    this.maxX = params.maxX;
    this.body.bounce.y = 0.2;
    this.anchor.setTo(0.5);

    this.direction = params.direction;
    this.speed = params.speed;
    this.animations.play(this.direction, 10, true);

    this.dead = false;
    this.pointsRewarded = false
};

Pirate.prototype = Object.create(Phaser.Sprite.prototype);
Pirate.prototype.constructor = Pirate;

Pirate.prototype.onRevived = function() {

};

Pirate.prototype.onKilled = function() {
    this.animations.stop();
};

Pirate.prototype.celebrate = function() {
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

Pirate.prototype.move = function() {
    if (!this.dead){
        if (this.direction == 'left') {
            this.position.x -= this.speed;
        } else {
            this.position.x += this.speed;
        }

        if (this.position.x <= this.minX) {
            this.direction = 'right';
            this.animations.play('right', 10, true);
        }

        if (this.position.x >= this.maxX) {
            this.direction = 'left';
            this.animations.play('left', 10, true);
        }
    } else if (this.body.onFloor() && (this.game.time.now - this.killed) > 2000) {
        this.destroy();
    }
};
