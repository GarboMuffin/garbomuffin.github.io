/// ENEMIES

abstract class Enemy extends RenderedSprite {
  public constructor(options: SpriteOptions) {
    super(options);
    enemies.push(this);
  }

  public frameUpdate() {
    if (this.touchingPlayer()) {
      player.damage(this.playerDamage);
    }
    this.update();
  }
  protected update?()

  public damage(amount) {
    if (isNumber(amount)) {
      this.health -= amount;
      if (this.health < 0) {
        this.kill();
      }
    }
  }
  public kill() {
    spawnParticle(BreakParticle, this);
    this.destroy();
  }

  protected abstract health: number;
  protected abstract readonly playerDamage: number;
  protected readonly _solid: boolean = false;
  public static particle;
}

class LargeSmiley extends Enemy {
  public constructor(options: SpriteOptions) {
    super(options);
    // dirty workaround
    this.y -= BLOCK_HEIGHT;
    this.lastProjectile = Date.now();
    remainingEnemies++;
  }

  public update() {
    if (this.dead) {
      this.yv -= GRAVITY;
      this.y -= this.yv;
    } else {
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

  public kill() {
    if (this.dead) return;
    this.dead = true;
    this.yv = 2;
    remainingEnemies--;
  }

  private dead = false;
  private yv = 0;
  protected lastProjectile: number;
  protected readonly _width = 32;
  protected readonly _height = 32;
  protected readonly playerDamage = 6;
  protected health = 10;
}

class SmileyProjectile extends Enemy {
  public constructor(options: SpriteOptions) {
    super(options);
    this.texture = loadImage("enemy/faceproj.png");
  }

  protected health = 2;
  protected playerDamage = 3;
  protected yv = 0;
  protected _width = 16;
  protected _height = 16;

  protected update() {
    this.x -= SMILEY_PROJECTILE_SPEED;
    this.y -= this.yv;

    this.yv -= GRAVITY;
    if (this.touchingSolidBlock()) {
      this.yv = SMILEY_JUMP_HEIGHT;
    }
  }
}

class Pokerface extends Enemy {
  public update() {
    this.x += POKERFACE_SPEED * this.scale.x;
    if (this.touchingSolidBlock() || !this.touchingSolidBlock(true, BLOCK_WIDTH / 2 * this.scale.x, BLOCK_HEIGHT)) {
      this.scale.x = -this.scale.x;
    }
  }

  protected health = 3;
  protected playerDamage = 2;
}

class ShootingFace extends Enemy {
  public update() {
    var date = Date.now();
    var diff = date - this.lastState;
    if (this.state === 0) {
      if (diff > SHOOTING_FACE_DELAY_A) {
        this.state = 1;
      }
    } else if (this.state === 1) {
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

  // 0 = waiting
  // 1 = shooting
  private state = 1;
  private projectiles = 0;
  private lastState = 0;
  protected health = 3;
  protected playerDamage = 3;
}
