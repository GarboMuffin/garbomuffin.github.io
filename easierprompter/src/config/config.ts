import { ConfigOption } from "./option";
import { ConfigSaver } from "./save";

interface Config {
  [s: string]: ConfigOption;
}

// TODO: saving & loading
export class ConfigManager {
  public options: Config = {};
  private configSaver: ConfigSaver = new ConfigSaver(this);

  public save() {
    return this.configSaver.save();
  }

  public load() {
    this.configSaver.load();
  }

  public promptReset() {
    const message = [
      "Are you sure you want to reset the settings?",
      "This will reset your script, the config, and reload the page.",
    ];
    if (confirm(message.join("\n\n"))) {
      this.configSaver.reset();
    }
  }

  public hasChanged() {
    const newData = this.configSaver.generateSaveData();
    const oldData = this.configSaver.lastSaveData;
    for (const key of Object.keys(newData)) {
      if (newData[key] !== oldData[key]) {
        return true;
      }
    }
    return false;
  }
}
