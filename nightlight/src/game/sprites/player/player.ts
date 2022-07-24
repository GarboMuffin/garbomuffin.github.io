import { BLOCK_HEIGHT, CHEATS } from "../../../config";
import { IImageSpriteOptions, ImageSprite } from "../../../engine/sprites/imagesprite";
import { Vector } from "../../../engine/vector";
import { IPointSpawnType, IRandomSpawnType, IRangeSpawnType } from "../../../level";
import { clone, getRandomInt, getElementById } from "../../../utils";
import { Nightlight } from "../../game";
import { runPhysics } from "../../physics";
import { PseudoSolidBlock } from "../blocks/block";
import { PlayerFragmentSprite } from "./fragment";

/*
 * It's a player.
 *
 * For now there doesn't seem to be any problems with having the player also be the graphic
 * And until there are problems they will be staying as one
 */

// How fast the player walks
const PLAYER_WALK_SPEED = 0.5 / 2;

// The velocity gained when jumping
const JUMP_HEIGHT = 5.4;

// Maximum speed the player is allowed to move at
const PLAYER_MAX_SPEED = 4 / 2;

// The player uses a custom friction
// This is the value used in that friction
const PLAYER_FRICTION = 0.8 / 2;

// Fragment textures that will always be present when dying
const FRAGMENT_TEXTURES = [1, 2, 3, 4];
// The minimum amount of small pieces to create
const FRAGMENT_SMALL_PIECE_MIN = 4;
// The maxiumum amount of small pieces to create
const FRAGMENT_SMALL_PIECE_MAX = 6;
// The texture associated with small pieces
const FRAGMENT_SMALL_PIECE_TEXTURE = 5;
// The range of xv values that pieces will have
const FRAGMENT_XV_RANGE = 1;
// The minimum yv that pieces will have
const FRAGMENT_YV_MIN = 3;
// The maxiumum yv that pieces will have
const FRAGMENT_YV_MAX = 6;
// The range of rotation change that pieces will have
const FRAGMENT_RV_RANGE = 10;

// Frames in the walk animation
const WALK_ANIMATION_FRAMES = 4;
// Length of each frame
const WALK_ANIMATION_LENGTH = 4;

enum MovementDirection {
  Right = 1, Left = -1,
}

export class PlayerSprite extends ImageSprite {
  public yv: number = 0;
  public xv: number = 0;
  private lastMovementDirection: MovementDirection = MovementDirection.Right;
  private onGround: boolean = true;
  private walkingAnimationProgress: number = 1;
  private currentFrameProgress: number = 0;
  private moving: boolean = false;
  public hasJumpLight: boolean = false;
  public runtime!: Nightlight;

  constructor(opts: IImageSpriteOptions) {
    super(opts);

    this.addTask(() => this.run());
    this.addTask(() => this.updateGraphic());

    if (CHEATS) {
      this.addTask(() => this.debugTeleport());
    }
  }

  private debugTeleport() {
    if (this.runtime.mouse.isDown) {
      const position = new Vector(this.runtime.mouse.position);
      position.x -= this.width / 2;
      position.y -= this.height / 2;
      position.z = this.z;
      this.position = position;
    }
  }

  private getInputs(): {rightDown: boolean, leftDown: boolean, upDown: boolean, upJustPressed: boolean} {
    if (this.runtime.isMobile) {
      return this.getMobileInputs();
    } else {
      return this.getComputerInputs();
    }
  }

  private getComputerInputs() {
    const keys = this.runtime.keyboard.keys;
    const rightDown = keys[39].isPressed || keys[68].isPressed;
    const leftDown = keys[37].isPressed || keys[65].isPressed;
    const upDown = keys[38].isPressed || keys[87].isPressed;
    const upJustPressed = keys[38].justPressed || keys[87].justPressed;

    return {
      rightDown,
      leftDown,
      upDown,
      upJustPressed,
    };
  }

  private getMobileInputs() {
    const mouseX = this.runtime.mouse.position.x;
    const mouseY = this.runtime.mouse.position.y;
    const mouseDown = this.runtime.mouse.isDown;

    const grace = this.runtime.canvas.width / 10;
    const moveLeftMax = this.runtime.canvas.width / 3 + grace;
    const moveRightMin = this.runtime.canvas.width / 3 * 2 - grace;
    const moveUpMax = this.runtime.canvas.height / 2;

    const leftDown = mouseDown && mouseX <= moveLeftMax;
    const rightDown = mouseDown && mouseX >= moveRightMin;
    const upDown = mouseDown && mouseY <= moveUpMax;
    const upJustPressed = this.runtime.mouse.isClick;

    return {
      leftDown,
      rightDown,
      upDown,
      upJustPressed,
    }
  }

