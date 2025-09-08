export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mult(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  div(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  length(): number {
    return this.mag();
  }

  normalize(): Vector {
    const mag = this.mag();
    if (mag > 0) {
      return new Vector(this.x / mag, this.y / mag);
    }
    return new Vector(0, 0);
  }
}
