import { AbstractSprite } from "../../../engine/sprite";
import { PlayerSprite } from "../player/player";
import { IBlockOptions, SolidBlock } from "./block";

/*
 * It's a spike. It kills the player.
 */

// Spikes share pretty much all of their code
// So an abstract class is made and extended
abstract class SpikeBlock extends SolidBlock {
  public static = true;
  public intersectingDeferred = true;

  public handleIntersect(sprite: AbstractSprite, velocity: number, horizontal: boolean) {
    super.handleIntersect(sprite, velocity, horizontal);

    if (this.canKill(sprite) && sprite instanceof PlayerSprite) {
      sprite.kill();
      return false;
    }
    return true;
  }

  protected abstract canKill(sprite: AbstractSprite): boolean;
}

export class UpSpikeBlock extends SpikeBlock {
  constructor(opts: IBlockOptions) {
    super(opts);

    this.floorAlign();
  }

  protected canKill(sprite: AbstractSprite) {
    return sprite.y + sprite.height === this.y;
  }
}

export class DownSpikeBlock extends SpikeBlock {
  // Already aligned due to spawning

  protected canKill(sprite: AbstractSprite) {
    return sprite.y === this.y + this.height;
  }
}

export class LeftSpikeBlock extends SpikeBlock {
  constructor(opts: IBlockOptions) {
    super(opts);

    this.leftAlign();
  }

  protected canKill(sprite: AbstractSprite) {
    return sprite.x + sprite.width === this.x;
  }
}

export class RightSpikeBlock extends SpikeBlock {
  // Already aligned due to spawning

  protected canKill(sprite: AbstractSprite) {
    return sprite.x === this.x + this.width;
  }
}
