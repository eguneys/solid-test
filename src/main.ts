import Iksir, { Play, Quad } from 'iksir'
import sprites_png from '../assets/sprites.png'

import Input from './input'
import { ticks } from './shared'

function load_image(path: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    let res = new Image()
    res.onload = () => resolve(res)
    res.src = path
  })
}


type Context = {
	play: Play,
  input: Input,
	image: HTMLImageElement
}

abstract class IMetro {
  get play(): Play { return this.ctx.play }
	get a(): HTMLImageElement { return this.ctx.image }

	constructor(readonly ctx: Context) {}

  init(): this {
    this._init()
    return this
  }

  update(dt: number, dt0: number) {
    this._update(dt, dt0)
  }

  draw() {
    this._draw()
  }
  abstract _init(): void;
  abstract _update(dt: number, dt0: number): void;
  abstract _draw(): void;
}


class AllMetro extends IMetro {


  _init() {
  }

  _update(dt: number, dt0: number) {}

  _draw() {
  }

}

export default function app(element: HTMLElement) {

  /*
  let context = new AudioContext()
  console.log(context.sampleRate, context.destination.channelCount)

  let now = context.currentTime
  let kick = new Kick(context)

  kick.a(now)
  kick.a(now + 0.5)
  kick.a(now + 1)


  let snare = new Snare(context)
  snare.a(now)
  snare.a(now + 1)
   */

  let input: Input = new Input()
  let play = Iksir(element)

  load_image(sprites_png).then((image: HTMLImageElement) => {

    play.glOnce(image)

    let ctx: Context = {
      play,
      input,
      image
    }

    let metro = new AllMetro(ctx).init()

    let fixed_dt = 1000/60
    let timestamp0: number | undefined,
      min_dt = fixed_dt,
      max_dt = fixed_dt * 2,
      dt0 = fixed_dt

    let elapsed = 0
    function step(timestamp: number) {

      let dt = timestamp0 ? timestamp - timestamp0 : fixed_dt

      dt = Math.max(min_dt, dt)
      dt = Math.min(max_dt, dt)

      input.update(dt, dt0)

      if (input.btn('z') > 0) {
        metro.init()
      }
      if (input.btn('e') > 0) {
        if (elapsed++ % 24 === 0) {
          metro.update(dt, dt0)
        }
      } else {
        metro.update(dt, dt0)
      }

    metro.draw()
    play.flush()
    dt0 = dt 
    requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
}

function draw(analyser: AnalyserNode) {
  let data = new Uint8Array(analyser.frequencyBinCount)

  analyser.getByteTimeDomainData(data)



}

class WithContext {
  constructor(readonly context: AudioContext) {}
}

class Snare extends WithContext {


  analyser!: AnalyserNode

  _noise!: AudioBuffer

  get noise(): AudioBuffer {
    if (!this._noise) {
      let bufferSize = this.context.sampleRate
      let buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate)
      let output = buffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
      this._noise = buffer
    }
    return this._noise
  }

  a(time: number) {
    let { context } = this

    let noise = this.context.createBufferSource()
    noise.buffer = this.noise

    let filter = this.context.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(time, 1000)
    noise.connect(filter)

    let envelope = this.context.createGain()
    filter.connect(envelope)

    //envelope.connect(this.context.destination)

    this.analyser = this.context.createAnalyser()
    envelope.connect(this.analyser)
    this.analyser.connect(this.context.destination)


    envelope.gain.setValueAtTime(1, time)
    envelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
    noise.start(time)

    noise.stop(time + 0.2)
  }
}

class Kick extends WithContext {

  a(time: number) {
    let { context } = this

    let oscillator = context.createOscillator()
    let gain = context.createGain()

    oscillator.connect(gain)
    gain.connect(context.destination)

    oscillator.frequency.setValueAtTime(150, time)
    gain.gain.setValueAtTime(1, time)

    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5)
    oscillator.start(time)
    oscillator.stop(time + 0.5)
  }

}

