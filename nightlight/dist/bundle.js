/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__engine_sprites_imagesprite__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(3);


class Block extends __WEBPACK_IMPORTED_MODULE_0__engine_sprites_imagesprite__["a" /* ImageSprite */] {
    constructor(opts) {
        super(opts);
        this.solid = false;
        this.runtime.blocks.push(this);
    }
    groundedCenterAlign() {
        this.x -= (__WEBPACK_IMPORTED_MODULE_1__config__["c" /* BLOCK_WIDTH */] - this.width) / 2;
        this.x = Math.floor(this.x);
        this.y += __WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCK_HEIGHT */] - this.height;
        this.y = Math.floor(this.y);
    }
    centerAlign() {
        this.x += (__WEBPACK_IMPORTED_MODULE_1__config__["c" /* BLOCK_WIDTH */] - this.width) / 2;
        this.x = Math.floor(this.x);
        this.y += (__WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCK_HEIGHT */] - this.height) / 2;
        this.y = Math.floor(this.y);
    }
    handleIntersect(sprite, horizontal) {
        if (horizontal) {
            if (sprite.x > this.x) {
                sprite.x = this.x + this.width;
            }
            else {
                sprite.x = this.x - sprite.width;
            }
        }
        else {
            if (sprite.y < this.y) {
                sprite.y = this.y - sprite.height;
            }
            else {
                sprite.y = this.y + this.height;
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Block;

class SolidBlock extends Block {
    constructor() {
        super(...arguments);
        this.solid = true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = SolidBlock;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector2d__ = __webpack_require__(10);

// a simple position class that removes some verbosity from code
// can make for some nicer code sometimes
class Vector extends __WEBPACK_IMPORTED_MODULE_0__vector2d__["a" /* Vector2D */] {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y);
        if (typeof x === "object") {
            this.z = x.z;
        }
        else {
            this.z = z;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Vector;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(5);
// Tasks and TaskRunners

// a task is something to be run at a certain time, maybe repeating
class Task {
    constructor(options) {
        const runnable = options.run;
        const delay = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* getOrDefault */])(options.delay, 0);
        const repeatEvery = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* getOrDefault */])(options.repeatEvery, -1);
        this.originalOptions = options;
        this.runnable = runnable;
        this.delay = delay;
        this.repeatEvery = repeatEvery;
    }
    run() {
        // pass this task to the function so that it can call things like task.stop();
        this.runnable(this);
    }
    stop() {
        this.delay = -1;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Task;

// the things that runs tasks
// adds everything tasks use
// most methods prefixed with _ to avoid as many collisions as possible
// almost EVERYTHING extends this (and as such can have tasks on it)
class TaskRunner {
    constructor() {
        this._tasks = [];
    }
    runTasks() {
        for (const task of this._tasks) {
            if (task.delay <= 0) {
                task.run();
                if (task.delay === -1) {
                    // called task.stop();
                }
                else if (task.repeatEvery >= 0) {
                    task.delay = task.repeatEvery;
                }
                else {
                    task.delay = -1;
                }
            }
            else {
                task.delay--;
            }
        }
        this._tasks = this._tasks.filter((task) => task.delay !== -1);
    }
    resetTasks() {
        this._tasks = [];
    }
    // add a task
    // can either be a task or a function
    // if it is a task it is added as you would expect
    // if it is a function it will repeat every frame
    addTask(task) {
        if (typeof task === "function") {
            this.addTask(new Task({
                run: task,
                repeatEvery: 0,
            }));
        }
        else {
            task.runnable = task.runnable.bind(this);
            this._tasks.push(task);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = TaskRunner;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const BLOCK_HEIGHT = 16;
/* harmony export (immutable) */ __webpack_exports__["a"] = BLOCK_HEIGHT;

const BLOCK_WIDTH = 16;
/* harmony export (immutable) */ __webpack_exports__["c"] = BLOCK_WIDTH;

const BLOCK_SIZE_SCALE = 2;
/* harmony export (immutable) */ __webpack_exports__["b"] = BLOCK_SIZE_SCALE;

const LEVEL_HEIGHT = 23;
/* unused harmony export LEVEL_HEIGHT */

const LEVEL_WIDTH = 30;
/* harmony export (immutable) */ __webpack_exports__["f"] = LEVEL_WIDTH;

const GRAVITY = 0.19;
/* harmony export (immutable) */ __webpack_exports__["e"] = GRAVITY;

const FRICTION = 0.75;
/* harmony export (immutable) */ __webpack_exports__["d"] = FRICTION;
 // xv *= FRICTION


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sprite__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(5);


// NIGHTLIGHT: images are imported from scratch which has things at 2x actual res
const TEXTURE_SCALE = 2;
/* harmony export (immutable) */ __webpack_exports__["b"] = TEXTURE_SCALE;

class ImageSprite extends __WEBPACK_IMPORTED_MODULE_0__sprite__["a" /* AbstractSprite */] {
    constructor(options) {
        super(options);
        this.texture = options.texture;
        this.width = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* getOrDefault */])(options.width, this.texture.width / TEXTURE_SCALE);
        this.height = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* getOrDefault */])(options.height, this.texture.height / TEXTURE_SCALE);
        this.rotation = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* getOrDefault */])(options.rotation, 0);
        this.opacity = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* getOrDefault */])(options.opacity, 1);
    }
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        if (this.rotation !== 0) {
            // terrible code
            // rotation is difficult
            // https://stackoverflow.com/a/4650102
            const translateX = this.x + this.width / 2;
            const translateY = this.y + this.height / 2;
            ctx.translate(translateX, translateY);
            ctx.rotate(Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* degreeToRadians */])(this.rotation));
            ctx.translate(-translateX, -translateY);
        }
        if (this.scale.x !== 1 || this.scale.y !== 1) {
            const translateX = this.x + this.width / 2;
            const translateY = this.y + this.height / 2;
            ctx.translate(translateX, translateY);
            ctx.scale(this.scale.x, this.scale.y);
            ctx.translate(-translateX, -translateY);
        }
        ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ImageSprite;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = isMobile;
