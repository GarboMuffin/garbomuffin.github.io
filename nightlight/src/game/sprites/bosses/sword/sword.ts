import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../../../../config";
import { Task } from "../../../../engine/task";
import { Vector } from "../../../../engine/vector";
import { Vector2D } from "../../../../engine/vector2d";
import { Nightlight } from "../../../game";
import { runPhysics } from "../../../physics";
import { IBlockOptions } from "../../blocks/block";
import { SwordBossLevelUpCoinSprite } from "../../coin";
import { AbstractBoss } from "../boss";

/*
 * The first boss: A Sword
 */

// swipe and spin cycle
const SPIN_ROTATION_SPEED = 5 / 2;
const SPIN_SIZE_CHANGE_RATE = 0.035;
const SWIPE_ROTATION_SPEED = 10 / 2;
const SWIPE_MOVE_SPEED = 12.5 / 2;
const SWIPE_BASE_DELAY = 60;
const SWIPE_SIZE_CHANGE_RATE = 0.11;
const SWIPE_ANIMATE_TIMES = 25;
const SWIPE_ANIMATE_FRAME_LENGTH = 3;
const SWIPE_TEXTURES = [
  "boss/sword/sword",
  "boss/sword/open",
];

const SWIPE_DOWN_SPEED = 15 / 2;
const SWIPE_UP_SPEED = SWIPE_DOWN_SPEED / 2;

// getting damaged
const DAMAGED_FALL_SPEED = 5;
const DAMAGED_RISE_SPEED = DAMAGED_FALL_SPEED / 2;
const DAMAGED_ANIMATE_TIMES = 20;
const DEAD_ANIMATE_TIMES = 35;
const DAMAGED_TEXTURES = [
  "boss/sword/open",
  "boss/sword/hurt",
];
const DAMAGE_ANIMATE_FRAME_LENGTH = 2;
const PLAYER_JUMP_YV = 3;

// death
const DEAD_ROTATION_SPEED = 0.742857142857 / 2; // 0.742... is how the game actually defines this.
const DEAD_STARTING_VELOCITY = 2;

const REST_PHASE_LENGTH = 180;

export interface ISwordOptions {
  health?: number;
  blocksFromTop?: number;
}

export class SwordBoss extends AbstractBoss {
  private health: number;
  private startingHealth: number;
  private hitPlayer: boolean = false;
  private _sizeScale: number = 1;
  private spinDirection: number = 1;
  private testCollision: boolean = false;
  private blocksFromTop: number;
  public yv: number = DEAD_STARTING_VELOCITY;
  public xv: number = 0;
  public runtime!: Nightlight;

  private readonly startingHeight: number;
  private readonly startingWidth: number;

  constructor(opts: IBlockOptions, options: ISwordOptions = {}) {
    super(opts);

    this.blocksFromTop = options.blocksFromTop || 14;
    this.startingHealth = options.health || 3;
    this.health = this.startingHealth;
    this.startingHeight = this.height;
    this.startingWidth = this.width;

    this.resetCoordinates();

    this.addTask(new Task({
      run: () => this.beginSpinAttack(),
      delay: 60,
    }));

    this.addTask(() => this.intersectTest());

    this.rotationPoint = new Vector2D(0.5, 0.05);
  }

  //
  // Utilities
  //

  public intersectTest() {
    if (!this.testCollision) {
      return;
    }

    if (this.complexIntersectsSimple(this.runtime.player)) {
      this.runtime.player.kill();
      this.hitPlayer = true;
    }
  }

  protected startRoutine() {
    super.startRoutine();
    this.texture = this.runtime.getImage("boss/sword/sword");
    this.beginSpinAttack();
  }

  private resetCoordinates() {
    this.recenter();
    this.y = this.blocksFromTop * BLOCK_HEIGHT;
  }

  private recenter() {
    this.x = this.runtime.canvas.width / 2 - this.width / 2;
  }

  private animate(textures: string[], times: number, length: number, cb?: () => void) {
    for (let i = 0; i < times; i++) {
      this.addTask(new Task({
        run: () => {
          this.texture = this.runtime.getImage(textures[i % textures.length]);
          if (cb) {
            cb();
          }
        },
        delay: i * length,
      }));
    }
  }

