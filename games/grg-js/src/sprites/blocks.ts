/// SPECIAL BLOCKS

class Block extends RenderedSprite {
  public constructor(options: SpriteOptions) {
    super(options);
    blocks.push(this);
  }
}

class BoxTile extends Block {
  public frameUpdate() {
    var touching = <PlayerProjectile>this.touchingContainer(false, projectiles, PlayerProjectile);
    if (touching) {
      touching.destroy();
      this.state++;
      if (this.state > 3) {
        spawnParticle(BreakParticle, this);
        this.destroy();
      } else {
        this.texture = loadImage(`tiles/box/${this.state}.png`);
      }
    }
  }

  private state = 1;
}

class ArrowTile extends Block {
  public constructor(options: SpriteOptions) {
    // oh my god
    // how does this work
    super({
      ...options,
      width: 8,
      height: 8,
      solid: false,
      center: {
        x: options.x,
        y: options.y,
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
      }
    });
  }
}

class UpgradeTile extends Block {
  public frameUpdate() {
    if (this.touchingPlayer()) {
      maxSpeed *= 1.25;
      this.destroy();
    }
  }
}

class HiddenBrickTile extends Block {
  public frameUpdate() {
    if (remainingEnemies === 0) {
      this.solid = true;
      this.visible = true;
    }
  }
}

class ChestTile extends Block {

}
