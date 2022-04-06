import { createSignal, createContext, useContext } from 'soli2d-js'
import { Quad, Vec2, loop } from 'soli2d'

const AppContext = createContext<AppContextValue>({})

const AppProvider = (props) => {
  const [image, _setImage] = createSignal()
  const [root, _setRoot] = createSignal()

    let store = [image, root, {
      _setImage,
        _setRoot
    }]
  return (
    <AppContext.Provider value={store}>
      {props.children}
    </AppContext.Provider>)
  
}

export const useApp = () => useContext(AppContext)

const App = (_image, _root) => {

  let _App = () => {

    const [image, root, { _setImage, _setRoot }] = useApp()

      _setImage(_image)
      _setRoot(_root)


     loop((dt) => {
       root()._update_world()
       })


    return (<Game/>)
  }

  return () => (<AppProvider> <_App/> </AppProvider>)
}

export default App




export const Game = () => {



  
  return (<>
    <Tile x={10} y={100}/>
    <Tile x={200} y={200}/>
      </>)
}


export const Tile = (props) => {

  let [image] = useApp()
  return (<transform quad={Quad.make(image(), 0, 0, 128, 128)} size={Vec2.make(100, 100)} x={props.x} y={props.y}/>)
}
