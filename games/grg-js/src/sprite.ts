interface SpriteOptions {
  x?: number
  y?: number
  center?: Sprite | SpriteOptions
  texture?: HTMLImageElement
  width?: number
  height?: number
  solid?: boolean
  rotation?: number
}

interface SpriteScale {
  x: number
  y: number
}

interface RenderedSpriteOptions extends SpriteOptions {
  frameUpdate?: () => void
  persistent?: boolean
  visible?: boolean
  zIndex?: number
}

interface ProjectileOptions extends RenderedSpriteOptions {
  direction?: number
}

interface HealthTickOptions extends RenderedSpriteOptions {
  id: number
}

interface BossRoutineOptions {
  init?: (sprite: Sprite) => void
  update: () => void
  onend?: () => void
}

/// BASE CLASSES

class Sprite {
  public constructor(options?: SpriteOptions) {
    if (typeof options.solid === "boolean") this.solid = options.solid;

    if (options.texture instanceof HTMLImageElement) this.texture = options.texture;

    if (isNumber(options.width) && options.width > 0) this.width = options.width;
    else if (this.texture) this.width = this.texture.width;

    if (isNumber(options.height) && options.height > 0) this.height = options.height;
    else if (this.texture) this.height = this.texture.height;
    if (isNumber(options.rotation)) this.rotation = options.rotation

    if (options.center) {
      this.center(options.center);
    } else {
      if (isNumber(options.x)) this.x = options.x;
      if (isNumber(options.y)) this.y = options.y;
    }
  }

  protected _x: number = 0
  protected _y: number = 0
  protected _texture: HTMLImageElement
  protected _width: number = 0
  protected _height: number = 0
  protected _solid: boolean = true
  protected _rotation: number = 0

  protected _scale: SpriteScale = {
    x: 1,
    y: 1,
  }

  public center(sprite: Sprite | SpriteOptions) {
    this.x = sprite.x + (isNumber(sprite.width) ? sprite.width / 2 : 0) - (this.width / 2);
    this.y = sprite.y + (isNumber(sprite.height) ? sprite.height / 2 : 0) - (this.height / 2);
  }
  public intersects(sprite: Sprite, xOffset = 0, yOffset = 0): boolean {
    return this.x + xOffset < sprite.x + sprite.width &&
      this.x + this.width + xOffset > sprite.x &&
      this.y < sprite.y + sprite.height + yOffset &&
      this.y + this.height + yOffset > sprite.y;
  }
  public touchingContainer(returnBoolean = true, container: Container, requiredType = Sprite, xOffset = 0, yOffset = 0): boolean | Sprite {
    for (var sprite of container) {
      if (this.intersects(sprite, xOffset, yOffset) && sprite instanceof requiredType) return returnBoolean ? true : sprite;
    }
    return false;
  }
  public touchingSolidBlock(returnBoolean = true, xOffset = 0, yOffset = 0): boolean | Sprite {
    for (var sprite of blocks) {
      if (sprite.solid && this.intersects(sprite, xOffset, yOffset)) return returnBoolean ? true : sprite;
    }
    return false;
  }
  public touchingBlock(returnBoolean = true, xOffset = 0, yOffset = 0): boolean | Sprite {
    for (var sprite of blocks) {
      if (this.intersects(sprite, xOffset, yOffset)) return returnBoolean ? true : sprite;
    }
    return false;
  }
  public touchingPlayer() {
    return this.intersects(player);
  }
  protected offScreen(): boolean {
    return this.x + this.width < 0 || this.x > WIDTH || this.y > HEIGHT || this.y + this.height < 0
  }

  public get x() {
    return this._x;
  }
  public set x(x: number) {
    if (isNumber(x)) this._x = x;
  }
  public get y() {
    return this._y;
  }
  public set y(y: number) {
    if (isNumber(y)) this._y = y;
  }
  public get centerX() {
    return this.x + (this.width / 2);
  }
  public get centerY() {
    return this.y + (this.height / 2);
  }
  public get width() {
    return this._width;
  }
  public set width(width: number) {
    if (isNumber(width) && width > 0) this._width = width;
  }
  public get height() {
    return this._height;
  }
  public set height(height: number) {
    if (isNumber(height) && height > 0) this._height = height;
  }
  public get rotation() {
    return this._rotation;
  }
  public set rotation(rotation: number) {
    if (isNumber(rotation)) this._rotation = rotation;
  }
  public get scale() {
    return this._scale;
  }
  public set scale(scale) {
    if (isNumber(scale.x) && isNumber(scale.y)) this._scale = scale;
  }

  public get texture() {
    return this._texture;
  }
  public set texture(texture: HTMLImageElement) {
    if (texture instanceof HTMLImageElement) this._texture = texture;
  }

