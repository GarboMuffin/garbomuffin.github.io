import { LEVEL_HEIGHT, LEVEL_WIDTH } from "./config";
import { Level } from "./level";
import { getRandomInt } from "./utils";

export const LEVEL_CODE_LENGTH = LEVEL_HEIGHT * LEVEL_WIDTH;

export function getLevelForCode(str: string): Level {
  const isJson = str.startsWith("{");
  if (isJson) {
    try {
      var json = JSON.parse(str);
    } catch (e) {
      throw new Error("Invalid JSON input");
    }
    return getJsonLevel(json);
  } else {
    return getStringLevel(str);
  }
}

function getJsonLevel(json: any): Level {
  if (typeof json.levelData === "undefined" || json.levelData.length !== LEVEL_CODE_LENGTH) {
    throw new Error("Invalid level data in JSON input");
  }
  if (typeof json.dark === "undefined") {
    json.dark = false;
  }
  if (typeof json.stars === "undefined") {
    json.stars = true;
  }
  if (typeof json.background === "undefined") {
    json.background = "black";
  }
  return json;
}

function getStringLevel(str: string): Level {
  if (str.length !== LEVEL_CODE_LENGTH) {
    throw new Error(`Invalid input`);
  }

  return {
    levelData: str,
    stars: true,
    dark: false,
    background: "black",
    backgroundMusic: ["music/exploration"],
  };
}

export function getLevelForContinueCode(code: string): number {
  if (code.length !== 8) {
    throw new Error("Invalid input");
  }
  if (Math.floor(+code) !== +code) {
    throw new Error("Invalid input");
  }
  const level = +(code[1] + code[4]);
  if (level < 0) {
    throw new Error("Invalid input");
  }
  if (!isFinite(level)) {
    throw new Error("Invalid input");
  }
  return level;
}

export function getContinueCodeForLevel(nlevel: number) {
  let level = nlevel.toString();
  if (level.length === 1) {
    level = "0" + level;
  }
  let result = "";
  result += getRandomInt(0, 9);
  result += level[0];
  result += getRandomInt(0, 9);
  result += getRandomInt(0, 9);
  result += level[1];
  result += getRandomInt(0, 9);
  result += getRandomInt(0, 9);
  result += getRandomInt(0, 9);
  return result;
}
