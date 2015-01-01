var Pirate = function(game, params) {
    Phaser.Sprite.call(this, game, params.x, params.y, params.key, params.startFrame);
    this.game.physics.arcade.enableBody(this);

    this.animations.add('left', [4,5,6,7,4]);
    this.animations.add('right', [8,9,10,11,8]);
    this.startingY = params.y;
    this.minX = params.minX;
    this.maxX = params.maxX;
    this.direction = params.direction;
    this.speed = params.speed;

    this.animations.play(this.direction, 10, true);
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
}

Pirate.prototype.move = function() {
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
};
