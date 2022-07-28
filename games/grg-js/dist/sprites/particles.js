/// PARTICLES
class Particle extends RenderedSprite {
    constructor() {
        super(...arguments);
        this.frame = 0;
        this.lifeSpan = 30;
        this.speed = 30;
    }
    frameUpdate() {
        this.frame++;
        if (this.offScreen() || this.frame > this.lifeSpan)
            this.destroy();
        this.x += this.speed * Math.cos(this.rotation);
        this.y += this.speed * -Math.sin(this.rotation);
    }
}
// protected readonly speed: number = 3;
// protected readonly lifeSpan: number = 30;
Particle.count = 8;
Particle.angleIncrement = 360 / Particle.count;
class BreakParticle extends Particle {
    constructor(options) {
        super(Object.assign({}, options, { height: 5, width: 5 }));
        this.speed = 3;
        this.lifeSpan = 5;
    }
}
BreakParticle.count = 8;
BreakParticle.type = "break";
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
    constructor() {
        super(...arguments);
        this.yv = 5 / 2;
    }
    frameUpdate() {
        this.y -= this.yv;
        this.yv -= GRAVITY;
        this.x += 1;
    }
}
PlayerDeathParticle.count = 9;
PlayerDeathParticle.angleIncrement = 22.5;
PlayerDeathParticle.type = "grahm";
