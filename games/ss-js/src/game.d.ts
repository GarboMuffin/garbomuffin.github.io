interface Tile {
  texture: HTMLImageElement | string,
  tick?(diff?: number): boolean | void,
  // type?: string,
  init?(): void,
  destroy?(): void,
  animation?: AnimationOptions,
  solid?: boolean,
  afterCreation?(): void,
}

interface SpriteOptions extends Tile {
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  rotation?: number,
  visible?: boolean,
  render?(): void,
}

interface AnimationOptions {
  length: number,
  frames: string[],
  condition?(): boolean,
}

interface ProjectileOptions extends SpriteOptions {
  dir: number
}
