import { BlackBlock } from "./game/sprites/blocks/black";
import { Block, PseudoSolidBlock, StaticSolidBlock } from "./game/sprites/blocks/block";
import { AquaOrangeBlockSwitchSpawner, RedGreenBlockSwitchSpawner } from "./game/sprites/blocks/blockswitchspawner";
import { AboveLevelUpCoinSpawnerBlock, BelowLevelUpCoinSpawnerBlock } from "./game/sprites/blocks/coinspawner";
import { CastleCornerBlock, RotatedCornerBlock, SolidRotatedCornerBlock } from "./game/sprites/blocks/corner";
import { CrumblingBlock } from "./game/sprites/blocks/crumble";
// tslint:disable-next-line
import { AquaOrangeInstantFallingBlock, AquaOrangeVibratingFallingBlock, RedGreenInstantFallingBlock, RedGreenVibratingFallingBlock } from "./game/sprites/blocks/falling";
import { GrassBlock } from "./game/sprites/blocks/grass";
// tslint:disable-next-line
import { DisabledLightBlock1, DisabledLightBlock2, DisabledLightBlock3, DisabledLightBlock4, EnabledLightBlock1, EnabledLightBlock2, EnabledLightBlock3, EnabledLightBlock4 } from "./game/sprites/blocks/lightblock";
import { RedGreenLightSwitchBlock } from "./game/sprites/blocks/lightswitch";
import { OneWayBlock } from "./game/sprites/blocks/oneway";
import { DownSpikeBlock, LeftSpikeBlock, RightSpikeBlock, UpSpikeBlock } from "./game/sprites/blocks/spike";
import { TallGrassBlock } from "./game/sprites/blocks/tallgrass";

/*
 * A map of characters and the texture and class
 * they correspond to
 */

interface IBlockMap {
  [s: string]: IBlockMetaData;
}

interface IBlockMetaData {
  texture: string;
  type: typeof Block;
}

function special(type: typeof Block, texture: string) {
  return {
    type, texture,
  };
}

function solid(texture: string) {
  return {
    type: StaticSolidBlock,
    texture,
  };
}

export const blockMap: IBlockMap = {
  "a": special(BlackBlock, "blocks/a"),
  "b": solid("blocks/b"),
  "c": solid("blocks/c"),
  "d": solid("blocks/d"),
  "e": solid("blocks/e"),
  "f": solid("blocks/f"),
  "g": solid("blocks/g"),
  "h": solid("blocks/h"),
  "i": solid("blocks/i"),
  "j": special(GrassBlock, "blocks/j"),
  "k": special(GrassBlock, "blocks/k"),
  "l": special(GrassBlock, "blocks/l"),
  "m": special(RotatedCornerBlock, "blocks/m"),
  "]": special(SolidRotatedCornerBlock, "blocks/m"),
  "n": special(AboveLevelUpCoinSpawnerBlock, "blocks/n"),
  "o": special(UpSpikeBlock, "blocks/spikes/up"),
  "p": special(TallGrassBlock, "blocks/p"),
  "q": special(TallGrassBlock, "blocks/q"),
  "r": solid("blocks/r"),
  "s": solid("blocks/s"),
  "t": special(CrumblingBlock, "blocks/crumble/1"),
  "u": special(RedGreenBlockSwitchSpawner, "blocks/button/redgreen/spawner"),
  "U": special(AquaOrangeBlockSwitchSpawner, "blocks/button/aquaorange/spawner"),
  "v": solid("blocks/v"),
  "w": special(RedGreenVibratingFallingBlock, "blocks/w"),
  "W": special(AquaOrangeVibratingFallingBlock, "blocks/capitalw"),
  "[": special(RedGreenInstantFallingBlock, "blocks/w"),
  "{": special(AquaOrangeInstantFallingBlock, "blocks/capitalw"),
  "x": special(RedGreenLightSwitchBlock, "blocks/lightbutton/1"),
  "y": special(DisabledLightBlock1, "blocks/editory"),
  "z": special(EnabledLightBlock1, "blocks/z"),
  "Y": special(DisabledLightBlock2, "blocks/capitaly"),
  "Z": special(EnabledLightBlock2, "blocks/capitalz"),
  "O": special(DisabledLightBlock3, "blocks/capitalo"),
  "P": special(EnabledLightBlock3, "blocks/capitalp"),
  "Q": special(EnabledLightBlock4, "blocks/capitalq"),
  "R": special(DisabledLightBlock4, "blocks/capitalr"),

  // Post sword
  "1": solid("blocks/1"),
  "2": solid("blocks/2"),
  "3": solid("blocks/3"),
  "4": solid("blocks/4"),
  "5": solid("blocks/5"),
  "6": solid("blocks/6"),
  "7": solid("blocks/7"),
  "8": solid("blocks/8"),
  "9": special(RotatedCornerBlock, "blocks/9"),
  "@": special(BelowLevelUpCoinSpawnerBlock, "blocks/n"),
  "!": special(OneWayBlock, "blocks/!"),
  "#": special(LeftSpikeBlock, "blocks/spikes/left"),
  "$": special(RightSpikeBlock, "blocks/spikes/right"),
  "%": special(DownSpikeBlock, "blocks/spikes/down"),

  // Castle
  "^": special(PseudoSolidBlock, "blocks/caret"),
  "&": solid("blocks/ampersand"),
  "*": solid("blocks/asterisk"),
  "(": solid("blocks/("),
  ")": solid("blocks/)"),
  "-": solid("blocks/-"),
  "_": solid("blocks/underscore"),
  "=": solid("blocks/="),
  "+": solid("blocks/+"),
  "`": special(CastleCornerBlock, "blocks/grave"),
  "S": solid("blocks/capitals"),
  "T": solid("blocks/capitalt"),
  "V": solid("blocks/capitalv"),

  "}": solid("blocks/closingcurlybracket"),
  "|": solid("blocks/pipe"),
  "'": solid("blocks/singlequote"),

  // New blocks!
  "A": solid("blocks/capitala"),
  "B": solid("blocks/capitalb"),
  "C": solid("blocks/capitalc"),
  "D": solid("blocks/capitald"),
  "E": solid("blocks/capitale"),
  "F": solid("blocks/capitalf"),
  "G": solid("blocks/capitalg"),
  "H": solid("blocks/capitalh"),
  "I": special(RotatedCornerBlock, "blocks/capitali"),
  "J": solid("blocks/capitalj"),
  "K": solid("blocks/capitalk"),
  "L": solid("blocks/capitall"),
  "M": solid("blocks/capitalm"),
  "N": solid("blocks/capitaln"),

  // these are all of the remaining characters...
  // yeah that's not many
  // idea: use one of these characters to indicate that this is a 2 letter wide block, maybe?
  // "\"": solid(""),
  // ",": solid(""),
  // "/": solid(""),
  // "?": solid(""),
  // ">": solid(""),
  // "<": solid(""),
  // "~": solid(""),
  // " ": solid(""),
  // "\\": solid(""),
};
