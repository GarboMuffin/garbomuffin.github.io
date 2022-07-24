import { AbstractSprite, ISpriteOptions } from "../../../engine/sprite";
import { Task } from "../../../engine/task";
import { toHex } from "../../../engine/utils";
import { Vector } from "../../../engine/vector";
import { scratchCoordinate } from "../../../utils";
import { Nightlight } from "../../game";
import { INightlightTextSpriteOptions } from "../text/NightlightTextSprite";
import { StaticNightlightTextSprite } from "../text/StaticNightlightTextSprite";
import { EndingSceneSprite } from "./EndingSceneSprite";
import { EndingThumbSprite } from "./EndingThumbSprite";

const INITIAL_DELAY = 60;

const BACKGROUND_PHASE_LENGTH = 300;
// #2FB3FF
const BACKGROUND_COLOR_RED = 0x2F;
const BACKGROUND_COLOR_GREEN = 0xB3;
const BACKGROUND_COLOR_BLUE = 0xFF;

const TEXT_PHASE_LINE_DELAY = 120;
const TEXT: INightlightTextSpriteOptions[] = [
  {
    text: "with noss, the cube of darkness' defeat,",
    position: scratchCoordinate(-160, 164),
  },
  {
    text: "the world was relieved to finally see the night pass.",
    position: scratchCoordinate(-212, 140),
  },
  {
    text: "our little hero is just taking in the scenery...",
    position: scratchCoordinate(-192, 116),
  },
];

const FADE_OUT_PHASE_DELAY = 600;

export class EndingSprite extends AbstractSprite {
  public runtime!: Nightlight;
  public endingScene!: EndingSceneSprite;

  constructor(options: ISpriteOptions) {
    super(options);

    /**
     * Well, that's the end.
     */

    // get rid of the player
    this.runtime.player.destroy();

    this.addTask(new Task({
      run: (task) => this.backgroundPhase(task),
      onend: () => this.startTextPhase(),
      delay: INITIAL_DELAY,
      repeatMax: BACKGROUND_PHASE_LENGTH,
      repeatEvery: 0,
    }));
  }

  private backgroundPhase(task: Task) {
    const progress = task.repeatCount / task.repeatMax;

    const r = Math.floor(BACKGROUND_COLOR_RED * progress);
    const g = Math.floor(BACKGROUND_COLOR_GREEN * progress);
    const b = Math.floor(BACKGROUND_COLOR_BLUE * progress);

    const hex = (val: number) => {
      const hexadecimal = toHex(val);
      if (hexadecimal.length === 1) {
        return "0" + hexadecimal;
      }
      return hexadecimal;
    };

    this.runtime.background = `#${hex(r)}${hex(g)}${hex(b)}`;
  }

  private startTextPhase() {
    this.addTask(new Task({
      run: () => this.runtime.setBackgroundMusic([this.runtime.getSound("music/exploration")]),
      delay: TEXT_PHASE_LINE_DELAY,
    }));

    for (let i = 0; i < TEXT.length; i++) {
      const delay = (i + 1) * TEXT_PHASE_LINE_DELAY;
      const opts = TEXT[i];
      this.addTask(new Task({
        run: () => this.displayText(opts),
        delay,
      }));
    }

    this.addTask(new Task({
      run: () => this.spawnEndScene(),
      delay: (TEXT.length + 1) * TEXT_PHASE_LINE_DELAY,
    }));
  }

  private displayText(opts: INightlightTextSpriteOptions) {
    new StaticNightlightTextSprite(opts);
    this.runtime.updateStatic();
  }

  private spawnEndScene() {
    const image = this.runtime.getImage("end/scene");
    const x = -image.width * 2;
    const y = this.runtime.canvas.height;
    this.endingScene = new EndingSceneSprite(this, {
      position: new Vector(x, y),
      width: image.width * 8,
      height: image.height * 8,
      texture: image,
    });
  }

  public sceneMoveEnd() {
    this.addTask(new Task({
      run: () => this.goodbye(),
      delay: FADE_OUT_PHASE_DELAY,
    }));
  }

  private goodbye() {
    new EndingThumbSprite(this, {
      texture: this.runtime.getImage("thumb"),
      position: new Vector(0, 0),
    });
  }

  public render() {
    // this sprite doesn't do rendering, it just handles running some things for the ending
  }
}
