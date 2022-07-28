const ASSET_LIST: string[] = [
  "tiles/grass.png",
  "tiles/dirt.png",
  "tiles/unknown.png",
  "tiles/box/1.png",
  "tiles/box/2.png",
  "tiles/box/3.png",
  "tiles/arrow.png",
  "tiles/upgrade.png",
  "tiles/hidden_brick.png",
  "health/bar.png",
  "health/empty.png",
  "player/stun.png",
  "player/still.png",
  "player/move.png",
  "bullet/bullet.png",
  "particle/break.png",
  "particle/boss.png",
  "particle/boss2.png",
  "particle/grahm.png",
  "particle/airhorn.png",
  "enemy/face.png",
  "enemy/face2.png",
  "enemy/face3.png",
  "enemy/faceproj.png",
  "enemy/face3proj.png",
  "boss/troll.png",
];
const ASSETS = {};
var loadedAssets = 0;
var totalAssets = ASSET_LIST.length;
var loaded = false;

for (let asset of ASSET_LIST) {
  loadImage(asset);
}

function loadImage(file: string | HTMLImageElement): HTMLImageElement {
  if (file instanceof HTMLImageElement) {
    return file;
  }
  if (file.indexOf("assets/") === -1) {
    file = "assets/" + file;
  }
  if (file.indexOf(".png") === -1) {
    file += ".png";
  }

  if (file in ASSETS) {
    return ASSETS[file];
  }

  // console.log("Downloading: " + file);
  var asset;
  asset = new Image();
  asset.onload = function (): void {
    loadedAssets++;
    // console.log("Loaded: " + asset.src);
  }
  asset.src = file;
  ASSETS[file] = asset;
  return asset;
}
