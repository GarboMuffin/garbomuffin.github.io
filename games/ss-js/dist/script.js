/// <reference path="game.d.ts" />
// get the canvas ready
var canvas = document.getElementById("canvas");
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
var keys = [];
var state = play;
var last = 0;
var level = 0; // zero indexed!
var totalFrames = 0;
var last60 = Date.now(); // for the fps counter
var loaded = false;
var iceInterval = null;
var volume = 0.5;
// sprites
var player;
var graphic;
var suitGraphic;
// containers
var containers = [];
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
var loadInterval = setInterval(function () {
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
document.addEventListener("keydown", function (e) {
    var code = e.keyCode;
    keys[code] = true;
    if (BLOCKED_INPUTS.indexOf(code) > -1) {
        e.preventDefault();
    }
});
document.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});
