import { GameRuntime } from "../../runtime";
import { Vector } from "../../vector";
import { BaseMouse, BaseMouseButton, EmptyMouseButton, IMouse, IMouseButton } from "./base";

/*
 * A mouse driver for touchscreens
 *
 * A little buggy but it does get the job done
 */

class TouchscreenButton extends BaseMouseButton implements IMouseButton {
  constructor(mouse: TouchscreenMouse) {
    super(mouse); // It's a bird! It's a plane! No it's Supermouse!

    document.addEventListener("touchstart", (e: any) => {
      this.isDown = true;
    });

    document.addEventListener("touchend", (e: any) => {
      this.isDown = false;
    });

    document.addEventListener("touchcancel", (e: any) => {
      this.isDown = false;
    });
  }
}

export class TouchscreenMouse extends BaseMouse implements IMouse {
  constructor(runtime: GameRuntime) {
    super(runtime);

    // only the left mouse button does stuff
    this.left = new TouchscreenButton(this);
    this.middle = new EmptyMouseButton();
    this.right = new EmptyMouseButton();

    // stop scrolling, zooming, or other stuff that you can do with your fingers
    runtime.canvas.addEventListener("touchmove", (e) => this.handleEvent(e));
    runtime.canvas.addEventListener("touchstart", (e) => this.handleEvent(e));
    runtime.canvas.addEventListener("touchend", (e) => this.handleEvent(e));
    runtime.canvas.addEventListener("touchcancel", (e) => this.handleEvent(e));
  }

  private handleEvent(e: any) {
    e.preventDefault();

    const offset = this.findOffset(this.runtime.canvas);

    this.position.x = e.changedTouches[0].clientX - offset.x;
    this.position.y = e.changedTouches[0].clientY - offset.y;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events with minor modifications
  private findOffset(el: HTMLElement): Vector {
    let curleft = 0;
    let curtop = 0;

    while (el.offsetParent) {
      curleft += el.offsetLeft;
      curtop += el.offsetTop;
      el = el.offsetParent as HTMLElement;
    }

    return new Vector(curleft - document.body.scrollLeft, curtop - document.body.scrollTop);
  }
}
