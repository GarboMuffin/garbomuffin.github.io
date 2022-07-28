/// <reference path="game.d.ts" />
/**
 * Sprites!
 *
 * @class Sprite
 */
class Sprite {
    /**
     * Creates an instance of Sprite.
     * @param {SpriteOptions} options
     *
     * @memberOf Sprite
     */
    constructor(options) {
        this.options = options;
        this.texture = loadImage(options.texture);
        this.x = options.x;
        this.y = options.y;
        if (typeof options.width !== "undefined") {
            this.width = options.width;
        }
        else {
            this.width = this.texture.width;
        }
        if (typeof options.height !== "undefined") {
            this.height = options.height;
        }
        else {
            this.height = this.texture.height;
        }
        if (typeof options.solid !== "undefined") {
            this.solid = options.solid;
        }
        else {
            this.solid = true;
        }
        if (options.tick) {
            this.tick = options.tick;
            this.tickable = true;
            tickable.push(this);
        }
        else {
            this.tickable = false;
        }
        if (options.animation) {
            this.animated = true;
            this.animation = options.animation;
            this.frame = 0;
            this.animationFrame = 0;
            // if (typeof this.animation.adjustSize === "undefined"){
            //   this.animation.adjustSize = true;
            // }
            animated.push(this);
        }
        else {
            this.animated = false;
        }
        if (typeof options.visible !== "undefined") {
            this.visible = options.visible;
        }
        else {
            this.visible = true;
        }
        if (typeof options.render !== "undefined") {
            this.render = options.render;
        }
        if (typeof options.rotation !== "undefined") {
            this.rotation = options.rotation;
        }
        else {
            this.rotation = 0;
        }
        // some sprites need to create more sprites relative to it's position and set some variables relative to this sprite
        if (options.afterCreation) {
            options.afterCreation.call(this);
        }
        if (options.init) {
            options.init.call(this);
        }
        if (options.destroy) {
            this.afterDestroy = options.destroy;
        }
        // TODO: Better way to do this.
        // if (options.type) this.type = options.type;
        // if (options.type === "ice"){
        //   ice.add(this);
        // }else if (options.type === "switchToggled"){
        //   this.creationLevel = level;
        //   switchToggled.add(this);
        // }
        sprites.append(this);
    }
    animate() {
        // if the condition exists and returns false, return
        if (this.animation.condition && !this.animation.condition.call(this))
            return;
        this.frame++;
        if (this.frame % this.animation.length === 0) {
            ++this.animationFrame;
            if (this.animationFrame === this.animation.frames.length) {
                this.animationFrame = 0;
            }
            this.setTexture(this.animation.frames[this.animationFrame]);
            // TODO: Auto adjust sprite size
            // if (this.animation.adjustSize){
            //   this.width = this.texture.width;
            //   this.height = this.texture.height;
            // }
        }
    }
    /**
     * Render this sprite
     * Can be overridden
     *
     * @memberOf Sprite
     */
    render() {
        if (this.animated)
            this.animate();
        if (this.visible) {
            if (this.rotation) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.translate(this.width / 2, this.height / 2);
                ctx.rotate(this.rotation);
                ctx.drawImage(this.texture, -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();
            }
            else {
                ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
            }
        }
    }
    /**
     * Nuke this sprite from orbit
     *
     * @memberOf Sprite
     */
    destroy() {
        sprites.splice(sprites.indexOf(this), 1);
        if (this.animated) {
            animated.splice(animated.indexOf(this), 1);
        }
        if (this.tickable) {
            tickable.splice(tickable.indexOf(this), 1);
        }
        // FIXME
        for (let container of containers) {
            let index = container.indexOf(this);
            if (index > -1)
                container.splice(index, 1);
        }
        if (this.afterDestroy)
            this.afterDestroy.call(this);
    }
    get texture() {
        return this._texture;
    }
    set texture(texture) {
        this._texture = texture;
        // TODO: Automatically set width and height from new texture
    }
    setTexture(texture) {
        this.texture = loadImage(texture);
    }
    onEdge() {
        return this.x < 0 ||
            this.x > WIDTH ||
            this.y < 0 ||
            this.y > HEIGHT;
    }
    offScreen() {
        return this.x + this.width < 0 ||
            this.x > WIDTH ||
            this.y + this.height < 0 ||
            this.y > HEIGHT;
    }
    touchingGroup(group, xOffset, yOffset) {
        for (let sprite of group) {
            if (this.intersects(sprite, xOffset, yOffset))
                return true;
        }
        return false;
    }
    touchingPlayer(xOffset = 0, yOffset = 0) {
        return this.intersects(player, xOffset, yOffset);
    }
    touchingGround(xOffset = 0, yOffset = 0) {
        for (let block of sprites) {
            if (block.solid && this.intersects(block, xOffset, yOffset))
                return true;
        }
        return false;
    }
    getTouchingGround(xOffset = 0, yOffset = 0) {
        for (let block of sprites) {
            if (block.solid && this.intersects(block, xOffset, yOffset))
                return block;
        }
        return false;
    }
    intersects(sprite, xOffset = 0, yOffset = 0) {
        return this.x + xOffset < sprite.x + sprite.width &&
            this.x + this.width + xOffset > sprite.x &&
            this.y < sprite.y + sprite.height + yOffset &&
            this.y + this.height + yOffset > sprite.y;
    }
}
/**
 * It's like a sprite but it's not solid
 *
 * @class NonSolidSprite
 * @extends {Sprite}
 */