  public get solid() {
    return this._solid;
  }
  public set solid(solid: boolean) {
    if (typeof solid === "boolean") this._solid = solid;
  }
}

class RenderedSprite extends Sprite {
  public constructor(options: RenderedSpriteOptions) {
    super(options);
    if (typeof options.persistent === "boolean") this.persistent = options.persistent;
    if (typeof options.visible === "boolean") this.visible = options.visible;

    if (isNumber(options.zIndex)) this.zIndex = options.zIndex;

    if (typeof options.frameUpdate === "function") {
      this.frameUpdate = options.frameUpdate.bind(this);
    }
    if (this.frameUpdate) {
      updatable.push(this);
    }

    sprites.push(this);
  }

  protected _visible: boolean = true
  protected _zIndex: number = 0
  public readonly persistent: boolean = false

  public render() {
    if (!this.visible) return;
    var scale = this.scale.x !== 1 || this.scale.y !== 1;
    var rotation = this.rotation;
    if (scale || rotation) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.translate(this.width / 2, this.height / 2);
      if (rotation) {
        ctx.rotate(this.rotation);
      } else if (scale) {
        ctx.scale(this.scale.x, this.scale.y);
      }
      ctx.drawImage(this.texture, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    } else {
      ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
    }
  }
  public destroy() {
    for (let container of containers) {
      var index = container.indexOf(this);
      if (index > -1) {
        container.splice(index, 1);
      }
    }
  }
  public frameUpdate?(): void

  public get visible() {
    return this._visible;
  }
  public set visible(visible: boolean) {
    if (typeof visible === "boolean") this._visible = visible;
  }
  public get zIndex() {
    return this._zIndex;
  }
  public set zIndex(zIndex) {
    if (isNumber(zIndex)) {
      this._zIndex = zIndex;
      sprites.sort(); // some zindex changed so sort the list again to update rendering order
    }
  }
}

/// SPRITES

class PlayerHitbox extends RenderedSprite {
  public constructor() {
    super({});
    this.reset();
  }

  private _yv = 0;
  private _xv = 0;
  private _lastShot = 0;
  private _direction = DIR_RIGHT;
  private _health = MAX_HEALTH;
  private _lastZ = false;
  protected readonly _height = PLAYER_HEIGHT;
  protected readonly _width = PLAYER_WIDTH;
  protected readonly _visible = false;
  protected readonly _solid = false;
  public readonly persistent = true;
  public frame = 0;
  public _vulnerable = true

  public frameUpdate() {
    // up
    if (keys[38] || keys[32]) {
      if (this.touchingSolidBlock(true)) {
        this.yv = JUMP_HEIGHT;
      }
    } else {
      if (this.yv > 1) {
        this.yv = 1;
      }
    }

    var right = keys[39];
    var left = keys[37];

    // right/left
    if (right && left) {
      this.direction = DIR_RIGHT;
    } else {
      if (left) {
        this.xv -= WALK_SPEED;
        if (this.xv < -maxSpeed) {
          this.xv = -maxSpeed;
        }
        this.direction = DIR_LEFT;
        this.frame++;
      } else if (right) {
        this.xv += WALK_SPEED;
        if (this.xv > maxSpeed) {
          this.xv = maxSpeed;
        }
        this.direction = DIR_RIGHT;
        this.frame++;
      } else {
        this.frame = 1;
        if (this.xv > 0) {
          this.xv -= FRICTION;
          if (this.xv < 0) this.xv = 0;
        } else if (this.xv < 0) {
          this.xv += FRICTION;
          if (this.xv > 0) this.xv = 0;
        }
      }
    }

    // x physics
    this.x += this.xv;
    this.x = Math.round(this.x);
    var block = <Sprite>this.touchingSolidBlock(false, 0, -1);
    if (block) {
      let increment = this.xv > 0 ? -1 : 1;
      while (this.intersects(block, 0, -1)) {
        this.x += increment;
      }
      this.xv = 0;
    }

    // y physics
    this.yv -= GRAVITY;
    this.y -= this.yv;
    var block = <Sprite>this.touchingSolidBlock(false, 0, -1);
    if (block) {
      let increment = this.yv < 0 ? -1 : 1;
      while (this.intersects(block, 0, -1)) {
        this.y += increment;
      }
      // dirty workarounds are the best workarounds
      if (this.yv > 0) {
        this.y++;
      }
      this.yv = 0;
    }

    // z/shoot
    if (keys[90] && !this.lastZ && playerProjectiles() < MAX_PROJECTILES) {
      this.shoot();
    }
    this.lastZ = keys[90];

    // a/rapid shoot
    if (keys[65] && Date.now() - this.lastShot > RAPID_SHOT_DELAY && playerProjectiles() < MAX_PROJECTILES) {
      this.shoot();
      this.lastShot = Date.now();
    }

    if (this.x + this.width >= WIDTH) {
      nextLevel();
    }

    if (this.x <= 0) {
      this.x = 0;
    }

    if (this.y > HEIGHT) {
      this.reset();
    }
  }
  public reset() {
    this.x = PLAYER_STARTING_X;
    this.y = HEIGHT - 1;
    this.yv = 0;
    this.xv = 0;
    this.vulnerable = true;
    playerGraphic.visible = true;
    while (this.touchingBlock()) {
      this.y--;
    }
  }
  private shoot() {
    new PlayerProjectile({
      direction: this.direction,
      center: this,
    });
  }
  public damage(amount) {
    if (isNumber(amount) && amount > 0 && this.vulnerable) {
      this.health -= amount;
      this.vulnerable = false;
      playerDamage();
    }
  }
  public kill() {
    this.visible = false;
    new PlayerDeathParticle({
      x: this.x,
      y: this.y,
    });
  }

