/// <reference path="game.d.ts" />

const GRASS_TILE: Tile = { texture: "tiles/grass.png" };
const DIRT_TILE: Tile = { texture: "tiles/dirt.png" };
const CLOUD_TILE: Tile = { texture: "tiles/cloud.png" };
const STONE_TILE: Tile = { texture: "tiles/stone.png" };
const DARK_STONE_TILE: Tile = { texture: "tiles/DarkStone.png" };
const GOLD_TILE: Tile = { texture: "tiles/gold.png" };
const IRON_TILE: Tile = { texture: "tiles/iron.png" };
const GOLD_CARPET_TILE: Tile = { texture: "tiles/carpet.png" };
const WHITE_IRON: Tile = { texture: "tiles/ironWhite.png" };
const WHITE_CARPET: Tile = { texture: "tiles/carpetWhite.png" };

const ICE_TILE: Tile = {
  texture: "tiles/ice.png",
  tick: iceTick,
  init: iceInit,
};
const COIN_TILE: Tile = {
  texture: "tiles/coin/1.png",
  animation: {
    length: 5,
    frames: [
      "tiles/coin/1.png",
      "tiles/coin/2.png",
      "tiles/coin/3.png",
      "tiles/coin/4.png",
      "tiles/coin/5.png",
      "tiles/coin/6.png",
      "tiles/coin/7.png",
      "tiles/coin/8.png",
      "tiles/coin/9.png",
      "tiles/coin/10.png",
      "tiles/coin/11.png",
    ],
  },
  solid: false,
  tick: coinTick,
};
const FIRE_SUIT_TILE: Tile = {
  texture: "tiles/suits/fire.png",
  solid: false,
  tick: function () {
    return suitTick.call(this, FIRE_SUIT);
  }
};
const CLOUD_SUIT_TILE: Tile = {
  texture: "tiles/suits/wind.png",
  solid: false,
  tick: function () {
    return suitTick.call(this, WIND_SUIT);
  },
};
const HAMMER_SUIT_TILE: Tile = {
  texture: "tiles/suits/wind.png",
  solid: false,
  tick: function () {
    return suitTick.call(this, HAMMER_SUIT);
  },
};
const SWITCH_DISPLAY_TILE: Tile = {
  texture: "tiles/switch.png",
  afterCreation: createSwitch,
};
const HAMMER_BLOCK_TILE: Tile = {
  texture: "tiles/hblock/block.png",
  init: switchToggledInit,
};
const HAMMER_SWITCH_TILE: Tile = {
  texture: "tiles/hswitch/B.png",
  tick: hammerSwitch,
  animation: {
    frames: [
      "tiles/hswitch/B.png",
      "tiles/hswitch/Bs.png",
    ],
    length: 10,
    condition: function () {
      return !this.activated;
    }
  },
};
const ON_SWITCH_TILE: Tile = {
  texture: "tiles/switch/off.png",
  tick: switchTick,
  solid: false
};
const UP_SPIKE_TILE: Tile = {
  texture: "tiles/spikes/up.png",
  solid: false,
  tick: spike
};
const DOWN_SPIKE_TILE: Tile = {
  texture: "tiles/spikes/down.png",
  solid: false,
  tick: spike
};
const GUARD: Tile = {
  texture: "guard/still.png",
  tick: guard,
  destroy: guardDestroy,
};
const SLIDING_IRON_DOOR: Tile = {
  texture: "tiles/iron.png",
  tick: slidingDoor,
};

const TILES = {
  "A": GRASS_TILE,
  "B": DIRT_TILE,
  "C": CLOUD_TILE,
  "S": STONE_TILE,
  "I": ICE_TILE,
  "R": GOLD_CARPET_TILE,
  "G": GOLD_TILE,
  "O": IRON_TILE,
  "P": DARK_STONE_TILE,
  "Z": WHITE_IRON,
  "Y": WHITE_CARPET,
  "@": COIN_TILE,
  "1": FIRE_SUIT_TILE,
  "2": CLOUD_SUIT_TILE,
  "3": HAMMER_SUIT_TILE,
  "#": SWITCH_DISPLAY_TILE,
  "$": HAMMER_BLOCK_TILE,
  "*": HAMMER_SWITCH_TILE,
  "+": ON_SWITCH_TILE,
  "^": UP_SPIKE_TILE,
  "V": DOWN_SPIKE_TILE,
  "!": GUARD,
  "|": SLIDING_IRON_DOOR,
};
