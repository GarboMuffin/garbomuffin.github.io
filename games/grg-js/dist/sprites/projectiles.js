/// PROJECTILES
class Projectile extends RenderedSprite {
    constructor(options) {
        super(options);
        this.direction = options.direction;
        projectiles.push(this);
        this.y = Math.floor(this.y);
    }
    frameUpdate() {
        this.x += this.direction * PROJECTILE_SPEED;
        this.check();
        if (this.offScreen())
            this.destroy();
    }
    check() { }
}
class PlayerProjectile extends Projectile {
    constructor(options) {
        super(Object.assign({}, options, { texture: loadImage("bullet/bullet.png"), width: 6, height: 6 }));
        this.destroyAfter = false;
    }
    check() {
        var touching = this.touchingContainer(false, enemies);
        if (touching && !this.destroyAfter) {
            touching.damage(1);
            this.destroyAfter = true;
        }
        else if (this.destroyAfter) {
            this.destroy();
        }
    }
}
PlayerProjectile.damage = 3;
class ShootingFaceProjectile extends Projectile {
    constructor(options) {
        super(Object.assign({}, options, { width: 8, height: 8 }));
        this.direction = DIR_LEFT;
    }
    check() {
        if (this.touchingPlayer()) {
            player.damage(3);
        }
    }
}
