import { AbstractSprite, ISpriteOptions } from "../sprite";
import { TImage } from "../types";
import { getOrDefault } from "../utils";

/*
 * A sprite that has an image as a texture.
 */

export interface IImageSpriteOptions extends ISpriteOptions {
  texture: TImage;
  rotation?: number;
  opacity?: number;
}

export class ImageSprite extends AbstractSprite {
  public texture: TImage;
  public rotation: number;
  public opacity: number;

  constructor(options: IImageSpriteOptions) {
    super(options);

    this.texture = options.texture;
    this.width = getOrDefault(options.width, this.texture.width) as number;
    this.height = getOrDefault(options.height, this.texture.height) as number;
    this.rotation = getOrDefault(options.rotation, 0) as number;
    this.opacity = getOrDefault(options.opacity, 1) as number;
  }

  public render(ctx: CanvasRenderingContext2D) {
    if (!this.visible) {
      return;
    }

    ctx.save();

    this._setRenderValues(ctx);

    const x = this.x;
    const y = this.y;

    ctx.drawImage(this.texture, x, y, this.width, this.height);
    ctx.restore();
  }

  public updateDimensions() {
    this.width = this.texture.width;
    this.height = this.texture.height;
  }
}
