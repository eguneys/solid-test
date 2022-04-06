import { on, createEffect, createSignal, createContext, useContext } from 'soli2d-js'
import { Quad, Vec2, loop } from 'soli2d'
import Input from './input'

const colors = {
  sand2: [3, 1],
  red2: [4, 2],
  red3: [4, 3]
}

const AppContext = createContext<AppContextValue>({})

const AppProvider = (props) => {
  const [image, _setImage] = createSignal()
  const [root, _setRoot] = createSignal()
  const [update, setUpdate] = createSignal([0, 0])
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
     }))


    return (<Game/>)
  }

  return () => (<AppProvider> <_App/> </AppProvider>)
}

export default App




export const Game = () => {



  
  return (<>
      <Background/>
      <Mila/>
      <StrokeRect color={colors.red2} x={50} y={50} w={20} h={20}/>
      <StrokeRect color={colors.red2} x={71} y={50} w={20} h={20}/>
      <StrokeRect color={colors.red2} x={50} y={71} w={20} h={20}/>
    </>)
}

export const Mila = () => {

  let [{input}] = useApp()

  let [hue, lum] = colors.red3

  createEffect(on(input, (input) => {
    console.log(input.btn('a'))
        }))

  return (<transform rotation={Math.PI*0.25} pivot={Vec2.make(0.5, 0.5)} x={10} y={10}>
      <Tile lum={lum} hue={hue} pivot={0.5} size={Vec2.make(14, 14)} x={0} y={0}/>
      </transform>)
}

export const Background = () => {
  let [hue, lum] = colors.sand2
  return (<>
      <Tile lum={lum} hue={hue} size={Vec2.make(320, 180)} x={0} y={0}/>
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

  const lum = () => props.lum * 2
  const hue = () => props.hue * 2

  return (<transform quad={Quad.make(image(), lum(), hue(), 1, 1)} 
      pivot={Vec2.make(pivot, pivot)}
      size={props.size} 
      x={Math.round(props.x)} y={Math.round(props.y)}/>)
}