class NonSolidSprite extends Sprite {
    constructor(options) {
        super(options);
        this.solid = false;
    }
}
class Block extends Sprite {
    constructor(options) {
        super(options);
        this.width = BLOCK_WIDTH;
        this.height = BLOCK_HEIGHT;
        blocks.push(this);
    }
}
class NonSolidBlock extends Block {
    constructor(options) {
        super(options);
        this.solid = false;
    }
}
class Switch extends Block {
    constructor(options) {
        super(options);
        this.activated = false;
    }
}
class Player extends NonSolidSprite {
    constructor(options) {
        super(options);
        this.visible = false;
        this.downWasDown = false;
        this.height = PLAYER_HEIGHT;
        this.width = PLAYER_WIDTH;
        this.dir = DIR_RIGHT;
        this.yv = 0;
        this.xv = 0;
        this.run = 0;
        this.projectiles = 0;
        this.lastProjectile = 0;
        this.totalSwitches = 0;
        this.activatedSwitches = 0;
        this.allSwitchesActivated = false;
        this.frame = 0;
        this.killedGuards = 0;
        var totalSwitches = LEVELS[level].join("").match(/#/g);
        if (totalSwitches)
            this.totalSwitches = totalSwitches.length;
        var totalGuards = LEVELS[level].join("").match(/!/g);
        if (totalGuards)
            this.totalGuards = totalGuards.length;
    }
    reset() {
        this.y = HEIGHT - 1;
        this.x = 0;
        this.xv = 0;
        this.yv = 0;
        while (this.touchingGround()) {
            this.y--;
        }
    }
}
class PlayerGraphic extends NonSolidSprite {
    constructor(options) {
        super(options);
    }
}
class Projectile extends NonSolidSprite {
    constructor(options) {
        super(options);
        this.dir = options.dir;
        // tickable.add(this);
    }
}
class Fireball extends Projectile {
    constructor(options) {
        super(options);
        this.width = FIREBALL_WIDTH;
        this.height = FIREBALL_HEIGHT;
        this.yv = 0;
        fireballs.add(this);
    }
}
class Hammer extends Projectile {
    constructor(options) {
        super(options);
        this.width = HAMMER_WIDTH;
        this.height = HAMMER_HEIGHT;
        this.yv = HAMMER_VELOCITY;
        hammers.add(this);
    }
}
