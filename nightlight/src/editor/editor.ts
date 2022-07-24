import { blockMap } from "../blockmap";
import { BLOCK_HEIGHT, LEVEL_HEIGHT, LEVEL_WIDTH } from "../config";
import { GameRuntime } from "../engine/runtime";
import { Vector } from "../engine/vector";
import { INightlightTextSpriteOptions } from "../game/sprites/text/NightlightTextSprite";
import { Level } from "../level";
import { getLevelForCode } from "../levelcode";
import { clone, getElementById, getSearchParam, splitToChunks, setSearchParam } from "../utils";
import { BLOCK_MAP_KEYS } from "./blockmapkeys";
import { LevelEditorMode } from "./mode";
import { BlockSelectorSprite } from "./sprites/BlockSelectorSprite";
import { BossSelectorSprite } from "./sprites/BossSelectorSprite";
import { JumpLightSelectorSprite } from "./sprites/JumpLightSelectorSprite";
import { LevelRenderer } from "./sprites/LevelRenderer";
import { PlayerSpawnSelectorSprite } from "./sprites/PlayerSpawnSelectorSprite";
import { TextSelectorSprite } from "./sprites/TextSelectorSprite";

export class NightlightLevelEditor extends GameRuntime {
  public levelData: string[][] = [];
  public jumpLights: Vector[] = [];
  public text: INightlightTextSpriteOptions[] = [];
  public blockOffsetY: number;
  public mode: LevelEditorMode = LevelEditorMode.Blocks;

  public levelRenderer!: LevelRenderer;
  public blockSelector!: BlockSelectorSprite;
  public jumpLightSelector!: JumpLightSelectorSprite;
  public bossSelector!: BossSelectorSprite;
  public playerSpawnSelector!: PlayerSpawnSelectorSprite;
  public textSelector!: TextSelectorSprite;

  public ui = {
    container: getElementById("level-editor-ui"),
    getJsonCodeButton: getElementById<HTMLButtonElement>("level-editor-get-json-code"),
    importCodeButton: getElementById<HTMLButtonElement>("level-editor-import-code"),
    openLevel: getElementById<HTMLButtonElement>("level-editor-open-level"),
    codeOutput: getElementById<HTMLTextAreaElement>("level-editor-code-output"),
    modeSelect: getElementById<HTMLSelectElement>("level-editor-option-mode"),
    welcome: {
      container: getElementById("level-editor-welcome"),
      content: getElementById("level-editor-welcome-content"),
      toggleButton: getElementById("level-editor-welcome-toggle"),
    },
    options: {
      dark: getElementById<HTMLInputElement>("level-editor-option-dark"),
      stars: getElementById<HTMLInputElement>("level-editor-option-stars"),
      background: getElementById<HTMLSelectElement>("level-editor-option-background"),
      music: getElementById<HTMLSelectElement>("level-editor-option-music"),
    },
    jumpLights: {
      container: getElementById("level-editor-mode-jump-lights"),
      snapToGrid: getElementById<HTMLInputElement>("level-editor-jump-lights-snap"),
    },
    blocks: {
      container: getElementById("level-editor-mode-block"),
      activeBlockImage: getElementById<HTMLImageElement>("level-editor-active-block-image"),
      gallery: getElementById("level-editor-block-gallery"),
      activeBlockDescription: getElementById("level-editor-active-block-description"),
    },
    text: {
      container: getElementById("level-editor-mode-text"),
      snapToGrid: getElementById<HTMLInputElement>("level-editor-text-snap"),
    },
    boss: {
      container: getElementById("level-editor-mode-boss"),
      selection: getElementById<HTMLSelectElement>("level-editor-boss-selection"),
      sword: {
        container: getElementById("level-editor-boss-sword"),
        blocksFromTop: getElementById<HTMLInputElement>("level-editor-boss-sword-blocks-from-top"),
        health: getElementById<HTMLInputElement>("level-editor-boss-sword-health"),
      },
      noss1: {
        container: getElementById("level-editor-boss-noss1"),
      },
      noss2: {
        container: getElementById("level-editor-boss-noss2"),
      },
    },
    playerSpawn: {
      container: getElementById("level-editor-mode-spawn"),
      spawnSelect: getElementById<HTMLSelectElement>("level-editor-spawn-select"),
      alwaysShow: getElementById<HTMLInputElement>("level-editor-spawn-always-show"),
      random: {
        container: getElementById("level-editor-spawn-random"),
        minX: getElementById<HTMLInputElement>("level-editor-spawn-random-min-x"),
        maxX: getElementById<HTMLInputElement>("level-editor-spawn-random-max-x"),
        minY: getElementById<HTMLInputElement>("level-editor-spawn-random-min-y"),
        maxY: getElementById<HTMLInputElement>("level-editor-spawn-random-max-y"),
      },
      range: {
        container: getElementById("level-editor-spawn-range"),
        minX: getElementById<HTMLInputElement>("level-editor-spawn-range-min-x"),
        maxX: getElementById<HTMLInputElement>("level-editor-spawn-range-max-x"),
        requireSolid: getElementById<HTMLInputElement>("level-editor-spawn-range-solid"),
      },
      point: {
        container: getElementById("level-editor-spawn-point"),
        x: getElementById<HTMLInputElement>("level-editor-spawn-point-x"),
        y: getElementById<HTMLInputElement>("level-editor-spawn-point-y"),
        select: getElementById<HTMLButtonElement>("level-editor-spawn-point-select"),
        gridAlign: getElementById<HTMLInputElement>("level-editor-spawn-point-select-align"),
      },
    },
  };

