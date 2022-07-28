/// <reference path="game.d.ts" />

class Container {
  /**
   * Creates an instance of Container.
   * 
   * @memberOf Container
   */
  public constructor() {
    this.children = [];
    containers.push(this);
  }

  protected children: Sprite[]

  public push(...args): number {
    return this.children.push.apply(this.children, arguments);
  }
  public add(sprite: Sprite): void {
    this.children.push(sprite);
  }
  public append(sprite: Sprite): void {
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
  public splice(...args): number | void {
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
  public indexOf(...args): number {
    return this.children.indexOf.apply(this.children, arguments)
  };

  public destroy(deleteChildren = true): void {
    if (deleteChildren) {
      while (this.children[0]) {
        this.children[0].destroy();
      }
    }
    containers.splice(containers.indexOf(this), 1);
  }

  public get length(): number {
    return this.children.length;
  }
  public get sprites(): Sprite[] {
    return this.children;
  }

  public *[Symbol.iterator]() {
    for (let sprite of this.children) {
      yield sprite;
    }
  }
}