/* harmony export (immutable) */ __webpack_exports__["b"] = getOrDefault;
/* harmony export (immutable) */ __webpack_exports__["d"] = toHex;
/* unused harmony export radiansToDegree */
/* harmony export (immutable) */ __webpack_exports__["a"] = degreeToRadians;
// https://stackoverflow.com/a/3540295
// tests if the device is probably a mobile phone
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
// if obj is defined, return obj
// else return def
// used as less verbose option defaulting without neglecting falsy values (|| does that)
function getOrDefault(obj, def) {
    if (typeof obj === "undefined") {
        return def;
    }
    else {
        return obj;
    }
}
// https://stackoverflow.com/a/697841
function toHex(number) {
    return number.toString(16).toUpperCase();
}
function radiansToDegree(rad) {
    return rad * 180 / Math.PI;
}
function degreeToRadians(deg) {
    return deg * Math.PI / 180;
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector2d__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__task__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__(3);




class AbstractSprite extends __WEBPACK_IMPORTED_MODULE_1__task__["b" /* TaskRunner */] {
    constructor(options) {
        super();
        this.runtime = AbstractSprite.runtime;
        this.position = options.position;
        this.width = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* getOrDefault */])(options.width, 0);
        this.height = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* getOrDefault */])(options.height, 0);
        this.scale = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* getOrDefault */])(options.scale, new __WEBPACK_IMPORTED_MODULE_0__vector2d__["a" /* Vector2D */](1, 1));
        this.persistent = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* getOrDefault */])(options.persistent, false);
        this.runtime.sprites.push(this);
    }
    update() {
        this.runTasks();
    }
    destroy() {
        this._removeFromContainer(this.runtime.sprites);
        for (const container of this.runtime.containers) {
            this._removeFromContainer(container);
        }
        this.resetTasks(); // stop all future things from running
    }
    _removeFromContainer(container) {
        const index = container.sprites.indexOf(this);
        if (index > -1) {
            container.sprites.splice(index, 1);
        }
    }
    containsPoint(p) {
        return p.x > this.x &&
            p.x < this.x + this.width &&
            p.y > this.y &&
            p.y < this.y + this.height;
    }
    intersects(thing) {
        if (thing instanceof AbstractSprite) {
            return this.x < thing.x + thing.width &&
                this.x + this.width > thing.x &&
                this.y < thing.y + thing.height &&
                this.y + this.height > thing.y;
        }
        else {
            for (const sprite of thing) {
                if (this.intersects(sprite)) {
                    return true;
                }
            }
            return false;
        }
    }
    get x() {
        return this.position.x;
    }
    set x(x) {
        this.position.x = x;
    }
    get y() {
        return this.position.y;
    }
    set y(y) {
        this.position.y = y;
    }
    get z() {
        return this.position.z;
    }
    set z(z) {
        this.position.z = z;
    }
    //
    // Nightlight related code
    //
    runBasicPhysics(xv, yv, options = {}) {
        options.collision = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* getOrDefault */])(options.collision, true);
        options.inAirFriction = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* getOrDefault */])(options.inAirFriction, true);
        options.restrictPositionValues = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* getOrDefault */])(options.restrictPositionValues, true);
        options.friction = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* getOrDefault */])(options.friction, true);
        options.midAirFriction = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* getOrDefault */])(options.midAirFriction, true);
        this.x += xv;
        if (options.collision && this.handleCollision(true)) {
            xv = 0;
        }
        if (options.restrictPositionValues) {
            if (this.x < 0) {
                this.x = 0;
                xv = 0;
            }
            else if (this.x + this.width > this.runtime.canvas.width) {
                this.x = this.runtime.canvas.width - this.width;
                xv = 0;
            }
        }
        let onGround = false;
        yv -= __WEBPACK_IMPORTED_MODULE_3__config__["e" /* GRAVITY */];
        this.y -= yv;
        if (options.collision && this.handleCollision(false)) {
            if (yv < 0) {
                onGround = true;
            }
            yv = 0;
        }
        if (options.friction) {
            if (onGround || options.midAirFriction) {
                xv *= __WEBPACK_IMPORTED_MODULE_3__config__["d" /* FRICTION */];
            }
        }
        return {
            xv, yv, onGround,
        };
    }
    handleCollision(horizontal) {
        for (const block of this.runtime.blocks) {
            if (block.solid && this.intersects(block)) {
                block.handleIntersect(this, horizontal);
                return true;
            }
        }
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AbstractSprite;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__engine_sprites_imagesprite__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fragment__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__engine_vector__ = __webpack_require__(1);





const PLAYER_WALK_SPEED = 0.5 / 2;
const JUMP_HEIGHT = 5.25;
const PLAYER_MAX_SPEED = 4 / 2;
const PLAYER_FRICTION = 0.8 / 2;
const FRAGMENT_COUNT = 5;
const FRAGMENT_XV_RANGE = 1;
const FRAGMENT_YV_MIN = 3;
const FRAGMENT_YV_MAX = 5;
const FRAGMENT_RV_RANGE = 10;
const FRAGMENT_TEXTURES = 5;
const WALK_ANIMATION_FRAMES = 4;
const WALK_ANIMATION_LENGTH = 4;
var MovementDirection;
(function (MovementDirection) {
    MovementDirection[MovementDirection["Right"] = 1] = "Right";
    MovementDirection[MovementDirection["Left"] = -1] = "Left";
})(MovementDirection || (MovementDirection = {}));
class PlayerSprite extends __WEBPACK_IMPORTED_MODULE_0__engine_sprites_imagesprite__["a" /* ImageSprite */] {
    constructor(opts) {
        super(opts);
        this.yv = 0;
        this.xv = 0;
        this.lastMovementDirection = MovementDirection.Right;
        this.onGround = true;
        this.walkingAnimationProgress = 1;
        this.currentFrameProgress = 0;
        this.moving = false;
        this._jumpMonitorLastYv = 0;
        this._jumpMonitorStart = 0;
        this._jumpMonitorStarted = false;
        this.addTask(this.run);
        this.addTask(this.jumpMonitor);
        this.addTask(this.updateGraphic);
    }
    // Monitors the length of a jump in frames to allow easier fine tuning
    jumpMonitor() {
        if (this.yv < this._jumpMonitorLastYv && !this._jumpMonitorStarted) {
            this._jumpMonitorStarted = true;
            this._jumpMonitorStart = this.runtime.frames;
            console.log("jump start");
        }
        if (this.yv > this._jumpMonitorLastYv && this._jumpMonitorStarted) {
            this._jumpMonitorStarted = false;
            const length = this.runtime.frames - this._jumpMonitorStart;
            console.log("jump end length=" + length);
        }
        this._jumpMonitorLastYv = this.yv;
    }
    handleInputs(onGround) {
        const keys = this.runtime.keyboard.keys;
        const rightDown = keys[39].isPressed;
        const leftDown = keys[37].isPressed;
        const upDown = keys[38].isPressed;
        this.moving = false;
        if (rightDown && !leftDown) {
            this.xv += PLAYER_WALK_SPEED;
            this.lastMovementDirection = MovementDirection.Right;
            this.moving = true;
        }
        if (leftDown && !rightDown) {
            this.xv -= PLAYER_WALK_SPEED;
            this.lastMovementDirection = MovementDirection.Left;
            this.moving = true;
        }
        if (upDown && onGround) {
            this.yv = JUMP_HEIGHT;
        }
        else if (!upDown && this.yv > 3) {
            this.yv = 3;
        }
        return {
            rightDown, leftDown, upDown,
        };
    }
    run() {
        if (this.xv > PLAYER_MAX_SPEED) {
            this.xv = PLAYER_MAX_SPEED;
        }
        else if (this.xv < -PLAYER_MAX_SPEED) {
            this.xv = -PLAYER_MAX_SPEED;
        }
        const physicsResult = this.runBasicPhysics(this.xv, this.yv, {
            friction: false,
        });
        this.xv = physicsResult.xv;
        this.yv = physicsResult.yv;
        this.onGround = physicsResult.onGround;
        const inputs = this.handleInputs(physicsResult.onGround);
        if ((!inputs.leftDown && !inputs.rightDown) || (inputs.leftDown && inputs.rightDown)) {
            if (this.xv > 0) {
                this.xv -= PLAYER_FRICTION;
                this.xv = Math.max(this.xv, 0);
            }
            else {
                this.xv += PLAYER_FRICTION;
                this.xv = Math.min(this.xv, 0);
            }
        }
        if (this.y >= this.runtime.canvas.height) {
            this.kill();
        }
    }
    reset() {
        this.position.x = 40;
        this.position.y = this.runtime.canvas.height - __WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCK_HEIGHT */];
        this.xv = 0;
        this.yv = 0;
        const sprites = this.runtime.blocks.sprites.filter((s) => s.solid);
        while (this.intersects(sprites)) {
            this.y -= __WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCK_HEIGHT */];
        }
    }
    kill() {
        for (let i = 0; i < FRAGMENT_COUNT; i++) {
            new __WEBPACK_IMPORTED_MODULE_2__fragment__["a" /* PlayerFragmentSprite */]({
                position: new __WEBPACK_IMPORTED_MODULE_4__engine_vector__["a" /* Vector */](this.position),
                texture: this.runtime.getAsset(`fragments/${Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* getRandomInt */])(1, FRAGMENT_TEXTURES)}`),
                xv: Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* getRandomInt */])(-FRAGMENT_XV_RANGE * 1000, FRAGMENT_XV_RANGE * 1000) / 1000,
                yv: Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* getRandomInt */])(FRAGMENT_YV_MIN * 1000, FRAGMENT_YV_MAX * 1000) / 1000,
                rv: Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* getRandomInt */])(-FRAGMENT_RV_RANGE * 1000, FRAGMENT_RV_RANGE * 1000) / 1000,
            });
        }
        this.reset();
    }
    updateGraphic() {
        this.scale.x = this.lastMovementDirection;
        if (this.onGround) {
            if (this.moving) {
                this.currentFrameProgress++;
                if (this.currentFrameProgress === WALK_ANIMATION_LENGTH) {
                    this.currentFrameProgress = 0;
                    this.walkingAnimationProgress++;
                }
                if (this.walkingAnimationProgress > WALK_ANIMATION_FRAMES) {
                    this.walkingAnimationProgress = 1;
                }
                this.texture = this.runtime.getAsset(`player/walk${this.walkingAnimationProgress}`);
            }
            else {
                this.texture = this.runtime.getAsset("player/idle");
            }
        }
        else {
            if (this.yv < 0.1) {
                this.texture = this.runtime.getAsset("player/down");
            }
            else {
                this.texture = this.runtime.getAsset("player/up");
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayerSprite;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__3rd_party_stableSort__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__3rd_party_stableSort___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__3rd_party_stableSort__);
// a container contains sprites
// isn't that earth shattering or what?
// these were used more heavily in my older games
// currently only one of these are used: the sprites list

class Container {
    constructor() {
        this.runtime = Container.runtime;
        this.sprites = [];
        this.runtime.containers.push(this);
    }
    push(...items) {
        return this.sprites.push(...items);
    }
    *[Symbol.iterator]() {
        for (const sprite of this.sprites) {
            yield sprite;
        }
    }
    sort() {
        this.sprites.stableSort((a, b) => {
            return a.position.z - b.position.z;
        });
    }
    get length() {
        return this.sprites.length;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Container;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__task__ = __webpack_require__(2);


class BaseMouse extends __WEBPACK_IMPORTED_MODULE_1__task__["b" /* TaskRunner */] {
    constructor(runtime) {
        super();
        this.position = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* Vector */](0, 0);
        this.runtime = runtime;
    }
    update() {
        this.runTasks();
    }
    get isDown() {
        return this.left.isDown;
    }
    get isUp() {
        return this.left.isUp;
    }
    get isClick() {
        return this.left.isClick;
    }
    get framesDown() {
        return this.left.framesDown;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseMouse;

class BaseMouseButton {
    constructor(mouse) {
        this.isDown = false;
        this.framesDown = 0;
        mouse.addTask(this.update.bind(this));
    }
    update() {
        if (this.isDown) {
            this.framesDown++;
        }
        else {
            this.framesDown = 0;
        }
    }
    get isUp() {
        return !this.isDown;
    }
    get isClick() {
        return this.framesDown === 1;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = BaseMouseButton;

// A mouse button that doesn't do anything and always returns basic defaults
// Used by mobile mouse support as only left click is supported there
class EmptyMouseButton {
    constructor() {
        this.isDown = false;
        this.isUp = true;
        this.isClick = false;
        this.framesDown = 0;
    }
    update() { }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = EmptyMouseButton;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Vector2D {
    constructor(x = 0, y = 0) {
        if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Vector2D;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getRandomInt;
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(3);


class GrassBlock extends __WEBPACK_IMPORTED_MODULE_0__block__["a" /* Block */] {
    constructor(opts) {
        super(opts);
        this.y += __WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCK_HEIGHT */];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GrassBlock;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__engine_task__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__engine_vector__ = __webpack_require__(1);



const VIBRATE_EVERY = 3;
const VIBRATE_RANGE = 2;
const VIBRATE_TIMES = 20;
const FALL_DELAY_PER_Y = 0.25;
class FallingBlock extends __WEBPACK_IMPORTED_MODULE_0__block__["b" /* SolidBlock */] {
    constructor(opts) {
        super(opts);
        this.yv = 0;
        this.vibrateProgress = 0;
        this.frame = 0;
        this.startingPosition = new __WEBPACK_IMPORTED_MODULE_2__engine_vector__["a" /* Vector */](this.position);
    }
    trigger() {
        this.x -= VIBRATE_RANGE / 2;
        this.addTask(new __WEBPACK_IMPORTED_MODULE_1__engine_task__["a" /* Task */]({
            run: this.vibrate,
            repeatEvery: 3,
        }));
    }
    vibrate(task) {
        this.vibrateProgress++;
        if (this.vibrateProgress === VIBRATE_TIMES) {
            const fromBottom = this.runtime.canvas.height - this.y;
            task.stop();
            this.position = this.startingPosition;
            this.solid = false;
            this.addTask(new __WEBPACK_IMPORTED_MODULE_1__engine_task__["a" /* Task */]({
                run: this.fall,
                delay: fromBottom * FALL_DELAY_PER_Y,
                repeatEvery: 0,
            }));
        }
        else if (this.vibrateProgress % 2 === 0) {
            this.x -= VIBRATE_RANGE;
        }
        else {
            this.x += VIBRATE_RANGE;
        }
    }
    fall(task) {
        const physicsResult = this.runBasicPhysics(0, this.yv, {
            collision: false,
        });
        this.yv = physicsResult.yv;
        if (this.y >= this.runtime.canvas.height) {
            task.stop();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FallingBlock;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(15);

window._SRC_PREFIX = window._SRC_PREFIX || "";
const game = new __WEBPACK_IMPORTED_MODULE_0__game__["a" /* Nightlight */]();
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


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__engine_runtime__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__levels_levels__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sprites_player_player__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__engine_vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__blockmap__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sprites_blocks_block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__engine_container__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__sprites_star__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils__ = __webpack_require__(11);










class Nightlight extends __WEBPACK_IMPORTED_MODULE_0__engine_runtime__["a" /* GameRuntime */] {
    constructor() {
        super(document.getElementById("canvas"));
        this.level = 0;
        this.backgroundColor = "black";
        this.blocks = new __WEBPACK_IMPORTED_MODULE_7__engine_container__["a" /* Container */]();
    }
    start() {
        super.start();
        this.createPlayer();
        this.createStarBackground();
        this.renderLevel();
    }
    createPlayer() {
        this.player = new __WEBPACK_IMPORTED_MODULE_2__sprites_player_player__["a" /* PlayerSprite */]({
            texture: this.getAsset("player/idle"),
            position: new __WEBPACK_IMPORTED_MODULE_3__engine_vector__["a" /* Vector */](0, 0, 10),
            width: __WEBPACK_IMPORTED_MODULE_6__config__["c" /* BLOCK_WIDTH */],
            height: __WEBPACK_IMPORTED_MODULE_6__config__["a" /* BLOCK_HEIGHT */],
            persistent: true,
        });
    }
    createStarBackground() {
        for (let i = 0; i < 50; i++) {
            const x = Object(__WEBPACK_IMPORTED_MODULE_9__utils__["a" /* getRandomInt */])(0, this.canvas.width);
            const y = Object(__WEBPACK_IMPORTED_MODULE_9__utils__["a" /* getRandomInt */])(0, this.canvas.height);
            new __WEBPACK_IMPORTED_MODULE_8__sprites_star__["a" /* BackgroundStarSprite */]({
                position: new __WEBPACK_IMPORTED_MODULE_3__engine_vector__["a" /* Vector */](x, y, -10),
                width: 2,
                height: 2,
                persistent: true,
            });
        }
    }
    destroyLevel() {
        // a normal for loop won't work because we are modifying the list mid loop
        for (let i = 0; i < this.sprites.length;) {
            const sprite = this.sprites.sprites[i];
            if (sprite.persistent) {
                i++;
            }
            else {
                sprite.destroy();
            }
        }
    }
    renderLevel(level = this.level) {
        this.destroyLevel();
        const levelData = __WEBPACK_IMPORTED_MODULE_1__levels_levels__["a" /* Levels */][level];
        this.levelData = levelData;
        let x = 0;
        let y = this.canvas.height - __WEBPACK_IMPORTED_MODULE_6__config__["a" /* BLOCK_HEIGHT */];
        const createBlock = (position, char, index) => {
            const blockType = __WEBPACK_IMPORTED_MODULE_4__blockmap__["a" /* blockMap */][char];
            let spriteConstructor;
            let texture;
            if (typeof blockType === "undefined") {
                console.warn("skipping block", char);
                return;
            }
            else if (typeof blockType === "string") {
                texture = this.getAsset(blockType);
                spriteConstructor = __WEBPACK_IMPORTED_MODULE_5__sprites_blocks_block__["b" /* SolidBlock */];
            }
            else {
                texture = this.getAsset(blockType.texture);
                spriteConstructor = blockType.type;
            }
            const opts = {
                width: texture.width / __WEBPACK_IMPORTED_MODULE_6__config__["b" /* BLOCK_SIZE_SCALE */],
                height: texture.height / __WEBPACK_IMPORTED_MODULE_6__config__["b" /* BLOCK_SIZE_SCALE */],
                position,
                texture,
                levelIndex: index,
            };
            new spriteConstructor(opts);
        };
        for (let i = 0; i < levelData.length; i++) {
            const char = levelData[i];
            if (char !== ".") {
                const position = new __WEBPACK_IMPORTED_MODULE_3__engine_vector__["a" /* Vector */](x, y);
                createBlock(position, char, i);
            }
            x += __WEBPACK_IMPORTED_MODULE_6__config__["c" /* BLOCK_WIDTH */];
            if (x >= this.canvas.width) {
                x = 0;
                y -= __WEBPACK_IMPORTED_MODULE_6__config__["a" /* BLOCK_HEIGHT */];
            }
        }
        this.player.reset();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Nightlight;



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__container__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__drivers_keyboard_keyboard__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__drivers_mouse_mouse__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__drivers_mouse_touchscreen__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__errors_exit__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sprite__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__task__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils__ = __webpack_require__(5);








const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 360;
// this is the main game runtime object
// rendering is done here
// a lot of stuff is done here
class GameRuntime extends __WEBPACK_IMPORTED_MODULE_6__task__["b" /* TaskRunner */] {
    constructor(canvas) {
        super();
        // see resetVariables()
        this.assets = new Map();
        this.containers = [];
        this.frames = 0;
        this.backgroundColor = "white";
        this._assetPromises = [];
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        // mouse driver, support pc and mobile to some degree
        if (!Object(__WEBPACK_IMPORTED_MODULE_7__utils__["c" /* isMobile */])()) {
            console.log("using normal mouse");
            this.mouse = new __WEBPACK_IMPORTED_MODULE_2__drivers_mouse_mouse__["a" /* Mouse */](this);
        }
        else {
            console.log("using mobile mouse");
            this.mouse = new __WEBPACK_IMPORTED_MODULE_3__drivers_mouse_touchscreen__["a" /* TouchscreenMouse */](this);
        }
        this.keyboard = new __WEBPACK_IMPORTED_MODULE_1__drivers_keyboard_keyboard__["a" /* Keyboard */](this);
        // set the current runtime on some objects
        // i dont want to do this but it works
        __WEBPACK_IMPORTED_MODULE_5__sprite__["a" /* AbstractSprite */].runtime = this;
        __WEBPACK_IMPORTED_MODULE_0__container__["a" /* Container */].runtime = this;
        // reset other variables
        this.resetVariables();
        // debugging
        window.runtime = this;
        // run the mouse driver
        this.addTask(this.updateMouse);
        // classess are weird
        this.loop = this.loop.bind(this);
    }
    ///
    /// ASSETS
    ///
    // add an asset and start loading it
    addAsset(src) {
        // uses the original src for storage
        // TODO: consider using the new src and adding that into getAsset?
        const originalSrc = src;
        // add the extension and folder
        src = `${window._SRC_PREFIX}assets/${src}.png`;
        console.log("adding asset", src);
        // create a promise that will resolve when onload is called or
        // reject when onerror is called
        const promise = new Promise((resolve, reject) => {
            const image = document.createElement("img");
            image.src = src;
            image.onload = () => {
                resolve();
            };
            image.onerror = () => {
                reject();
            };
            this.assets.set(originalSrc, image);
        });
        this._assetPromises.push(promise);
        return promise;
    }
    // wait for all assets to load
    waitForAssets() {
        // Promise.all will fail on an error and that is probably preferred behavior
        return Promise.all(this._assetPromises)
            .then(() => console.log("loaded assets"))
            .then(() => this._assetPromises = []);
    }
    // get an asset with a name
    getAsset(src) {
        return this.assets.get(src);
    }
    ///
    /// CORE
    ///
    // reset variabels to sane defaults
    // after starting it has to reset things
    resetVariables() {
        // this.containers = [];
        this.sprites = new __WEBPACK_IMPORTED_MODULE_0__container__["a" /* Container */]();
    }
    // resets things and starts the loop
    start() {
        console.log("starting loop");
        this.resetVariables();
        this.loop();
    }
    // the main loop - calls all tasks in all sprites
    loop() {
        // update sprites and this
        this.frames++;
        try {
            this.update();
        }
        catch (e) {
            // handle exiting
            if (e instanceof __WEBPACK_IMPORTED_MODULE_4__errors_exit__["a" /* ExitError */]) {
                this.onexit();
                return;
            }
            else {
                throw e;
            }
        }
        // render
        this.render();
        // request the next frame to render
        requestAnimationFrame(this.loop);
    }
    update() {
        // all non-core details should be implemented using this.addTask
        // the only core things right now are sprite ticking and rendering (partly due to ordering reasons)
        // all tasks added on here are executed BEFORE sprites
        this.runTasks();
        // all sprites
        for (const sprite of this.sprites) {
            sprite.update();
        }
    }
    render() {
        // clear the canvas
        this.resetCanvas();
        // sort sprites by z TODO: find a better for to do this
        this.sortSprites();
        // render all sprites onto our canvas
        for (const sprite of this.sprites) {
            sprite.render(this.ctx);
        }
    }
    sortSprites() {
        this.sprites.sort();
    }
    // throws an error that is handled gracefully by the update function
    // stops ALL execution
    exit() {
        console.warn("exiting using exit()");
        // instances of ExitError are treated specially by the update function
        throw new __WEBPACK_IMPORTED_MODULE_4__errors_exit__["a" /* ExitError */]();
    }
    // clears the canvas and replaces it with a blank white background
    resetCanvas() {
        this.ctx.scale(1, 1);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // small function that calls the mouse driver's update funciton
    updateMouse() {
        this.mouse.update();
    }
    // called when exiting
    onexit() {
        console.warn("empty onexit()");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameRuntime;



/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://gist.github.com/fsufitch/18bb4692d5f46b649890f8fd58765fbc
let defaultCmp = (a, b) => {
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    else {
        return 0;
    }
};
Array.prototype.stableSort = function (cmp = defaultCmp) {
    const self = this; // for typing
    const stabilized = self.map((el, index) => ([el, index]));
    const stableCmp = (a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    };
    stabilized.sort(stableCmp);
    for (let i = 0; i < self.length; i++) {
        self[i] = stabilized[i][0];
    }
    return self;
};


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(19);

class Keyboard extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* AbstractKeyboard */] {
    constructor(runtime) {
        super(runtime);
        document.addEventListener("keydown", (e) => {
            const keyCode = e.keyCode;
            if (Keyboard.PREVENT.indexOf(keyCode) > -1) {
                e.preventDefault();
            }
            this.keys[keyCode].isPressed = true;
        });
        document.addEventListener("keyup", (e) => {
            const keyCode = e.keyCode;
            if (Keyboard.PREVENT.indexOf(keyCode) > -1) {
                e.preventDefault();
            }
            this.keys[keyCode].isPressed = false;
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Keyboard;

Keyboard.PREVENT = [
    32,
    37,
    38,
    39,
    40,
];


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task__ = __webpack_require__(2);

class AbstractKeyboard extends __WEBPACK_IMPORTED_MODULE_0__task__["b" /* TaskRunner */] {
    constructor(runtime) {
        super();
        this.keys = [];
        runtime.addTask(this.update.bind(this));
        for (let i = 0; i < AbstractKeyboard.KEY_COUNT; i++) {
            this.keys[i] = new Key(this, i);
        }
    }
    update() {
        this.runTasks();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AbstractKeyboard;

AbstractKeyboard.KEY_COUNT = 256;
class Key {
    constructor(keyboard, keyCode) {
        this.isPressed = false;
        this.framesDown = 0;
        keyboard.addTask(this.update.bind(this));
    }
    update() {
        if (this.isPressed) {
            this.framesDown++;
        }
        else {
            this.framesDown = 0;
        }
    }
    get justPressed() {
        return this.framesDown === 1;
    }
}
/* unused harmony export Key */



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(9);

// handles mouse events
// a simple "driver" for the mouse
// TODO: touchscreen support
// probably will use another "driver" that is compatible
var Button;
(function (Button) {
    Button[Button["left"] = 0] = "left";
    Button[Button["middle"] = 1] = "middle";
    Button[Button["right"] = 2] = "right";
})(Button || (Button = {}));
class MouseButton extends __WEBPACK_IMPORTED_MODULE_0__base__["b" /* BaseMouseButton */] {
    constructor(mouse, button) {
        super(mouse); // It's a bird! It's a plane! No it's Supermouse!
        this.button = button;
        document.addEventListener("mousedown", (e) => {
            if (e.button === this.button) {
                this.isDown = true;
            }
        });
        document.addEventListener("mouseup", (e) => {
            if (e.button === this.button) {
                this.isDown = false;
            }
        });
    }
}
class Mouse extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* BaseMouse */] {
    constructor(runtime) {
        super(runtime);
        this.right = new MouseButton(this, Button.right);
        this.middle = new MouseButton(this, Button.middle);
        this.left = new MouseButton(this, Button.left);
        runtime.canvas.addEventListener("mousemove", (e) => {
            this.position.x = e.layerX;
            this.position.y = e.layerY;
        });
        runtime.canvas.addEventListener("mousedown", (e) => {
            e.preventDefault();
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Mouse;



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(1);


// handles mouse events
// a simple "driver" for the mouse
// TODO: touchscreen support
// probably will use another "driver" that is compatible
class TouchscreenButton extends __WEBPACK_IMPORTED_MODULE_0__base__["b" /* BaseMouseButton */] {
    constructor(mouse) {
        super(mouse); // It's a bird! It's a plane! No it's Supermouse!
        document.addEventListener("touchstart", (e) => {
            this.isDown = true;
        });
        document.addEventListener("touchend", (e) => {
            this.isDown = false;
        });
        document.addEventListener("touchcancel", (e) => {
            this.isDown = false;
        });
    }
}
class TouchscreenMouse extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* BaseMouse */] {
    constructor(runtime) {
        super(runtime);
        // only the left mouse button does stuff
        this.left = new TouchscreenButton(this);
        this.middle = new __WEBPACK_IMPORTED_MODULE_0__base__["c" /* EmptyMouseButton */]();
        this.right = new __WEBPACK_IMPORTED_MODULE_0__base__["c" /* EmptyMouseButton */]();
        // stop scrolling, zooming, or other stuff that you can do with your fingers
        this.handleEvent = this.handleEvent.bind(this);
        runtime.canvas.addEventListener("touchmove", this.handleEvent);
        runtime.canvas.addEventListener("touchstart", this.handleEvent);
        runtime.canvas.addEventListener("touchend", this.handleEvent);
        runtime.canvas.addEventListener("touchcancel", this.handleEvent);
    }
    handleEvent(e) {
        e.preventDefault();
        const offset = this.findOffset(this.runtime.canvas);
        this.position.x = e.changedTouches[0].clientX - offset.x;
        this.position.y = e.changedTouches[0].clientY - offset.y;
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events with minor modifications
    findOffset(el) {
        let curleft = 0;
        let curtop = 0;
        while (el.offsetParent) {
            curleft += el.offsetLeft;
            curtop += el.offsetTop;
            el = el.offsetParent;
        }
        return new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* Vector */](curleft - document.body.scrollLeft, curtop - document.body.scrollTop);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TouchscreenMouse;



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// error is handled more gracefully by the engine
// than a regular error
class ExitError extends Error {
    constructor() {
        super("Stopping game execution");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ExitError;



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Levels = [
    "eaaaaaaaaafeaaaafeaaaaaaaaaaaaeaaaaaaaaafbccccdeaaaaaaaaaaaaeaaaaaaaaafooooooeaaaaaaaaaaaaeaaaaaaaaaf......eaaaaaaaaaaaaeaaaaaaaaaf......eaaaaaaaaaaaabcccccccccd......bcccmaaaaaaaajkpppkkpqkl......jkqpeaaaaaaaa.....................eaaaaaaaa.....................eamccccnc.....................bcdkpkq.k.....................qpl..............................................................................................................................................................................................................................................................................................................................................................................",
    "aaaaaaaaaafr.r.r.r.r.r.eaaaaaaaaaaaaaaaafo.o.o.o.o.o.eaaaaaaaaaaaaaaaaf............eaaaaaaaaaaaaaaaaf............eaaaaaaaaaaaaaaaaf............eaaaaaaaaaaaaaaaaf.gi.........eaaaaaaaaaaaaaaaaf.jl.........eaaaaaaaaaaaaaaaaf.......gi...eaaaaaaccccccccccd.......jl...eaaaaaaqkkpkpqqkkl...........gmaaaaaa.....................gmaaaaaaa.....................bcmaaaaaa.....................kqeaaaaaa............ghhhhi.....eaaaaaa............jpqqkl.....eaaaaaa......ghi..............eaaaaaa......qkp..............eaaaaaa.......................eaaaaaa.............ghhhhi....bccnccc.............jqkkpl....pkq.kqk..........................................................................................",
    "aaaaaaf..............srrrrrrrraaaaaaf..............srrrrrrrraaaaaaf..............srrrrrrrraaaaaaf..............sssssrrrraaaaaaf..................srrrraaaaaaf..t....t..........srrrraaaaaaf..................srrrraaaaaaf..................ssnssaaaaaaf.......................ccccccd.......................kpkqqkl....gi............................ef.........ghhhhhhh...........ef.......ghmaaaaaaa...........ef......gmaaaaaaaaa...........emhhhhhhmaaaaaaaaaa...........eaaaaaaaaaaaaaaaaaa.........ghmaaaaaaaaaaaaaaaaaa.......ghmaaaaaaaaaaaaaaaaaaaa.....ghmaaaaaaaaaaaaaaaaaaaaaa...ghmaaaaaaaaaaaaaaaaaaaaaaaa..gmaaaaaaaaaaaaaaaaaaaaaaaaaa.gmaaaaaaaaaaaaaaaaaaaaaaaaaaa.eaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "rrrrrs...................srrrrrrrrrs...................srrrrrrrrrs...................srrrrrrrrrs...................srrrrrrssss...................ssnssrrs......t...t................rrs...........................sss..............t...................................................gi............................emhi.................hi......gmaaf.................amhi...gmaaami...............gaaamhhhmaaaaamhi...........ghmaaaaaaaaaaaaaaamhhi.....ghhmaaaaaaaaaaaaaaaaaaaamhhhhhmaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "aaaaaf.............t....eaaaaaaaaaaf...t..............bcmaaaaaaaaf........t...........bmaaaaamcd.....................bcmmccd.........................ef...........................gmf.....ghhhvvvvvvhhhi.......gmami...gmmcdoo..oobccmhhi....peafp..gmaf...........bcmmhhi..eaf...qeaf.............bmafp..eami...emmi.............emd...eaami..efpp..ghhhi......ef...gmaafq..ef....pqncmi....gmd...eaaaf...bmi.......ef....bd....eaaaf....ef.......ef....w....gmaaami...ef.ghhhhhmmi...w....eaaaaami..emhmccuccmamhi.w..ghmaaaaaaf..bccd.....bmaamhhhhmaaaaaaaaf............eaaaaaaaaaaaaaaaami..........gmaaaaaaaaaaaaaaaaami.......ghmaaaaaaaaaaaaaaaaaaamhhhhhhhmaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "aaaaaaaaaaafbccccdeaaaaaaaaaaaaaaaaaaaaaafooooooeaaaaaaaaaaaaaaaaaaaaaaf......eaaaaaaaaaaaaaaaaaaaaaaf......eaaaaaaaaaaaaaaaaaaaaaaf......eaaaaaaaaaaaaaaaaaaaaaaf......eaaaaaaaaaaaaaaaaaaaaaaf......eaaaaaaaaaaacccccccccccd......bccccccccccckkpppkkqpkkl......jkqkqkkpqqpp....................................................................................................................................................................................................................................................................................................................................................................................................................................",
    "aaaaaa5...................4aaaaaaaaa5...........y.......4aaaaaaaaa5...................4aaaaaaaaa5.....y.zzz.........1222aaaaaa5............zzz......x.aaaaaa5.......................2222223..zzz..............................................................................................................y..........................................................................................................................y678...........................4a5..........67778............123...t......4aaa5......68..............t..12n23......13....................................................................................................................................................",
    "aaaaaaaaaaaaaaaa5..!!!!!4aa5..aaaaaaaaaaaaaaaa5.....x.4aa98.aaaaaaaaaaaaaaaa5.......4aaa5.a9222222222229aa5.......4aaa98a5...w..w....4aa5..!!!!!122223a5...w.......4aa5.......aaaa..a5...w.......4aa5.......aaaa..a5.........!!4aa5!!!!!!!6778!.a5...........4aa5ooooooo4aa5..a978.........1223.......1223..aaa978........................aaaaa98.......................aaaaaa98......................aaaaaaa9778!!!!!..............229a9222223....................z1u3z.........................z...z......68ww68.............z...z......45!!45.............zzzzz......45..45........................45..45........................45..45........................497@95........................4aaaa5............",
    "aaaa5...ooo45.45..45..soo4aaaaaaaa5......13.13..13..s..4aaaaaaaa5....s............s..4aaaa22223....s..#s$.......s..12222.........s..#ssss%s...s.......8........s..#ssssss!!!s.......978.....ss..#ss.......s.......aa98.....s...s$.sssssss@s.....aaa98....s...s$.s.......s.....aaaa98...s$..s$!s.......s.....aaaa93...s$..s$.s.......s.....aaaa5....s$..s$.s.......s.....aaaa5....s$..s$.s.......s.....aaaa5....s...s$!s.......s.....aaaa5...ss...s$.s.......s.....aaaa5....s..#s$.s!!!!!!!s.....aaaa5....s..#s$.sooooooos.....aaaa5....s..#s$!s......!s.....aaaa5.......#s$...............aaaa5.......ss$...............aaaa97778...ss$...............aaaaaaaa97778.................aaaaaaaaaaaa5.................",
    "aaaaaaaaa5oooooooo4aa5......4aaaaaaaaaa5........4aa5......4aaaaaaaaaa5........1223......4a22222229a5..................4a.......4a5..................4a.......4a5..................4a.......4a5.............%....4a8ss....4a5.............o....4a5oo....4a5..................4a5......4a5..................4a5......4a5..................4a5......4a5...678............4a5....ss4a5...4a5.......%....4a5....oo4a5...4a5.......o....4a5......4a5...4a5............4a5......4a5...4a5............4a5......4a5...4a5............4a5s.....4a5...4a5............4a5o.....123...4a5.......%....4a5............4a5.......o....1n5............4a5..............5............4a5..............5............4a5..............",
    "4aaaaaaaaaaaaa5............4aa4aaaaaaaaaaaaa5............4aa4aaaaaaaaaaaaa5............4aa4aaaaaaaaaaaaa5............1n2122222222222223............w........y....................w........y.............zzz....w..$..#ss$.#s..........z.z....w..$...#s$.#s..........z.z....w..$....s$.#s....%.....zzz....w..s$...s$.#s...#s$...........w..ss$..s$.#s...#s$...........w..sss!!s$.#s...#s$...........w..sx...s$.#s...#s$...........w..s....s$.#s...#s$...........w.......su!ss...#s$...........w.......s...s...#s$...........w.......s...s...#s$...........w.......s...s...#s$...........w.......s!!!s...#s$..........#s$..............#s$..........#s$..............#s$..........#s$..............#s$..........#s$.",
    "aaaaaa5....................4aaaaa92n3....................4aaaaa5......................69aaaaa5.....................6aaaaaaa9778..................129aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aaaaaaaa5....................4aa2222223wwwwwwwwwwwwwwwwwwww1u2..............................................................................................................................................................................................................................................................................",
    "2222222222229aaaa9222222222222............4aaaa5........................4aaaa5........................122223......................................._=+...........................)^-...........................)^-...........................)^-......6778.................)^-......1223.................)^-...........................)^-...........................)^-...........................)^-.......................6777)^-.......................1222)^-...........................)^-...........................)^-...67778...................)^-...12223...................)^-...........................)^-.........................._`^-..........................&**(..............................",
    "^^^-..........................^^^-..........................***(...t...................................t.............................................................................................t.....................................................................................t.......t................t..............................................................................u.......................................t.....%%%..........................%_=+%........................#_`^`+$.......................#)^^^-$.......................#&*n*($........%%%..............w.w.........._=+..............www..........)^-...........................)^-...........................)^-.",
    "^^^^-......................)^^^^^^-......................)^^****(...t...t...t...t..t..t)^^...........................)^^...........................)^^...........................&**....._==================+..........)`*****************(....._====`-oooooooooooooooooo.....&*****(..t...t...t...t...t.....................................................................t.............................._=======================......&*******************`^^^......oooooooooooooooooooo)^^^......t....t....t....t....&*n*........................................................................................................................==============================^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    "^^^^-....................)^^^^^^^^-....................)^^^^****(....................&*u**.....................................................................................................................................................................................................................................................................................................................................%%%%%====+...................._====^^^^-....................)^^^^****(....................&*n**..x......................zw.wz.........................zwwwz.........................zzzzz..........................................................................................",
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`****************************`-...........................#)-...........................#)-...........................#)-!!_+......y.....zww..._+z..#)-..)-..................)-...#)-..)-..................)-...#)-%.)-..................)-...#)-sz)-......y.......zww.)-z..#)-..)-..................)-...#)-..)-..................)-...#)-.%)-..................)-...#)-zs)-......y.....wwz...)-z..#)-..)-..................)-...#)-..)-..................)-...#)-%.)-......s........._=`-s..#)-uz&(......x.........&n`-x..#)-....................w.)-...#)-....................w.)-...#)`======================``====`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    "^^^^^^^^^^^^-....)^^^^^^^-....^^^^^^^^^^^^-....)^^^^^^^-....************(....&*******(................................................................................................yyy......................t.................................................................y..........ss............................x..............t.................................w............................w.w..........................._@+....................t......)^-................t..........&u(...t...t...t.................................................................................................................................................................................................",
    "^^^^^^^^-oooooooooooo)^^^^^^^^^^^^^^^^-............)^^^^^^^^^^^^^^^^-............)^^^^^^^^********(............&********................................................................................................................................................................................................................................................==================+$..........^^^^^^^^^^^^^^^^^^-$..........`*****************($..........-.............................-.............................-.............................-.............................-.............................-.............................`=@=======+...................^^^^^^^^^^-...................",
    "..)^^^^^^^^^^^^^^^^^^^^^^^^-....)^^^^^^^^^^^^^^^^^^^^^^^^-....&************************(..........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................",
    // ???
    "  ",
    "eaaaaf......eaaaaf......eaaaafeaaaaf......eaaaaf......eaaaafeaaaaf......eaaaaf......eaaaafeaaaaf......eaaaaf......eaaaafeaaaaf..gi..eaaaaf..gi..eaaaafeaaaaf..bd..eaaaaf..bd..eaaaafemcncd..jl..eaaaaf..jl..bcncmfef..........eaaaaf..........efef..........bccccd..........efef..........jkkkkl..........efbd..........................bdnl..........................jn...................................ghhi............ghhi..........eaaf............eaaf..........bccd............bccd.............................................................................ghhhhi........................jkkkkl......................................................................................................",
];
/* harmony export (immutable) */ __webpack_exports__["a"] = Levels;



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__engine_sprites_imagesprite__ = __webpack_require__(4);

const LIFESPAN = 300;
const GHOST_RATE = 0.03;
class PlayerFragmentSprite extends __WEBPACK_IMPORTED_MODULE_0__engine_sprites_imagesprite__["a" /* ImageSprite */] {
    constructor(opts) {
        super(opts);
        this.xv = 0;
        this.yv = 0;
        this.rv = 0;
        this.lifespan = 0;
        this.xv = opts.xv;
        this.yv = opts.yv;
        this.rv = opts.rv;
        if (this.y >= this.runtime.canvas.height) {
            this.y = this.runtime.canvas.height - 1;
        }
        this.addTask(this.run);
    }
    run() {
        this.lifespan++;
        const physicsResult = this.runBasicPhysics(this.xv, this.yv, {
            inAirFriction: false,
            midAirFriction: false,
        });
        this.xv = physicsResult.xv;
        this.yv = physicsResult.yv;
        if (physicsResult.onGround) {
            this.rv *= 0.5;
        }
        this.rotation += this.rv;
        if (this.lifespan >= LIFESPAN) {
            this.opacity -= GHOST_RATE;
        }
        if (this.opacity < 0 || this.y > this.runtime.canvas.height) {
            this.destroy();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayerFragmentSprite;



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sprites_blocks_block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sprites_blocks_grass__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sprites_blocks_spike__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sprites_blocks_corner__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sprites_blocks_tallgrass__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sprites_blocks_coinspawner__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sprites_blocks_crumble__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__sprites_blocks_falling__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__sprites_blocks_blockswitchspawner__ = __webpack_require__(32);









function special(type, texture) {
    return {
        type, texture,
    };
}
function notsolid(texture) {
    return special(__WEBPACK_IMPORTED_MODULE_0__sprites_blocks_block__["a" /* Block */], texture);
}
const blockMap = {
    a: "blocks/a",
    b: "blocks/b",
    c: "blocks/c",
    d: "blocks/d",
    e: "blocks/e",
    f: "blocks/f",
    g: "blocks/g",
    h: "blocks/h",
    i: "blocks/i",
    j: special(__WEBPACK_IMPORTED_MODULE_1__sprites_blocks_grass__["a" /* GrassBlock */], "blocks/j"),
    k: special(__WEBPACK_IMPORTED_MODULE_1__sprites_blocks_grass__["a" /* GrassBlock */], "blocks/k"),
    l: special(__WEBPACK_IMPORTED_MODULE_1__sprites_blocks_grass__["a" /* GrassBlock */], "blocks/l"),
    m: special(__WEBPACK_IMPORTED_MODULE_3__sprites_blocks_corner__["a" /* CornerBlock */], "blocks/m"),
    n: special(__WEBPACK_IMPORTED_MODULE_5__sprites_blocks_coinspawner__["a" /* LevelUpCoinSpawnerBlock */], "blocks/n"),
    o: special(__WEBPACK_IMPORTED_MODULE_2__sprites_blocks_spike__["a" /* SpikeBlock */], "blocks/o"),
    p: special(__WEBPACK_IMPORTED_MODULE_4__sprites_blocks_tallgrass__["a" /* TallGrassBlock */], "blocks/p"),
    q: special(__WEBPACK_IMPORTED_MODULE_4__sprites_blocks_tallgrass__["a" /* TallGrassBlock */], "blocks/q"),
    r: "blocks/r",
    s: "blocks/s",
    t: special(__WEBPACK_IMPORTED_MODULE_6__sprites_blocks_crumble__["a" /* CrumblingBlock */], "blocks/crumble/1"),
    u: special(__WEBPACK_IMPORTED_MODULE_8__sprites_blocks_blockswitchspawner__["a" /* BlockSwitchSpawnerBlock */], "blocks/u"),
    v: "blocks/v",
    w: special(__WEBPACK_IMPORTED_MODULE_7__sprites_blocks_falling__["a" /* FallingBlock */], "blocks/w"),
};
/* harmony export (immutable) */ __webpack_exports__["a"] = blockMap;



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__player_player__ = __webpack_require__(7);


class SpikeBlock extends __WEBPACK_IMPORTED_MODULE_0__block__["b" /* SolidBlock */] {
    constructor(opts) {
        super(opts);
        this.groundedCenterAlign();
    }
    handleIntersect(sprite, horizontal) {
        super.handleIntersect(sprite, horizontal);
        if (sprite.y + sprite.height === this.y && sprite instanceof __WEBPACK_IMPORTED_MODULE_1__player_player__["a" /* PlayerSprite */]) {
            sprite.kill();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SpikeBlock;



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__engine_sprites_imagesprite__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__engine_vector__ = __webpack_require__(1);




const AIR = [
    ".",
    "l", "k", "j",
    "p", "q",
];
class CornerBlock extends __WEBPACK_IMPORTED_MODULE_0__block__["a" /* Block */] {
    constructor(opts) {
        super(opts);
        this.levelIndex = opts.levelIndex || 0;
        // black background
        new __WEBPACK_IMPORTED_MODULE_0__block__["a" /* Block */]({
            texture: this.runtime.getAsset("blocks/a"),
            position: new __WEBPACK_IMPORTED_MODULE_3__engine_vector__["a" /* Vector */](this.x, this.y, -1),
        });
        this.testCorner(__WEBPACK_IMPORTED_MODULE_1__config__["f" /* LEVEL_WIDTH */] - 1, -90, 0, 0);
        this.testCorner(__WEBPACK_IMPORTED_MODULE_1__config__["f" /* LEVEL_WIDTH */] + 1, 0, 1, 0);
        this.testCorner(-__WEBPACK_IMPORTED_MODULE_1__config__["f" /* LEVEL_WIDTH */] - 1, 180, 0, 1);
        this.testCorner(-__WEBPACK_IMPORTED_MODULE_1__config__["f" /* LEVEL_WIDTH */] + 1, 90, 1, 1);
        // the intent of a cornersprite is to create sprites
        // it itself does not do anything else so delete it
        this.destroy();
    }
    testCorner(offset, rotation, x, y) {
        const charAtOffset = this.runtime.levelData[this.levelIndex + offset];
        const isAir = AIR.indexOf(charAtOffset) > -1;
        if (isAir) {
            const position = new __WEBPACK_IMPORTED_MODULE_3__engine_vector__["a" /* Vector */](this.x + x * (__WEBPACK_IMPORTED_MODULE_1__config__["c" /* BLOCK_WIDTH */] / 2), this.y + y * (__WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCK_HEIGHT */] / 2));
            new __WEBPACK_IMPORTED_MODULE_2__engine_sprites_imagesprite__["a" /* ImageSprite */]({
                position,
                texture: this.texture,
                rotation,
            });
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CornerBlock;



/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__grass__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__engine_vector__ = __webpack_require__(1);



class TallGrassBlock extends __WEBPACK_IMPORTED_MODULE_0__block__["a" /* Block */] {
    constructor(opts) {
        super(opts);
        new __WEBPACK_IMPORTED_MODULE_1__grass__["a" /* GrassBlock */]({
            position: new __WEBPACK_IMPORTED_MODULE_2__engine_vector__["a" /* Vector */](opts.position),
            texture: this.runtime.getAsset("blocks/k"),
        });
        this.groundedCenterAlign();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TallGrassBlock;



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__coin__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__engine_vector__ = __webpack_require__(1);




class LevelUpCoinSpawnerBlock extends __WEBPACK_IMPORTED_MODULE_0__block__["b" /* SolidBlock */] {
    constructor(opts) {
        super(opts);
        const position = new __WEBPACK_IMPORTED_MODULE_3__engine_vector__["a" /* Vector */](this.x, this.y - __WEBPACK_IMPORTED_MODULE_2__config__["a" /* BLOCK_HEIGHT */]);
        new __WEBPACK_IMPORTED_MODULE_1__coin__["a" /* LevelUpCoinSprite */]({
            position,
            texture: this.runtime.getAsset("coin/1"),
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LevelUpCoinSpawnerBlock;



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__blocks_block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__engine_task__ = __webpack_require__(2);


const FRAME_LENGTH = 3;
const TOTAL_FRAMES = 4;
class LevelUpCoinSprite extends __WEBPACK_IMPORTED_MODULE_0__blocks_block__["a" /* Block */] {
    constructor(opts) {
        super(opts);
        this.animationFrame = 1;
        this.centerAlign();
        this.addTask(this.run);
        this.addTask(new __WEBPACK_IMPORTED_MODULE_1__engine_task__["a" /* Task */]({
            run: this.animate,
            repeatEvery: FRAME_LENGTH,
            delay: FRAME_LENGTH,
        }));
    }
    run() {
        const touchingPlayer = this.intersects(this.runtime.player);
        if (touchingPlayer) {
            this.runtime.level++;
            this.runtime.renderLevel();
        }
    }
    animate() {
        this.animationFrame++;
        if (this.animationFrame > TOTAL_FRAMES) {
            this.animationFrame = 1;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LevelUpCoinSprite;



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player_player__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__engine_task__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__engine_sprites_imagesprite__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__block__ = __webpack_require__(0);




const CRUMBLE_FRAMES = 9;
const CRUMBLE_FRAME_LENGTH = 5;
const CRUMBLE_RESPAWN = 60 * 3;
class CrumblingBlock extends __WEBPACK_IMPORTED_MODULE_3__block__["b" /* SolidBlock */] {
    constructor(opts) {
        super(opts);
        this.crumbling = false;
        this.crumbleProgress = 1;
        this.yv = 0;
        this.startingX = this.x;
        this.startingY = this.y;
    }
    handleIntersect(sprite, horizontal) {
        super.handleIntersect(sprite, horizontal);
        if (!this.crumbling && sprite.y + sprite.height === this.y && sprite instanceof __WEBPACK_IMPORTED_MODULE_0__player_player__["a" /* PlayerSprite */]) {
            this.crumbling = true;
            this.addTask(new __WEBPACK_IMPORTED_MODULE_1__engine_task__["a" /* Task */]({
                run: this.crumble,
                repeatEvery: CRUMBLE_FRAME_LENGTH,
            }));
        }
    }
    updateVisual() {
        this.texture = this.runtime.getAsset(`blocks/crumble/${this.crumbleProgress}`);
        this.height = this.texture.height / __WEBPACK_IMPORTED_MODULE_2__engine_sprites_imagesprite__["b" /* TEXTURE_SCALE */];
    }
    respawn() {
        this.x = this.startingX;
        this.y = this.startingY;
        this.crumbling = false;
        this.yv = 0;
        this.crumbleProgress = 1;
        this.solid = true;
        this.updateVisual();
    }
    crumble(task) {
        this.crumbleProgress++;
        this.updateVisual();
        if (this.crumbleProgress === CRUMBLE_FRAMES) {
            task.stop();
            this.solid = false;
            this.addTask(this.fall);
        }
    }
    fall(task) {
        const physicsResult = this.runBasicPhysics(0, this.yv, {
            collision: false,
        });
        this.yv = physicsResult.yv;
        if (this.y >= this.runtime.canvas.height) {
            task.stop();
            this.addTask(new __WEBPACK_IMPORTED_MODULE_1__engine_task__["a" /* Task */]({
                run: this.respawn,
                delay: CRUMBLE_RESPAWN,
            }));
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CrumblingBlock;



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__blockswitch__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__engine_vector__ = __webpack_require__(1);




class BlockSwitchSpawnerBlock extends __WEBPACK_IMPORTED_MODULE_0__block__["b" /* SolidBlock */] {
    constructor(opts) {
        super(opts);
        const position = new __WEBPACK_IMPORTED_MODULE_3__engine_vector__["a" /* Vector */](this.position);
        position.y -= __WEBPACK_IMPORTED_MODULE_2__config__["a" /* BLOCK_HEIGHT */];
        new __WEBPACK_IMPORTED_MODULE_1__blockswitch__["a" /* BlockSwitch */]({
            texture: this.runtime.getAsset("blocks/button/red"),
            position,
            spawner: this,
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BlockSwitchSpawnerBlock;



/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__blocks_block__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__blocks_falling__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__engine_sprites_imagesprite__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__engine_vector__ = __webpack_require__(1);




class BlockSwitch extends __WEBPACK_IMPORTED_MODULE_0__blocks_block__["a" /* Block */] {
    constructor(opts) {
        super(opts);
        this.spawner = opts.spawner;
        this.startingPosition = new __WEBPACK_IMPORTED_MODULE_3__engine_vector__["a" /* Vector */](this.position);
        this.groundedCenterAlign();
        this.addTask(this.run);
    }
    trigger() {
        const allSprites = this.runtime.sprites.sprites;
        const fallingBlocks = allSprites.filter((sprite) => sprite instanceof __WEBPACK_IMPORTED_MODULE_1__blocks_falling__["a" /* FallingBlock */]);
        for (const sprite of fallingBlocks) {
            sprite.trigger();
        }
        this.spawner.texture = this.runtime.getAsset("blocks/u2");
        this.texture = this.runtime.getAsset("blocks/button/on");
        this.height = this.texture.height / __WEBPACK_IMPORTED_MODULE_2__engine_sprites_imagesprite__["b" /* TEXTURE_SCALE */];
        this.position = this.startingPosition;
        this.groundedCenterAlign();
    }
    run(task) {
        if (this.intersects(this.runtime.player)) {
            this.trigger();
            task.stop();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BlockSwitch;



/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__engine_sprite__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__engine_task__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__engine_utils__ = __webpack_require__(5);



const UPDATE_EVERY = 6;
const ANIMATION_LENGTH = 10;
class BackgroundStarSprite extends __WEBPACK_IMPORTED_MODULE_0__engine_sprite__["a" /* AbstractSprite */] {
    constructor(opts) {
        super(opts);
        this.progress = 0;
        this.direction = 1;
        this.animate = this.animate.bind(this);
        this.addTask(new __WEBPACK_IMPORTED_MODULE_1__engine_task__["a" /* Task */]({
            repeatEvery: UPDATE_EVERY,
            run: this.animate,
        }));
    }
    animate() {
        this.progress += this.direction;
        if (this.progress === 0 && this.direction === -1) {
            this.direction = 1;
            this.progress--;
        }
        if (this.progress === ANIMATION_LENGTH && this.direction === 1) {
            this.direction = -1;
            this.progress++;
        }
    }
    clamp(x, min, max) {
        if (x < min) {
            return min;
        }
        else if (x > max) {
            return max;
        }
        else {
            return x;
        }
    }
    render(ctx) {
        const animationProgress = this.clamp(this.progress / ANIMATION_LENGTH, 0, 1);
        const color = Math.floor(255 * animationProgress);
        const hexCode = Object(__WEBPACK_IMPORTED_MODULE_2__engine_utils__["d" /* toHex */])(color);
        ctx.fillStyle = `#${hexCode}${hexCode}${hexCode}`;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BackgroundStarSprite;



/***/ })
/******/ ]);
