import { AbstractSprite } from "../../../engine/sprite";
import { Task } from "../../../engine/task";
import { Vector } from "../../../engine/vector";
import { Nightlight } from "../../game";
import { PlayerSprite } from "../player/player";
import { IBlockOptions, SolidBlock } from "./block";
import { LightBlock, LightBlockGroups } from "./lightblock";

/*
 * A block that toggles the solidity of LightBlocks
 */

// Frames to be played in the animation
const ANIMATION_FRAMES = [
  "blocks/lightbutton/1",
  "blocks/lightbutton/2",
];

// The length of each animation frame
const ANIMATION_FRAME_LENGTH = 5;

// How long the switch will remaing as pressed before hiding
const HIDE_DELAY = 30;

export abstract class LightSwitchBlock extends SolidBlock {
  private activated: boolean = false;
  private animationProgress: number = 0;
  private startingPosition: Vector;
  public runtime!: Nightlight;
  public group: number;

  constructor(opts: IBlockOptions, group: number) {
    super(opts);
    this.group = group;
    this.startingPosition = new Vector(this.position);
    this.show();
  }

  get needsReinstantiate() {
    return true;
  }

  private show() {
    // reset variables
    this.animationProgress = 0;
    this.activated = false;
    // reset texture and position
    this.texture = this.runtime.getImage(ANIMATION_FRAMES[0]);
    this.updateDimensions();
    this.position = new Vector(this.startingPosition);
    this.visible = true;
    // start animating
    this.addTask(new Task({
      run: (task) => this.animate(task),
      repeatEvery: ANIMATION_FRAME_LENGTH,
    }));
  }

  private animate(task: Task) {
    if (this.activated) {
      task.stop();
      return;
    }

    this.animationProgress++;
    if (this.animationProgress === ANIMATION_FRAMES.length) {
      this.animationProgress = 0;
    }
    this.texture = this.runtime.getImage(ANIMATION_FRAMES[this.animationProgress]);
  }

  private activate() {
    this.activated = true;

    const sprites = this.runtime.sprites;

    const lightBlocks = sprites
      .filter((s) => s instanceof LightBlock)
      .filter((s) => (s as LightBlock).group === this.group) as LightBlock[];
    for (const block of lightBlocks) {
      block.toggleSolid();
    }

    const otherSwitches = sprites
      .filter((s) => s instanceof LightSwitchBlock && s !== this)
      .filter((s) => (s as LightSwitchBlock).group === this.group) as LightSwitchBlock[];
    for (const block of otherSwitches) {
      if (block.activated) {
        block.show();
      }
    }

    this.texture = this.runtime.getImage("blocks/lightbutton/down");
    this.updateDimensions();
    this.floorAlign();

    this.addTask(new Task({
      run: () => this.hide(),
      delay: HIDE_DELAY,
    }));

    this.runtime.playSound("blocks/fds");
  }

  private hide() {
    this.visible = false;
  }

  public handleIntersect(sprite: AbstractSprite, velocity: number, horizontal: boolean) {
    const res = super.handleIntersect(sprite, velocity, horizontal);

    if (!this.activated && sprite.y + sprite.height === this.y && sprite instanceof PlayerSprite) {
      this.activate();
      return false;
    }
    return res;
  }
}

export class RedGreenLightSwitchBlock extends LightSwitchBlock {
  constructor(opts: IBlockOptions) {
    super(opts, LightBlockGroups.RedGreen);
  }

  get type() { return RedGreenLightSwitchBlock; }
}
