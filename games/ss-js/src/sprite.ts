/// <reference path="game.d.ts" />

/**
 * Sprites!
 * 
 * @class Sprite
 */
class Sprite {
  /**
   * Creates an instance of Sprite.
   * @param {SpriteOptions} options 
   * 
   * @memberOf Sprite
   */
  public constructor(public options: SpriteOptions) {
    this.texture = loadImage(options.texture);
    this.x = options.x;
    this.y = options.y;

    if (typeof options.width !== "undefined") {
      this.width = options.width;
    } else {
      this.width = this.texture.width;
    }
    if (typeof options.height !== "undefined") {
      this.height = options.height;
    } else {
      this.height = this.texture.height;
    }

    if (typeof options.solid !== "undefined") {
      this.solid = options.solid;
    } else {
      this.solid = true;
    }

    if (options.tick) {
      this.tick = options.tick;
      this.tickable = true;
      tickable.push(this);
    } else {
      this.tickable = false;
    }

    if (options.animation) {
      this.animated = true;
      this.animation = options.animation;
      this.frame = 0;
      this.animationFrame = 0;
      // if (typeof this.animation.adjustSize === "undefined"){
      //   this.animation.adjustSize = true;
      // }
      animated.push(this);
    } else {
      this.animated = false;
    }

    if (typeof options.visible !== "undefined") {
      this.visible = options.visible;
    } else {
      this.visible = true;
    }

    if (typeof options.render !== "undefined") {
      this.render = options.render;
    }

    if (typeof options.rotation !== "undefined") {
      this.rotation = options.rotation;
    } else {
      this.rotation = 0;
    }

    // some sprites need to create more sprites relative to it's position and set some variables relative to this sprite
    if (options.afterCreation) {
      options.afterCreation.call(this);
    }

    if (options.init) {
      options.init.call(this);
    }

    if (options.destroy) {
      this.afterDestroy = options.destroy;
    }

    // TODO: Better way to do this.
    // if (options.type) this.type = options.type;
    // if (options.type === "ice"){
    //   ice.add(this);
    // }else if (options.type === "switchToggled"){
    //   this.creationLevel = level;
    //   switchToggled.add(this);
    // }

    sprites.append(this);
  }

  public x: number
  public y: number
  public width: number
  public height: number
  public rotation: number
  public visible: boolean
  public solid: boolean
  public animation: AnimationOptions
  public frame?: number
  public animationFrame?: number
  public readonly creationLevel?: number

  protected tickable: boolean
  protected animated: boolean
  protected _texture: HTMLImageElement;

  protected animate(): void {
    // if the condition exists and returns false, return
    if (this.animation.condition && !this.animation.condition.call(this)) return;
    this.frame++;
    if (this.frame % this.animation.length === 0) {
      ++this.animationFrame;
      if (this.animationFrame === this.animation.frames.length) {
        this.animationFrame = 0;
      }
      this.setTexture(this.animation.frames[this.animationFrame]);
      // TODO: Auto adjust sprite size
      // if (this.animation.adjustSize){
      //   this.width = this.texture.width;
      //   this.height = this.texture.height;
      // }
    }
  }

  /**
   * Render this sprite
   * Can be overridden
   * 
   * @memberOf Sprite
   */
  public render(): void {
    if (this.animated) this.animate();
    if (this.visible) {
      if (this.rotation) {

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.translate(this.width / 2, this.height / 2);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.texture, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
      } else {
        ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
      }
    }
  }
  /**
   * Nuke this sprite from orbit
   * 
   * @memberOf Sprite
   */
  public destroy(): void {
    sprites.splice(sprites.indexOf(this), 1);
    if (this.animated) {
      animated.splice(animated.indexOf(this), 1);
    }
    if (this.tickable) {
      tickable.splice(tickable.indexOf(this), 1);
    }

    // FIXME
    for (let container of containers) {
      let index = container.indexOf(this);
      if (index > -1) container.splice(index, 1);
    }

    if (this.afterDestroy) this.afterDestroy.call(this);
  }
  public afterDestroy?(): void
  public tick?(diff?: number): boolean | void

  public get texture(): HTMLImageElement {
    return this._texture;
  }
  public set texture(texture: HTMLImageElement) {
    this._texture = texture;
    // TODO: Automatically set width and height from new texture
  }
  public setTexture(texture: HTMLImageElement | string): void {
    this.texture = loadImage(texture);
  }

