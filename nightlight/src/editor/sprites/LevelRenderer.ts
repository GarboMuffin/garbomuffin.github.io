import { blockMap } from "../../blockmap";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../../config";
import { AbstractSprite, ISpriteOptions } from "../../engine/sprite";
import { Vector } from "../../engine/vector";
import { CHAR_HEIGHT, CHAR_MAP, CHAR_WIDTH } from "../../game/sprites/text/NightlightTextSprite";
import { NightlightLevelEditor } from "../editor";
import { LevelEditorIndexes } from "./LevelEditorIndexes";

export class LevelRenderer extends AbstractSprite {
  public canvas!: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;
  public runtime!: NightlightLevelEditor;

  constructor(options: ISpriteOptions) {
    super(options);
    this.z = LevelEditorIndexes.Level;
    const { ctx, canvas } = this.runtime.createCanvas();
    this.canvas = canvas;
    this.ctx = ctx;
  }

  public updateLevel() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const data = this.runtime.levelData;
    const height = this.runtime.canvas.height;

    for (let y = 0; y < data.length; y++) {
      const row = data[y];
      const blockY = y * BLOCK_HEIGHT - this.runtime.blockOffsetY;
      for (let x = 0; x < row.length; x++) {
        const char = row[x];
        if (char === ".") {
          continue;
        }
        const blockX = BLOCK_WIDTH * x;
        const texture = this.runtime.getImage(blockMap[char].texture);
        this.ctx.drawImage(texture, blockX, blockY);
      }
    }

    const jumpLightTexture = this.runtime.getImage("blackjumplight");
    for (const position of this.runtime.jumpLights) {
      this.ctx.drawImage(jumpLightTexture, position.x, position.y);
    }

    for (const opt of this.runtime.text) {
      this.drawText(this.ctx, opt.text, opt.position);
    }
  }

  public drawText(ctx: CanvasRenderingContext2D, text: string, pos: Vector) {
    for (let i = 0; i < text.length; i++) {
      const originalChar = text[i].toLowerCase();
      const char = CHAR_MAP[originalChar] || originalChar;
      if (char === "skip") {
        continue;
      }
      const x = pos.x + (i * CHAR_WIDTH);
      const texture = this.runtime.getImage("text/" + char);
      ctx.drawImage(texture, x, pos.y, Math.max(CHAR_WIDTH, texture.width), CHAR_HEIGHT);
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.canvas, 0, 0);
  }
}