  //
  // Spin Attack
  //

  private beginSpinAttack() {
    this.testCollision = true;

    this.spinDirection = -this.multiplier;
    this.phaseDelay = SWIPE_BASE_DELAY;
    this.hitPlayer = false;

    this.addTask(new Task({
      run: (task) => this.spinAttack(task),
      repeatEvery: 0,
      delay: 60,
    }));
  }

  private spinAttack(task: Task) {
    this.rotation += this.spinDirection * SPIN_ROTATION_SPEED;

    // could be pos or neg
    if (Math.abs(this.rotation) >= 180) {
      this.sizeScale -= SPIN_SIZE_CHANGE_RATE;
    } else {
      this.sizeScale += SPIN_SIZE_CHANGE_RATE;
    }

    // could be pos or neg
    if (Math.abs(this.rotation) >= 360) {
      this.rotation = 0;
      task.stop();
      this.beginSwipeAttack();
    }

    this.resetCoordinates();
  }

  //
  // Swipe Attack
  //

  private beginSwipeAttack() {
    // make sure some values are reset properly
    this.sizeScale = 1;
    this.rotation = 0;
    this.phaseDelay = SWIPE_BASE_DELAY;

    // This is terrible.
    const multi = this.multiplier;

    const animate = () => {
      this.addPhase(new Task({
        run: () => this.animate(SWIPE_TEXTURES, SWIPE_ANIMATE_TIMES, SWIPE_ANIMATE_FRAME_LENGTH),
      }), SWIPE_ANIMATE_TIMES * SWIPE_ANIMATE_FRAME_LENGTH);
    };

    const attack = () => {
      this.addPhase(new Task({
        run: () => this.swipeAttack(SWIPE_DOWN_SPEED),
        repeatEvery: 0,
        repeatMax: 16,
        // delay: 10,
      }));

      this.addPhase(new Task({
        run: () => this.swipeAttack(-SWIPE_UP_SPEED),
        repeatEvery: 0,
        repeatMax: 32,
      }));
    };

    this.addPhase(new Task({
      run: () => this.swipeRotate(-1 * multi),
      repeatEvery: 0,
      repeatMax: 36,
    }));

    this.addPhase(new Task({
      run: () => this.swipeMove(1),
      repeatEvery: 0,
      repeatMax: 24,
    }));

    this.addPhase(new Task({
      run: () => {
        this.swipeRotate(-1 * multi);
        this.swipeSize(1);
      },
      repeatEvery: 0,
      repeatMax: 18,
    }));

    animate();
    attack();

    this.addPhase(new Task({
      run: () => this.swipeRotate(1 * multi),
      repeatEvery: 0,
      repeatMax: 36,
    }));

    animate();
    attack();

    this.addPhase(new Task({
      run: () => {
        this.swipeRotate(1 * multi);
        this.swipeSize(-1);
      },
      repeatEvery: 0,
      repeatMax: 18,
    }));

    this.addPhase(new Task({
      run: () => this.swipeMove(-1),
      repeatEvery: 0,
      repeatMax: 24,
    }));

    this.addPhase(new Task({
      run: () => this.beginRestPhase(),
    }));
  }

  private swipeRotate(multi: number) {
    this.rotation += SWIPE_ROTATION_SPEED * multi;
  }

  private swipeMove(multi: number) {
    this.y -= SWIPE_MOVE_SPEED * multi;
  }

  private swipeAttack(speed: number) {
    this.y += speed;
  }

  private swipeSize(multi: number) {
    this.sizeScale += SWIPE_SIZE_CHANGE_RATE * multi;
  }

  //
  // Rest Phase
  //

