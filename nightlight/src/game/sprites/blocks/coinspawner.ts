import { BLOCK_HEIGHT } from "../../../config";
import { Vector } from "../../../engine/vector";
import { LevelUpCoinSprite } from "../coin";
import { IBlockOptions, SolidBlock } from "./block";

/*
 * Spawns the level up coin
 * The level up coin itself is not part of the level code,
 * only the spawner.
 *
 * Different types becasue that's how the level codes are. (and I really don't want to touch those)
 */

abstract class LevelUpCoinSpawnerBlock extends SolidBlock {
  public static: boolean = true;

  constructor(opts: IBlockOptions) {
    super(opts);

    const position = this.getCoinPosition();
    new LevelUpCoinSprite({
      position,
      texture: this.runtime.getImage("coin/1"),
    });
  }

  protected abstract getCoinPosition(): Vector;
}

// Spawns the coin above the block
export class AboveLevelUpCoinSpawnerBlock extends LevelUpCoinSpawnerBlock {
  protected getCoinPosition() {
    return new Vector(this.x, this.y - BLOCK_HEIGHT);
  }
}

// Spawns the coin below the block
export class BelowLevelUpCoinSpawnerBlock extends LevelUpCoinSpawnerBlock {
  protected getCoinPosition() {
    return new Vector(this.x, this.y + BLOCK_HEIGHT);
  }
}
