import { blockMap } from "../blockmap";
import * as config from "../config";
import { GameRuntime } from "../engine/runtime";
import { GameState } from "../engine/state";
import { TBackground, TSound } from "../engine/types";
import { Vector } from "../engine/vector";
import { Vector2D } from "../engine/vector2d";
import { Level, TSpawnType } from "../level";
import { getContinueCodeForLevel } from "../levelcode";
import { clone, getElementById, getRandomInt } from "../utils";
import { getLevels } from "./levels";
import { Block, IBlockOptions } from "./sprites/blocks/block";
import { FinalBoss } from "./sprites/bosses/final/finalboss";
import { NossBoss } from "./sprites/bosses/noss/noss";
import { SwordBoss } from "./sprites/bosses/sword/sword";
import { JumpLight } from "./sprites/jumplight";
import { PauseSprite } from "./sprites/pause/PauseSprite";
import { PlayerSprite } from "./sprites/player/player";
import { BackgroundStarsSprite } from "./sprites/stars";
import { StaticNightlightTextSprite } from "./sprites/text/StaticNightlightTextSprite";
import { ZIndexes } from "./sprites/zindex";

const SPOTLIGHT_SIZE = 75;
const TOTAL_BACKGROUND_STARS = 100;

export class Nightlight extends GameRuntime {
  public level: number = 0;
  public levelData: string = "";
  public levels: Level[] = [];
  public player!: PlayerSprite;
  public backgroundStars!: BackgroundStarsSprite;
  public background: TBackground = "black";
  public backgroundMusic: TSound[] = [];
  public darkLevel: boolean = false;
  public ordereredBlocks: Array<Block | undefined> = [];
  public blocks: Block[] = [];
  public playerSpawn!: TSpawnType;
  public playState: GameState = this.defaultState;
  public pauseState: GameState = new GameState();
  public levelCode!: string;
  public castleBackground!: CanvasPattern;

  constructor() {
    super(getElementById("canvas"));

    (getElementById<HTMLInputElement>("volume")).oninput = (e) => {
      const volume = Number((e.target as HTMLInputElement).value);
      this.updateVolume(volume);
    };
    this.updateVolume(Number(getElementById<HTMLInputElement>("volume").value));

    (window as any).runtime = this;
  }

  updateVolume(volume: number) {
    this.volume = volume / 100;
  }

  //
  // Utilities and Init
  //

  public setBackgroundMusic(music: TSound[]) {
    // for (const sound of this.backgroundMusic) {
    //   this.stopSound(sound);
    //   sound.loop = false;
    //   sound.onended = () => {};
    // }

    // this.backgroundMusic = music;
    // for (const sound of music) {
    //   sound.onended = () => this.nextBackgroundMusic();
    // }
    // if (music.length > 0) {
    //   this.playSound(music[0]);
    // }
  }

  private nextBackgroundMusic() {
    if (this.backgroundMusic.length > 1) {
      this.backgroundMusic.shift();
    }
    this.playSound(this.backgroundMusic[0]);
  }

  private createPlayer() {
    this.player = new PlayerSprite({
      texture: this.getImage("player/idle"),
      position: new Vector(0, 0, ZIndexes.Player),
      width: config.BLOCK_WIDTH,
      height: config.BLOCK_HEIGHT,
      persistent: true,
    });
  }

  private createStarBackground() {
    const positions = [];
    for (let i = 0; i < TOTAL_BACKGROUND_STARS; i++) {
      const x = getRandomInt(0, this.canvas.width);
      const y = getRandomInt(0, this.canvas.height);
      positions.push(new Vector2D(x, y));
    }

    this.backgroundStars = new BackgroundStarsSprite({
      position: new Vector(0, 0, ZIndexes.Stars),
      width: 2,
      height: 2,
      persistent: true,
    }, positions);
  }

  //
  // Overrides
  //

  public start(levels?: Level[]) {
    super.start();

    new PauseSprite({
      texture: this.getImage("pause"),
      position: new Vector(0, 0),
      persistent: true,
    });

    this.castleBackground = this.ctx.createPattern(this.getImage("brick"), "repeat")!;
    if (levels) {
      this.levels = levels;
    } else {
      this.levels = getLevels(this);
    }

    this.createPlayer();
    this.createStarBackground();
    this.renderLevel();
  }

