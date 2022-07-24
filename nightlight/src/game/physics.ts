import { BLOCK_HEIGHT, BLOCK_WIDTH, FRICTION, GRAVITY, LEVEL_WIDTH } from "../config";
import { AbstractSprite } from "../engine/sprite";
import { getOrDefault } from "../engine/utils";
import { Nightlight } from "./game";
import { Block } from "./sprites/blocks/block";
import { UpSpikeBlock } from "./sprites/blocks/spike";

interface IVelocity {
  xv: number;
  yv: number;
}

export function runPhysics(sprite: AbstractSprite & IVelocity, opts: IPhysicsOptions = {}): boolean {
  opts.collision = getOrDefault(opts.collision, true);
  opts.restrictPositionValues = getOrDefault(opts.restrictPositionValues, true);
  opts.friction = getOrDefault(opts.friction, FRICTION);
  opts.midAirFriction = getOrDefault(opts.midAirFriction, true);
  opts.roundValues = getOrDefault(opts.roundValues, true);

  sprite.x += sprite.xv;
  if (opts.collision && handleCollision(sprite, true)) {
    sprite.xv = 0;
  }
  if (opts.restrictPositionValues) {
    if (sprite.x < 0) {
      sprite.x = 0;
      sprite.xv = 0;
    } else if (sprite.x + sprite.width > sprite.runtime.canvas.width) {
      sprite.x = sprite.runtime.canvas.width - sprite.width;
      sprite.xv = 0;
    }
  }

  let onGround = false;

  sprite.yv -= GRAVITY;
  sprite.y -= sprite.yv;
  if (opts.collision && handleCollision(sprite, false)) {
    if (sprite.yv < 0) {
      onGround = true;
    }
    sprite.yv = 0;
  }

  if (opts.friction !== false) {
    if (onGround || opts.midAirFriction) {
      sprite.xv *= (opts.friction as number);
    }
  }

  if (opts.roundValues) {
    sprite.x = Math.round(sprite.x);
    sprite.y = Math.round(sprite.y);
  }

  return onGround;
}

function handleCollision(sprite: AbstractSprite & IVelocity, horizontal: boolean) {
  const center = sprite.centerPosition;
  const blocksFromLeft = Math.floor(center.x / BLOCK_WIDTH);
  const blocksFromBottom = Math.floor((sprite.runtime.canvas.height - center.y) / BLOCK_HEIGHT);
  const centerLevelIndex = blocksFromBottom * LEVEL_WIDTH + blocksFromLeft;

  const ordereredBlocks = (sprite.runtime as Nightlight).ordereredBlocks;
  const blocks = [
    // For each block a 3x3 grid is shown, centered around the player
    // O represents the block this selects

    /*
    X X X
    X X X
    O X X
    */
    ordereredBlocks[centerLevelIndex - LEVEL_WIDTH - 1],
    /*
    X X X
    X X X
    X O X
    */
    ordereredBlocks[centerLevelIndex - LEVEL_WIDTH],
    /*
    X X X
    X X X
    X X O
    */
    ordereredBlocks[centerLevelIndex - LEVEL_WIDTH + 1],

    /*
    X X X
    X X O
    X X X
    */
    ordereredBlocks[centerLevelIndex + 1],
    /*
    X X X
    X O X
    X X X
    */
    ordereredBlocks[centerLevelIndex],
    /*
    X X X
    O X X
    X X X
    */
    ordereredBlocks[centerLevelIndex - 1],

    /*
    X O X
    X X X
    X X X
    */
    ordereredBlocks[centerLevelIndex + LEVEL_WIDTH],
    /*
    X X O
    X X X
    X X X
    */
    ordereredBlocks[centerLevelIndex + LEVEL_WIDTH + 1],
    /*
    O X X
    X X X
    X X X
    */
    ordereredBlocks[centerLevelIndex + LEVEL_WIDTH - 1],
  ];

  const intersecting: Block[] = [];

  // Create a list of blocks that intersect the sprite
  for (const block of blocks) {
    if (!block) {
      continue;
    }
    if (block.solid && block.visible && block.intersects(sprite)) {
      intersecting.push(block);
    }
  }

  // Sort the sprites so that those that are "intersectingDeferred" come last
  intersecting.sort((a, b) => {
    if (a.intersectingDeferred && !b.intersectingDeferred) {
      return 1;
    }
    if (b.intersectingDeferred && !a.intersectingDeferred) {
      return -1;
    }
    return 0;
  });

  // Loop through all the sorted blocks in order and attempt collision with them.
  for (const block of intersecting) {
    if (block.handleIntersect(sprite, horizontal ? sprite.xv : sprite.yv, horizontal) !== false) {
      return true;
    }
  }

  return false;
}

interface IPhysicsOptions {
  // do collision checking?
  collision?: boolean;

  // restrict x values into 0 <= x <= CANVAS_WIDTH?
  restrictPositionValues?: boolean;

  // false: don't apply friction
  // number: will be used as friction value instead of FRICTION in /config.ts
  friction?: false | number;

  // apply friction when in midair?
  midAirFriction?: boolean;

  // round coordinates?
  roundValues?: boolean;
}
