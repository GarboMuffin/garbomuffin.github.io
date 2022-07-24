import { IImageSpriteOptions, ImageSprite } from "../../../engine/sprites/imagesprite";
import { Vector } from "../../../engine/vector";

/*
 * Health events for bosses
 *
 * +0, +1, -1
 */

const LIFESPAN = 60;
const OPACITY_PER_FRAME = 1 / LIFESPAN;
const SIZE_CHANGE = 0.025;
const Y_CHANGE = 0.5;

export class HitEffectSprite extends ImageSprite {
  private lifespan: number = 0;
  private readonly startingHeight: number;
  private readonly startingWidth: number;
  private readonly startingPosition: Vector;

  constructor(opts: IImageSpriteOptions) {
    super(opts);

    this.addTask(() => this.run());

    this.startingHeight = this.height;
    this.startingWidth = this.width;
    this.startingPosition = new Vector(this.position);
  }

  private run() {
    this.lifespan++;
    if (this.lifespan >= LIFESPAN) {
      this.destroy();
    }

    this.opacity -= OPACITY_PER_FRAME;

    // adjust the size accordingly
    const mult = (1 + (this.lifespan * SIZE_CHANGE));
    this.height = this.startingHeight * mult;
    this.width = this.startingWidth * mult;

    this.x = this.startingPosition.x - ((this.width - this.startingWidth) / 2);
    this.y = this.startingPosition.y - ((this.height - this.startingHeight) / 2);

    // this is terrible
    this.startingPosition.y -= Y_CHANGE;
  }
}
