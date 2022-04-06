import { Vec2 } from 'soli2d'

export type Angle = number

export class Mila {


  speed = new RigidVal(100, 0.9, 0, 0)
  theta = new RigidVal(100, 0.93, 0, 0)

  input(input: Vec2) {
    this.theta.force = input.angle
    this.speed.force = input.length
  }

  update(dt: number, dt0: number) {

    this.speed.update(dt, dt0)
    this.theta.update(dt, dt0)

    this.theta.force = 0
    this.speed.force = 0
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