  public onEdge(): boolean {
    return this.x < 0 ||
      this.x > WIDTH ||
      this.y < 0 ||
      this.y > HEIGHT;
  }
  public offScreen(): boolean {
    return this.x + this.width < 0 ||
      this.x > WIDTH ||
      this.y + this.height < 0 ||
      this.y > HEIGHT;
  }

  public touchingGroup(group: Container, xOffset: 0, yOffset: 0): boolean {
    for (let sprite of group) {
      if (this.intersects(sprite, xOffset, yOffset)) return true;
    }
    return false;
  }
  public touchingPlayer(xOffset = 0, yOffset = 0): boolean {
    return this.intersects(player, xOffset, yOffset);
  }
  public touchingGround(xOffset = 0, yOffset = 0): boolean {
    for (let block of sprites) {
      if (block.solid && this.intersects(block, xOffset, yOffset)) return true;
    }
    return false;
  }
  public getTouchingGround(xOffset = 0, yOffset = 0): Sprite | boolean {
    for (let block of sprites) {
      if (block.solid && this.intersects(block, xOffset, yOffset)) return block;
    }
    return false;
  }
  public intersects(sprite: Sprite, xOffset = 0, yOffset = 0) {
    return this.x + xOffset < sprite.x + sprite.width &&
      this.x + this.width + xOffset > sprite.x &&
      this.y < sprite.y + sprite.height + yOffset &&
      this.y + this.height + yOffset > sprite.y;
  }
}

/**
 * It's like a sprite but it's not solid
 * 
 * @class NonSolidSprite
 * @extends {Sprite}
 */
class NonSolidSprite extends Sprite {
  public constructor(options: SpriteOptions) {
    super(options);
  }

  public readonly solid: boolean = false
}

class Block extends Sprite {
  public constructor(options: SpriteOptions) {
    super(options);
    blocks.push(this);
  }

  public readonly width: number = BLOCK_WIDTH
  public readonly height: number = BLOCK_HEIGHT
}

class NonSolidBlock extends Block {
  public constructor(options: SpriteOptions) {
    super(options);
  }

  public readonly solid: boolean = false
}

class Switch extends Block {
  public constructor(options: SpriteOptions) {
    super(options);
  }

  public parent: Sprite
  public activated: boolean = false
}

class Player extends NonSolidSprite {
  public constructor(options: SpriteOptions) {
    super(options);
    var totalSwitches = LEVELS[level].join("").match(/#/g);
    if (totalSwitches) this.totalSwitches = totalSwitches.length;
    var totalGuards = LEVELS[level].join("").match(/!/g);
    if (totalGuards) this.totalGuards = totalGuards.length;
  }

  public reset() {
    this.y = HEIGHT - 1;
    this.x = 0;
    this.xv = 0;
    this.yv = 0;
    while (this.touchingGround()) {
      this.y--;
    }
  }

  public visible: boolean = false
  public downWasDown: boolean = false
  public height: number = PLAYER_HEIGHT
  public width: number = PLAYER_WIDTH
  public dir: number = DIR_RIGHT

  public yv: number = 0
  public xv: number = 0
  public run: number = 0
  public projectiles: number = 0
  public lastProjectile: number = 0
  public totalSwitches: number = 0
  public activatedSwitches: number = 0
  public allSwitchesActivated: boolean = false
  public frame: number = 0
  public totalGuards: number
  public killedGuards: number = 0
}

class PlayerGraphic extends NonSolidSprite {
  public constructor(options: SpriteOptions) {
    super(options);
  }

  public costume: string
}

class Projectile extends NonSolidSprite {
  public constructor(options: ProjectileOptions) {
    super(options);
    this.dir = options.dir;
    // tickable.add(this);
  }

  public readonly dir: number;
}

class Fireball extends Projectile {
  public constructor(options: ProjectileOptions) {
    super(options);
    fireballs.add(this);
  }

  public width: number = FIREBALL_WIDTH
  public height: number = FIREBALL_HEIGHT
  public yv: number = 0
}

class Hammer extends Projectile {
  public constructor(options: ProjectileOptions) {
    super(options);
    hammers.add(this);
  }

  public width: number = HAMMER_WIDTH
  public height: number = HAMMER_HEIGHT
  public yv: number = HAMMER_VELOCITY
}
