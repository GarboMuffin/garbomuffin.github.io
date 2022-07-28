/// <reference path="game.d.ts" />

/// GAME FUNCTIONS

/**
 * A few things I want to say:
 * The comment below this and above the start() function is only there so that this comment does not become the "documentation" associated with it
 * Most of the function names and arguments in here should be completely self documenting
 * I realize this is probably a pile of speghetti
 */

/**
 * Start the game!
 */
function start(): void {
  console.log("Start");
  progress.parentNode.parentNode.removeChild(progress.parentNode); // ;-;
  loaded = true;
  renderLevel();
  requestAnimationFrame(loop);
}

/**
 * The internal game loop that keeps everything running, handles exceptions, and displays the FPS counter.
 * 
 */
function loop(): void {
  try {
    ++totalFrames;
    var now = Date.now();
    if (totalFrames % 60 === 0) {
      totalFrames = 0;
      document.getElementById("fps").innerHTML = "" + 60 / (now - last60) * 1000;
      last60 = now;
    }
    var diff = (now - last) / 1000;

    state(0);
    render();

    last = now;
    requestAnimationFrame(loop);
  } catch (e) {
    console.error(e);
    document.getElementById("outputHolder").style.cssText += ";display:block !important;"; // because .hidden has a display: none !important and this needs to override that
    document.getElementById("output").innerText = `The game crashed with the following error message: "${e.toString()}"`;
  }
}

/**
 * Really all this does is "tick" every sprite that can be "ticked".
 * This includes things like the player, projectiles, and iteractives blocks.
 * 
 * @param {number} [diff] 
 */
function play(diff?: number): void {
  for (let sprite of tickable) {
    sprite.tick.call(sprite, diff);
  }
}

/**
 * Clear the canvas and then throw all of our sprites on top of it in the order they appear in the sprites container
 * 
 */
function render(): void {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(gradientCanvas, 0, 0);
  for (let sprite of sprites) {
    sprite.render.call(sprite);
  }
}

/**
 * Delete sprites and recreate containers
 * This does not create the sprites again!
 * @see {@link createSprites} creates the sprites this deletes
 * 
 */
function reset(): void {
  // delete all containers and their containing sprites
  for (let container of containers) {
    container.destroy();
  }
  // containers, sprites occur later
  sprites = new Container();
  animated = new Container();
  tickable = new Container();
  fireballs = new Container();
  hammers = new Container();
  ice = new Container();
  blocks = new Container();
  switchToggled = new Container();
  // clear the interval
  clearInterval(iceInterval);
  iceInterval = null;
}

/**
 * Actually create the sprites reset() deletes
 * @see {@link reset} deletes the sprites this creates
 */
function createSprites(): void {
  // this has to run after the levels are created so that they appear above the blocks
  player = new Player({
    texture: "blank.png",
    x: 0,
    y: HEIGHT - 1,
    tick: playerUpdate
  });
  player.reset();
  graphic = new PlayerGraphic({
    texture: "player/still.png",
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
    solid: false,
    render: showPlayer,
  });
  suitGraphic = new Sprite({
    texture: "player/suits/fire/still.png",
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
    solid: false,
    visible: false,
    render: showSuit,
  });
}

/**
 * Renders and sets up variables for a level
 * 
 */
function renderLevel(): void {
  var rendering = LEVELS[level];
  reset();
  var levelHeight = rendering.length;
  for (let y = 0; y < levelHeight; y++) {
    var xStrip = rendering[y];
    var xLength = xStrip.length;
    var lastChar = " ";
    for (let x = 0; x < xLength; x++) {
      var char = xStrip.charAt(x);
      if (char === " ") {
        // space is air, so do nothing
        continue;
      }
      // . fills the rest of the row with the previous texture
      if (char === ".") {
        char = lastChar;
        xStrip += ".";
        if (xLength < LEVEL_LENGTH) xLength += 1;
      } else {
        lastChar = char;
      }
      var meta = TILES[char.toUpperCase()];
      var texture = meta.texture;
      var xPos = x * BLOCK_WIDTH;
      var yPos = HEIGHT - (y + 1) * BLOCK_HEIGHT;
      spawnBlock(xPos, yPos, meta);
    }
  }
  createSprites();
}

function spawnBlock(x: number, y: number, meta: SpriteOptions | Tile, constructor = Sprite): Sprite | Block {
  // really stupid workarounds that somehow work
  meta["x"] = x;
  meta["y"] = y;
  var sprite = new Block(meta);
  return sprite;
}

/// SPRITE TICKS + THEIR FUNCTIONS

