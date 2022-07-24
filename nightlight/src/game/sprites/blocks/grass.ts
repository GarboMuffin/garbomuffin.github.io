import { BLOCK_HEIGHT } from "../../../config";
import { ZIndexes } from "../zindex";
import { Block, IBlockOptions } from "./block";

/*
 * It's a grass block.
 *
 * It is spawned on top of the regular blocks and moves itself down onto the block below.
 */

export class GrassBlock extends Block {
  public static: boolean = true;

  constructor(opts: IBlockOptions) {
    super(opts);

    this.z = ZIndexes.Grass;

    // Move ourselves down
    this.y += BLOCK_HEIGHT;
  }
}
