import { IImageSpriteOptions, ImageSprite } from "../../../engine/sprites/imagesprite";
import { runPhysics } from "../../physics";

/*
 * Fragments of the player that will fly everywhere you when the player dies
 */

// How long before they will start to go away (opacity up)
const LIFESPAN = 300;

// The rate at which the opacity will go up each frame after the life span is reached
const GHOST_RATE = 0.03;

// The friction value for rotation when on the ground
// Multiplied by rotation so higher is less, 1 is 0
const ROTATION_FRICTION = 0.5;

// create a high limit to prevent constant death from crashing everything
const MAX_FRAGMENTS = 250;
let existingFragments = 0;

export interface IPlayerFragmentSpriteOptions extends IImageSpriteOptions {
  yv: number;
  xv: number;
  rv: number; // rotation velocity
}

export class PlayerFragmentSprite extends ImageSprite {
  public xv: number = 0;
  public yv: number = 0;
  public rv: number = 0;
  public lifespan: number = 0;

  constructor(opts: IPlayerFragmentSpriteOptions) {
    super(opts);

    existingFragments++;
    if (existingFragments > MAX_FRAGMENTS) {
      this.destroy();
      return;
    }

    this.xv = opts.xv;
    this.yv = opts.yv;
    this.rv = opts.rv;

    if (this.y >= this.runtime.canvas.height) {
      this.y = this.runtime.canvas.height - 1;
    }

    this.addTask(() => this.run());
  }

  private run() {
    this.lifespan++;

    const physicsResult = runPhysics(this, {
      midAirFriction: false,
      roundValues: false,
    });

    if (physicsResult) {
      this.rv *= ROTATION_FRICTION;
    }

    this.rotation += this.rv;

    if (this.lifespan >= LIFESPAN) {
      this.opacity -= GHOST_RATE;
    }

    if (this.opacity < 0 || this.y > this.runtime.canvas.height) {
      this.destroy();
    }
  }

  public destroy() {
    super.destroy();

    existingFragments--;
  }
}
