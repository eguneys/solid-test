import { createSignal, batch } from 'soli2d-js'
import { ticks } from './shared'

export function owrite(signal, fn) {
  if (typeof fn === 'function') {
    return signal[1](fn)
  } else {
    signal[1](_ => fn)
  }
}

export function write(signal, fn) {
  return signal[1](_ => {
    fn(_)
    return _
  })
}

export function read(signal) {
  if (Array.isArray(signal)) {
    return signal[0]()
  } else {
    return signal()
  }
}


export class Parabox {


  _x: Tween
  _y: Tween

  _tiles: Signal<Array<Parabox>>
  _parent: Signal<Parabox | undefined>


  get x0() { return this._x.a }
  get y0() { return this._y.a }

  get x() { return this._x.value }
  get y() { return this._y.value }

  get x2() { return this._x.b }
  get y2() { return this._y.b }

  get xi() { return this._x.i }
  get yi() { return this._y.i }

  get parent0() { return read(this._parent0) }
  get parent() { return read(this._parent) }

  get parent_in() {
    return this.parent0?.contains(this.parent)
  }

  get parent_out() {
    return this.parent.contains(this.parent0)
  }

  get transition() {
    return this.xi < 1 || this.yi < 1
  }

  get tiles() { return read(this._tiles) }

  constructor(x: number, y: number, readonly color: Color) {
    this._x = new Tween(x, x)
    this._y = new Tween(y, y)

    this._tiles = createSignal([])

    this._parent = createSignal()

    this._parent0 = createSignal()
  }

  contains(parabox: Parabox) {
    return this.tiles.indexOf(parabox) !== -1
  }

  setPush(ix: number, iy: number) {
    if (ix === 0 && iy === 0) { return }


    if (this.xi < 1 || this.yi < 1) { return }

    let tile = this.parent.tile(this.x + ix,
                                this.y + iy)
    
    if (tile) {

      let new_x = ix < 0 ? 10 : 
        ix > 0 ? 0 : 
        this.x
      let new_y = iy < 0 ? 10 :
        iy > 0 ? 0 :
        this.y
      this.setParent(tile, new_x, new_y, ix, iy)
      return
    }

    if (this.x + ix >= 10 | this.y + iy >= 10) {
      this.setParent(this.parent.parent, this.parent.x, this.parent.y, ix, iy)
      return
    }

    this._x.setB(this.x + ix)
    this._y.setB(this.y + iy)

  }

  tile(x: number, y: number) {
    return this.tiles.find(_ => _.x === x && _.y === y)
  }

  setParent(new_parent: Parabox, new_x: TileNumber, new_y: TileNumber, ix: number, iy: number) {
    let parent = this.parent
    this.parent.setRemove(this)
    new_parent.setAdd(this)
    this._x.setAB(new_x, new_x + ix)
    this._y.setAB(new_y, new_y + iy)
  }

  setAdd(parabox: Parabox) {
    owrite(parabox._parent0, read(parabox._parent))
    write(this._tiles, _ => _.push(parabox))
    owrite(parabox._parent, this)
  }

  setRemove(parabox: Parabox) {
    owrite(this._tiles, _ => _.filter(_ => _ !== parabox))
  }

  setUpdate(dt: number, dt0: number) {
    this._x.setUpdate(dt, dt0)
    this._y.setUpdate(dt, dt0)

    read(this._tiles).forEach(_ => _.setUpdate(dt, dt0))

    if (!this.transition) {
      owrite(this._parent0, read(this._parent))
    }
  }
}

const linear = t => t
const quad_in = t => t * t
const quad_out = t => -t * (t - 2)
const quad_in_out = t => t < 0.5 ? 2 * t * t : -2 * t * t + 1
const cubit_in = t => t * t * t

export class Tween {
  
  readonly _elapsed: Signal<number>
  readonly _b: Signal<number>
  readonly _a: Signal<number>

  constructor(_a: number, 
              _b: number,
              readonly duration: number = ticks.lengths, 
                readonly easing: Easing = quad_out) {
    this._elapsed = createSignal(0)
    this._a = createSignal(_a)
    this._b = createSignal(_b)
  }

  get _i () {
    return Math.min(1, read(this._elapsed) / this.duration)
  }

  get i() { return this.easing(this._i) }

  get value() { return  read(this._a) * (1 - this.i) + read(this._b) * this.i }

  setUpdate(dt: number, dt0: number) {
    owrite(this._elapsed, _ => _ + dt)
  }

  setAB(_a: number, _b: number) {
    owrite(this._a, _a)
    owrite(this._b, _b)
    owrite(this._elapsed, 0)
  }

  setB(_b: number) {
    owrite(this._a, this.value)
    owrite(this._b, _b)
    owrite(this._elapsed, 0)
  }
}
