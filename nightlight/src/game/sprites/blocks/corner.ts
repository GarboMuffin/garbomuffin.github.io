import { BLOCK_HEIGHT, BLOCK_WIDTH, LEVEL_WIDTH } from "../../../config";
import { ImageSprite } from "../../../engine/sprites/imagesprite";
import { TImage } from "../../../engine/types";
import { Vector } from "../../../engine/vector";
import { Nightlight } from "../../game";
import { Block, IBlockOptions, SolidBlock } from "./block";

/*
 * A block that is in the corner
 */

const AIR = [
  ".", // air, literally
  "l", "k", "j", // grass on dirt
  "p", "q", // tall grass
  "%", "#", "$", "o", // spikes
];

abstract class CornerBlock extends Block {
  public runtime!: Nightlight;

  constructor(opts: IBlockOptions) {
    super(opts);

    this.levelIndex = opts.levelIndex || 0;

    // queue deletion after other stuff runs
    this.destroy();
  }

  /**
   * If the block that is X distance from this one is air,
   * then create a new sprite with the texture, rotation, x offset, and y offset as provided
   */
  protected testCorner(offset: number, texture: TImage, rotation: number, x: number, y: number) {
    const charAtOffset = this.runtime.levelData[this.levelIndex + offset];
    const isAir = AIR.indexOf(charAtOffset) > -1;

    if (isAir) {
      const position = new Vector(
        this.x + x * (BLOCK_WIDTH / 2),
        this.y + y * (BLOCK_HEIGHT / 2),
      );
      // these should be static, but that seems to cause problems that i don't want to debug
      const sprite = new ImageSprite({
        position,
        texture,
        rotation,
        static: true,
      });
    }
  }
}

// A normal corner block that spawns rotations of itself
// Used in all zones but castle
export class RotatedCornerBlock extends CornerBlock {
  constructor(opts: IBlockOptions) {
    super(opts);

    // black background
    new Block({
      texture: this.runtime.getImage("blocks/a"),
      position: new Vector(this.x, this.y, -1), // any corners placed on this should go on top
      static: true,
    });

    const offset = this.width === BLOCK_WIDTH ? 0 : 1;

    // if spawned on far left edge then don't check for things that will wrap around to other side of screen
    if (this.levelIndex % LEVEL_WIDTH !== 0) {
      this.testCorner(LEVEL_WIDTH - 1, this.texture, -90, 0, 0);
      this.testCorner(-LEVEL_WIDTH - 1, this.texture, 180, 0, offset);
    }
    // if spawned on far right edge then don't check for things that will wrap around to other side of screen
    // untested but should work
    if (this.levelIndex % LEVEL_WIDTH !== LEVEL_WIDTH - 1) {
      this.testCorner(LEVEL_WIDTH + 1, this.texture, 0, offset, 0);
      this.testCorner(-LEVEL_WIDTH + 1, this.texture, 90, offset, offset);
    }
  }
}

// The corner blocks in the castle are special
// I believe this block actually only shows up like once in the whole game
export class CastleCornerBlock extends CornerBlock {
  constructor(opts: IBlockOptions) {
    super(opts);

    if (this.levelIndex % LEVEL_WIDTH !== 0) {
      this.testCorner(LEVEL_WIDTH - 1, this.runtime.getImage("blocks/castlecorner/topleft"), 0, 0, 0);
      this.testCorner(-LEVEL_WIDTH - 1, this.runtime.getImage("blocks/castlecorner/bottomleft"), 0, 0, 0);
    }
    if (this.levelIndex % LEVEL_WIDTH !== LEVEL_WIDTH - 1) {
      this.testCorner(LEVEL_WIDTH + 1, this.runtime.getImage("blocks/castlecorner/topright"), 0, 0, 0);
      this.testCorner(-LEVEL_WIDTH + 1, this.runtime.getImage("blocks/castlecorner/bottomright"), 0, 0, 0);
    }
  }
}

// I fix an OOB glitch in ONE level in the game!
// So useful!
export class SolidRotatedCornerBlock extends RotatedCornerBlock {
  constructor(options: IBlockOptions) {
    super(options);

    const position = new Vector(this.position);
    position.z = this.z - 1;
    new SolidBlock({
      texture: this.runtime.getImage("blocks/c"),
      position,
      static: true,
      levelIndex: this.levelIndex,
    });
  }
}
