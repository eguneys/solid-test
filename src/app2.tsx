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

  let store = [{image, root, update, input}, {
    _setImage,
      _setRoot
  }]

  loop((dt, dt0) => {
    setUpdate([dt, dt0])
    setInput(input => {
      input.update(dt, dt0)
      return input
    })
  })

  return (
    <AppContext.Provider value={store}>
      {props.children}
    </AppContext.Provider>)
  
}

export const useApp = () => useContext(AppContext)

const App = (_image, _root) => {

  let _App = () => {

    const [{image, root, update}, { _setImage, _setRoot }] = useApp()

      _setImage(_image)
      _setRoot(_root)


     createEffect(on(update, (dt, dt0) => {
        root()._update_world()
        //console.log(root()._flat.find(_ => _.name === 'milatransform').world.tx)
     }))

    return (<Game/>)
  }

  return () => (<AppProvider> <_App/> </AppProvider>)
}

export default App




export const Game = () => {


  let base = new OParabox(0, 0, colors.green2),
      box = new OParabox(0, 0, colors.sand2),
      b2 = new OParabox(0, 0, colors.blue2),
      mila = new OParabox(0, 1, colors.red2)

   base.setAdd(box)
   box.setAdd(b2)
   box.setAdd(mila)


  let [{input, update, root }] = useApp()

  // causes last item mila to render on top
  createEffect(() => {
      console.log(root()._flat.map(_ => [_.name, _.x].join('')))
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

  return (<>
     <Box x={0} y={0} box={base} zoom={1600}/>
    </>)
}

export const Box = (props) => {
  return (<>
      <transform name={props.zoom + 'wrap'} scale={Vec2.make(props.zoom, props.zoom)}>
        <Tile name={props.zoom + 'bg'} color={props.box.color} size={Vec2.make(1, 1)} x={props.x} y={props.y} />
      </transform>
      <For each={props.box.tiles}>{ (box, i) =>
        <Box box={box} x={box.x} y={box.y} zoom={props.zoom / 10}/>
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

