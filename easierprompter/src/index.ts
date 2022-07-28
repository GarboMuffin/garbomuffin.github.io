import "./email";
import "./sw";

import { ConfigManager } from "./config/config";
import { PrompterConfigManager } from "./config/prompterconfig";
import { Prompter } from "./prompter/prompter";
import { getElement } from "./utils";

function getConfig(): ConfigManager {
  return new PrompterConfigManager();
}

function getPrompter(cfg: ConfigManager): Prompter {
  return new Prompter(cfg);
}

const config = getConfig();
config.load();
config.save();

getElement("save-button").onclick = () => config.save();
getElement("reset-button").onclick = () => config.promptReset();

const prompter = getPrompter(config);

// TODO: move this somewhere else, probably configmanager?
window.addEventListener('beforeunload', (e: any) => {
  if (config.options.unsavedChangesWarning.get() && prompter.config.hasChanged()) {
    // Browsers such as Chrome have stopped showing the text here and instead some predetermined message
    // That's fine and this will work for other browsers.
    const text = [
      "You have unsaved changes to your config!",
      "If you leave these changes will be reset!",
      "(disable this warning by unchecking \"Unsaved changes warning\")",
    ].join("\n");
    e.returnValue = text;
    return text;
  }
}, true);
