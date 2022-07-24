import { AbstractSprite } from "../../../engine/sprite";
import { SolidBlock } from "./block";

/*
 * A block that allows things to go up but not down.
 */

export class OneWayBlock extends SolidBlock {
  public static: boolean = true;
  private intersectsPlayer: boolean = false;

  public handleIntersect(sprite: AbstractSprite, velocity: number, horizontal: boolean) {
    // Horizontally these have no collision
    if (horizontal) {
      return false;
    } else {
      const previousY = sprite.y + velocity;
      // If below then not solid
      // Otherwise use normal behavior when above
      if (previousY + sprite.height > this.y) {
        return false;
      } else {
        return super.handleIntersect(sprite, velocity, horizontal);
      }
    }
  }
}
