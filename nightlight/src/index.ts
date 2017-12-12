import { Nightlight } from "./game";
import { Task } from "./engine/task";

// TODO: type definitions
window._SRC_PREFIX = window._SRC_PREFIX || "";

const game = new Nightlight();

// add in all of our assets
game.addAsset("player/idle");
game.addAsset("player/up");
game.addAsset("player/down");
game.addAsset("player/walk1");
game.addAsset("player/walk2");
game.addAsset("player/walk3");
game.addAsset("player/walk4");

game.addAsset("fragments/1");
game.addAsset("fragments/2");
game.addAsset("fragments/3");
game.addAsset("fragments/4");
game.addAsset("fragments/5");

game.addAsset("coin/1");
game.addAsset("coin/2");
game.addAsset("coin/3");
game.addAsset("coin/4");

game.addAsset("blocks/a");
game.addAsset("blocks/b");
game.addAsset("blocks/c");
game.addAsset("blocks/d");
game.addAsset("blocks/e");
game.addAsset("blocks/f");
game.addAsset("blocks/g");
game.addAsset("blocks/h");
game.addAsset("blocks/i");
game.addAsset("blocks/j");
game.addAsset("blocks/k");
game.addAsset("blocks/l");
game.addAsset("blocks/m");
game.addAsset("blocks/n");
game.addAsset("blocks/o");
game.addAsset("blocks/p");
game.addAsset("blocks/q");
game.addAsset("blocks/r");
// game.addAsset("blocks/t");
game.addAsset("blocks/s");
game.addAsset("blocks/u");
game.addAsset("blocks/u2");
game.addAsset("blocks/v");
game.addAsset("blocks/w");
// game.addAsset("blocks/x");
// game.addAsset("blocks/y");
// game.addAsset("blocks/z");

game.addAsset("blocks/crumble/1");
game.addAsset("blocks/crumble/2");
game.addAsset("blocks/crumble/3");
game.addAsset("blocks/crumble/4");
game.addAsset("blocks/crumble/5");
game.addAsset("blocks/crumble/6");
game.addAsset("blocks/crumble/7");
game.addAsset("blocks/crumble/8");
game.addAsset("blocks/crumble/9");

game.addAsset("blocks/button/red");
game.addAsset("blocks/button/on");

// wait for it to load then run our stuff
game.waitForAssets().then(run);

function run() {
  game.start();
}
