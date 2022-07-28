/// ENEMIES
class Enemy extends RenderedSprite {
    constructor(options) {
        super(options);
        this._solid = false;
        enemies.push(this);
    }
    frameUpdate() {
        if (this.touchingPlayer()) {
            player.damage(this.playerDamage);
        }
        this.update();
    }
    damage(amount) {
        if (isNumber(amount)) {
            this.health -= amount;
            if (this.health < 0) {
                this.kill();
            }
        }
    }
    kill() {
        spawnParticle(BreakParticle, this);
        this.destroy();
    }
}
class LargeSmiley extends Enemy {
    constructor(options) {
        super(options);
        this.dead = false;
        this.yv = 0;
        this._width = 32;
        this._height = 32;
        this.playerDamage = 6;
        this.health = 10;
        // dirty workaround
        this.y -= BLOCK_HEIGHT;
        this.lastProjectile = Date.now();
        remainingEnemies++;
    }
    update() {
        if (this.dead) {
            this.yv -= GRAVITY;
            this.y -= this.yv;
        }
        else {
            var curDate = Date.now();
            if (curDate - this.lastProjectile > SMILEY_SHOOT_DELAY) {
                this.lastProjectile = curDate;
                new SmileyProjectile({
                    x: this.x,
                    y: this.y,
                });
            }
        }
    }
    kill() {
        if (this.dead)
            return;
        this.dead = true;
        this.yv = 2;
        remainingEnemies--;
    }
}
class SmileyProjectile extends Enemy {
    constructor(options) {
        super(options);
        this.health = 2;
        this.playerDamage = 3;
        this.yv = 0;
        this._width = 16;
        this._height = 16;
        this.texture = loadImage("enemy/faceproj.png");
    }
    update() {
        this.x -= SMILEY_PROJECTILE_SPEED;
        this.y -= this.yv;
        this.yv -= GRAVITY;
        if (this.touchingSolidBlock()) {
            this.yv = SMILEY_JUMP_HEIGHT;
        }
    }
}
class Pokerface extends Enemy {
    constructor() {
        super(...arguments);
        this.health = 3;
        this.playerDamage = 2;
    }
    update() {
        this.x += POKERFACE_SPEED * this.scale.x;
        if (this.touchingSolidBlock() || !this.touchingSolidBlock(true, BLOCK_WIDTH / 2 * this.scale.x, BLOCK_HEIGHT)) {
            this.scale.x = -this.scale.x;
        }
    }
}
class ShootingFace extends Enemy {
    constructor() {
        super(...arguments);
        // 0 = waiting
        // 1 = shooting
        this.state = 1;
        this.projectiles = 0;
        this.lastState = 0;
        this.health = 3;
        this.playerDamage = 3;
    }
    update() {
        var date = Date.now();
        var diff = date - this.lastState;
        if (this.state === 0) {
            if (diff > SHOOTING_FACE_DELAY_A) {
                this.state = 1;
            }
        }
        else if (this.state === 1) {
            if (diff > SHOOTING_FACE_DELAY_B) {
                new ShootingFaceProjectile({
                    center: this,
                    texture: loadImage("enemy/face3proj.png"),
                });
                this.projectiles++;
                this.lastState = date;
            }
            if (this.projectiles === SHOOTING_FACE_SHOTS) {
                this.state = 0;
                this.projectiles = 0;
            }
        }
    }
}
