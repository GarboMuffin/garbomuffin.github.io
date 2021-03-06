import { GameRuntime } from "../../runtime";
import { TaskRunner } from "../../task";

export abstract class AbstractKeyboard extends TaskRunner {
  public static readonly KEY_COUNT = 256;

  public keys: Key[] = [];

  constructor(runtime: GameRuntime) {
    super();

    runtime.addTask(this.update.bind(this));

    for (let i = 0; i < AbstractKeyboard.KEY_COUNT; i++) {
      this.keys[i] = new Key(this, i);
    }
  }

  private update() {
    this.runTasks();
  }
}

export class Key {
  public readonly keyCode: number;
  public isPressed: boolean = false;
  public framesDown: number = 0;

  constructor(keyboard: AbstractKeyboard, keyCode: number) {
    keyboard.addTask(this.update.bind(this));
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