  private run() {
    const prevXv = this.xv;
    const prevYv = this.yv;

    const inputs = this.getInputs();

    this.moving = false;
    if (inputs.rightDown && !inputs.leftDown) {
      this.xv += PLAYER_WALK_SPEED;
      this.lastMovementDirection = MovementDirection.Right;
      this.moving = true;
    }

    if (inputs.leftDown && !inputs.rightDown) {
      this.xv -= PLAYER_WALK_SPEED;
      this.lastMovementDirection = MovementDirection.Left;
      this.moving = true;
    }

    if ((inputs.upDown && this.onGround) || (inputs.upJustPressed && this.hasJumpLight)) {
      this.runtime.playSound("player/jump");
      this.hasJumpLight = false;
      this.yv = JUMP_HEIGHT;
    } else if (!inputs.upDown && this.yv > 3) {
      this.yv = 3;
    }

    if ((!inputs.leftDown && !inputs.rightDown) || (inputs.leftDown && inputs.rightDown)) {
      if (this.xv > 0) {
        this.xv -= PLAYER_FRICTION;
        this.xv = Math.max(this.xv, 0);
      } else {
        this.xv += PLAYER_FRICTION;
        this.xv = Math.min(this.xv, 0);
      }
    }

    if (this.xv > PLAYER_MAX_SPEED) {
      this.xv = PLAYER_MAX_SPEED;
    } else if (this.xv < -PLAYER_MAX_SPEED) {
      this.xv = -PLAYER_MAX_SPEED;
    }

    const physicsResult = runPhysics(this, {
      friction: false,
    });
    this.onGround = physicsResult;

    if (this.onGround && prevYv < -1.6) {
      this.runtime.playSound("player/ding");
    }

    if (this.onGround) {
      this.hasJumpLight = false;
    }

    if (this.y >= this.runtime.canvas.height) {
      this.kill();
    }

    // if (this.runtime.mouse.isDown) {
    //   this.x = this.runtime.mouse.position.x;
    //   this.y = this.runtime.mouse.position.y;
    // }
  }

  public reset() {
    const sprites = this.runtime.blocks.filter((s) => s.solid || s instanceof PseudoSolidBlock);

    this.position.y = this.runtime.canvas.height - BLOCK_HEIGHT;
    const spawnType = this.runtime.playerSpawn.type;
    if (spawnType === "default") {
      this.position.x = 40;
    } else if (spawnType === "random") {
      const playerSpawn = this.runtime.playerSpawn as IRandomSpawnType;
      var minX = playerSpawn.minX;
      var maxX = playerSpawn.maxX;
      var minY = spawnType === "random" ? playerSpawn.minY : this.y;
      var maxY = spawnType === "random" ? playerSpawn.maxY : this.y;
      this.position.x = getRandomInt(minX, maxX);
      this.position.y = getRandomInt(minY, maxY);
    } else if (spawnType === "range") {
      const playerSpawn = this.runtime.playerSpawn as IRangeSpawnType;
      var minX = playerSpawn.minX;
      var maxX = playerSpawn.maxX;
      this.x = getRandomInt(minX, maxX);
      // undefined or true act as true
      if (playerSpawn.requireSolid !== false) {
        let tries = 0;
        while (!this.intersects(sprites)) {
          tries++;
          if (tries > 1000) {
            alert("Invalid spawn range, can't find solid blocks.");
            break;
          }
          this.x = getRandomInt(minX, maxX);
        }
      }
    } else if (spawnType === "point") {
      const playerSpawn = this.runtime.playerSpawn as IPointSpawnType;
      this.position.x = playerSpawn.x;
      this.position.y = playerSpawn.y;
    }

    this.xv = 0;
    this.yv = 0;

    while (this.intersects(sprites)) {
      this.y -= BLOCK_HEIGHT;
    }
  }

  public kill() {
    const fragmentTextures = clone(FRAGMENT_TEXTURES);
    const smallPieces = getRandomInt(FRAGMENT_SMALL_PIECE_MIN, FRAGMENT_SMALL_PIECE_MAX);
    for (let i = 0; i < smallPieces; i++) {
      fragmentTextures.push(FRAGMENT_SMALL_PIECE_TEXTURE);
    }

    for (const i of fragmentTextures) {
      new PlayerFragmentSprite({
        position: new Vector(this.position),
        texture: this.runtime.getImage(`fragments/${i}`),

        xv: getRandomInt(-FRAGMENT_XV_RANGE * 1000, FRAGMENT_XV_RANGE * 1000) / 1000,
        yv: getRandomInt(FRAGMENT_YV_MIN * 1000, FRAGMENT_YV_MAX * 1000) / 1000,
        rv: getRandomInt(-FRAGMENT_RV_RANGE * 1000, FRAGMENT_RV_RANGE * 1000) / 1000,
      });
    }

    const blocks = clone(this.runtime.blocks);
    for (const block of blocks) {
      if (block.needsReinstantiate) {
        const opts = block.spawningOptions;
        block.destroy();
        const constructor = block.type;
        new constructor(opts);
      }
    }

    this.reset();
    this.runtime.playSound("player/death");
  }

  private updateGraphic() {
    this.scale.x = this.lastMovementDirection;
    if (this.onGround) {
      if (this.moving) {
        this.currentFrameProgress++;
        if (this.currentFrameProgress === WALK_ANIMATION_LENGTH) {
          this.currentFrameProgress = 0;
          this.walkingAnimationProgress++;
        }
        if (this.walkingAnimationProgress > WALK_ANIMATION_FRAMES) {
          this.walkingAnimationProgress = 1;
        }
        this.texture = this.runtime.getImage(`player/walk${this.walkingAnimationProgress}`);
      } else {
        this.texture = this.runtime.getImage("player/idle");
      }
    } else {
      if (this.yv < 0.1) {
        this.texture = this.runtime.getImage("player/down");
      } else {
        this.texture = this.runtime.getImage("player/up");
      }
    }
  }
}
