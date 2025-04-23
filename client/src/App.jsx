import { useState } from 'react'

import './App.css'
import { Landing_page } from './components/sections/Landing_page'
import "./index.css"

import Login from './components/sections/Login'
import Registration from './components/sections/Registration'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {
        
      //<Landing_page></Landing_page>
      <Registration></Registration>
     }
    </>
  )
}

export default App
