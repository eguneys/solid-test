import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

import App from './view'

export default function app(element: HTMLElement) {

  render(App, element)
}
