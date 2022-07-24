import "../3rd-party/stableSort";
import { AbstractKeyboard } from "./drivers/keyboard/base";
import { Keyboard } from "./drivers/keyboard/keyboard";
import { Mouse } from "./drivers/mouse/mouse";
import { TouchscreenMouse } from "./drivers/mouse/touchscreen";
import { ExitError } from "./errors/exit";
import { AbstractSprite } from "./sprite";
import { GameState } from "./state";
import { StaticRendererSprite } from "./staticRenderer";
import { TaskRunner } from "./task";
import { TBackground, TImage, TSound } from "./types";
import { isMobile } from "./utils";
import { Vector } from "./vector";

/*
 * The main game runtime object
 */

// Dimensions of the canvas
export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 360;

// Format of images
// .jpg might work but don't, just don't
const IMAGE_FORMAT = "png";

// Format of sounds
// mp3 has very wide browser support: https://caniuse.com/#feat=mp3
const SOUND_FORMAT = "mp3";

export class GameRuntime extends TaskRunner {
  // debug config variables
  private readonly _DEBUG_NON_STATIC_OUTLINE = false;
  private readonly _DEBUG_STATIC_OUTLINE = false;

  public readonly isMobile: boolean = isMobile();
  public readonly images: Map<string, TImage> = new Map();
  public readonly sounds: Map<string, TSound> = new Map();
  public sprites: AbstractSprite[] = [];
  public mouse: Mouse;
  public keyboard: AbstractKeyboard;
  public frames: number = 0;
  public started: boolean = false;
  public background: TBackground = "white";
  public defaultState: GameState = new GameState();
  public cursor: string = "default";
  private _volume: number = 0;
  private _assetPromises: Array<Promise<TImage>> = [];

  // rendering
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public staticCanvas: HTMLCanvasElement;
  public staticCtx: CanvasRenderingContext2D;

  public collisionCanvas: HTMLCanvasElement;
  public collisionCtx: CanvasRenderingContext2D;

  constructor(container: HTMLElement) {
    super();

    // make the main canvas and add it to the DOM
    const {canvas, ctx} = this.createCanvas({alpha: false});
    this.canvas = canvas;
    this.ctx = ctx;
    container.appendChild(this.canvas);

    // init static rendering optimizations
    const {canvas: staticCanvas, ctx: staticCtx} = this.createCanvas();
    this.staticCanvas = staticCanvas;
    this.staticCtx = staticCtx;

    // collision canvas
    const {canvas: collisionCanvas, ctx: collisionCtx} = this.createCanvas();
    this.collisionCanvas = collisionCanvas;
    this.collisionCtx = collisionCtx;

    // mouse driver, support pc and mobile to some degree
    if (this.isMobile) {
      // console.log("mobile");
      this.mouse = new TouchscreenMouse(this);
    } else {
      // console.log("pc");
      this.mouse = new Mouse(this);
    }
    this.addTask(() => this.mouse.update());

    this.keyboard = new Keyboard(this);

    // set the current runtime on some objects
    // i dont want to do this but it works
    // FIXME: GameRuntime.instance instead of this.runtime
    AbstractSprite.runtime = this;

    // set inital variables that have to happen after other things here
    this.volume = 0.5;
  }

  ///
  /// ASSETS
  ///

  // add an asset and start loading it
  public addImage(src: string) {
    // uses the original src for storage
    // TODO: consider using the new src and adding that into getAsset?
    const originalSrc = src;

    // add the extension and folder
    src = `assets/${src}`;
    if (src.indexOf(".") === -1) {
      src += "." + IMAGE_FORMAT;
    }

    // console.log("adding image", src);

    const promise = new Promise<TImage>((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve();
      image.onerror = () => reject();
      this.images.set(originalSrc, image);
    });
    this._assetPromises.push(promise);
    return promise;
  }

  // see: addImage()
  public addSound(src: string) {
    const originalSrc = src;

    // add the extension and folder
    src = `assets/sounds/${src}`;
    if (src.indexOf(".") === -1) {
      src += "." + SOUND_FORMAT;
    }

    // console.log("adding sound", src);

    const promise = new Promise<TImage>((resolve: any, reject: any) => {
      const sound = new Audio(src);
      sound.oncanplaythrough = () => resolve();
      sound.onerror = () => reject();
      sound.preload = "auto";
      this.sounds.set(originalSrc, sound);
    });

    // music doesn't need to load for the game to work
    // it can load in the background when it starts to play
    // this._assetPromises.push(promise);
    return promise;
  }

  // wait for all assets to load
  public waitForAssets(handler: (num: number) => void = () => {}) {
    // progress reporting
    const total = this._assetPromises.length;
    let current = 0;
    for (const promise of this._assetPromises) {
      promise.then(() => {
        current++;
        handler(current / total);
      });
    }

    // the actual loading stuff
    return Promise.all(this._assetPromises)
      .then(() => {
        // console.log("loaded assets");
        this._assetPromises = [];
      });
  }

  // get an asset with a name
  public getImage(src: string): TImage {
    const image = this.images.get(src);
    if (!image) {
      throw new Error(`Couldn't get image with name ${src}`);
    }
    return image as TImage;
  }

