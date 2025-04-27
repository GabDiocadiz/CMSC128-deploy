import { useState } from 'react'

import './App.css'
import { Landing_page } from './components/sections/Landing_page'
import "./index.css"
import ReactDOM from 'react-dom/client'
import Login from './components/sections/Login'
import Registration from './components/sections/Registration'
import MainPage from './components/sections/MainPage'
import ViewEventDetails from './components/sections/ViewEvent'
import ViewJobDetails from './components/sections/ViewJobPosting'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import { Admin_main } from './components/sections/Admin_main'
import { Results_page_accounts} from './components/sections/Results_accounts'
import { Results_page_jobs } from './components/sections/Results_job'
import { Results_page_events } from './components/sections/Results_event'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      {
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<MainPage/>} />

          <Route path="/reg" element={<Registration/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/admin_main" element={<Admin_main/>} />
          <Route path="/home" element={<MainPage/>} />
          <Route path="/jobs" element={<Results_page_jobs/>} />
          <Route path="/events" element={<Results_page_events/>} />
          <Route path="/job-details/:id" element={<ViewJobDetails/>} />
          <Route path="/event-details/:id" element={<ViewEventDetails/>} />
          
        </Routes>
        
      </BrowserRouter>
     }
    </>
  )
}

export default App
