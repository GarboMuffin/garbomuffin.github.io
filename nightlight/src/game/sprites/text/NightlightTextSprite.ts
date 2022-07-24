import { AbstractSprite, ISpriteOptions } from "../../../engine/sprite";

export interface INightlightTextSpriteOptions extends ISpriteOptions {
  text: string;
}

export const CHAR_WIDTH = 8;
export const CHAR_HEIGHT = CHAR_WIDTH;
const TEXTURE_FOLDER = "text/";

// map of specially treated letters to their real path or behavior
export const CHAR_MAP: {[s: string]: string | undefined} = {
  " ": "skip",
  ".": "period",
  "'": "singlequote",
  ":": "colon",
  "?": "question",
};

export class NightlightTextSprite extends AbstractSprite {
  public static: boolean = false;
  protected readonly text: string;

  constructor(options: INightlightTextSpriteOptions) {
    super(options);
    this.text = options.text;
  }

  public render(ctx: CanvasRenderingContext2D) {
    if (!this.visible) {
      return;
    }

    for (let i = 0; i < this.text.length; i++) {
      const originalChar = this.text[i].toLowerCase();
      const char = CHAR_MAP[originalChar] || originalChar;
      if (char === "skip") {
        continue;
      }
      const x = this.x + (i * CHAR_WIDTH);
      const texture = this.runtime.getImage(TEXTURE_FOLDER + char);
      ctx.drawImage(texture, x, this.y, Math.max(CHAR_WIDTH, texture.width), CHAR_HEIGHT);
    }
  }
}
