/// <reference path="game.d.ts" />
const ASSET_LIST = [
    "blank.png",
    "tiles/cloud.png",
    "tiles/DarkStone.png",
    "tiles/dirt.png",
    "tiles/grass.png",
    "tiles/ice.png",
    "tiles/stone.png",
    "tiles/switch.png",
    "tiles/switch/off.png",
    "tiles/switch/on.png",
    "tiles/switch/switch.png",
    "tiles/hblock/BB1.png",
    "tiles/hblock/BB2.png",
    "tiles/hblock/BB3.png",
    "tiles/hblock/BB4.png",
    "tiles/hblock/BB5.png",
    "tiles/hblock/BB6.png",
    "tiles/hblock/BB7.png",
    "tiles/hblock/BB8.png",
    "tiles/hblock/BB9.png",
    "tiles/hblock/block.png",
    "tiles/spikes/up.png",
    "tiles/spikes/down.png",
    "tiles/hswitch/B.png",
    "tiles/hswitch/Bd.png",
    "tiles/hswitch/Bs.png",
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
    "tiles/suits/fire.png",
    "tiles/suits/hammer.png",
    "tiles/suits/wind.png",
    "projectiles/fireball.png",
    "projectiles/hammer.png",
    "player/jump.png",
    "player/run1.png",
    "player/run2.png",
    "player/run3.png",
    "player/run4.png",
    "player/still.png",
    "player/suits/air/jump.png",
    "player/suits/air/run1.png",
    "player/suits/air/run2.png",
    "player/suits/air/run3.png",
    "player/suits/air/run4.png",
    "player/suits/air/still.png",
    "player/suits/fire/jump.png",
    "player/suits/fire/run1.png",
    "player/suits/fire/run2.png",
    "player/suits/fire/run3.png",
    "player/suits/fire/run4.png",
    "player/suits/fire/still.png",
    "player/suits/hammer/jump.png",
    "player/suits/hammer/run1.png",
    "player/suits/hammer/run2.png",
    "player/suits/hammer/run3.png",
    "player/suits/hammer/run4.png",
    "player/suits/hammer/still.png",
    "tiles/gold.png",
    "tiles/iron.png",
    "tiles/carpet.png",
    "guard/still.png",
    "guard/stilldie.png",
    "guard/run1.png",
    "guard/run2.png",
    "guard/run3.png",
    "guard/run4.png",
    "tiles/ironWhite.png",
    "tiles/carpetWhite.png",
];
var totalAssets = ASSET_LIST.length;
var loadedAssets = 0;
var loaded = false;
var progress = document.getElementById("progress");
const ASSETS = {};
for (let asset of ASSET_LIST) {
    loadImage(asset);
}
function loadImage(file) {
    if (file instanceof HTMLImageElement) {
        return file;
    }
    if (file.indexOf("assets/") === -1) {
        file = "assets/" + file;
    }
    if (file in ASSETS) {
        return ASSETS[file];
    }
    console.log("Downloading: " + file);
    var asset;
    if (file.indexOf(".png") > -1) {
        asset = new Image();
        asset.onload = function () {
            loadedAssets++;
            if (!loaded)
                progress.value = loadedAssets / totalAssets;
            console.log("Loaded: " + asset.src);
        };
    }
    else if (file.indexOf(".png")) {
        asset = new Audio();
        asset.oncanplay = function () {
            loadedAssets++;
            if (!loaded)
                progress.value = loadedAssets / totalAssets;
            console.log("Loaded: " + asset.src);
            asset.oncanplay = null;
        };
    }
    asset.src = file;
    ASSETS[file] = asset;
    return asset;
}
function playSound(sound) {
    console.warn(`Failed to play sound '${sound}': Sounds are disabled`);
    return document.createElement("audio");
}
// /**
//  * Play a sound
//  * @param {string} sound
//  */
// function playSound(sound){
//   if (!sound.startsWith("audio/")){
//     sound = "audio/" + sound;
//   }
//   if (!sound.endsWith(".ogg")){
//     sound = sound + ".ogg";
//   }
//   console.log("Playing sound: " + sound);
//   var audio = load(sound);
//   if (audio.ended || audio.currentTime === 0){
//     audio.play();
//   }else{
//     audio.currentTime = 0;
//   }
//   audio.volume = volume;
//   audio.play();
//   return audio;
// }
