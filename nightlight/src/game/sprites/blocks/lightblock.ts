import { Block, IBlockOptions } from "./block";

/*
 * A block that is toggled solid/not solid when a switch is hit.
 */

export enum LightBlockGroups {
  RedGreen = 0,
}

export abstract class LightBlock extends Block {
  public solid: boolean = true;
  public group: number = 0;
  public litTexture: string;
  public darkTexture: string;

  constructor(options: IBlockOptions, group: number, lit: string, dark: string = "blocks/y") {
    super(options);
    this.litTexture = lit;
    this.darkTexture = dark;
    this.group = group;
  }

  protected setSolid(solid: boolean) {
    this.solid = solid;
    if (this.solid) {
      this.texture = this.runtime.getImage(this.litTexture);
    } else {
      this.texture = this.runtime.getImage(this.darkTexture);
    }
  }

  get needsReinstantiate() {
    return true;
  }

  public toggleSolid() {
    this.setSolid(!this.solid);
  }
}
export abstract class AbstractEnabledLightBlock extends LightBlock {
  constructor(options: IBlockOptions, group: number, lit: string, dark?: string) {
    super(options, group, lit, dark);
    this.setSolid(true);
  }
}
export abstract class AbstractDisabledLightBlock extends LightBlock {
  constructor(options: IBlockOptions, group: number, lit: string, dark?: string) {
    super(options, group, lit, dark);
    this.setSolid(false);
  }
}

export class EnabledLightBlock1 extends AbstractEnabledLightBlock {
  constructor(opts: IBlockOptions) {
    super(opts, LightBlockGroups.RedGreen, "blocks/z");
  }
  get type() { return EnabledLightBlock1; }
}
export class DisabledLightBlock1 extends AbstractDisabledLightBlock {
  constructor(opts: IBlockOptions) {
    super(opts, LightBlockGroups.RedGreen, "blocks/z");
  }
  get type() { return DisabledLightBlock1; }
}

export class EnabledLightBlock2 extends AbstractEnabledLightBlock {
  constructor(opts: IBlockOptions) {
    super(opts, LightBlockGroups.RedGreen, "blocks/capitalz");
  }
  get type() { return EnabledLightBlock2; }
}
export class DisabledLightBlock2 extends AbstractDisabledLightBlock {
  constructor(opts: IBlockOptions) {
    super(opts, LightBlockGroups.RedGreen, "blocks/capitalz");
  }
  get type() { return DisabledLightBlock2; }
}

export class EnabledLightBlock3 extends AbstractEnabledLightBlock {
  constructor(opts: IBlockOptions) {
    super(opts, LightBlockGroups.RedGreen, "blocks/capitalp");
  }
  get type() { return EnabledLightBlock3; }
}
export class DisabledLightBlock3 extends AbstractDisabledLightBlock {
  constructor(opts: IBlockOptions) {
    super(opts, LightBlockGroups.RedGreen, "blocks/capitalp");
  }
  get type() { return DisabledLightBlock3; }
}

export class EnabledLightBlock4 extends AbstractEnabledLightBlock {
  constructor(opts: IBlockOptions) {
    super(opts, LightBlockGroups.RedGreen, "blocks/capitalq");
  }
  get type() { return EnabledLightBlock4; }
}
export class DisabledLightBlock4 extends AbstractDisabledLightBlock {
  constructor(opts: IBlockOptions) {
    super(opts, LightBlockGroups.RedGreen, "blocks/capitalq");
  }
  get type() { return DisabledLightBlock4; }
}
