import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../../config";
import { Task } from "../../engine/task";
import { Vector } from "../../engine/vector";
import { runPhysics } from "../physics";
import { Block, IBlockOptions } from "./blocks/block";

/*
 * The coin that levels you up
 */

// Length of an animation frame
const FRAME_LENGTH = 4;

// The total frames in the animation
const TOTAL_FRAMES = 4;

export class LevelUpCoinSprite extends Block {
  private animationFrame: number = 1;
  protected startingPosition: Vector;
  protected animated: boolean = true;

  constructor(opts: IBlockOptions) {
    super(opts);

    // In order to stay centered after changing position it will recenter using the startingPosition
    this.startingPosition = new Vector(this.position);

    this.centerAlign();
    this.addTask(() => this.run());
    this.addTask(new Task({
      run: () => this.animate(),
      repeatEvery: FRAME_LENGTH,
      delay: FRAME_LENGTH,
    }));
  }

  public run() {
    const touchingPlayer = this.intersects(this.runtime.player);
    if (touchingPlayer) {
      this.runtime.playSound("blocks/coin");
      this.runtime.level++;
      if (this.runtime.level === this.runtime.levels.length) {
        this.runtime.level = 0;
      }
      this.runtime.renderLevel();
    }
  }

  public animate() {
    if (!this.animated) {
      return;
    }

    this.animationFrame++;

    if (this.animationFrame > TOTAL_FRAMES) {
      this.animationFrame = 1;
    }

    this.texture = this.runtime.getImage(`coin/${this.animationFrame}`);
    this.updateDimensions();

    this.position = new Vector(this.startingPosition);
    this.centerAlign();
  }
}

export class SwordBossLevelUpCoinSprite extends LevelUpCoinSprite {
  public yv: number = 9;
  public xv: number = 0;
  private endY: number = (this.runtime.canvas.height / 2) - (BLOCK_WIDTH / 2) + this.height;
  private hasGoneAbove: boolean = false;

  constructor(options: IBlockOptions) {
    super(options);
    this.addTask((task) => this.fly(task));
    this.animated = false;
  }

  private fly(task: Task) {
    runPhysics(this, {
      collision: false,
    });

    if (this.hasGoneAbove) {
      if (this.y >= this.endY) {
        this.y = this.endY;
        this.animated = true;
        const x = this.x - (BLOCK_WIDTH - this.width) / 2;
        const y = this.y - (BLOCK_HEIGHT - this.height) / 2;
        this.startingPosition = new Vector(x, y);
        this.position = new Vector(x, y);
        this.centerAlign();
        task.stop();
      }
    } else {
      if (this.y <= this.endY) {
        this.hasGoneAbove = true;
      }
    }
  }
}
