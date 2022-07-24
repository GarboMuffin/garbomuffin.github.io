import { GameRuntime } from "../../runtime";
import { TaskRunner } from "../../task";

/*
 * A few base classes and things to extend for keyboard drivers
 *
 * Currently there's only one driver for computers but I want to add one for mobile.
 */

export abstract class AbstractKeyboard extends TaskRunner {
  public static readonly KEY_COUNT = 256;

  public keys: Key[] = [];

  constructor(runtime: GameRuntime) {
    super();

    runtime.addTask(() => this.update());

    for (let i = 0; i < AbstractKeyboard.KEY_COUNT; i++) {
      this.keys[i] = new Key(this);
    }
  }

  private update() {
    this.runTasks();
  }
}

export class Key {
  public isPressed: boolean = false;
  public framesDown: number = 0;

  constructor(keyboard: AbstractKeyboard) {
    keyboard.addTask(() => this.update());
  }

  private update() {
    if (this.isPressed) {
      this.framesDown++;
    } else {
      this.framesDown = 0;
    }
  }

  get justPressed() {
    return this.framesDown === 1;
  }
}
