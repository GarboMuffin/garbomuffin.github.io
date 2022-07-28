import { ConfigManager } from "../config/config";

const ONE_FRAME = 1000 / 60; // length of one frame at 60 fps

interface IPrompter {
  start(): void;
  stop(): void;

  show(): void;
  hide(): void;
}

export enum Direction {
  Up = -1, Down = 1,
}

export abstract class AbstractPrompter implements IPrompter {
  private _scrollDistance: number = 0;
  private lastFrameTime: number = 0;
  protected maxScrollDistance: number = Infinity;
  protected direction: Direction = Direction.Down;
  public showing: boolean = false;
  public scrolling: boolean = false;
  public config: ConfigManager;

  constructor(config: ConfigManager) {
    this.config = config;

    this.loop = this.loop.bind(this);
    this.loop(0);
  }

  ///
  /// Inherited from IPrompter
  ///

  // Start the scrolling
  public start() {
    this.scrolling = true;
  }

  // Stop the scrolling
  public stop() {
    this.scrolling = false;
  }

  // show the prompter
  // call super.show() in implementations
  public show() {
    this.showing = true;
    this.scrollDistance = 0;

    this.loadScript(this.getScript());
  }

  // hide & stop the prompter
  // call super.hide() in implementations
  public hide() {
    this.stop();

    this.showing = false;
  }

  ///
  /// Methods
  ///

  // Reverse the going direction
  protected reverseDirection() {
    if (this.direction === Direction.Up) {
      this.direction = Direction.Down;
    } else {
      this.direction = Direction.Up;
    }
  }

  // Main loop - renders and scrolls
  protected loop(currentTime: number) {
    requestAnimationFrame(this.loop);

    if (!this.showing) {
      return;
    }

    // Determine the time since last frame, capping at 1000 ms
    // A frame should never take more than 1000 ms unless requestAnimationFrame() is blocked by something
    // (like being on a different tab)
    // If the user tabs out for a minute we don't want the prompter to suddenly finish when they return.
    const timeSinceLastFrame = Math.min(currentTime - this.lastFrameTime, 1000);
    // Scroll the screen proportional to the amount of lag
    if (this.scrolling) {
      this.scroll(timeSinceLastFrame / ONE_FRAME);
    }
    this.lastFrameTime = currentTime;

    // Render it using Math.floor just so the number is a nice integer and not decimals
    this.render(Math.floor(this.scrollDistance));
  }

  // Move the current scroll distance according to the speed
  // Also use the "time since last frame" to move slower or faster during periods of lag
  protected scroll(frames: number) {
    this.scrollDistance += this.config.options.speed.get() * this.direction * frames;
  }

  protected toggleScrolling() {
    if (this.scrolling) {
      this.stop();
    } else {
      this.start();
    }
  }

  ///
  /// Accessors
  ///

  get scrollDistance() {
    return this._scrollDistance;
  }

  set scrollDistance(scrollDistance) {
    // Make sure it don't scroll above the script
    if (scrollDistance < 0) {
      scrollDistance = 0;
    }

    // Make sure it can't scroll too far past the script
    if (scrollDistance > this.maxScrollDistance) {
      scrollDistance = this.maxScrollDistance;
    }

    this._scrollDistance = scrollDistance;
  }

  ///
  /// Abstract
  ///

  // returns the script
  protected abstract getScript(): string;

  // loads a script (not the javascript type) into the DOM
  // Should also set maxScrollDistance
  protected abstract loadScript(script: string): void;

  // Render the prompter.
  // distance - how far the scrolling has gone (in pixels)
  protected abstract render(distance: number): void;
}