  constructor() {
    super(getElementById("canvas"));

    this.blockOffsetY = this.canvas.height % BLOCK_HEIGHT;
    this.background = "white";
    this.canvas.style.border = "1px solid black";
    this.ui.getJsonCodeButton.addEventListener("click", () => this.handleGetJsonCodeButton());
    this.ui.importCodeButton.addEventListener("click", () => this.handleImportLevelCodeButton());
    this.ui.openLevel.addEventListener("click", () => this.openLevelInNewTab());
    this.ui.modeSelect.addEventListener("change", () => this.setMode(+this.ui.modeSelect.value));
    getElementById("ingame-interface-container")!.style.display = "none";
    this.setMode(this.mode);

    this.ui.welcome.container.style.display = "block";
    this.ui.welcome.toggleButton.addEventListener("click", () => this.toggleWelcomeTextVisibility());
    this.setWelcomeTextVisibility(!!getSearchParam("welcome"));

    for (let y = 0; y < LEVEL_HEIGHT; y++) {
      const row = Array(LEVEL_WIDTH).fill(".");
      this.levelData.push(row);
    }

    (window as any).editor = this;
  }

  public start() {
    super.start();

    this.ui.container.style.display = "block";

    this.levelRenderer = new LevelRenderer({
      position: new Vector(0, 0),
    });
    this.levelRenderer.updateLevel();

    this.blockSelector = new BlockSelectorSprite({
      position: new Vector(0, 0),
      texture: this.getImage("blocks/a"), // overwritten
    });
    this.jumpLightSelector = new JumpLightSelectorSprite({
      position: new Vector(0, 0),
      texture: this.getImage("blackjumplight"),
    });
    this.bossSelector = new BossSelectorSprite({
      position: new Vector(0, 0),
      texture: this.getImage("boss/noss/noss"), // overwritten
    });
    this.playerSpawnSelector = new PlayerSpawnSelectorSprite({
      position: new Vector(0, 0),
      texture: this.getImage("player/idle"), // overwritten
    });
    this.textSelector = new TextSelectorSprite({
      position: new Vector(0, 0),
      texture: this.getImage("text/a"),
    });

    this.initGallery();

    const levelSearchParam = getSearchParam("level");
    if (levelSearchParam) {
      this.importLevelCode(levelSearchParam);
    }
  }

