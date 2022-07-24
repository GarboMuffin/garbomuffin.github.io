import { PseudoSolidBlock } from "./block";

export class BlackBlock extends PseudoSolidBlock {
  public static: boolean = true;
  public render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
