var Flower = function(game, x, y, direction) {
    key = 'flower';
    Phaser.Sprite.call(this, game, x, y, key, 1);

    this.scale.setTo(0.5);
    this.anchor.setTo(0.5);

    this.animations.add('spin');

    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;

    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;

    this.events.onKilled.add(this.onKilled, this);
    this.events.onRevived.add(this.onRevived, this);
};

Flower.prototype = Object.create(Phaser.Sprite.prototype);
Flower.prototype.constructor = Flower;

Flower.prototype.onRevived = function() {
    this.body.velocity.x = -400;
    this.animations.play('spin', 10, true);
};

Flower.prototype.onKilled = function() {
    this.animations.frame = 0;
};