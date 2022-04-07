import { Vec2 } from 'soli2d'
import { ticks } from './shared'

export type Paratype = 1 | 2
export type TileNumber = number

export function tile_no(row: number, col: number) {
  return row * 16 + col
}

export function tile_no_row(tile_no: TileNumber) {
  return [Math.floor(tile_no / 16), tile_no % 16]
}


export class Parabox {

  static make = (type: Paratype) => {
    return new Parabox(type)
  }

  get flat() {
    return [...this.data]
  }

  data: Map<TileNumber, Parabox> = new Map()

  constructor(readonly type: Paratype) {}


  add(no: TileNumber, box: Parabox) {
    this.data.set(no, box)
  }

}

export class Mila {


  _x: TweenVal
  _y: TweenVal

  get x() {
    return this._x.value
  }

  get y() {
    return this._y.value
  }

  constructor(x: number, y: number) {
    this._x = new TweenVal(x, x, ticks.thirds, TweenVal.quad_out)
    this._y = new TweenVal(y, y, ticks.thirds, TweenVal.quad_out)
  }

  input(x: number, y: number) {
    if (x === 0 && y === 0) {
      return
    }
    if (this._x.i < 1 || this._y.i < 1) {
      return
    }

    this._x = this._x.new_b(this.x + x * 16)
    this._y = this._y.new_b(this.y + y * 16)
  }

  update(dt: number, dt0: number) {
    this._x.update(dt, dt0)
    this._y.update(dt, dt0)
  }

} 

export class TweenVal {


  static linear = t => t
  static quad_in = t => t * t
  static quad_out = t => -t * (t - 2)
  static quad_in_out = t => t < 0.5 ? 2 * t * t : -2 * t * t + 1
  static cubit_in = t => t * t * t


  _elapsed: number = 0

  get _i() {
    return Math.min(1, this._elapsed / this.duration)
  }

  get i() {
    return this.easing(this._i)
  }

  get value() {
    return this.a * (1 - this.i) + this.b * this.i
  }

  constructor(readonly a: number,
              readonly b: number,
              readonly duration: number = ticks.sixth,
              readonly easing: Easing = TweenVal.linear) {}


  new_b(b: number) {
    return new TweenVal(this.value,
                        b,
                        this.duration,
                        this.easing)
  }


  update(dt: number, dt0: number) {
    this._elapsed += dt
  }

}

export class RigidVal {


  force: number
  x: number

  x0: number
  vx: number

  constructor(readonly mass,
    readonly friction,
    force: number,
    x: number) {
    this.force = force
    this.x = x
    this.x0 = x
  }


  update(dt: number, dt0: number) {

    let { force, mass } = this

    let a = force * 1/mass
    let { x, x0 } = this

    let { friction } = this

    let v0_x = x - x0
    let new_vx = v0_x * friction * dt / dt0 + a * dt * (dt + dt0) / 2

    let new_x0 = x,
      new_x = x + new_vx

    this.x0 = new_x0
    this.x = new_x
    this.vx = new_vx
  }



}
