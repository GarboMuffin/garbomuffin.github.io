import { Vector } from "../../engine/vector";
import { Nightlight } from "../game";
import { Block, IBlockOptions } from "./blocks/block";
import { BlockSwitchSpawnerBlock } from "./blocks/blockswitchspawner";
import { AbstractFallingBlock as FallingBlock } from "./blocks/falling";

/*
 * The switch that makes the FallingBlocks fall
 *
 * Spawned by a BlockSwitchSpawnerBlock as this is not actually part of the level code, only the spawner
 */

export interface IBlockSwitchOptions extends IBlockOptions {
  spawner: BlockSwitchSpawnerBlock;
  group: number;
  textureFolder: string;
}

export class BlockSwitch extends Block {
  private spawner: BlockSwitchSpawnerBlock;
  private startingPosition: Vector;
  private triggered: boolean = false;
  public runtime!: Nightlight;
  public group: number;
  public textureFolder: string;

  constructor(opts: IBlockSwitchOptions) {
    super(opts);
    this.group = opts.group;
    this.textureFolder = opts.textureFolder;
    this.spawner = opts.spawner;
    this.startingPosition = new Vector(this.position);
    this.floorAlign();
    this.addTask(() => this.run());
    this.spawner.texture = this.getImage("spawner");
    this.texture = this.getImage("button");
  }

  private getImage(str: string) {
    return this.runtime.getImage(`blocks/button/${this.textureFolder}/${str}`);
  }

  get needsReinstantiate() {
    return true;
  }

  get type() {
    return BlockSwitch;
  }

  private trigger() {
    const allSprites = this.runtime.sprites;
    const fallingBlocks = allSprites
      .filter((sprite) => sprite instanceof FallingBlock)
      .filter((sprite) => (sprite as FallingBlock).group === this.group) as FallingBlock[];
    for (const sprite of fallingBlocks) {
      sprite.trigger();
    }

    this.spawner.texture = this.getImage("spawner2");
    this.texture = this.getImage("button2");
    this.updateDimensions();
    this.position = new Vector(this.startingPosition);
    this.floorAlign();
    this.triggered = true;

    this.runtime.playSound("blocks/button");
  }

  private run() {
    if (!this.triggered && this.intersects(this.runtime.player)) {
      this.trigger();
    }
  }
}
