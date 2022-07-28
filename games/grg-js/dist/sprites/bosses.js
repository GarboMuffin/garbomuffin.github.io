/// BOSSES
class BossRoutine {
    constructor(options) {
        this.update = options.update;
        if (typeof options.init === "function")
            this.init = options.init;
        if (typeof options.onend === "function")
            this.onend = options.onend;
    }
}
class Boss extends Enemy {
    constructor() {
        super(...arguments);
        this.routines = [];
        this.currentRoutine = null;
        this.health = 10; // or something
        this.playerDamage = 5; // or something
        this.state = 0;
        this.yv = 0;
        // public static particle = BossParticle;
    }
    update() {
        if (this.state === 0) {
            if (this.health < 20) {
                this.health++;
            }
            else {
                console.log("[boss] health increase finished...");
                this.state = 1;
            }
        }
        else {
            if (this.bossUpdate)
                this.bossUpdate();
            // routines
            if (!this.currentRoutine && getRandomInt(1, BOSS_ROUTINE_CHANCE) === 1) {
                var random = getRandomInt(0, this.routines.length - 1);
                var routine = this.routines[random];
                this.startRoutine(routine);
            }
        }
    }
    // since a lot of bosses use some form of yvelocity (gravity)
    // in their routines so to prevent a large amount of code
    // duplication this is just a generic thing that does all of that
    _yvelocity() {
        this.y -= this.yv;
        this.yv -= GRAVITY;
        if (this.touchingSolidBlock()) {
            var increment = this.yv > 0 ? -1 : 1;
            while (this.touchingSolidBlock()) {
                this.y -= increment;
            }
            return true;
        }
        return false;
    }
    // just resets variables
    resetRoutine() {
        this.yv = 0;
    }
    startRoutine(routine) {
        this.bossUpdate = routine.update;
        this.resetRoutine();
        if (routine.init)
            routine.init(this);
        this.currentRoutine = routine;
    }
    endRoutine() {
        if (typeof this.currentRoutine.onend === "function") {
            this.currentRoutine.onend.call(this);
        }
        this.currentRoutine = null;
        this.bossUpdate = null;
    }
}
class TrollBoss extends Boss {
    constructor() {
        super(...arguments);
        this.routines = [
            new BossRoutine({
                init: function (sprite) {
                    sprite.yv = 13.35 / 2;
                },
                update: this._jump,
                onend: this._end,
            }),
            new BossRoutine({
                update: this._dash,
                onend: this._end,
            }),
        ];
        this.velocity = false;
        this.direction = true;
        // public static readonly x1 = 0
        // public static readonly x2 = 314
        // protected _x = TrollBoss.x2;
        // protected _y = 172;
    }
    _jump() {
        if (this._yvelocity()) {
            return this.endRoutine();
        }
        if (this.direction)
            this.x -= 4;
        else
            this.x += 4;
    }
    _dash() {
        if ((this.direction && this.x <= 44) || (!this.direction && this.x >= 400)) {
            return this.endRoutine();
        }
        if (this.direction)
            this.x -= 4;
        else
            this.x += 4;
    }
    _end() {
        this.direction = !this.direction;
    }
}
