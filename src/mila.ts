import { Vec2 } from 'soli2d-js/web'
import { ticks } from './shared'

import { color, hue, lum, colors } from './shared'

export type Paratype = 1 | 2 | 3
export type TileNumber = number

export function tile_no(row: number, col: number) {
  return row * 16 + col
}

export function tile_no_row(tile_no: TileNumber) {
  return Vec2.make(Math.floor(tile_no / 16), tile_no % 16)
}

export class Game {

  get parent() {
    return this.box.parent
  }

  box: Parabox

  constructor(box: Parabox,
              readonly mila: Mila) {
                this.box = box
              }


  input(x: number, y: number) {
    this.mila.input(x, y)

    if (this.mila.has_reached) {
      let dest = this.box.get(this.mila.tile)

      if (dest) {
        this.box = dest
      }

    }

  }


  update(dt: number, dt0: number) {
    this.mila.update(dt, dt0)
  }

}

let para_colors = [undefined, colors.red2, colors.blue2, colors.green2]
export class Parabox {

  static make = (type: Paratype) => {
    return new Parabox(type)
  }

  get color() {
    return para_colors[this.type]
  }

  get flat() {
    return [...this.data]
  }

  parent?: Parabox
  data: Map<TileNumber, Parabox> = new Map()

  constructor(readonly type: Paratype) {}


  add(no: TileNumber, box: Parabox) {
    box.parent = this
    this.data.set(no, box)
  }

  get(no: TileNumber) {
    return this.data.get(no)
  }

}

export class Mila {


  _x: TweenVal
  _y: TweenVal

  get has_reached() {
    return this._x.has_reached || this._y.has_reached
  }

  get tile() {
    return tile_no(this.x, this.y)
  }

  get x() {
    return this._x.value
  }

  get y() {
    return this._y.value
  }


  get x2() {
    return this._x.b
  }

  get y2() {
    return this._y.b
  }

  constructor(tile_no: TileNumber) {
    let { x, y } = tile_no_row(tile_no)
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

    this._x = this._x.new_b(this.x + x)
    this._y = this._y.new_b(this.y + y)
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

  _i0: number

  get has_reached() {
    return this.i === 1 && this._i0 !== this.i
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
    this._i0 = this.i
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
