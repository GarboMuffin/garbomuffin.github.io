import { IImageSpriteOptions, ImageSprite } from "../../engine/sprites/imagesprite";
import { TImage } from "../../engine/types";
import { Vector } from "../../engine/vector";
import { CHAR_HEIGHT, CHAR_MAP, CHAR_WIDTH, INightlightTextSpriteOptions } from "../../game/sprites/text/NightlightTextSprite";
import { NightlightLevelEditor } from "../editor";
import { LevelEditorMode } from "../mode";
import { LevelEditorIndexes } from "./LevelEditorIndexes";

export class TextSelectorSprite extends ImageSprite {
  public runtime!: NightlightLevelEditor;
  private snapToGrid: boolean = true;
  private outline: INightlightTextSpriteOptions | null = null;
  private moving: INightlightTextSpriteOptions | null = null;
  private initTexture: TImage;

  constructor(opts: IImageSpriteOptions) {
    super(opts);
    this.opacity = 0.5;
    this.z = LevelEditorIndexes.Selector;
    this.initTexture = this.texture;
    this.addTask(() => this.run());

    this.runtime.ui.text.snapToGrid.addEventListener("change", () => {
      this.snapToGrid = this.runtime.ui.text.snapToGrid.checked;
    });
    this.snapToGrid = this.runtime.ui.text.snapToGrid.checked;
  }

  private run() {
    if (this.runtime.mode !== LevelEditorMode.Text) {
      this.visible = false;
      return;
    }

    const mouseX = this.runtime.mouse.position.x;
    const mouseY = this.runtime.mouse.position.y;
    if (this.snapToGrid) {
      const distanceFromBottom = this.runtime.canvas.height - mouseY;
      const x = Math.floor(mouseX / 8) * 8;
      const y = Math.floor(mouseY / 8) * 8;
      this.x = x;
      this.y = y;
    } else {
      this.x = mouseX - (this.width / 2);
      this.y = mouseY - (this.height / 2);
    }

    const hovered = this.getHovered();

    if (hovered === null) {
      this.visible = true;
      if (this.moving) {
        if (this.runtime.mouse.isClick) {
          this.moving.position = new Vector(this.position);
          this.runtime.text.push(this.moving);
          this.runtime.levelRenderer.updateLevel();
          this.moving = null;
        }
      } else {
        this.outline = null;
        if (this.runtime.mouse.isClick) {
          const text = prompt("Type the text:")
          if (text === null) {
            return;
          }
          if (!this.isValidText(text)) {
            alert("Unsupported characters");
            return;
          }
          const textObj = {
            text,
            position: new Vector(this.position),
          };
          this.runtime.text.push(textObj);
          this.runtime.levelRenderer.updateLevel();
        }
      }
    } else {
      this.visible = false;
      this.outline = hovered;
      this.runtime.cursor = "pointer";
      if (this.runtime.mouse.isClick) {
        const text = prompt("Enter the new text:", hovered.text);
        if (text) {
          if (!this.isValidText(text)) {
            alert("Unsupported characters");
            return;
          }
          hovered.text = text;
          this.runtime.levelRenderer.updateLevel();
        }
      } else if (this.runtime.mouse.middle.isClick) {
        this.remove(hovered);
        this.moving = hovered;
      } else if (this.runtime.mouse.right.isClick) {
        this.remove(hovered);
      }
    }
  }

  private remove(obj: INightlightTextSpriteOptions) {
    const index = this.runtime.text.indexOf(obj);
    this.runtime.text.splice(index, 1);
    this.runtime.levelRenderer.updateLevel();
  }

  private isValidText(text: string) {
    for (const c of text) {
      try {
        const char = CHAR_MAP[c] || c;
        if (char === "skip") {
          continue;
        }
        this.runtime.getImage("text/" + char);
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  private getHovered(): INightlightTextSpriteOptions | null {
    for (const text of this.runtime.text) {
      const width = text.text.length * CHAR_WIDTH;
      const height = CHAR_HEIGHT;
      const obj = {
        x: text.position.x,
        y: text.position.y,
        width,
        height,
      };
      const intersects = this.x < obj.x + obj.width &&
        this.x + this.width > obj.x &&
        this.y < obj.y + obj.height &&
        this.y + this.height > obj.y;
      if (intersects) {
        return text;
      }
    }
    return null;
  }

  public render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);

    if (this.outline) {
      const width = this.outline.text.length * CHAR_WIDTH;
      const height = CHAR_HEIGHT;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeRect(this.outline.position.x, this.outline.position.y, width, height);
    }
    
    if (this.moving) {
      this.runtime.levelRenderer.drawText(ctx, this.moving.text, this.position);
    }
  }
}