function playerUpdate(diff?: number) {
  this.frame++;
  this.updated = false;

  // up
  if (keys[38] || keys[32] || keys[87] || keys[90]) {
    if (this.touchingGround()) {
      if (currentSuit === WIND_SUIT) {
        this.yv = CLOUD_JUMP;
      } else {
        this.yv = JUMP;
      }
    }
  } else {
    if (this.yv > 3) {
      this.yv = 1;
    }
  }

  // right
  if (keys[39] || keys[68]) {
    if (this.xv < RUN_SPEED) {
      this.xv += RUN_SPEED;
    }
    this.dir = DIR_RIGHT;
    if (this.frame % RUNNING_ANIMATION_LENGTH === 0) {
      this.run++;
      this.updated = true;
    }
  }
  if (keys[37] || keys[65]) { // left
    if (this.xv > -RUN_SPEED) {
      this.xv -= RUN_SPEED;
    }
    this.dir = DIR_LEFT;
    if (this.frame % RUNNING_ANIMATION_LENGTH === 0) {
      this.run++;
      this.updated = true;
    }
  }
  if (!(keys[39] || keys[68] || keys[37] || keys[65])) {
    this.run = 0;
  }

  if (this.run > RUNNING_FRAMES.length) {
    this.run = 1;
  }

  // down/suit change
  // waiting for it to not be pressed
  if (this.downWasDown && !(keys[40] || keys[83])) {
    this.downWasDown = false;
  }
  if (currentSuit > 0 && !this.downWasDown && (keys[40] || keys[83])) {
    currentSuit++;
    if (currentSuit > unlockedSuits) {
      currentSuit = 1;
    }
    this.downWasDown = true;
  }

  // x/projectile
  if (currentSuit > 0 && keys[88]) {
    if (Date.now() - this.lastProjectile > PROJECTILE_DELAY && PROJECTILE_SUITS.indexOf(currentSuit) > -1 && this.projectiles < MAX_PROJECTILES) {
      this.projectiles++;
      if (currentSuit === FIRE_SUIT) {
        new Fireball({
          x: this.x,
          y: this.y,
          texture: "projectiles/fireball.png",
          tick: fireball,
          dir: this.dir,
        });
      } else if (currentSuit === HAMMER_SUIT) {
        new Hammer({
          x: this.x,
          y: this.y,
          texture: "projectiles/hammer.png",
          tick: hammer,
          dir: this.dir,
        });
      } else {
        console.warn("Invalid suit?");
      }
      this.lastProjectile = Date.now();
    };
  }

  // x physics
  this.xv *= FRICTION;
  this.x += this.xv;
  var block = this.getTouchingGround(0, -1);
  if (block) {
    let increment = this.xv > 0 ? -1 : 1;
    while (this.intersects(block, 0, -1)) {
      this.x += increment;
    }
    this.xv = 0;
  }

  // y physics
  this.yv -= GRAVITY;
  this.y -= this.yv;
  block = this.getTouchingGround(0, -1);
  if (block) {
    let increment = this.yv > 0 ? -1 : 1;
    while (this.intersects(block, 0, -1)) {
      this.y -= increment;
    }
    if (this.yv > 0) {
      this.yv = -1;
      // many hours were spent debugging for this one line.
      this.y -= increment;
    } else {
      this.yv = 0;
    }
  }

  if (this.x < 0) {
    this.x = 0;
  }

  if (this.y > HEIGHT) {
    this.reset();
  }

  if (this.x > WIDTH) {
    level++;
    renderLevel();
  }

  // switches!
  if (this.totalSwitches > 0 && !this.allSwitchesActivated && this.activatedSwitches === this.totalSwitches) {
    this.allSwitchesActivated = true;
    if (level === 7) {
      var sprite = new NonSolidBlock({
        y: 0,
        x: HAMMER_SUIT_X,
        texture: loadImage("tiles/suits/hammer.png"),
        tick: hammerSuit,
      });
    } else {
      console.warn(`Switch behavior for this level is undefined! (current level=${level})`);
    }
  }
}

function showPlayer(): void {
  this.x = Math.round(player.x);
  this.y = Math.floor(player.y);
  var texture;
  if (player.touchingGround(0, 0)) {
    if (player.run > 0) {
      texture = "player/run" + player.run + ".png";
    } else {
      texture = "player/still.png";
    }
  } else {
    texture = "player/jump.png";
  }
  this.costume = texture;
  texture = loadImage(texture);
  ctx.save();
  ctx.translate(this.x + (PLAYER_WIDTH / 2), this.y + (PLAYER_HEIGHT / 2));
  ctx.scale(player.dir, 1);
  ctx.drawImage(texture, -PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, texture.width / 2, texture.height / 2);
  ctx.restore();
}

