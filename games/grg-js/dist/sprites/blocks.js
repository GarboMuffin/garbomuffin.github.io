/// SPECIAL BLOCKS
class Block extends RenderedSprite {
    constructor(options) {
        super(options);
        blocks.push(this);
    }
}
class BoxTile extends Block {
    constructor() {
        super(...arguments);
        this.state = 1;
    }
    frameUpdate() {
        var touching = this.touchingContainer(false, projectiles, PlayerProjectile);
        if (touching) {
            touching.destroy();
            this.state++;
            if (this.state > 3) {
                spawnParticle(BreakParticle, this);
                this.destroy();
            }
            else {
                this.texture = loadImage(`tiles/box/${this.state}.png`);
            }
        }
    }
}
class ArrowTile extends Block {
    constructor(options) {
        // oh my god
        // how does this work
        super(Object.assign({}, options, { width: 8, height: 8, solid: false, center: {
                x: options.x,
                y: options.y,
                width: BLOCK_WIDTH,
                height: BLOCK_HEIGHT,
            } }));
    }
}
class UpgradeTile extends Block {
    frameUpdate() {
        if (this.touchingPlayer()) {
            maxSpeed *= 1.25;
            this.destroy();
        }
    }
}
class HiddenBrickTile extends Block {
    frameUpdate() {
        if (remainingEnemies === 0) {
            this.solid = true;
            this.visible = true;
        }
    }
}
class ChestTile extends Block {
}
