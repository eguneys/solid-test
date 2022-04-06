import { on, createEffect, createSignal, createContext, useContext } from 'soli2d-js'
import { Quad, Vec2, loop } from 'soli2d'

const colors = {
  red2: [4, 2]
}

const AppContext = createContext<AppContextValue>({})

const AppProvider = (props) => {
  const [image, _setImage] = createSignal()
  const [root, _setRoot] = createSignal()
  const [update, setUpdate] = createSignal([0, 0])

    let store = [image, root, update, {
      _setImage,
        _setRoot
    }]

  loop((dt, dt0) => {
    setUpdate([dt, dt0])
    })

  return (
    <AppContext.Provider value={store}>
      {props.children}
    </AppContext.Provider>)
  
}

export const useApp = () => useContext(AppContext)

const App = (_image, _root) => {

  let _App = () => {

    const [image, root, update, { _setImage, _setRoot }] = useApp()

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
      <StrokeRect color={colors.red2} x={50} y={50} w={20} h={20} thick={5}/>
      <StrokeRect color={colors.red2} x={71} y={50} w={20} h={20} thick={5}/>
      <StrokeRect color={colors.red2} x={50} y={71} w={20} h={20} thick={5}/>
    </>)
}


export const StrokeRect = (props) => {

  let [hue, lum] = props.color

    return (<transform x={props.x} y={props.y}>
        <Tile lum={lum} hue={hue} size={Vec2.make(props.w, props.thick)} x={0} y={0}/>
        <Tile lum={lum} hue={hue} size={Vec2.make(props.w, props.thick)} x={0} y={props.h-props.thick}/>
        <Tile lum={lum} hue={hue} size={Vec2.make(props.thick, props.h)} x={0} y={0}/>
        <Tile lum={lum} hue={hue} size={Vec2.make(props.thick, props.h)} x={props.w-props.thick} y={0}/>
        </transform>)

}

export const Tile = (props) => {

  const [image, root] = useApp()

  const pivot = props.pivot || 0

  const lum = () => props.lum * 2
  const hue = () => props.hue * 2

  return (<transform quad={Quad.make(image(), lum(), hue(), 1, 1)} 
      pivot={Vec2.make(pivot, pivot)}
      size={props.size} 
      x={Math.round(props.x)} y={Math.round(props.y)}/>)
}

