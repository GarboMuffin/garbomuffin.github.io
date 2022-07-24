import { TBackground } from "./engine/types";
import { Vector } from "./engine/vector";
import { Nightlight } from "./game/game";
import { ISwordOptions } from "./game/sprites/bosses/sword/sword";
import { INightlightTextSpriteOptions } from "./game/sprites/text/NightlightTextSprite";

export type THandler = (game: Nightlight) => void;

export interface IRangeSpawnType {
  type: "range";
  minX: number;
  maxX: number;
  requireSolid?: boolean;
}
export interface IRandomSpawnType {
  type: "random";
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
export interface IPointSpawnType {
  type: "point";
  x: number;
  y: number;
}
export interface IDefaultSpawnType {
  type: "default";
}
export type TSpawnType = IRandomSpawnType | IPointSpawnType | IDefaultSpawnType | IRangeSpawnType;

export interface ISwordBossType extends ISwordOptions {
  type: "sword";
}
export interface INoss1BossType {
  type: "noss1";
}
export interface INoss2BossType {
  type: "noss2";
}
export interface INoBossType {
  type: "";
}
export type TBossType = ISwordBossType | INoss1BossType | INoss2BossType | INoBossType;

export interface Level {
  levelData: string;
  background?: TBackground;
  backgroundMusic?: string[];
  handlers?: THandler[];
  dark?: boolean;
  text?: INightlightTextSpriteOptions[];
  jumpLights?: Vector[];
  spawn?: TSpawnType;
  stars?: boolean;
  boss?: TBossType;
}
