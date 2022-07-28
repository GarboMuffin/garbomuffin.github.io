/// PARTICLES

class Particle extends RenderedSprite {
  public frameUpdate() {
    this.frame++;
    if (this.offScreen() || this.frame > this.lifeSpan) this.destroy();

    this.x += this.speed * Math.cos(this.rotation);
    this.y += this.speed * -Math.sin(this.rotation);
  }

  protected frame: number = 0;
  // protected readonly speed: number = 3;
  // protected readonly lifeSpan: number = 30;

  protected static count: number = 8
  protected static angleIncrement: number = 360 / Particle.count;
  protected lifeSpan?: number = 30
  protected speed?: number = 30
}

class BreakParticle extends Particle {
  public constructor(options: SpriteOptions) {
    super({
      ...options,
      height: 5,
      width: 5,
    });
  }

  protected readonly speed = 3;
  protected readonly lifeSpan = 5;
  public static count = 8;
  public static type = "break";
}

// class BossParticle extends Particle {
//   public constructor(options: SpriteOptions){
//     super({
//       ...options,
//       height: 12,
//       width: 12,
//     });
//   }

//   public static count = 16;
//   public static type = "boss";
// }

class PlayerDeathParticle extends Particle {
  public frameUpdate() {
    this.y -= this.yv;
    this.yv -= GRAVITY;
    this.x += 1;
  }


  private yv = 5 / 2;
  public static count = 9;
  public static angleIncrement = 22.5;
  public static type = "grahm";
}