  protected get yv() {
    return this._yv;
  }
  protected set yv(yv) {
    if (isNumber(yv)) this._yv = yv;
  }
  protected get xv() {
    return this._xv;
  }
  protected set xv(xv) {
    if (isNumber(xv)) this._xv = xv;
  }
  protected get direction() {
    return this._direction;
  }
  protected set direction(direction) {
    if (direction === DIR_RIGHT || direction === DIR_LEFT) {
      this._direction = direction;
      this.scale.x = direction;
    }
  }
  protected get lastShot() {
    return this._lastShot;
  }
  protected set lastShot(lastShot) {
    if (isFinite(lastShot)) this._lastShot = lastShot;
  }
  public get health() {
    return this._health;
  }
  public set health(health) {
    if (isNumber(health)) this._health = health;
  }
  public get vulnerable() {
    return this._vulnerable;
  }
  public set vulnerable(vulnerable) {
    if (typeof vulnerable === "boolean") this._vulnerable = vulnerable;
  }
  private get lastZ() {
    return this._lastZ;
  }
  private set lastZ(lastZ) {
    if (typeof lastZ === "boolean") this._lastZ = lastZ;
  }
}

class PlayerGraphic extends RenderedSprite {
  public constructor() {
    super({
      width: PLAYER_HEIGHT,
      height: PLAYER_HEIGHT,
      texture: loadImage("player/still.png")
    });
  }

  public frameUpdate() {
    this.x = player.x;
    this.y = player.y | 0;

    this.rotation = player.rotation;

    this.scale = player.scale;

    if (!player.touchingSolidBlock()) {
      this.texture = loadImage("player/still.png");
      player.frame = 1;
    } else if (!(keys[39] || keys[37])) {
      this.texture = loadImage("player/still.png");
      this.height = 16;
      this.walkFrame = false;
    } else {
      if (player.frame % WALK_ANIMATION_SPEED === 0) {
        player.frame = 1;
        this.walkFrame = !this.walkFrame;
      }
      if (this.walkFrame) {
        this.texture = loadImage("player/move.png");
        this.height = 15;
        this.y++;
      } else {
        this.texture = loadImage("player/still.png");
        this.height = 16;
      }
    }
  }

  protected readonly _height = PLAYER_HEIGHT;
  protected readonly _width = PLAYER_WIDTH;
  protected readonly _solid = false;
  protected readonly _zIndex = 10;
  public readonly persistent = true;
  private walkFrame = false; // there's only 2 frames in the walking animation so this is easiest
}

class HealthTick extends RenderedSprite {
  public constructor(options: HealthTickOptions) {
    super(options);
    this.id = options.id;
  }

  public frameUpdate() {
    if (this.id < player.health) {
      this.texture = loadImage("health/bar.png");
    } else {
      this.texture = loadImage("health/empty.png");
    }
  }

  private readonly id: number;
  protected readonly _x = 28;
  protected readonly _width = 8;
  protected readonly _height = 2;
  protected readonly _zIndex = 10;
  public readonly persistent = true;
}

class HitStun extends RenderedSprite {
  public constructor() {
    super({
      center: player,
      width: 16,
      height: 16,
      texture: loadImage("player/stun.png")
    });
  }

  public frameUpdate() {
    this.frame++;
    this.center(player);
    if (this.frame == 3) {
      this.visible = false;
    } else if (this.frame == 6) {
      this.frame = 0;
      this.repititions++;
      this.visible = true;
    }
    if (this.repititions > 10) {
      player.vulnerable = true;
      this.destroy();
    }
  }

  protected _zIndex = 20;
  protected _visible = true;
  private repititions = 0;
  private frame = 0;
  protected _width = 12;
  protected _height = 12;
}
