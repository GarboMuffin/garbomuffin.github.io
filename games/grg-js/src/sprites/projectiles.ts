/// PROJECTILES

class Projectile extends RenderedSprite {
  public constructor(options: ProjectileOptions) {
    super(options);
    this.direction = options.direction;
    projectiles.push(this);
    this.y = Math.floor(this.y);
  }

  public frameUpdate() {
    this.x += this.direction * PROJECTILE_SPEED;
    this.check();
    if (this.offScreen()) this.destroy();
  }

  protected check() { }

  protected readonly direction: number
}

class PlayerProjectile extends Projectile {
  public constructor(options: ProjectileOptions) {
    super({
      ...options,
      texture: loadImage("bullet/bullet.png"),
      width: 6,
      height: 6,
    });
  }

  protected static damage = 3;
  private destroyAfter = false;

  protected check() {
    var touching = <Enemy>this.touchingContainer(false, enemies)
    if (touching && !this.destroyAfter) {
      touching.damage(1);
      this.destroyAfter = true;
    } else if (this.destroyAfter) {
      this.destroy();
    }
  }
}

class ShootingFaceProjectile extends Projectile {
  public constructor(options: SpriteOptions) {
    super({
      ...options,
      width: 8,
      height: 8,
    });
  }

  protected check() {
    if (this.touchingPlayer()) {
      player.damage(3);
    }
  }

  protected readonly direction = DIR_LEFT;
}
