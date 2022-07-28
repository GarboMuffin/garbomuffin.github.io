/// <reference path="game.d.ts" />

// get the canvas ready
var canvas = <HTMLCanvasElement>document.getElementById("canvas");
var platformCanvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.height = HEIGHT;
canvas.width = WIDTH;

var gradientCanvas = document.createElement("canvas");
var gradientCtx = gradientCanvas.getContext("2d");
gradientCanvas.width = canvas.width;
gradientCanvas.height = canvas.height;

var platformCanvas = document.createElement("canvas");
var platformCtx = platformCanvas.getContext("2d");
platformCanvas.width = canvas.width;
platformCanvas.height = canvas.height;

var gradient = ctx.createLinearGradient(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
gradient.addColorStop(0, "#00CCCC");
gradient.addColorStop(1, "#006666");
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// setup variables
var keys: boolean[] = [];
var state: (diff?: number) => void = play;
var last = 0;
var level = 0; // zero indexed!
var totalFrames = 0;
var last60 = Date.now(); // for the fps counter
var loaded = false;
var iceInterval: number = null;
var volume = 0.5;
// sprites
var player: Player;
var graphic: PlayerGraphic;
var suitGraphic: Sprite;
// containers
var containers: Container[] = [];
var sprites = new Container();
var animated = new Container();
var tickable = new Container();
var fireballs = new Container();
var hammers = new Container();
var ice = new Container();
var blocks = new Container();
var switchToggled = new Container();
// because it deletes and recreates the player sprite it can't store this stuff in there
var currentSuit = 0;
var unlockedSuits = 0;

var loadInterval = setInterval(function (): void {
  if (totalAssets === loadedAssets &&
    typeof LEVELS !== "undefined" &&
    typeof TILES !== "undefined" &&
    typeof Sprite !== "undefined" &&
    typeof Container !== "undefined" &&
    typeof start !== "undefined") {
    clearInterval(loadInterval);
    start();
  }
}, 1);

// key detection
document.addEventListener("keydown", function (e: KeyboardEvent): void {
  var code = e.keyCode;
  keys[code] = true;
  if (BLOCKED_INPUTS.indexOf(code) > -1) { // disable arrow and space scrolling
    e.preventDefault();
  }
});
document.addEventListener("keyup", function (e: KeyboardEvent): void {
  keys[e.keyCode] = false;
});
