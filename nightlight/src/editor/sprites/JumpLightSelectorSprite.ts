import { IImageSpriteOptions, ImageSprite } from "../../engine/sprites/imagesprite";
import { Vector } from "../../engine/vector";
import { Vector2D } from "../../engine/vector2d";
import { NightlightLevelEditor } from "../editor";
import { LevelEditorMode } from "../mode";
import { LevelEditorIndexes } from "./LevelEditorIndexes";

export class JumpLightSelectorSprite extends ImageSprite {
  public runtime!: NightlightLevelEditor;
  public outlinePoint: Vector2D | null = null;
  public snapToGrid: boolean = true;
  private moving: boolean = false;

  constructor(opts: IImageSpriteOptions) {
    super(opts);
    this.opacity = 0.5;
    this.z = LevelEditorIndexes.Selector;
    this.addTask(() => this.run());
    this.runtime.ui.jumpLights.snapToGrid.addEventListener("change", () => {
      this.snapToGrid = this.runtime.ui.jumpLights.snapToGrid.checked;
    });
    this.snapToGrid = this.runtime.ui.jumpLights.snapToGrid.checked;
  }

  private run() {
    if (this.runtime.mode !== LevelEditorMode.JumpLights) {
      this.visible = false;
      return;
    }
    const mouseX = this.runtime.mouse.position.x;
    const mouseY = this.runtime.mouse.position.y;
    if (this.snapToGrid) {
      const distanceFromBottom = this.runtime.canvas.height - mouseY;
      this.x = Math.round(mouseX / 8) * 8;
      this.y = this.runtime.canvas.height - (Math.round(distanceFromBottom / 8) * 8);
    } else {
      this.x = mouseX;
      this.y = mouseY;
    }
    this.x -= (this.width / 2);
    this.y -= (this.height / 2);

    const hovered = this.findHovered(mouseX, mouseY);

    if (hovered) {
      this.visible = false;
      this.outlinePoint = hovered;
      this.runtime.cursor = "pointer";
      if (this.runtime.mouse.isClick) {
        this.removePoint(hovered);
        this.moving = true;
      } else if (this.runtime.mouse.right.isClick) {
        this.removePoint(hovered);
        this.outlinePoint = null;
      }
    } else {
      this.visible = true;
      if (!this.moving) {
        this.outlinePoint = null;
      }
      if (this.runtime.mouse.isClick) {
        this.moving = false;
        this.addPoint(new Vector(this.x, this.y));
      }
    }
  }

  private findHovered(mx: number, my: number): Vector | null {
    const width = this.width;
    const height = this.height;
    for (const p of this.runtime.jumpLights) {
      const intersects =
        p.x < mx &&
        p.x + width > mx &&
        p.y < my &&
        p.y + height > my;
      if (intersects) {
        return p;
      }
    }
    return null;
  }

  public removePoint(p: Vector) {
    const index = this.runtime.jumpLights.indexOf(p);
    if (index === -1) {
      throw new Error("couldn't find point");
    }
    this.runtime.jumpLights.splice(index, 1);
    this.runtime.levelRenderer.updateLevel();
  }

  public addPoint(p: Vector) {
    this.runtime.jumpLights.push(p);
    this.runtime.levelRenderer.updateLevel();
  }

  public render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);

    if (this.outlinePoint) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeRect(this.outlinePoint.x, this.outlinePoint.y, this.width, this.height);
    }
  }
}
