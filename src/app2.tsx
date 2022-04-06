import { createSignal, createContext, useContext } from 'soli2d-js'
import { Quad, Vec2 } from 'soli2d'


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


    let [s, setS] = createSignal(0)
      setTimeout(() => {

          setS(7)
          root()._update_world()
          },1000)
    return (<transform quad={Quad.make(image(), 0, 0, 100, 100)} size={Vec2.make(100, 100)} x={s()<5?100:200}/>)
  }

  return () => (<AppProvider> <_App/> </AppProvider>)
}


export default App
