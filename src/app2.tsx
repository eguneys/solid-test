import { on, createEffect, createSignal, createContext, useContext } from 'soli2d-js'
import { Quad, Vec2, loop } from 'soli2d'
import Input from './input'
import { Mila as OMila } from './mila'

const colors = {
  sand2: [3, 1],
  red2: [4, 2],
  red3: [4, 3]
}

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
     }))


    return (<Game/>)
  }

  return () => (<AppProvider> <_App/> </AppProvider>)
}

export default App




export const Game = () => {


  let [{input, update}] = useApp()

  let res = 0
  const rotation=() => {
    update()
    res += 0.01
    return res
  }
  
  return (<>
      <Background/>
      <Mila/>
    <transform pivot={Vec2.make(20, 20)} y={100} x={100} rotation={rotation()}>
      <StrokeRect color={colors.red2} x={0} y={0} w={20} h={20}/>
      <StrokeRect color={colors.red2} x={21} y={0} w={20} h={20}/>
      <StrokeRect color={colors.red2} x={0} y={21} w={20} h={20}/>
    </transform>
    </>)
}

export const Mila = () => {

  let [{input, update}] = useApp()

  let [mila, setMila] = createSignal(new OMila(), { equals: false })

  let [hue, lum] = colors.red3

  createEffect(on(update, ([dt, dt0]) => {
    setMila(mila => {
      mila.update(dt, dt0)
      return mila
    })
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

    setMila(mila => {
      mila.input(Vec2.make(i_x, i_y))
      return mila
    })
  }))



  createEffect(() => {
    //console.log(mila().theta.x)
  })

  return (<transform rotation={Math.PI*0.25} pivot={Vec2.make(0.5, 0.5)} x={50} y={50}>
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

