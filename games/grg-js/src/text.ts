interface TextOptions {
  text: string
  font?: string
  size?: number
  color?: string
  x?: number
  y: number
  center?: boolean
}

// Text is already defined in javascript
// so the next "best" name was used

class TextSprite {
  public constructor(options: TextOptions) {
    this.text = options.text.toLowerCase();

    var font = "sans-serif";
    var fontSize = options.size || 8;
    this.styling = `${fontSize}px "${font}"`;
    this.color = options.color || "black";

    this.y = options.y;
    if (isNumber(options.x)) {
      this.x = options.x;
    } else if (typeof options.center === "boolean") {
      ctx.font = this.styling;
      var length = ctx.measureText(this.text).width;
      this.x = (WIDTH / 2) - (length / 2);
    }

    sprites.push(this);
  }

  public render() {
    ctx.font = this.styling;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
  }

  public destroy() {
    for (let container of containers) {
      var index = container.indexOf(this);
      if (index > -1) {
        container.splice(index, 1);
      }
    }
  }

  protected y: number
  protected x: number
  protected text: string
  protected color: string
  protected styling: string
}
