import { IImageSpriteOptions, ImageSprite } from "../../../engine/sprites/imagesprite";
import { Vector } from "../../../engine/vector";
import { Nightlight } from "../../game";
import { CHAR_HEIGHT, CHAR_WIDTH, NightlightTextSprite } from "../text/NightlightTextSprite";
import { ZIndexes } from "../zindex";

class LevelCodeTextSprite extends NightlightTextSprite {
  public runtime!: Nightlight;

  get text() {
    return this.runtime.levelCode;
  }

  set text(text: string) {
    // lol no
  }
}

export class PauseSprite extends ImageSprite {
  public runtime!: Nightlight;

  constructor(options: IImageSpriteOptions) {
    super(options);

    this.width *= 2;
    this.height *= 2;

    this.gameState = this.runtime.pauseState;
    this.x = (this.runtime.canvas.width / 2) - (this.width / 2);
    this.y = this.runtime.canvas.height * 0.2;
    this.z = ZIndexes.PauseMenu;
    this.runtime.pauseState.renderingEnabled = false;

    const getCenterX = (text: string) => (this.runtime.canvas.width / 2) - (text.length * CHAR_WIDTH / 2);

    const spawnCenteredText = (text: string, y: number) => {
      return new NightlightTextSprite({
        text,
        position: new Vector(getCenterX(text), y, ZIndexes.PauseMenu),
        gameState: this.gameState,
        persistent: true,
      });
    };
    spawnCenteredText("hit esc to resume", this.runtime.canvas.height * 0.4);

    const levelCodeLabel = spawnCenteredText("level code:", this.runtime.canvas.height * 0.9);
    new LevelCodeTextSprite({
      text: "this will be replaced",
      position: new Vector(getCenterX("12345678"), levelCodeLabel.y + CHAR_HEIGHT, ZIndexes.PauseMenu),
      persistent: true,
      gameState: this.gameState,
    });

    this.addTask(() => this.keyTest());
  }

  private keyTest() {
    // escape key
    if (this.runtime.keyboard.keys[27].justPressed) {
      this.runtime.pauseState.renderingEnabled = !this.runtime.pauseState.renderingEnabled;
      this.runtime.playState.updatingEnabled = !this.runtime.playState.updatingEnabled;
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#000000AA";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    super.render(ctx);
  }
}
