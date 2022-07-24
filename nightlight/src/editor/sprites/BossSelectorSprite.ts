import { BLOCK_HEIGHT } from "../../config";
import { IImageSpriteOptions, ImageSprite } from "../../engine/sprites/imagesprite";
import { ISwordOptions } from "../../game/sprites/bosses/sword/sword";
import { TBossType } from "../../level";
import { NightlightLevelEditor } from "../editor";
import { LevelEditorMode } from "../mode";
import { LevelEditorIndexes } from "./LevelEditorIndexes";

export class BossSelectorSprite extends ImageSprite {
  private ui = this.runtime.ui.boss;
  private type: string = "";
  private shouldBeVisible: boolean = false;
  private sword = {
    blocksFromTop: 0, // ignored
    health: 0, // ignored
  };
  private noss1 = {

  };
  private noss2 = {

  };
  public runtime!: NightlightLevelEditor;

  constructor(options: IImageSpriteOptions) {
    super(options);
    this.z = LevelEditorIndexes.Selector;
    this.addTask(() => this.run());
    this.opacity = 0.5;
    this.type = this.ui.selection.value;

    this.sword.blocksFromTop = +this.ui.sword.blocksFromTop.value;
    this.sword.health = +this.ui.sword.health.value;

    this.ui.selection.addEventListener("change", () => this.updateSelection());
    this.ui.sword.blocksFromTop.addEventListener("change", () => this.updateSelection());
    this.ui.sword.health.addEventListener("change", () => this.updateSelection());
  }

  private updateSelection() {
    const type = this.ui.selection.value;
    this.type = type;
    if (type === "") {
      this.visible = false;
      return;
    }

    this.ui.sword.container.style.display = type === "sword" ? "block" : "";
    this.ui.noss1.container.style.display = type === "noss1" ? "block" : "";
    this.ui.noss2.container.style.display = type === "noss2" ? "block" : "";

    if (type === "sword") {
      this.shouldBeVisible = true;
      this.texture = this.runtime.getImage("boss/sword/sword");
      this.updateDimensions();
      this.x = this.runtime.canvas.width / 2 - this.width / 2;
      const blocksFromTop = +this.ui.sword.blocksFromTop.value;
      this.y = blocksFromTop * BLOCK_HEIGHT;
      this.sword.blocksFromTop = blocksFromTop;
      this.sword.health = +this.ui.sword.health.value;
    } else if (type === "noss1") {
      this.shouldBeVisible = true;
      this.texture = this.runtime.getImage("boss/noss/noss");
      this.updateDimensions();
    } else if (type === "noss2") {
      this.shouldBeVisible = true;
      this.texture = this.runtime.getImage("boss/noss/noss");
      this.updateDimensions();
    } else {
      throw new Error(`${type} is not a valid boss type`);
    }
  }

  private run() {
    if (this.runtime.mode !== LevelEditorMode.Boss) {
      this.visible = false;
      return;
    }
    this.visible = this.shouldBeVisible;
  }

  get selection(): TBossType | undefined {
    const type = this.ui.selection.value;
    if (type === "") {
      return undefined;
    } else if (type === "sword") {
      return {
        type,
        blocksFromTop: this.sword.blocksFromTop,
        health: this.sword.health,
      }
    } else if (type === "noss1") {
      return {
        type,
      }
    } else if (type === "noss2") {
      return {
        type,
      }
    } else {
      throw new Error(`${type} is not a valid boss type`);
    }
  }

  set selection(selection: TBossType | undefined) {
    if (typeof selection === "undefined") {
      this.ui.selection.value = "";
      return;
    }

    const type = selection.type;
    this.ui.selection.value = type;
    if (type === "sword") {
      const s = selection as ISwordOptions;
      this.ui.sword.blocksFromTop.value = (s.blocksFromTop || 14).toString();
      this.ui.sword.health.value = (s.health || 3).toString();
    } else if (type === "noss1") {
      
    } else if (type === "noss2") {
      
    } else {
      throw new Error(`${type} is not a valid boss type`);
    }
    this.updateSelection();
  }
}
