import { IImageSpriteOptions } from "../../../../engine/sprites/imagesprite";
import { Task } from "../../../../engine/task";
import { Vector } from "../../../../engine/vector";
import { getRandomInt, scratchCoordinate } from "../../../../utils";
import { AbstractNossBoss, BASE_TEXTURE, HIT_ANIMATION_TOTAL_LENGTH } from "../noss";
import { MOVE_TIME as BULLET_MOVE_TIME, NossBossBulletSprite } from "./bullet";

interface INossPosition {
  position: Vector;
  direction?: 1 | -1;
}

const POSITIONS: INossPosition[] = [
  {
    position: scratchCoordinate(-156, 136), // original (-152, 132)
  },
  {
    position: scratchCoordinate(-116, -8), // original (-112, -12)
  },
  {
    position: scratchCoordinate(156, 72), // original (160, 68)
    direction: -1,
  },
];

const VULNERABLE_TEXTURE = "boss/noss/rest";
const STARTING_POS = scratchCoordinate(-4, -104); // original (0, -108)
const HEALTH = 3;

export class NossBoss extends AbstractNossBoss {
  private health: number = HEALTH;
  private shouldEndRoutine: boolean = false;
  private alreadyHit: boolean = false;

  constructor(options: IImageSpriteOptions) {
    super(options);

    this.visible = false;
    this.position = new Vector(STARTING_POS);

    this.addTask(new Task({
      run: () => this.start(),
      delay: 60,
    }));
  }

  private start() {
    this.audiblePoof(true);
    this.addTask(new Task({
      run: () => this.startRoutine(),
      delay: 90,
    }));
  }

  //
  // ROUTINE
  //

  protected startRoutine() {
    super.startRoutine();
    this.alreadyHit = false;

    this.addPhase(new Task({
      run: () => this.poof(),
    }));

    this.addPhase(new Task({
      run: () => this.runtime.playSound("boss/noss/shadow1"),
    }), 60);

    this.addPhase(new Task({
      run: () => this.runtime.playSound("boss/noss/shadow3"),
    }), 90);

    this.addPhase(new Task({
      run: () => this.teleport(),
    }));

    this.addPhase(new Task({
      run: () => this.audiblePoof(),
    }), 60);

    this.addPhase(new Task({
      run: () => this.spawnBullets(),
      repeatEvery: 1,
      repeatMax: 10,
    }));

    this.addPhase(new Task({
      run: () => this.afterSpawnBullets(),
    }), BULLET_MOVE_TIME);

    this.addPhase(new Task({
      run: () => this.texture = this.runtime.getImage(VULNERABLE_TEXTURE),
    }));

    this.addPhase(new Task({
      // note: this.rest() does its own endRoutine(), task.stop()
      run: (task) => this.rest(task),
      repeatEvery: 0,
    }));
  }

  private endRoutine() {
    this.addTask(new Task({
      run: () => this.startRoutine(),
      delay: 0,
    }));
  }

  private teleport() {
    const position = POSITIONS[getRandomInt(0, POSITIONS.length - 1)];
    this.position = new Vector(position.position);
    this.scale.x = position.direction || 1;
    this.texture = this.runtime.getImage(BASE_TEXTURE);
  }

  private rest(task: Task) {
    if (this.shouldEndRoutine || (!this.alreadyHit && task.repeatCount >= 300)) {
      this.endRoutine();
      task.stop();
      return;
    }

    if (!this.alreadyHit && this.playerJumpedOn()) {
      this.alreadyHit = true;
      this.bouncePlayer();
      this.spawnHitEffect("-1");
      this.health--;

      if (this.health === 0) {
        this.dead();
      } else {
        this.damage();
      }
    }
  }

  private damage() {
    this.playHitAnimation();

    this.addTask(new Task({
      run: () => this.shouldEndRoutine = true,
      delay: HIT_ANIMATION_TOTAL_LENGTH,
    }));
  }

  private dead() {
    this.playDeadAnimation();
  }

  private spawnBullets() {
    new NossBossBulletSprite({
      position: this.position,
      texture: this.runtime.getImage("boss/noss/bullet"),
    });
  }

  private afterSpawnBullets() {
    this.runtime.playSound("boss/noss/shadow4");
    this.shouldEndRoutine = false;
  }

  protected poof(newVisibility: boolean = !this.visible) {
    super.poof();
    this.visible = newVisibility;
  }

  // this function is brought to you by audible
  private audiblePoof(newVisibility?: boolean) {
    this.poof(newVisibility);
    this.runtime.playSound("boss/noss/shadow2");
  }
}
