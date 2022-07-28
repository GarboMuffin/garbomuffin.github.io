class Container {
  public constructor() {
    containers.push(this);
  }

  protected children: RenderedSprite[] = []

  public push(...args) {
    return this.children.push.apply(this.children, args);
  }
  public splice(...args) {
    return this.children.splice.apply(this.children, args);
  }
  public indexOf(...args) {
    return this.children.indexOf.apply(this.children, args);
  }
  public sort(compareFunction = spriteSort) {
    return this.children.sort(compareFunction);
  }
  public get length() {
    return this.children.length;
  }
  public get(id) {
    return this.children[id];
  }

  public *[Symbol.iterator]() {
    for (var sprite of this.children) {
      yield sprite;
    }
  }
}
