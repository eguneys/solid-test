import sprites_png from '../assets/sprites.png'
import { render, Soli2d } from 'soli2d-js/web'

import App from './app2'

function load_image(path: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    let res = new Image()
    res.onload = () => resolve(res)
    res.src = path
  })
}


export default function app(element: HTMLElement) {

  load_image(sprites_png).then(image => {
    let [_render, root] = Soli2d(element, image, 320, 180)
    render(App(_render, image, root), root)
  })

}
