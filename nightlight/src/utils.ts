import { Vector } from "./engine/vector";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clones an array
// Allows you to use inplace methods on an array without changing the actual array
// (eg. sort)
export function clone<T>(array: T[]): T[] {
  let i = array.length;
  const result = [];
  while (i--) {
    result[i] = array[i];
  }
  return result;
}

// Converts Scratch coordinates to coordinates this game will understand
export function scratchCoordinate(x: number, y: number) {
  return new Vector(x + 236, (360 - y) - 184);
}

export function clamp(x: number, min: number, max: number) {
  if (x < min) {
    return min;
  } else if (x > max) {
    return max;
  } else {
    return x;
  }
}

// https://stackoverflow.com/a/6259536
export function splitToChunks(str: string, chunkSize: number): string[] {
  const chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.substring(i, i + chunkSize));
  }
  return chunks;
}

export function getElementById<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (el === null) {
    throw new Error("No element with id " + id);
  }
  return el as T;
}

export function getSearchParam(target: string): string | null {
  const allParams = location.search.substr(1).split("&");
  for (const param of allParams) {
    const name = param.substr(0, param.indexOf("="));
    const val = param.substr(param.indexOf("=") + 1);
    if (name === target) {
      return unescape(val);
    }
  }
  return null;
}

export function setSearchParam(name: string, newVal: string) {
  const map = new Map<string, string>();
  const allParams = location.search.substr(1).split("&");
  for (const param of allParams) {
    const k = param.substr(0, param.indexOf("="));
    const v = param.substr(param.indexOf("=") + 1);
    map.set(k, v);
  }
  map.set(name, escape(newVal));

  let newSearch = "";
  for (const key of map.keys()) {
    if (key === "") {
      continue;
    }
    const val = map.get(key);
    if (val === "") {
      continue;
    }
    const divider = newSearch.length === 0 ? "?" : "&";
    newSearch += `${divider}${key}=${val}`;
  }
  history.pushState({}, "", newSearch);
}
