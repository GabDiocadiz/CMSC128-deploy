import { useState } from 'react'

import './App.css'
import { Landing_page } from './components/sections/Landing_page'
import "./index.css"
import ReactDOM from 'react-dom/client'
import Login from './components/sections/Login'
import Registration from './components/sections/Registration'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import { Admin_main } from './components/sections/Admin_main'
import { Results_page_accounts} from './components/sections/Results_accounts'
import { Results_page_jobs } from './components/sections/Results_job'
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      {
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Results_page_jobs/>} />
          <Route path="/reg" element={<Registration/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/admin_main" element={<Admin_main/>} />
          
        </Routes>
        
      </BrowserRouter>
     }
    </>
  )
}

export default App
