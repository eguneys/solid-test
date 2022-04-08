import { Show, For, on, createEffect, createSignal, createContext, useContext } from 'soli2d-js'
import { Quad, Vec2, loop } from 'soli2d-js/web'
import Input from './input'
import { tile_no, tile_no_row, Game as OGame, Mila as OMila, Parabox as OParabox } from './mila'

import { color, hue, lum, colors } from './shared'


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
        console.log(root()._flat.map(_ => _.name).join(';'))
        //console.log(root()._flat.find(_ => _.name === 'milatransform').world.tx)
     }))

    return (<Game/>)
  }

  return () => (<AppProvider> <_App/> </AppProvider>)
}

export default App




export const Game = () => {

  let parent = OParabox.make(3),
      box = OParabox.make(1),
      b2 = OParabox.make(2)
  parent.add(tile_no(4, 4), box)
  box.add(tile_no(4, 4), b2)
  let _mila = new OMila(tile_no(0, 0))
  let _game = new OGame(box, _mila)

  let [game, setGame] = createSignal(_game, { equals: false })

  let [{input, update, root }] = useApp()

  // causes last item mila to render on top
  createEffect(() => {
    console.log(root()._flat.map(_ => [_.name, _.world.ty].join('')))
    
  })

  createEffect(on(update, ([dt, dt0]) => {
    setGame(game => {
      game.update(dt, dt0)
      return game
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

    setGame(game => {
      game.input(i_x, i_y)
      return game
    })
  }))



  return (<>
      <transform name={"milaparent"} x={160} y={90}>
        <Show when={game().parent}>
          <ParentBox box={game().parent}/>
        </Show>
        <Mila mila={game().mila}/>
      </transform>
    </>)
}


export const ParentBox = (props) => {
  
  return (<>
      <transform pivot={Vec2.make(80, 80)} scale={Vec2.make(1.2, 1.2)}>
      <Tile color={props.box.color} size={Vec2.make(160, 160)} x={0} y={0}/>
      </transform>
      <For each={props.box.flat}>{([no, box], i) =>
        <For each={props.box.flat}>{(_, i) =>
          <MilaBox name={'box' + i()} box={box} x={tile_no_row(no).x} y={tile_no_row(no).y} />  
        }</For>
      }</For>
    </>)

}

export const Box = (props) => {
  
  return (<>
    <Tile name={"first"} color={props.box.color} size={Vec2.make(160, 160)} x={0} y={0}/>
    <For each={props.box.flat}>{([no, box], i) =>
      <MilaBox name={'box' + i()} box={box} x={tile_no_row(no).x} y={tile_no_row(no).y} />  
    }</For>
    </>)
}

export const MilaBox = (props) => {

  const x = () => { return props.x * 16 }
  const y = () => { return props.y * 16 }

  return (<transform x={x()} y={y()}>
      <Tile name={props.name} color={props.box.color} size={Vec2.make(16, 16)} x={0} y={0}/>
    </transform>)
}

export const Mila = (props) => {

  const x = () => { return props.mila.x * 16 }
  const y = () => { return props.mila.y * 16 }

  return (<transform name={'milatransform'} pivot={Vec2.make(5, 5)} rotation={Math.PI*0.25} x={x()+8} y={y()+8}>
      <Tile name={'mila'} color={colors.red3} size={Vec2.make(10, 10)} x={0} y={0}/>
      </transform>)
}

export const Background = () => {
  return (<>
      <Tile color={colors.sand2} size={Vec2.make(320, 180)} x={0} y={0}/>
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
      x={Math.round(props.x)} y={Math.round(props.y)}/>)
}

