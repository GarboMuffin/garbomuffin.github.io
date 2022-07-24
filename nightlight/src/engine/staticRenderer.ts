import { AbstractSprite } from "./sprite";

export class StaticRendererSprite extends AbstractSprite {
  public render(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.runtime.staticCanvas, 0, 0);
  }
}
