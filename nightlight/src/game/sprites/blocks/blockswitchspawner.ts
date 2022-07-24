import { BLOCK_HEIGHT } from "../../../config";
import { Vector } from "../../../engine/vector";
import { BlockSwitch } from "../blockswitch";
import { IBlockOptions, SolidBlock } from "./block";
import { FallingBlockGroups } from "./falling";

// Block that spawns a switch
export abstract class BlockSwitchSpawnerBlock extends SolidBlock {
  constructor(opts: IBlockOptions, group: number, textureFolder: string) {
    super(opts);

    const position = new Vector(this.position);
    position.y -= BLOCK_HEIGHT;
    new BlockSwitch({
      texture: this.runtime.getImage("blocks/button/redgreen/button"),
      position,
      spawner: this,
      group,
      textureFolder,
    });
  }
}

export class RedGreenBlockSwitchSpawner extends BlockSwitchSpawnerBlock {
  constructor(opts: IBlockOptions) {
    super(opts, FallingBlockGroups.RedGreen, "redgreen");
  }
}

export class AquaOrangeBlockSwitchSpawner extends BlockSwitchSpawnerBlock {
  constructor(opts: IBlockOptions) {
    super(opts, FallingBlockGroups.AquaOrange, "aquaorange");
  }
}