  // get a sound with a name
  public getSound(src: string, clone: boolean = false): TSound {
    const val = this.sounds.get(src);
    if (!val) {
      throw new Error(`Couldn't get audio with name ${src}`);
    }
    if (clone) {
      return val.cloneNode() as TSound;
    } else {
      return val;
    }
  }

  // plays a sound and resets its currentTime to 0
  public playSound(src: string | TSound, clone: boolean = false) {
    if (typeof src === "string") {
      src = this.getSound(src, clone);
    }
    src.currentTime = 0;
    src.volume = this.volume;
    src.play();
    return src;
  }

  // stops a sound and resets its currentTime to 0
  public stopSound(src: string | TSound) {
    if (typeof src === "string") {
      src = this.getSound(src);
    }
    src.currentTime = 0;
    src.pause();
    return src;
  }

  ///
  /// CORE
  ///

  // resets things and starts the loop
  public start() {
    // console.log("starting loop");
    this.loop();
    this.updateStatic();

    this.started = true;

    new StaticRendererSprite({
      position: new Vector(0, 0, -1),
      persistent: true,
    });
  }

  // the main loop - calls all tasks in all sprites
  public loop() {
    // update sprites and this
    this.frames++;
    try {
      this.update();
    } catch (e) {
      // handle exiting
      if (e instanceof ExitError) {
        this.onexit();
        return;
      } else {
        throw e;
      }
    }

    // render
    this.render();

    // request the next frame to render
    requestAnimationFrame(() => this.loop());
  }

  public update() {
    this.cursor = "default";

    // all non-core details should be implemented using this.addTask
    // the only core things right now are sprite ticking and rendering (partly due to ordering reasons)
    // all tasks added on here are executed BEFORE sprites
    this.runTasks();

    // all sprites
    for (const sprite of this.sprites) {
      if (sprite.gameState && !sprite.gameState.updatingEnabled) {
        continue;
      }
      sprite.update();
    }
  }

  public stopAllSounds() {
    for (const sound of this.sounds.values()) {
      this.stopSound(sound);
    }
  }

  // throws an error that is handled gracefully by the update function
  // stops ALL execution
  public exit(): never {
    this.stopAllSounds();

    console.warn("exiting using exit()");

    // instances of ExitError are treated specially by the update function
    throw new ExitError();
  }

  ///
  /// EVENTS
  ///

  // called when exiting
  public onexit() {
    this.started = false;
  }

  // when volume is set
  public onsetvolume(volume: number) {

  }

  ///
  /// RENDERING
  ///

  public updateStatic() {
    this.resetCanvas(this.staticCtx);
    this.sortSprites();

    for (const sprite of this.sprites) {
      if (sprite.static) {
        sprite.render(this.staticCtx);
      }
    }

    if (this._DEBUG_STATIC_OUTLINE) {
      this.staticCtx.strokeStyle = "orange";
      this.staticCtx.lineWidth = 1;
      this.staticCtx.beginPath();
      for (const sprite of this.sprites) {
        this.staticCtx.rect(sprite.x, sprite.y, sprite.width, sprite.height);
      }
      this.staticCtx.closePath();
      this.staticCtx.stroke();
    }
  }

  public render() {
    // clear the canvas
    this.resetCanvas(this.ctx, this.background);

    // sort sprites by z
    this.sortSprites();

    // render all non static sprites onto our canvas
    for (const sprite of this.sprites) {
      if (sprite.gameState && !sprite.gameState.renderingEnabled) {
        continue;
      }
      if (!sprite.static) {
        sprite.render(this.ctx);
      }
    }

    if (this.canvas.style.cursor !== this.cursor) {
      this.canvas.style.cursor = this.cursor;
    }

    if (this._DEBUG_NON_STATIC_OUTLINE) {
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      for (const sprite of this.sprites) {
        if (sprite.gameState && !sprite.gameState.renderingEnabled) {
          continue;
        }
        if (!sprite.static) {
          this.ctx.rect(sprite.x, sprite.y, sprite.width, sprite.height);
        }
      }
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  protected sortSprites() {
    // if the sprites list isn't sorted anymore, then sort it
    const end = this.sprites.length - 1;
    for (let i = 0; i < end; i++) {
      const thisSprite = this.sprites[i];
      const nextSprite = this.sprites[i + 1];
      if (thisSprite.z > nextSprite.z) {
        this.sprites.stableSort((a, b) => a.position.z - b.position.z);
        break;
      }
    }
  }

  // clears the canvas and sets the background or makes it transparent
  protected resetCanvas(ctx: CanvasRenderingContext2D, background: TBackground = "rgba(0, 0, 0, 0)") {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }

  public createCanvas(options?: CanvasRenderingContext2DSettings) {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext("2d", options) as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;

    return {canvas, ctx};
  }

  ///
  /// ACCESSORS
  ///

  get volume() {
    return this._volume;
  }

  set volume(volume: number) {
    for (const sound of this.sounds.values()) {
      sound.volume = volume;
    }
    this._volume = volume;
    this.onsetvolume(volume);
  }
}
