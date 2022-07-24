import { IImageSpriteOptions, ImageSprite } from "../../../engine/sprites/imagesprite";
import { Task } from "../../../engine/task";
import { AbstractBoss } from "./boss";

const PARTICLE_LIFESPAN = 20;
const PARTICLE_STEP = 1;

const POOF_PARTICLE_COUNT = 8;
const POOF_PARTICLE_ANGLE = 360 / POOF_PARTICLE_COUNT;

export const BASE_TEXTURE = "boss/noss/noss";
const HIT_ANIMATION_FRAMES = [
  "boss/noss/hit",
  BASE_TEXTURE,
];
const HIT_ANIMATION_LENGTH = 2;
export const HIT_ANIMATION_REPEAT = 12;
export const HIT_ANIMATION_REPEAT2 = 35; // for dead

export const HIT_ANIMATION_TOTAL_LENGTH = HIT_ANIMATION_LENGTH *
                                          HIT_ANIMATION_REPEAT *
                                          HIT_ANIMATION_FRAMES.length +
                                          HIT_ANIMATION_LENGTH;
export const HIT_ANIMATION_TOTAL_LENGTH2 = HIT_ANIMATION_LENGTH *
                                           HIT_ANIMATION_REPEAT2 *
                                           HIT_ANIMATION_FRAMES.length +
                                           HIT_ANIMATION_LENGTH;

class NossBossDustSprite extends ImageSprite {
  constructor(options: IImageSpriteOptions) {
    super(options);

    this.addTask(new Task({
      run: () => this.destroy(),
      delay: PARTICLE_LIFESPAN,
    }));

    this.addTask(() => this.move());
  }

  private move() {
    this.moveForward(PARTICLE_STEP);
  }
}

export abstract class AbstractNossBoss extends AbstractBoss {
  protected poof() {
    const position = this.centerPosition;
    const texture = this.runtime.getImage("boss/noss/dust");
    position.x -= texture.width / 2;
    position.y -= texture.height / 2;

    for (let i = 0; i < POOF_PARTICLE_COUNT; i++) {
      new NossBossDustSprite({
        rotation: i * POOF_PARTICLE_ANGLE,
        position,
        texture,
      });
    }
  }

  protected playDeadAnimation() {
    this.playHitAnimation(HIT_ANIMATION_REPEAT2);
    this.runtime.playSound("boss/shadow5");
    this.addTask(new Task({
      run: () => this.kill(),
      delay: HIT_ANIMATION_TOTAL_LENGTH2 + 60,
    }));
  }

  protected kill() {
    this.runtime.playSound("boss/noss/shadow1");
    this.poof();
    this.spawnLevelUpCoin(this.position);
    this.destroy();
  }

  protected playHitAnimation(repeat: number = HIT_ANIMATION_REPEAT) {
    for (let i = 0; i < HIT_ANIMATION_FRAMES.length; i++) {
      const frame = HIT_ANIMATION_FRAMES[i];
      this.addTask(new Task({
        run: () => this.texture = this.runtime.getImage(frame),
        repeatEvery: HIT_ANIMATION_LENGTH * 2,
        delay: i * HIT_ANIMATION_LENGTH,
        repeatMax: repeat,
      }));
    }
  }
}