function showSuit(): void {
  this.x = graphic.x;
  this.y = graphic.y;
  var suitName = SUIT_NAMES[currentSuit];
  var costume = graphic.costume.split("/")[1];
  if (suitName === "default") return;

  var texture = "player/suits/" + suitName + "/" + costume;
  var loadedTexture = loadImage(texture);
  this.texture = loadedTexture;
  ctx.save();
  ctx.translate(this.x + (PLAYER_WIDTH / 2), this.y + (PLAYER_HEIGHT / 2));
  ctx.scale(player.dir, 1);
  ctx.drawImage(this.texture, -PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, this.texture.width / 2, this.texture.height / 2);
  ctx.restore();
}

function coinTick(): void {
  if (this.touchingPlayer()) {
    this.destroy();
    playSound("click");
  }
}

function suitTick(suit): void {
  if (this.touchingPlayer()) {
    this.destroy();
    currentSuit = suit;
    unlockedSuits = currentSuit;
  }
}

function fireball(): boolean | void {
  this.yv -= FIREBALL_GRAVITY;
  this.y -= this.yv;
  this.x += this.dir * FIREBALL_SPEED;

  if (this.onEdge()) {
    player.projectiles--;
    this.destroy();
    return false;
  }

  if (this.touchingGround()) {
    this.yv = FIREBALL_VELOCITY;
  }

  this.rotation += FIREBALL_ROTATION;
}

function hammer(): boolean | void {
  this.yv -= GRAVITY;
  this.rotation += HAMMER_ROTATION;
  this.y -= this.yv;
  this.x += this.dir * HAMMER_SPEED;

  if (this.offScreen()) {
    player.projectiles--;
    this.destroy();
    return false;
  }
}

function afterFireballCreation(): void {
  fireballs.add(this);
}

function afterHammerCreation(): void {
  hammers.add(this);
}

function iceTick(): void {
  if (this.touchingGroup(fireballs)) {
    if (!iceInterval) {
      clearIce();
      iceInterval = setInterval(clearIce, ICE_DELAY);
    }
  }
}

function createSwitch(): void {
  var meta = ON_SWITCH_TILE;
  meta["x"] = this.x;
  meta["y"] = this.y - BLOCK_HEIGHT;
  var sprite = new Switch(meta);
  sprite.parent = this;
  sprite.activated = false;
}

function switchTick(): void {
  if (!this.activated && this.touchingPlayer()) {
    this.setTexture("tiles/switch/on.png");
    this.parent.setTexture("tiles/switch/switch.png");
    setTimeout(deleteSprite.bind(this), SWITCH_TIMEOUT);
    this.activated = true;
    player.activatedSwitches++;
  }
}

/**
 * Usage: deleteSprite.bind(this)
 * (only because creating functions in loops is a bad idea or something)
 */
function deleteSprite(): void {
  if (typeof this.creationLevel !== "undefined" && this.creationLevel !== level) {
    // level changed since it was set to delete, so abandon
    return;
  }
  this.destroy();
}

function clearIce(): void {
  var top: number = HEIGHT;
  var highest: Block[] = [];
  for (let block of ice) {
    if (block.y < top) {
      top = block.y;
      highest = [block];
    } else if (block.y === top) {
      highest.push(block);
    }
  }

  if (highest.length > 0) {
    playSound("ice");
    for (let block of highest) {
      block.destroy();
    }
  } else {
    clearInterval(iceInterval);
    iceInterval = null;
  }
}

function hammerSuit(): void {
  if (!this.ground && !this.touchingGround()) {
    this.y++;
  } else if (!this.ground) {
    this.ground = true;
    this.y--;
  }
  suitTick.call(this, 3);
}

function hammerSwitch(): void {
  if (!this.activated && (this.touchingPlayer() || this.touchingGroup(hammers))) {
    this.setTexture("tiles/hswitch/Bd.png");
    setTimeout(deleteSprite.bind(this), HAMMER_SWITCH_TIMEOUT);
    this.activated = true; // disable animation
    // there's only ever 1 hammer switch in a level so activate the thing now
    if (level === 7 || level === 8) {
      switchToggled.destroy();
    } else {
      console.warn(`No hswitch behavior is defined for this level! (current level=${level})`)
    }
  }
}

function spike(): void {
  if (this.touchingPlayer(0, -1)) {
    player.reset();
  }
}

function slidingDoor(): void {
  if (player.killedGuards === player.totalGuards) {
    // if all guards are dead, move up
    this.y -= DOOR_MOVE_SPEED;
    // and if hidden behind blocks, delete
    if (!this.touchingGround(0, BLOCK_HEIGHT)) {
      this.destroy();
    }
  }
}

function guard(): void {
  if (this.touchingPlayer()) player.reset();
  if (level === 10 && this.touchingGroup(fireballs)) {
    this.destroy();
  }
}

/// INIT FUNCTIONS

function iceInit(): void {
  ice.add(this);
}

function switchInit(): void {
  this.creationLevel = level;
}

function switchToggledInit(): void {
  switchToggled.add(this);
}

/// DESTROY FUNCTIONS

function guardDestroy(): void {
  player.killedGuards++;
}
