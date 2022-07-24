import { IImageSpriteOptions, ImageSprite } from "../../engine/sprites/imagesprite";
import { IPointSpawnType, IRandomSpawnType, IRangeSpawnType, TSpawnType } from "../../level";
import { NightlightLevelEditor } from "../editor";
import { LevelEditorMode } from "../mode";
import { LevelEditorIndexes } from "./LevelEditorIndexes";

enum Mode {
  None,
  SelectingSpawnPoint,
}

export class PlayerSpawnSelectorSprite extends ImageSprite {
  public runtime!: NightlightLevelEditor;
  private mode: Mode = Mode.None;
  private ui = this.runtime.ui.playerSpawn;
  private alwaysShow: boolean = this.ui.alwaysShow.checked;

  constructor(options: IImageSpriteOptions) {
    super(options);
    this.z = LevelEditorIndexes.Selector;
    this.opacity = 0.5;
    this.ui.spawnSelect.addEventListener("change", () => this.selectionChanged());
    this.ui.alwaysShow.addEventListener("change", () => this.alwaysShow = this.ui.alwaysShow.checked);
    this.ui.point.select.addEventListener("click", () => this.mode = Mode.SelectingSpawnPoint);
    this.addTask(() => this.run());
  }

  private run() {
    this.visible = false;
    if (this.runtime.mode !== LevelEditorMode.PlayerSpawn) {
      return;
    }

    if (this.mode === Mode.SelectingSpawnPoint) {
      const align = this.ui.point.gridAlign.checked;
      this.visible = true;

      const mouseX = this.runtime.mouse.position.x;
      const mouseY = this.runtime.mouse.position.y;
      if (align) {
        const distanceFromButton = this.runtime.canvas.height - mouseY;
        this.x = Math.round(mouseX / 8) * 8;
        this.y = this.runtime.canvas.height - (Math.round(distanceFromButton / 8) * 8);
      } else {
        this.x = mouseX;
        this.y = mouseY;
      }
      this.x -= (this.width / 2);
      this.y -= (this.height / 2);

      if (this.runtime.mouse.isClick) {
        this.mode = Mode.None;
        this.ui.point.x.value = this.x.toString();
        this.ui.point.y.value = this.y.toString();
      }
    } else if (this.mode === Mode.None) {
      const type = this.ui.spawnSelect.value;
      if (type === "point") {
        this.visible = true;
        this.x = +this.ui.point.x.value;
        this.y = +this.ui.point.y.value;
      }
    }
  }

  private selectionChanged() {
    const type = this.ui.spawnSelect.value;
    this.ui.point.container.style.display = type === "point" ? "block" : "";
    this.ui.random.container.style.display = type === "random" ? "block" : "";
    this.ui.range.container.style.display = type === "range" ? "block" : "";
  }

  get selection(): TSpawnType | undefined {
    const type = this.ui.spawnSelect.value;
    if (type === "default") {
      return undefined;
    } else if (type === "random") {
      return {
        type: "random",
        minX: +this.ui.random.minX.value,
        maxX: +this.ui.random.maxX.value,
        minY: +this.ui.random.minY.value,
        maxY: +this.ui.random.maxY.value,
      };
    } else if (type === "range") {
      return {
        type: "range",
        minX: +this.ui.range.minX.value,
        maxX: +this.ui.range.maxX.value,
        requireSolid: this.ui.range.requireSolid.checked ? undefined : false,
      }
    } else if (type === "point") {
      return {
        type: "point",
        x: +this.ui.point.x.value,
        y: +this.ui.point.y.value,
      };
    } else {
      throw new Error(`${type} is not a valid spawn or whatever`);
    }
  }

  set selection(selection: TSpawnType | undefined) {
    if (typeof selection === "undefined") {
      // default type, nothing to do
      return;
    }
    const type = selection.type;
    this.ui.spawnSelect.value = type;
    if (type === "default") {
      // do nothing???
    } else if (type === "random") {
      const s = selection as IRandomSpawnType;
      this.ui.random.minX.value = s.minX.toString();
      this.ui.random.maxX.value = s.maxX.toString();
      this.ui.random.minY.value = s.minY.toString();
      this.ui.random.maxY.value = s.maxY.toString();
    } else if (type === "range") {
      const s = selection as IRangeSpawnType;
      this.ui.range.minX.value = s.minX.toString();
      this.ui.range.maxX.value = s.maxX.toString();
      this.ui.range.requireSolid.checked = typeof s.requireSolid === "undefined" || s.requireSolid ? true : false;
    } else if (type === "point") {
      const s = selection as IPointSpawnType;
      this.ui.point.x.value = s.x.toString();
      this.ui.point.y.value = s.y.toString();
    } else {
      throw new Error(`${type} is not a valid spawn or whatever`);
    }
    this.selectionChanged();
  }

  public render(ctx: CanvasRenderingContext2D) {
    if (this.runtime.mode !== LevelEditorMode.PlayerSpawn && !this.alwaysShow) {
      return;
    }

    const fillRect = (x: number, y: number, x2: number, y2: number) => {
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "aqua";
      ctx.fillRect(x, y, x2 - x, y2 - y);
      ctx.globalAlpha = 1;
    };

    const selection = this.selection;
    if (selection === undefined || selection.type === "default") {
      // do nothing
    } else if (selection.type === "point") {
      if (this.mode === Mode.SelectingSpawnPoint) {
        // do nothing
      } else {
        this.x = selection.x;
        this.y = selection.y;
      }
      super.render(ctx);
    } else if (selection.type === "random") {
      fillRect(selection.minX, selection.minY, selection.maxX, selection.maxY);
    } else if (selection.type === "range") {
      fillRect(selection.minX, 0, selection.maxX, ctx.canvas.height);
    }
  }
}
