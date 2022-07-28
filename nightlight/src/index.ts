import { NightlightLevelEditor } from "./editor/editor";
import { GameRuntime } from "./engine/runtime";
import { Nightlight } from "./game/game";
import { getLevelForCode, getLevelForContinueCode } from "./levelcode";
import { getElementById, getSearchParam, setSearchParam } from "./utils";
import { CHEATS } from "./config";

/*
 * The loader.
 *
 * It creates the game object, adds in assets, and starts the game.
 */

function getRuntime(): GameRuntime {
  if (getSearchParam("m") === "leveleditor") {
    return new NightlightLevelEditor();
  } else {
    return new Nightlight();
  }
}

const game = getRuntime();

// later made visibile in run()
game.canvas.style.display = "none";

// add in all of our assets

//
// Pre sword and core
//
game.addImage("player/idle");
game.addImage("player/up");
game.addImage("player/down");
game.addImage("player/walk1");
game.addImage("player/walk2");
game.addImage("player/walk3");
game.addImage("player/walk4");

game.addImage("text/a");
game.addImage("text/b");
game.addImage("text/c");
game.addImage("text/d");
game.addImage("text/e");
game.addImage("text/f");
game.addImage("text/g");
game.addImage("text/h");
game.addImage("text/i");
game.addImage("text/j");
game.addImage("text/k");
game.addImage("text/l");
game.addImage("text/m");
game.addImage("text/n");
game.addImage("text/o");
game.addImage("text/p");
game.addImage("text/q");
game.addImage("text/r");
game.addImage("text/s");
game.addImage("text/t");
game.addImage("text/u");
game.addImage("text/v");
game.addImage("text/w");
game.addImage("text/x");
game.addImage("text/y");
game.addImage("text/z");
game.addImage("text/0");
game.addImage("text/1");
game.addImage("text/2");
game.addImage("text/3");
game.addImage("text/4");
game.addImage("text/5");
game.addImage("text/6");
game.addImage("text/7");
game.addImage("text/8");
game.addImage("text/9");
game.addImage("text/period");
game.addImage("text/question");
game.addImage("text/,");
game.addImage("text/!");
game.addImage("text/singlequote");
game.addImage("text/colon");

game.addImage("fragments/1");
game.addImage("fragments/2");
game.addImage("fragments/3");
game.addImage("fragments/4");
game.addImage("fragments/5");

game.addImage("coin/1");
game.addImage("coin/2");
game.addImage("coin/3");
game.addImage("coin/4");

game.addImage("blocks/a");
game.addImage("blocks/b");
game.addImage("blocks/c");
game.addImage("blocks/d");
game.addImage("blocks/e");
game.addImage("blocks/f");
game.addImage("blocks/g");
game.addImage("blocks/h");
game.addImage("blocks/i");
game.addImage("blocks/j");
game.addImage("blocks/k");
game.addImage("blocks/l");
game.addImage("blocks/m");
game.addImage("blocks/n");
game.addImage("blocks/p");
game.addImage("blocks/q");
game.addImage("blocks/r");
game.addImage("blocks/s");
game.addImage("blocks/v");
game.addImage("blocks/w");
game.addImage("blocks/y");
game.addImage("blocks/z");
game.addImage("blocks/editory");
game.addImage("blocks/capitaly");
game.addImage("blocks/capitalz");
game.addImage("blocks/capitalo");
game.addImage("blocks/capitalp");
game.addImage("blocks/capitalq");
game.addImage("blocks/capitalr");
game.addImage("blocks/closingcurlybracket");

game.addImage("blocks/button/redgreen/button");
game.addImage("blocks/button/redgreen/button2");
game.addImage("blocks/button/redgreen/spawner");
game.addImage("blocks/button/redgreen/spawner2");
game.addImage("blocks/button/aquaorange/button");
game.addImage("blocks/button/aquaorange/button2");
game.addImage("blocks/button/aquaorange/spawner");
game.addImage("blocks/button/aquaorange/spawner2");

game.addImage("blocks/crumble/1");
game.addImage("blocks/crumble/2");
game.addImage("blocks/crumble/3");
game.addImage("blocks/crumble/4");
game.addImage("blocks/crumble/5");
game.addImage("blocks/crumble/6");
game.addImage("blocks/crumble/7");
game.addImage("blocks/crumble/8");
game.addImage("blocks/crumble/9");

game.addImage("blocks/spikes/up");
game.addImage("blocks/spikes/down");
game.addImage("blocks/spikes/left");
game.addImage("blocks/spikes/right");

game.addImage("boss/sword/sword");
game.addImage("boss/sword/open");
game.addImage("boss/sword/heal");
game.addImage("boss/sword/hurt");

game.addImage("hit/-1");
game.addImage("hit/+1");
game.addImage("hit/+0");

//
// Post sword
//

game.addImage("blocks/1");
game.addImage("blocks/2");
game.addImage("blocks/3");
game.addImage("blocks/4");
game.addImage("blocks/5");
game.addImage("blocks/6");
game.addImage("blocks/7");
game.addImage("blocks/8");
game.addImage("blocks/9");
game.addImage("blocks/!");
game.addImage("blocks/singlequote");

game.addImage("blocks/lightbutton/1");
game.addImage("blocks/lightbutton/2");
game.addImage("blocks/lightbutton/down");

game.addImage("jumplight");
game.addImage("blackjumplight");

// Noss
game.addImage("boss/noss/noss");
game.addImage("boss/noss/hit");
game.addImage("boss/noss/rest");
game.addImage("boss/noss/bullet");
game.addImage("boss/noss/dust");

