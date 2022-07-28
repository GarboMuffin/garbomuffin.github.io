type Handler = () => boolean | void;
type HandlerList = Handler[][];
type RequireHandler = (e: KeyboardEvent) => boolean;

export class Keyboard {
  private handlers: Handler[][] = [];

  private requirements: RequireHandler[] = [];
  private keyDownHandlers: HandlerList = [];
  private keyPressHandlers: HandlerList = [];
  private keyUpHandlers: HandlerList = [];

  constructor() {
    document.addEventListener("keydown", this._createEventHandler(this.keyDownHandlers));
    document.addEventListener("keyup", this._createEventHandler(this.keyUpHandlers));
    document.addEventListener("keypress", this._createEventHandler(this.keyPressHandlers));
  }

  public require(func: RequireHandler) {
    this.requirements.push(func);
  }

  public onKeyDown(keyCode: number, handler: Handler) {
    this._addHandler(keyCode, handler, this.keyDownHandlers);
  }

  public onKeyUp(keyCode: number, handler: Handler) {
    this._addHandler(keyCode, handler, this.keyUpHandlers);
  }

  public onKeyPress(keyCode: number, handler: Handler) {
    this._addHandler(keyCode, handler, this.keyPressHandlers);
  }

  private testRequirements(e: KeyboardEvent) {
    for (const func of this.requirements) {
      if (!func(e)) {
        return false;
      }
    }
    return true;
  }

  private _addHandler(keyCode: number, handler: Handler, eventHandlers: HandlerList) {
    if (!eventHandlers[keyCode]) {
      eventHandlers[keyCode] = [];
    }
    const existingHandlers = eventHandlers[keyCode];

    existingHandlers.push(handler);
  }

  private _createEventHandler(eventHandlers: HandlerList) {
    return (e: KeyboardEvent) => {
      if (!this.testRequirements(e)) {
        return;
      }

      const keyCode = e.keyCode;
      const handlers = eventHandlers[keyCode];

      if (!handlers) {
        return;
      }

      let preventDefault = false;
      for (const handler of handlers) {
        const result = handler();
        if (result) {
          preventDefault = true;
          break;
        }
      }

      if (preventDefault) {
        e.preventDefault();
      }
    };
  }
}
