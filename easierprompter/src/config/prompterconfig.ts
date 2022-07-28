import { getElement, setDisplay } from "../utils";
import { ConfigManager } from "./config";
import { ConfigOption } from "./option";

export class PrompterConfigManager extends ConfigManager {
  constructor() {
    super();

    const prompterContainer = getElement("prompter-lines-container");
    const prompterLines = getElement("prompter-lines");
    const caret = getElement("prompter-caret");

    this.options.speed = new ConfigOption<number>({
      default: 1.5,
      el: getElement("options-current-speed"),
      type: "number",
      setterOpts: {
        transform: (value: number) => {
          if (value < 0) {
            value = 0;
          }
          return value.toFixed(2);
        },
      },
    });

    this.options.fontSize = new ConfigOption<number>({
      default: 75,
      el: getElement("options-font-size"),
      type: "number",
      setterOpts: {
        onchange: true,
        callback: (value: number) => {
          prompterContainer.style.fontSize = `${value}px`;
        },
      },
    });

    this.options.fontFamily = new ConfigOption<string>({
      default: "sans-serif",
      el: getElement("options-font-family"),
      type: "text",
      setterOpts: {
        onchange: true,
        callback: (value: string) => {
          prompterContainer.style.fontFamily = `${value}, sans-serif`;
        },
      },
    });

    this.options.boldText = new ConfigOption<boolean>({
      default: true,
      el: getElement("options-bold-text"),
      type: "checkbox",
      setterOpts: {
        onchange: true,
        callback: (value: boolean) => {
          prompterLines.style.fontWeight = value ? "bold" : "normal";
        },
      },
    });

    this.options.lineHeight = new ConfigOption<number>({
      default: 1.15,
      el: getElement("options-line-height"),
      type: "number",
      setterOpts: {
        onchange: true,
        callback: (value: number) => {
          prompterLines.style.lineHeight = '' + value;
        },
      },
    });

    this.options.unsavedChangesWarning = new ConfigOption<boolean>({
      default: false,
      el: getElement("options-unsaved-changes-warning"),
      type: "checkbox",
    });

    this.options.showCaret = new ConfigOption<boolean>({
      default: true,
      el: getElement("options-show-caret"),
      type: "checkbox",
      setterOpts: {
        onchange: true,
        callback: (value: boolean) => {
          setDisplay(caret, value);
        },
      },
    });

    this.options.endText = new ConfigOption<string>({
      default: "[END]",
      el: getElement("options-end-text"),
      type: "text",
    });

    this.options.text = new ConfigOption<string>({
      default: "Enter your script here!",
      el: getElement("text-input"),
      type: "text",
    });
  }
}
