import { Container } from "./container";
import { Position } from "./position";
import { Scale } from "./scale";
import { TaskRunner } from "./task";
import { TGame } from "./types";
import { getOrDefault } from "./utils";

export interface ISpriteOptions {
  position: Position;

  width?: number;
  height?: number;

  scale?: Scale;
}

export abstract class AbstractSprite extends TaskRunner {
  public static runtime: TGame;
  public runtime: TGame = AbstractSprite.runtime;

  public position: Position;
  public width: number;
  public height: number;
  public scale: Scale;

  public constructor(options: ISpriteOptions) {
    super();

    this.position = options.position;

    this.width = getOrDefault(options.width, 0);
    this.height = getOrDefault(options.height, 0);

    this.scale = getOrDefault(options.scale, new Scale());

    this.runtime.sprites.push(this);
  }

  public abstract render(ctx: CanvasRenderingContext2D): void;

  public update() {
    this.runTasks();
  }

  public destroy() {
    this._removeFromContainer(this.runtime.sprites);
    for (const container of this.runtime.containers) {
      this._removeFromContainer(container);
    }
  }

  private _removeFromContainer(container: Container) {
    const index = container.sprites.indexOf(this);
    if (index > -1) {
      container.sprites.splice(index, 1);
    }
  }

  public containsPoint(p: Position) {
    return p.x > this.x &&
      p.x < this.x + this.width &&
      p.y > this.y &&
      p.y < this.y + this.height;
  }

  get x() {
    return this.position.x;
  }
  set x(x) {
    this.position.x = x;
  }
  get y() {
    return this.position.y;
  }
  set y(y) {
    this.position.y = y;
  }
  get z() {
    return this.position.z;
  }
  set z(z) {
    this.position.z = z;
  }
}
