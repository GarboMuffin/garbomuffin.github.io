import { AbstractSprite, ISpriteOptions } from "../../engine/sprite";
import { Task } from "../../engine/task";
import { Vector2D } from "../../engine/vector2d";

/*
 * The stars in the background.
 */

// How often to update opacity
const UPDATE_EVERY = 6;

// How many times will it update in each cycle
// One cycle is Dark -> Bright or Bright -> Dark, not both
const ANIMATION_LENGTH = 10;

export class BackgroundStarsSprite extends AbstractSprite {
  private progress: number = 0;
  private direction: number = 1;

  private renderCache: HTMLCanvasElement[] = [];

  constructor(opts: ISpriteOptions, positions: Vector2D[]) {
    super(opts);

    this.addTask(new Task({
      repeatEvery: UPDATE_EVERY,
      run: () => this.animate(),
    }));

    const path = new Path2D();
    for (const position of positions) {
      path.rect(position.x, position.y, this.width, this.height);
    }

    for (let i = 0; i <= ANIMATION_LENGTH; i++) {
      const {canvas, ctx} = this.runtime.createCanvas();
      this.renderStarPath(ctx, path, i / ANIMATION_LENGTH);
      this.renderCache[i] = canvas;
    }
  }

  private animate() {
    this.progress += this.direction;

    if (this.progress === 0 || this.progress === 10) {
      this.direction *= -1;
    }
  }

  private clamp(x: number, min: number, max: number) {
    if (x < min) {
      return min;
    } else if (x > max) {
      return max;
    } else {
      return x;
    }
  }

  public renderStarPath(ctx: CanvasRenderingContext2D, path: Path2D, alpha: number) {
    if (!this.visible) {
      return;
    }

    ctx.fillStyle = "white";
    ctx.globalAlpha = alpha;
    ctx.fill(path);
  }

  public render(ctx: CanvasRenderingContext2D) {
    if (!this.visible) {
      return;
    }

    const image = this.renderCache[this.progress];
    ctx.drawImage(image, 0, 0, image.width, image.height);
  }
}
