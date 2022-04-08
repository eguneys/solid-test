const rate = 1000 / 60
export const ticks = {
  seconds: 60 * rate,
  half: 30 * rate,
  thirds: 20 * rate,
  lengths: 15 * rate,
  sixth: 10 * rate,
  five: 5 * rate,
  three: 3 * rate,
  one: 1 * rate
}

export const lum = (color: Color) => color[1] * 2
export const hue = (color: Color) => color[0] * 2

export const colors = {
  sand2: [3, 1],
  blue2: [6, 1],
  red2: [4, 2],
  red3: [4, 3],
  green2: [2, 3]
}