  private beginRestPhase() {
    this.testCollision = false;

    if (this.hitPlayer) {
      this.texture = this.runtime.getImage("boss/sword/heal");

      this.spawnHitEffect(this.health === this.startingHealth ? "+0" : "+1");

      if (this.health < this.startingHealth) {
        this.health++;
      }

      this.addTask(new Task({
        run: () => this.startRoutine(),
        delay: 60,
      }));
    } else {
      this.texture = this.runtime.getImage("boss/sword/open");

      this.addTask(new Task({
        run: (task) => this.restVulnerable(task),
        repeatEvery: 0,
        repeatMax: REST_PHASE_LENGTH,
      }));

      const health = this.health;
      this.addTask(new Task({
        run: () => {
          if (this.health === health) {
            this.startRoutine();
          }
        },
        delay: 180,
      }));
    }
  }

  private restVulnerable(task: Task) {
    // use simple intersects for performance reasons
    if (this.playerJumpedOn()) {
      this.bouncePlayer();
      this.damage();
      task.stop();
    }
  }

  private damage() {
    this.health--;

    this.spawnHitEffect("-1");

    this.phaseDelay = 0;
    this.addPhase(new Task({
      run: () => this.runtime.playSound("boss/ouch"),
    }));

    this.addPhase(new Task({
      run: () => this.y += DAMAGED_FALL_SPEED,
      repeatEvery: 0,
      repeatMax: 5,
    }));

    if (this.health === 0) {
      this.addPhase(new Task({
        run: () => this.runtime.playSound("boss/shadow5"),
      }));
    } else {
      this.addPhase(new Task({
        run: () => this.runtime.playSound("boss/sword/rumble"),
      }));
    }

    this.addPhase(new Task({
      run: () => this.animate(DAMAGED_TEXTURES, DAMAGED_ANIMATE_TIMES, DAMAGE_ANIMATE_FRAME_LENGTH),
    }), DAMAGED_ANIMATE_TIMES * DAMAGE_ANIMATE_FRAME_LENGTH);

    if (this.health === 0) {
      this.addPhase(new Task({
        run: () => this.animate(DAMAGED_TEXTURES, DEAD_ANIMATE_TIMES, DAMAGE_ANIMATE_FRAME_LENGTH, () => {
          this.rotation -= DEAD_ROTATION_SPEED;
        }),
      }), DEAD_ANIMATE_TIMES * DAMAGE_ANIMATE_FRAME_LENGTH);

      this.addPhase(new Task({
        run: () => this.runtime.setBackgroundMusic([]),
      }));

      this.addPhase(new Task({
        run: (task) => this.deadPhysics(task),
        repeatEvery: 0,
      }));
    } else {
      this.addPhase(new Task({
        run: () => this.animate(DAMAGED_TEXTURES, DAMAGED_ANIMATE_TIMES, DAMAGE_ANIMATE_FRAME_LENGTH),
      }), DAMAGED_ANIMATE_TIMES * DAMAGE_ANIMATE_FRAME_LENGTH);

      this.addPhase(new Task({
        run: () => this.texture = this.runtime.getImage("boss/sword/sword"),
      }));

      this.addPhase(new Task({
        run: () => this.y -= DAMAGED_RISE_SPEED,
        repeatEvery: 0,
        repeatMax: 10,
      }));

      this.addPhase(new Task({
        run: () => this.startRoutine(),
      }));
    }
  }

  //
  // Dead
  //

  private deadPhysics(task: Task) {
    const physicsResult = runPhysics(this, {
      collision: false,
    });

    if (this.y > this.runtime.canvas.height) {
      task.stop();

      this.addTask(new Task({
        run: () => this.spawnCoin(),
        delay: 30,
      }));
    }
  }

  private spawnCoin() {
    const texture = this.runtime.getImage("coin/1");
    const x = (this.runtime.canvas.width / 2) - (BLOCK_WIDTH / 2);
    const y = this.runtime.canvas.height;
    new SwordBossLevelUpCoinSprite({
      position: new Vector(x, y),
      texture,
    });
  }

  //
  // Getters and Setters
  //

  set sizeScale(scale: number) {
    this.height = this.startingHeight * scale;
    this.width = this.startingWidth * scale;
    this._sizeScale = scale;
    this.recenter();
  }

  get sizeScale() {
    return this._sizeScale;
  }

  get multiplier() {
    if ((this.runtime.player.x + this.runtime.player.width / 2) < (this.x + this.width / 2)) {
      return 1;
    } else {
      return -1;
    }
  }
}