  private getJsonLevelCode(): Level {
    const dark = this.ui.options.dark.checked;
    const stars = this.ui.options.stars.checked;
    const background = this.ui.options.background.value;
    const music = this.ui.options.music.value.split(",");
    const boss = this.bossSelector.selection;
    const spawn = this.playerSpawnSelector.selection;
    const text = this.text;

    const levelData = clone(this.levelData);
    const code = levelData.reverse().map((s) => s.join("")).join("");

    return {
      levelData: code,
      dark,
      stars,
      background,
      jumpLights: this.jumpLights.length > 0 ? this.jumpLights : undefined,
      backgroundMusic: music,
      boss: boss,
      spawn,
      text: text.length > 0 ? this.text : undefined,
    };
  }

  private handleGetJsonCodeButton() {
    this.ui.codeOutput.value = JSON.stringify(this.getJsonLevelCode());
  }

  private handleImportLevelCodeButton() {
    const code = prompt("Enter the level code:");
    if (code === null) {
      return;
    }
    const levelDataBackup = this.levelData;
    try {
      this.importLevelCode(code);
    } catch (e) {
      alert(`Error: ${e.message}`);
      this.levelData = levelDataBackup;
      this.levelRenderer.updateLevel();
    }
  }

  private importLevelCode(str: string) {
    const level = getLevelForCode(str);

    this.ui.options.stars.checked = level.stars as boolean;
    this.ui.options.dark.checked = level.dark as boolean;
    this.ui.options.background.value = level.background as string;
    this.ui.options.music.value = (level.backgroundMusic || []).join(",");
    this.jumpLights = level.jumpLights || [];
    this.bossSelector.selection = level.boss;
    this.playerSpawnSelector.selection = level.spawn || {type: "default"};
    this.text = level.text || [];

    this.levelData = splitToChunks(level.levelData, LEVEL_WIDTH).map((i) => i.split("")).reverse();
    this.levelRenderer.updateLevel();
  }

  private handleGallerySelection(char: string) {
    this.blockSelector.setSelection(char);
  }

  private initGallery() {
    const getImage = (src: string) => {
      const link = document.createElement("a");
      link.href = "";
      link.className = "level-editor-gallery-item";
      link.onclick = () => false;

      const image = document.createElement("img");
      image.src = src;
      image.className = "level-editor-block-gallery-item";

      link.appendChild(image);
      return link;
    };

    for (const key of BLOCK_MAP_KEYS) {
      if (key === "empty") {
        const el = document.createElement("div");
        el.className = "level-editor-gallery-item";
        this.ui.blocks.gallery.appendChild(el);
        continue;
      }
      const val = blockMap[key];
      const texture = this.getImage(val.texture);
      const image = getImage(texture.src);
      image.addEventListener("click", () => this.handleGallerySelection(key));
      this.ui.blocks.gallery.appendChild(image);
    }
  }

  public setMode(m: LevelEditorMode) {
    this.mode = m;
    this.ui.blocks.container.style.display = m === LevelEditorMode.Blocks ? "block" : "";
    this.ui.jumpLights.container.style.display = m === LevelEditorMode.JumpLights ? "block" : "";
    this.ui.text.container.style.display = m === LevelEditorMode.Text ? "block" : "";
    this.ui.boss.container.style.display = m === LevelEditorMode.Boss ? "block" : "";
    this.ui.playerSpawn.container.style.display = m === LevelEditorMode.PlayerSpawn ? "block" : "";
  }

  private openLevelInNewTab() {
    const code = escape(JSON.stringify(this.getJsonLevelCode()));
    window.open(`?autorun=1&level=${code}`, "_blank");
  }

  private setWelcomeTextVisibility(visible: boolean) {
    this.ui.welcome.content.style.display = visible ? "block" : "none";
    this.ui.welcome.toggleButton.textContent = (visible ? "hide" : "show") + " welcome text";
    setSearchParam("welcome", visible ? "1" : "");
  }

  private toggleWelcomeTextVisibility() {
    const isVisible = this.ui.welcome.content.style.display === "block";
    this.setWelcomeTextVisibility(!isVisible);
    return false;
  }
}
