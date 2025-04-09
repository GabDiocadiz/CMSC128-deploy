import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Landing_page } from './components/sections/Landing_page'
import "./index.css"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {
        
      <Landing_page></Landing_page>
      
     }
    </>
  )
}

export default App
