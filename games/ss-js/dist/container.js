/// <reference path="game.d.ts" />
class Container {
    /**
     * Creates an instance of Container.
     *
     * @memberOf Container
     */
    constructor() {
        this.children = [];
        containers.push(this);
    }
    push(...args) {
        return this.children.push.apply(this.children, arguments);
    }
    add(sprite) {
        this.children.push(sprite);
    }
    append(sprite) {
        this.children.push(sprite);
    }
    /**
     * Functions exactly the same as Array.prototype.splice
     *
     * @param {any} ...args Any amount of arguments that splice will accept
     * @returns {(number|void)}
     *
     * @memberOf Container
     */
    splice(...args) {
        return this.children.splice.apply(this.children, arguments);
    }
    /**
     * Functions exactly the same of Array.prototype.indexOf
     *
     * @param {any} ...args Any amount of arguments that indexOf accepts
     * @returns {number}
     *
     * @memberOf Container
     */
    indexOf(...args) {
        return this.children.indexOf.apply(this.children, arguments);
    }
    ;
    destroy(deleteChildren = true) {
        if (deleteChildren) {
            while (this.children[0]) {
                this.children[0].destroy();
            }
        }
        containers.splice(containers.indexOf(this), 1);
    }
    get length() {
        return this.children.length;
    }
    get sprites() {
        return this.children;
    }
    *[Symbol.iterator]() {
        for (let sprite of this.children) {
            yield sprite;
        }
    }
}
