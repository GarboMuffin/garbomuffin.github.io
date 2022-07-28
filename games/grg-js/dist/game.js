function loop() {
    // frame++;
    // stats.begin();
    if (state === null)
        return; // crash handling
    state();
    render();
    // stats.end();
    requestAnimationFrame(loop);
}
function render() {
    // sprites.sort()
    ctx.fillStyle = gradient;
    ctx.drawImage(gradientCanvas, 0, 0);
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    for (let sprite of sprites) {
        sprite.render();
    }
}
function reset() {
    // use a really weird thing to delete sprites for reasons.
    frame = 0;
    var length = sprites.length;
    var index = 0;
    for (let i = 0; i < length; i++) {
        var sprite = sprites.get(index);
        if (!sprite.persistent)
            sprite.destroy();
        else
            index++;
    }
    remainingEnemies = 0;
    bosses();
    renderLevel();
    sprites.sort();
    player.reset();
}
function bosses() {
    if (level === 9) {
        new TrollBoss({
            texture: loadImage("boss/troll.png"),
            width: 32,
            height: 32,
            center: {
                x: 416,
                y: 172,
            }
        });
    }
}
/**
 * Sorts sprites by putting those with a higher zIndex towards the end.
 * (they will render on top)
 */
function spriteSort(a, b) {
    return a.zIndex - b.zIndex;
}
function createHealthBar() {
    var id = 0;
    var y = 65;
    while (id < MAX_HEALTH) {
        id++;
        new HealthTick({
            texture: loadImage("health/bar.png"),
            id: id,
            y: y
        });
        y -= 2;
    }
}
function playerDamage() {
    new HitStun();
}
function nextLevel() {
    level++;
    reset();
}
function renderLevel() {
    var levelData = LEVELS[level];
    var x = 0;
    var y = HEIGHT - BLOCK_HEIGHT;
    for (let char of levelData) {
        if (char !== ".") {
            var meta = TILES[char];
            if (!meta)
                console.warn(`UNRECOGNIZED CHARACTER: ${char}`);
            spawnTile(meta, meta.texture, x, y);
        }
        x += BLOCK_WIDTH;
        if (x >= WIDTH) {
            x = 0;
            y -= BLOCK_HEIGHT;
        }
    }
    var texts = TEXTS[level];
    if (texts !== undefined) {
        for (let text of texts) {
            new TextSprite(text);
        }
    }
}
function spawnTile(meta, texture, x, y) {
    var options = Object.assign({}, meta, { texture: loadImage(texture), x: x, y: y, width: BLOCK_WIDTH, height: BLOCK_HEIGHT });
    var sprite;
    if (meta.type) {
        sprite = new options.type(options);
    }
    else {
        sprite = new Block(options);
    }
    return sprite;
}
/**
 * @param {Particle} particle The particle object itself, not an instance of it!
 */
function spawnParticle(particle, center) {
    var texture = loadImage(`particle/${particle.type}.png`);
    var count = particle.count;
    var angle = particle.angleIncrement;
    for (let i = 1; i <= count; i++) {
        new particle({
            center: center,
            texture: texture,
            rotation: angle * i,
        });
    }
}
function start() {
    reset();
    state = play;
    // create sprites
    createHealthBar();
    // define some variables that can't be defined earlier because reasons
    Enemy.particle = BreakParticle;
    // time to start
    loop();
}
function play() {
    for (let sprite of updatable) {
        sprite.frameUpdate();
    }
}
function isNumber(number) {
    return typeof number === "number" && isFinite(number);
}
function playerProjectiles() {
    var p = 0;
    for (let sprite of projectiles) {
        if (sprite instanceof PlayerProjectile)
            p++;
    }
    return p;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
