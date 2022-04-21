import { Show, For, on, createMemo, createEffect, createSignal, createContext, useContext } from 'soli2d-js'
import { Quad, Vec2, loop } from 'soli2d-js/web'
import Input from './input'

import { color, hue, lum, colors } from './shared'
import { Parabox as OParabox } from './gbox'


const AppContext = createContext<AppContextValue>({})

const AppProvider = (props) => {
  const [image, _setImage] = createSignal()
  const [root, _setRoot] = createSignal()
  const [update, setUpdate] = createSignal([16, 16])
  const [input, setInput] = createSignal(new Input().init(), { equals: false })
  const [render, setRender] = createSignal(undefined, { equals: false })

  let store = [{image, root, update, render, input}, {
    _setImage,
      _setRoot
  }]

  loop((dt, dt0) => {
    setUpdate([dt, dt0])
    setInput(input => {
      input.update(dt, dt0)
      return input
    })
    setRender()
  })

  return (
    <AppContext.Provider value={store}>
      {props.children}
    </AppContext.Provider>)
  
}

export const useApp = () => useContext(AppContext)

const App = (_render, _image, _root) => {

  let _App = () => {

    const [{image, root, update, render, input}, { _setImage, _setRoot }] = useApp()

      _setImage(_image)
      _setRoot(_root)

     createEffect(on(render, () => {
        root()._update_world()
       _render()
       }))

    return (<Game/>)
  }

  return () => (<AppProvider> <_App/> </AppProvider>)
}

export default App




export const Game = () => {


  let base = new OParabox(1, 1, colors.red3),
      base_child = new OParabox(1, 1, colors.green2),
      box = new OParabox(1, 0, colors.sand2),
      b2 = new OParabox(1, 1, colors.blue2),
      mila = new OParabox(0, 1, colors.red2)

   base.setAdd(base_child)
   base_child.setAdd(box)
   box.setAdd(b2)
   box.setAdd(mila)

  let [{input, update, root }] = useApp()

  // causes last item mila to render on top
  createEffect(() => {
    //console.log(root()._flat.map(_ => [_.name, _.x].join('')))
  })

  createEffect(on(update, ([dt, dt0]) => {
    base.setUpdate(dt, dt0)
  }))

  createEffect(on(input, (input) => {
    let i_up = input.btn('up'),
      i_down = input.btn('down'),
      i_left = input.btn('left'),
      i_right = input.btn('right')

    let i_x = 0, i_y = 0

    if (i_up > 0 && (i_down === 0 || i_up < i_down)) {
      i_y = -1
    } 
    if (i_down > 0 && (i_up === 0 || i_down < i_up)) {
      i_y = 1
    } 

    if (i_left > 0 && (i_right === 0 || i_left < i_right)) {
      i_x = -1
    } 
    if (i_right > 0 && (i_left === 0 || i_right < i_left)) {
      i_x = 1
    } 

      mila.setPush(i_x, i_y)
  }))

let parent_in_out = () => mila.transition && (mila.parent_in || mila.parent_out)

  return (<>
      <Show when={!parent_in_out()} fallback={
        <transform name={'in'} x={-mila.parent.x * 160 +80} y={-mila.parent.y * 160 + 10 }>
          <Box box={mila.parent.parent} zoom={1600}/>
        </transform>
      }>
        <transform name={'out'} x={-mila.parent.x * 160 +80} y={-mila.parent.y * 160 + 10 }>
          <Box box={mila.parent.parent} zoom={1600}/>
        </transform>
      </Show>
    </>)


}

export const Box = (props) => {
  return (<>
      <transform size={Vec2.make(props.zoom, props.zoom)}>
        <Tile color={props.box.color} />
      </transform>
      <For each={props.box.tiles}>{ box =>
        <transform x={box.x*props.zoom/10} y={box.y * props.zoom/10}>
          <Box box={box} zoom={props.zoom/10}/>
        </transform>
      }</For>
      </>)
}

export const StrokeRect = (props) => {

  let thick = props.thick || 2
  let [hue, lum] = props.color

    return (<transform x={props.x} y={props.y}>
        <Tile lum={lum} hue={hue} size={Vec2.make(props.w, thick)} x={0} y={0}/>
        <Tile lum={lum} hue={hue} size={Vec2.make(props.w, thick)} x={0} y={props.h-thick}/>
        <Tile lum={lum} hue={hue} size={Vec2.make(thick, props.h)} x={0} y={0}/>
        <Tile lum={lum} hue={hue} size={Vec2.make(thick, props.h)} x={props.w-thick} y={0}/>
        </transform>)

}

export const Tile = (props) => {

  const [{image, root}] = useApp()

  const pivot = props.pivot || 0

  return (<transform name={props.name} 
      quad={Quad.make(image(), lum(props.color), hue(props.color), 1, 1)} 
      pivot={Vec2.make(pivot, pivot)}
      size={props.size} 
      x={props.x} y={props.y}/>)
}

