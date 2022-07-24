import { getSearchParam } from "./utils";

/*
 * Config values that are global to the whole game
 * Options to one specific thing are in its file
 */

export const BLOCK_HEIGHT = 16;
export const BLOCK_WIDTH = 16;

export const LEVEL_HEIGHT = 23;
export const LEVEL_WIDTH = 30;

export const GRAVITY = 0.195;
export const FRICTION = 0.75;

export const CHEATS = getSearchParam("cheats") === "on";