//
// Castle
//

game.addImage("brick");
game.addImage("blocks/caret");
game.addImage("blocks/ampersand");
game.addImage("blocks/asterisk");
game.addImage("blocks/(");
game.addImage("blocks/)");
game.addImage("blocks/-");
game.addImage("blocks/underscore");
game.addImage("blocks/=");
game.addImage("blocks/+");
game.addImage("blocks/grave");
game.addImage("blocks/capitals");
game.addImage("blocks/capitalt");
game.addImage("blocks/capitalv");

game.addImage("blocks/castlecorner/topright");
game.addImage("blocks/castlecorner/topleft");
game.addImage("blocks/castlecorner/bottomright");
game.addImage("blocks/castlecorner/bottomleft");

game.addImage("blocks/capitala");
game.addImage("blocks/capitalb");
game.addImage("blocks/capitalc");
game.addImage("blocks/capitald");
game.addImage("blocks/capitale");
game.addImage("blocks/capitalf");
game.addImage("blocks/capitalg");
game.addImage("blocks/capitalh");
game.addImage("blocks/capitali");
game.addImage("blocks/capitalj");
game.addImage("blocks/capitalk");
game.addImage("blocks/capitall");
game.addImage("blocks/capitalm");
game.addImage("blocks/capitaln");
game.addImage("blocks/capitalw");
game.addImage("blocks/pipe");

// ending
game.addImage("end/scene");
game.addImage("thumb");

// pause
game.addImage("pause");

//
// Sounds
//

game.addSound("blocks/coin");
game.addSound("blocks/break");
game.addSound("blocks/fall");
game.addSound("blocks/smash");
game.addSound("blocks/button");
game.addSound("blocks/fds");

game.addSound("player/death");
game.addSound("player/ding");
game.addSound("player/jump");

// boss
game.addSound("boss/ouch");
game.addSound("boss/sword/rumble");
game.addSound("boss/noss/shadow1");
game.addSound("boss/noss/shadow2");
game.addSound("boss/noss/shadow3");
game.addSound("boss/noss/shadow4");
game.addSound("boss/shadow5");

// background music
game.addSound("music/exploration");
game.addSound("music/netherslament");
game.addSound("music/challenge");
game.addSound("music/boss/1");
game.addSound("music/boss/2");
game.addSound("music/blackroad/1");
game.addSound("music/blackroad/2");
game.addSound("music/finalboss/1");
game.addSound("music/finalboss/2");

// html elements
const progressBar = getElementById<HTMLProgressElement>("progress-bar");
const menuContainer = getElementById("menu-container");
const loadingScreen = getElementById("loading-screen");
const menuBackground = getElementById("menu-background");
const menuScreen = getElementById("menu-screen");
const playButton = getElementById<HTMLButtonElement>("play-button");
const loadCodeButton = getElementById<HTMLButtonElement>("load-code-button");
const loadCodeFromUrlButton = getElementById("load-code-url-button");
const cheatsInterface = getElementById("cheats-interface");

// wait for it to load then run our stuff
game.waitForAssets((progress) => {
  // show a progress bar
  const value = progress * 100;
  progressBar.style.width = value + "%";
}).then(() => canPlay());

function canPlay() {
  if (game instanceof Nightlight) {
    const autorun = !!getSearchParam("autorun");
    const urlLevelParam = getSearchParam("level") || "";
    const loadLevelFromUrl = () => runLevelCode(urlLevelParam as string);

    if (autorun) {
      try {
        if (urlLevelParam) {
          loadLevelFromUrl();
        } else {
          run();
        }
        return;
      } catch (e) {
        // TODO: handle this
        throw e;
      }
    }

    playButton.addEventListener("click", () => run());
    loadCodeButton.addEventListener("click", () => {
      // chrome (and probably others) limit prompt default value to 2000 or so characters
      const TOO_LONG_TO_SHOW_MESSAGE = "(too long to safely show in this box, but enter will still work as expected)";

      let defaultValue;
      if (urlLevelParam.length > 2000) {
        defaultValue = TOO_LONG_TO_SHOW_MESSAGE;
      } else {
        defaultValue = urlLevelParam;
      }

      let code = prompt("Enter the level code:", defaultValue);
      if (code === TOO_LONG_TO_SHOW_MESSAGE) {
        code = urlLevelParam;
      }
      if (code === null) {
        return;
      }
      runLevelCode(code);
    });

    if (urlLevelParam) {
      loadCodeFromUrlButton.addEventListener("click", () => loadLevelFromUrl());
      loadCodeFromUrlButton.style.display = "inline";
    }

    menuBackground.classList.add("active");
    loadingScreen.style.display = "none";
    menuScreen.style.display = "block";
  } else {
    run();
  }
}

function showCanvas() {
  menuContainer.style.display = "none";
  game.canvas.style.display = "";
}

function runLevelCode(code: string) {
  if (!(game instanceof Nightlight)) {
    throw new Error("not in game");
  }

  const importCode = (str: string) => {
    if (code.length === 8) {
      // resume code
      const level = getLevelForContinueCode(str);
      game.level = level;
      run();
    } else {
      // probably a full level code
      const level = getLevelForCode(code);
      showCanvas();
      game.start([level]);
    }
  };

  try {
    importCode(code);
  } catch (e) {
    alert(`Error: ${e.message}`);
  }
  setSearchParam("level", code);
}

function run() {
  showCanvas();
  game.start();
}

cheatsInterface.style.display = CHEATS ? "block" : "none";
