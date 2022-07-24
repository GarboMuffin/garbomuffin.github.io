import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../../../config";
import { AbstractSprite } from "../../../engine/sprite";
import { IImageSpriteOptions, ImageSprite } from "../../../engine/sprites/imagesprite";
import { Nightlight } from "../../game";

export interface IBlockOptions extends IImageSpriteOptions {
  levelIndex?: number;
}

export class Block extends ImageSprite {
  public solid: boolean = false;
  public spawningOptions!: IBlockOptions;
  public levelIndex: number;
  public intersectingDeferred: boolean = false;
  public runtime!: Nightlight;

  constructor(opts: IBlockOptions) {
    super(opts);
    this.levelIndex = typeof opts.levelIndex !== "undefined" ? opts.levelIndex : -1;

    this.runtime.blocks.push(this);
    if (typeof opts.levelIndex !== "undefined") {
      this.runtime.ordereredBlocks[opts.levelIndex] = this;
    }

    if (this.needsReinstantiate) {
      this.spawningOptions = opts;
    }
  }

  // Ugly duplication but it works

  // Align the sprite to the floor and centered horizontally
  public floorAlign() {
    this.centerAlign(true, false);

    this.y += BLOCK_HEIGHT - this.height;
    this.y = Math.floor(this.y);
  }

  // Align the sprite to the left and centered vertically
  public leftAlign() {
    this.centerAlign(false, true);

    this.x += BLOCK_WIDTH - this.width;
    this.x = Math.floor(this.x);
  }

  // Center the sprite
  public centerAlign(centerX: boolean = true, centerY: boolean = true) {
    if (centerX) {
      this.x += (BLOCK_WIDTH - this.width) / 2;
      this.x = Math.floor(this.x);
    }

    if (centerY) {
      this.y += (BLOCK_HEIGHT - this.height) / 2;
      this.y = Math.floor(this.y);
    }
  }

  /**
   * Moves the sprite off of this block
   * Return values:
   * true or undefined - collision handled
   * false - collision was not handled, this is used by other blocks that replace this method
   */
  public handleIntersect(sprite: AbstractSprite, velocity: number, horizontal: boolean): boolean | void {
    if (horizontal) {
      if (velocity > 0) {
        sprite.x = this.x - sprite.width;
      } else if (velocity < 0) {
        sprite.x = this.x + this.width;
      }
    } else {
      if (velocity > 0) {
        sprite.y = this.y + this.height;
      } else if (velocity < 0) {
        sprite.y = this.y - sprite.height;
      }
    }

    return true;
  }

  public destroy() {
    super.destroy();
    this._removeFromList(this.runtime.blocks);
    if (this.levelIndex > -1) {
      this.runtime.ordereredBlocks[this.levelIndex] = undefined;
    }
  }

  get needsReinstantiate(): boolean {
    return false;
  }

  get type(): typeof Block {
    console.warn("unimplemented getType()?");
    return Block;
  }
}

// Block with solid = true by default
// Note that just because solid = true does not actually mean it is solid, just likely that it is solid
// Some blocks extend this then in handleIntersect have special behavior
export class SolidBlock extends Block {
  public solid: boolean = true;
}

// Block with solid = true and staic = true by default
// Setting static = true can greatly improve performance by not rendering things more than they need to be
export class StaticSolidBlock extends SolidBlock {
  public static: boolean = true;
}

// Block that is solid but doesn't handle intersecting
// Used for blocks that shouldn't be solid but needed for player.reset() to work
export class PseudoSolidBlock extends StaticSolidBlock {
  public handleIntersect() {
    return false;
  }
}
