import { GameRuntime } from "../../runtime";
import { BaseMouse, BaseMouseButton, IMouse, IMouseButton } from "./base";

/*
 * A mouse driver for computers
 */

enum Button {
  left = 0,
  middle = 1,
  right = 2,
}

class MouseButton extends BaseMouseButton implements IMouseButton {
  constructor(mouse: Mouse, button: Button) {
    super(mouse); // It's a bird! It's a plane! No it's Supermouse!

    // The choice of adding listeners to canvas and document is very intentional

    mouse.runtime.canvas.addEventListener("mousedown", (e: any) => {
      if (e.button === button) {
        this.isDown = true;
      }
    });

    document.addEventListener("mouseup", (e: any) => {
      if (e.button === button) {
        this.isDown = false;
      }
    });
  }
}

export class Mouse extends BaseMouse implements IMouse {
  constructor(runtime: GameRuntime) {
    super(runtime);

    this.right = new MouseButton(this, Button.right);
    this.middle = new MouseButton(this, Button.middle);
    this.left = new MouseButton(this, Button.left);

    runtime.canvas.addEventListener("mousemove", (e: any) => {
      this.position.x = e.layerX;
      this.position.y = e.layerY;
    });

    runtime.canvas.addEventListener("mousedown", (e: any) => {
      e.preventDefault();
    });

    runtime.canvas.addEventListener("contextmenu", (e: any) => {
      e.preventDefault();
    });
  }
}
