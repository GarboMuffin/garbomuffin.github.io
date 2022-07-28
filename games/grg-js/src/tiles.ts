interface Tile {
  texture?: HTMLImageElement | string
  solid?: boolean
  visible?: boolean
  type?: any//...thing that extends Sprite
}

// normal blocks
const GRASS_TILE: Tile = { texture: "tiles/grass.png" }
const DIRT_TILE: Tile = { texture: "tiles/dirt.png" }

const UNKNOWN_TILE: Tile = { texture: "tiles/unknown.png" }

// non solid variants
const NONSOLID_DIRT_TILE: Tile = { ...DIRT_TILE, solid: false }
const ARROW_TILE: Tile = { texture: "tiles/arrow.png", type: ArrowTile }

// things that are interactable or whatever
const BOX_TILE: Tile = { texture: "tiles/box/1.png", type: BoxTile }
const UPGRADE_TILE: Tile = { texture: "tiles/upgrade.png", solid: false, type: UpgradeTile }
const HIDDEN_BRICK_TILE: Tile = { texture: "tiles/hidden_brick.png", solid: false, visible: false, type: HiddenBrickTile }
const CHEST_TILE: Tile = { texture: "", type: ChestTile }

// enemies
const LARGE_SMILEY: Tile = { texture: "enemy/face.png", type: LargeSmiley }
const POKERFACE: Tile = { texture: "enemy/face2.png", type: Pokerface }
const SHOOTING_FACE: Tile = { texture: "enemy/face3.png", type: ShootingFace }

// bosses
// god no why
const TROLL_FACE_BOSS: Tile = { texture: "boss/troll.png", type: TrollBoss };

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
}
