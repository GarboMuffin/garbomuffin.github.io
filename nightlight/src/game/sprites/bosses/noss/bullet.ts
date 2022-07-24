import { IImageSpriteOptions, ImageSprite } from "../../../../engine/sprites/imagesprite";
import { Task } from "../../../../engine/task";
import { radiansToDegree } from "../../../../engine/utils";
import { Vector } from "../../../../engine/vector";
import { clamp } from "../../../../utils";
import { Nightlight } from "../../../game";

const GLIDE_TIME = 30;
const SPEED_GAIN = 0.2;
const TURN_SPEED = 7.5;
export const MOVE_TIME = 180;

export class NossBossBulletSprite extends ImageSprite {
  private speed: number = 0;
  private glideMoveSpeed: number;
  public runtime!: Nightlight;

  constructor(options: IImageSpriteOptions) {
    super(options);

    this.addTask(new Task({
      run: () => this.glideToCenter(),
      repeatEvery: 0,
      repeatMax: GLIDE_TIME,
    }));

    const canvasX = (this.runtime.canvas.width / 2) - (this.width / 2);
    const canvasY = (this.runtime.canvas.height / 2) - (this.height / 2);
    const center = new Vector(canvasX, canvasY);

    // figure out what rotation should be in order to glide to the center
    const distance = this.distanceTo(center);
    this.glideMoveSpeed = distance / GLIDE_TIME;
    const heightDifference = this.centerY - canvasY;
    this.rotation = -radiansToDegree(Math.acos(heightDifference / distance));
    if (this.centerX > canvasX) {
      this.rotation *= -1;
    }

    this.addTask(new Task({
      run: () => this.move(),
      delay: GLIDE_TIME,
      repeatEvery: 0,
      repeatMax: MOVE_TIME,
    }));

    this.addTask(new Task({
      run: () => this.destroy(),
      delay: MOVE_TIME,
    }));

    this.addTask(() => this.testIntersects());
  }

  private glideToCenter() {
    this.moveForward(-this.glideMoveSpeed);
  }

  private testIntersects() {
    if (this.intersects(this.runtime.player)) {
      this.runtime.player.kill();
    }
  }

  private move() {
    this.speed += SPEED_GAIN;
    this.rotation -= TURN_SPEED;
    this.moveForward(this.speed);

    this.x = clamp(this.x, 0, this.runtime.canvas.width);
    this.y = clamp(this.y, 0, this.runtime.canvas.height);
  }

  public render() {
    const rotation = this.rotation;
    this.rotation = 0;
    super.render.apply(this, arguments);
    this.rotation = rotation;
  }
}
