import { AbstractSprite } from "../../../engine/sprite";
import { Task } from "../../../engine/task";
import { runPhysics } from "../../physics";
import { PlayerSprite } from "../player/player";
import { IBlockOptions, SolidBlock } from "./block";

/*
 * A block that crumbles beneath you as you stand on it
 * Will reappear after a few seconds
 */

// The amount of frames in the crumbling animation
const CRUMBLE_FRAMES = 9;

// The length of each frame in the crumbling animation
const CRUMBLE_FRAME_LENGTH = 5;

// How long before the block will reappear
const CRUMBLE_RESPAWN = 60 * 3;

export class CrumblingBlock extends SolidBlock {
  private crumbling: boolean = false;
  private crumbleProgress: number = 1;
  public yv: number = 0;
  public xv: number = 0;

  private readonly startingX: number;
  private readonly startingY: number;

  constructor(opts: IBlockOptions) {
    super(opts);

    this.startingX = this.x;
    this.startingY = this.y;
  }

  public handleIntersect(sprite: AbstractSprite, velocity: number, horizontal: boolean) {
    super.handleIntersect(sprite, velocity, horizontal);

    if (!this.crumbling && !horizontal && velocity < 0 && sprite instanceof PlayerSprite) {
      this.crumbling = true;

      this.addTask(new Task({
        run: (task) => this.crumble(task),
        repeatEvery: CRUMBLE_FRAME_LENGTH,
      }));
    }
  }

  private updateVisual() {
    this.texture = this.runtime.getImage(`blocks/crumble/${this.crumbleProgress}`);
    this.updateDimensions();
  }

  private respawn() {
    this.x = this.startingX;
    this.y = this.startingY;
    this.crumbling = false;
    this.yv = 0;
    this.crumbleProgress = 1;
    this.solid = true;
    this.updateVisual();
  }

  private crumble(task: Task) {
    this.crumbleProgress++;
    this.updateVisual();

    this.runtime.playSound("blocks/break", true);

    if (this.crumbleProgress === CRUMBLE_FRAMES) {
      task.stop();
      this.solid = false;
      this.runtime.playSound("blocks/fall");
      this.addTask((task2) => this.fall(task2));
    }
  }

  private fall(task: Task) {
    const physicsResult = runPhysics(this, {
      collision: false,
    });

    if (this.y >= this.runtime.canvas.height) {
      task.stop();
      this.addTask(new Task({
        run: () => this.respawn(),
        delay: CRUMBLE_RESPAWN,
      }));
    }
  }

  get needsReinstantiate() {
    return true;
  }

  get type() {
    return CrumblingBlock;
  }
}
