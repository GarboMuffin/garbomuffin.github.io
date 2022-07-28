class Container {
    constructor() {
        this.children = [];
        containers.push(this);
    }
    push(...args) {
        return this.children.push.apply(this.children, args);
    }
    splice(...args) {
        return this.children.splice.apply(this.children, args);
    }
    indexOf(...args) {
        return this.children.indexOf.apply(this.children, args);
    }
    sort(compareFunction = spriteSort) {
        return this.children.sort(compareFunction);
    }
    get length() {
        return this.children.length;
    }
    get(id) {
        return this.children[id];
    }
    *[Symbol.iterator]() {
        for (var sprite of this.children) {
            yield sprite;
        }
    }
}
