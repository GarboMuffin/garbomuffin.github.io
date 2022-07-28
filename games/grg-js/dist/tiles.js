// normal blocks
const GRASS_TILE = { texture: "tiles/grass.png" };
const DIRT_TILE = { texture: "tiles/dirt.png" };
const UNKNOWN_TILE = { texture: "tiles/unknown.png" };
// non solid variants
const NONSOLID_DIRT_TILE = Object.assign({}, DIRT_TILE, { solid: false });
const ARROW_TILE = { texture: "tiles/arrow.png", type: ArrowTile };
// things that are interactable or whatever
const BOX_TILE = { texture: "tiles/box/1.png", type: BoxTile };
const UPGRADE_TILE = { texture: "tiles/upgrade.png", solid: false, type: UpgradeTile };
const HIDDEN_BRICK_TILE = { texture: "tiles/hidden_brick.png", solid: false, visible: false, type: HiddenBrickTile };
const CHEST_TILE = { texture: "", type: ChestTile };
// enemies
const LARGE_SMILEY = { texture: "enemy/face.png", type: LargeSmiley };
const POKERFACE = { texture: "enemy/face2.png", type: Pokerface };
const SHOOTING_FACE = { texture: "enemy/face3.png", type: ShootingFace };
// bosses
// god no why
const TROLL_FACE_BOSS = { texture: "boss/troll.png", type: TrollBoss };
const TILES = {
    a: GRASS_TILE,
    b: DIRT_TILE,
    c: NONSOLID_DIRT_TILE,
    d: BOX_TILE,
    e: LARGE_SMILEY,
    g: UPGRADE_TILE,
    f: POKERFACE,
    i: HIDDEN_BRICK_TILE,
    j: SHOOTING_FACE,
    k: UNKNOWN_TILE,
    h: ARROW_TILE,
};
