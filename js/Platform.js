var Platform = function(game, params) {
    Phaser.Sprite.call(this, game, params.x, params.y, params.key, 1);
    game.physics.arcade.enableBody(this);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.game = game;

    this.startingY = params.y;
    this.minX = params.minX;
    this.maxX = params.maxX;
    this.direction = params.direction;
    this.speed = params.speed;
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.move = function() {
    if (this.direction == 'left') {
        this.body.velocity.x = -this.speed;
    } else {
        this.body.velocity.x = this.speed;
    }

    if (this.position.x <= this.minX) {
        this.direction = 'right';
    }

    if (this.position.x >= this.maxX) {
        this.direction = 'left';
    }
};