  public render() {
    super.render();

    if (this.darkLevel) {
      // https://stackoverflow.com/a/6271865
      const {canvas: coverCanvas, ctx: coverCtx} = this.createCanvas();
      coverCtx.fillStyle = "black";
      this.resetCanvas(coverCtx, "black");
      coverCtx.globalCompositeOperation = "xor";

      const player = this.player;
      const centerX = player.x + (player.width / 2);
      const centerY = player.y + (player.height / 2);

      coverCtx.arc(centerX, centerY, SPOTLIGHT_SIZE, 0, 2 * Math.PI);
      coverCtx.fill();

      this.ctx.drawImage(coverCanvas, 0, 0);
    }
  }

  //
  // Levels
  //

  private destroyLevel() {
    const sprites = clone(this.sprites);
    for (const sprite of sprites) {
      if (!sprite.persistent) {
        sprite.destroy();
      }
    }
  }

  private createBlock(position: Vector, char: string, index: number) {
    const blockType = blockMap[char];

    if (typeof blockType === "undefined") {
      throw new Error(`Could not find block metadata for ${char}`);
    }

    const texture = this.getImage(blockType.texture);
    const spriteConstructor = blockType.type;

    if (!texture) {
      console.error(`Could not find block texture for ${blockType}, skipping`);
      return;
    }

    const opts: IBlockOptions = {
      width: texture.width,
      height: texture.height,
      position,
      texture,
      levelIndex: index,
    };

    const block = new spriteConstructor(opts);
    return block;
  }

  public renderLevel(d: number | Level = this.level) {
    this.destroyLevel();

    const level = typeof d === "object" ? d : this.levels[d];
    const levelData = level.levelData;

    this.levelData = levelData;

    let x = 0;
    let y = this.canvas.height - config.BLOCK_HEIGHT;

    for (let i = 0; i < levelData.length; i++) {
      const char = levelData[i];

      if (char !== ".") {
        const position = new Vector(x, y);
        this.createBlock(position, char, i);
      }

      x += config.BLOCK_WIDTH;
      if (x >= this.canvas.width) {
        x = 0;
        y -= config.BLOCK_HEIGHT;
      }
    }

    // Level metadata

    // if a level changes the background
    if (level.background) {
      if (level.background === "castle") {
        level.background = this.castleBackground;
      }
      this.background = level.background;
    }

    // if a level has new background music
    if (level.backgroundMusic) {
      // this.setBackgroundMusic(level.backgroundMusic.map((i) => this.getSound(i)));
    }

    // if a level has handlers
    if (level.handlers) {
      for (const handler of level.handlers) {
        handler(this);
      }
    }

    // if a level has a boss
    if (typeof level.boss !== "undefined" && level.boss.type !== "") {
      if (level.boss.type === "sword") {
        new SwordBoss({
          texture: this.getImage("boss/sword/sword"),
          position: new Vector(0, 0),
        }, level.boss);
      } else if (level.boss.type === "noss1") {
        new NossBoss({
          texture: this.getImage("boss/noss/noss"),
          position: new Vector(0, 0),
        });
      } else if (level.boss.type === "noss2") {
        new FinalBoss({
          texture: this.getImage("boss/noss/noss"),
          position: new Vector(0, 0),
        });
      } else {
        throw new Error("Unknown boss");
      }
    }

    if (typeof level.stars !== "undefined") {
      this.backgroundStars.visible = level.stars;
    }

    // spawn text
    if (level.text) {
      for (const textOption of level.text) {
        new StaticNightlightTextSprite(textOption);
      }
    }

    // dark rooms
    this.darkLevel = !!level.dark;

    // spawn things that you can jump on
    if (level.jumpLights) {
      this.spawnJumpLights(level.jumpLights);
    }

    // custom spawn handling
    if (level.spawn) {
      this.playerSpawn = level.spawn;
    } else {
      this.playerSpawn = {
        type: "default",
      };
    }

    // render static things that were just created
    this.updateStatic();

    this.levelCode = getContinueCodeForLevel(this.level);

    this.player.reset();
  }

  private spawnJumpLights(positions: Vector[]) {
    const texture = this.getImage("jumplight");

    for (const position of positions) {
      new JumpLight({
        texture,
        position,
      });
    }
  }

  public onsetvolume(volume: number) {
    getElementById("volume-level")!.textContent = Math.round(volume * 100) + "%";
  }
}
