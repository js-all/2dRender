class Box {
  _x: number;
  _y: number;
  _width: number;
  _height: number;
  _angle: number;
  a: points;
  b: points;
  c: points;
  d: points;
  center: points;
  color: rgb;
  constructor(x: number, y: number, width: number, height: number, color = new rgb(255, 165, 0), angle = 0) {
    this.a = { x: 0, y: 0 };
    this.b = { x: 0, y: 0 };
    this.c = { x: 0, y: 0 };
    this.d = { x: 0, y: 0 };
    this.center = { x: 0, y: 0 };
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._angle = angle;
    this.color = color;
    this._setPoints();
  }
  set angle(val: number) {
    this._angle = val;
    this._setPoints();
  }
  set x(val: number) {
    this._x = val;
    this._setPoints();
  }
  set y(val: number) {
    this._y = val;
    this._setPoints();
  }
  set width(val: number) {
    this._width = val;
    this._setPoints();
  }
  set height(val: number) {
    this._height = val;
    this._setPoints();
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get angle() {
    return this._angle;
  }
  _setPoints() {
    this.a.x = this._x;
    this.d.x = this._x;
    this.b.x = this._x + this._width;
    this.c.x = this._x + this._width;
    this.a.y = this._y;
    this.b.y = this._y;
    this.d.y = this._y + this._height;
    this.c.y = this._y + this._height;
    this.center.x = this._x + this._width / 2;
    this.center.y = this._y + this._height / 2;
    this._rotate(
      Math.atan2(this._width / 2, this._height / 2),
      Math.hypot(this._width / 2, this._height / 2)
    );
  }
  _rotate(BA: number, hyp: number) {
    const rotateAroundPoint = (
      angle: number,
      ox: number,
      oy: number,
      px: number,
      py: number
    ): points => {
      return {
        x: Math.cos(angle) * (px - ox) - Math.sin(angle) * (py - oy) + ox,
        y: Math.sin(angle) * (px - ox) + Math.cos(angle) * (py - oy) + oy
      };
    };
    this.a = rotateAroundPoint(
      this.angle,
      this.center.x,
      this.center.y,
      this.a.x,
      this.a.y
    );
    this.b = rotateAroundPoint(
      this.angle,
      this.center.x,
      this.center.y,
      this.b.x,
      this.b.y
    );
    this.c = rotateAroundPoint(
      this.angle,
      this.center.x,
      this.center.y,
      this.c.x,
      this.c.y
    );
    this.d = rotateAroundPoint(
      this.angle,
      this.center.x,
      this.center.y,
      this.d.x,
      this.d.y
    );
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color.value;
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.lineTo(this.c.x, this.c.y);
    ctx.lineTo(this.d.x, this.d.y);
    ctx.lineTo(this.a.x, this.a.y);
    ctx.fill();
    ctx.closePath();
  }
  getSegments() {
    return [
      new Wall(this.a.x, this.a.y, this.b.x, this.b.y, this.color),
      new Wall(this.b.x, this.b.y, this.c.x, this.c.y, this.color),
      new Wall(this.c.x, this.c.y, this.d.x, this.d.y, this.color),
      new Wall(this.d.x, this.d.y, this.a.x, this.a.y, this.color)
    ];
  }
}
