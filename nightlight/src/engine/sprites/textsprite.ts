/*
 * A sprite that is text
 */

import { Color, NamedColor } from "../color";
import { AbstractSprite, ISpriteOptions } from "../sprite";
import { getOrDefault } from "../utils";

export interface ITextSpriteOptions extends ISpriteOptions {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  maxWidth?: number;
  color?: Color;
}

export class TextSprite extends AbstractSprite {
  public text: string;
  public fontSize: number;
  public fontFamily: string;
  public color: Color;

  constructor(options: ITextSpriteOptions) {
    super(options);

    this.text = getOrDefault(options.text, "");
    this.fontSize = getOrDefault(options.fontSize, 10);
    this.fontFamily = getOrDefault(options.fontFamily, "sans-serif");
    this.color = getOrDefault(options.color, new NamedColor("black"));
  }

  get font() {
    return `${this.fontSize}px ${this.fontFamily}`;
  }

  public render(ctx: CanvasRenderingContext2D) {
    if (!this.visible) {
      return;
    }

    ctx.save();

    this._setRenderValues(ctx);

    ctx.font = this.font;
    ctx.fillStyle = this.color.toString();
    ctx.fillText(this.text, this.x, this.y);

    ctx.restore();
  }
}
