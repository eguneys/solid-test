import { createSignal } from 'solid-js'

const App = () => {

  let [hello, setHello] = createSignal('hello')


  setTimeout(() => {
   setHello('world')
      }, 1000)

  return (<div>{hello()}</div>)
}

export default App
