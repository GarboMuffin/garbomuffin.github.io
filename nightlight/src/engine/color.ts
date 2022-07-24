import { toHex } from "./utils";

/*
 * Colors
 *
 * WIP and unfinished
 */

export abstract class Color {
  public abstract toString(): string;
}

export class RGBColor {
  public red: number;
  public green: number;
  public blue: number;

  constructor(r: number = 0, g: number = 0, b: number = 0) {
    this.red = r;
    this.green = g;
    this.blue = b;
  }

  public toString() {
    return `#${toHex(this.red)}${toHex(this.green)}${toHex(this.red)}`;
  }
}

export class NamedColor {
  private color: string;

  constructor(color: string) {
    this.color = color;
  }

  public toString() {
    return this.color;
  }
}
