import { blockMap } from "../../blockmap";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../../config";
import { IImageSpriteOptions, ImageSprite } from "../../engine/sprites/imagesprite";
import { BLOCK_MAP_KEYS } from "../blockmapkeys";
import { NightlightLevelEditor } from "../editor";
import { LevelEditorMode } from "../mode";
import { LevelEditorIndexes } from "./LevelEditorIndexes";

export class BlockSelectorSprite extends ImageSprite {
  private selection: string = "c";
  private selectionIndex: number = 4; // 4 is block type "c"
  public runtime!: NightlightLevelEditor;

  constructor(options: IImageSpriteOptions) {
    super(options);
    this.z = LevelEditorIndexes.Selector;
    this.addTask(() => this.run());
    this.width = BLOCK_WIDTH;
    this.height = BLOCK_HEIGHT;
    this.texture = this.runtime.getImage(blockMap[this.selection].texture);
    this.updateSelection();

    document.addEventListener("keydown", (e) => {
      if (blockMap[e.key] && e.target === document.body) {
        this.setSelection(e.key);
      }
    });
  }

  private updateSelection() {
    this.selection = BLOCK_MAP_KEYS[this.selectionIndex];
    const blockDetails = blockMap[this.selection];
    const texture = this.runtime.getImage(blockDetails.texture);
    this.texture = texture;
    this.runtime.ui.blocks.activeBlockImage.src = texture.src;
    this.runtime.ui.blocks.activeBlockImage.height = this.texture.height * 6;
    this.runtime.ui.blocks.activeBlockImage.width = this.texture.width * 6;
    this.runtime.ui.blocks.activeBlockDescription.textContent = blockDetails.type.name + ", " + this.selection;
    this.updateDimensions();
  }

  private setBlock(x: number, y: number, char: string) {
    const row = this.runtime.levelData[y];
    if (!row) {
      return;
    }
    const existingChar = row[x];
    if (!existingChar) {
      return;
    }
    row[x] = char;
    this.runtime.levelRenderer.updateLevel();
  }

  private run() {
    if (this.runtime.mode !== LevelEditorMode.Blocks) {
      this.visible = false;
      return;
    }
    this.visible = true;

    // get hovered block
    const mouseX = this.runtime.mouse.position.x;
    const mouseY = this.runtime.mouse.position.y - this.runtime.blockOffsetY;
    const blockX = Math.floor(mouseX / BLOCK_WIDTH);
    const blockY = Math.ceil(mouseY / BLOCK_HEIGHT);
    this.x = blockX * BLOCK_WIDTH;
    this.y = blockY * BLOCK_HEIGHT - this.runtime.blockOffsetY;

    // drawing
    if (this.runtime.mouse.left.isDown) {
      this.opacity = 1;
      this.setBlock(blockX, blockY, this.selection);
    } else if (this.runtime.mouse.right.isDown) {
      this.opacity = 0;
      this.setBlock(blockX, blockY, ".");
    } else {
      this.opacity = 0.5;
    }
  }

  public setSelection(char: string) {
    const index = BLOCK_MAP_KEYS.indexOf(char);
    if (index === -1) {
      throw new Error(char + " is not in BLOCK_MAP_KEYS");
    }
    this.selection = char;
    this.selectionIndex = index;
    this.updateSelection();
  }
}
