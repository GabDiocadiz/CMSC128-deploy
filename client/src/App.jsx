import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './App.css'
import { Landing_page } from './components/sections/Landing_page'
import "./index.css"

import Login from './components/sections/Login'
import Registration from './components/sections/Registration'
import MainPage from './components/sections/MainPage'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       {
        
//       //<Landing_page></Landing_page>
//       // <Registration></Registration>
//       <MainPage></MainPage>
//      }
//     </>
//   )
// }

function App() {
  const router = createBrowserRouter([
    // {
    //   path: "/",
    //   element: (
    //     <Landing_page />
    //   ),
    // },
    // {
    //   path: "/login",
    //   element: (
    //     <Login />
    //   )
    // },{
    //   path: "/register",
    //   element: (
    //     <Registration />
    //   )
    // },
    {
      path: "/",
      element: (
        <MainPage />
      )
    },
    {
      path: "/home",
      element: (
        <MainPage />
      )
    },
    {
      path: "/jobs",
      element: (
        <Landing_page />
      )
    },
    {
      path: "/book-event",
      element: (
        <Landing_page />
      )
    },
    {
      path: "/search-alumni",
      element: (
        <Landing_page />
      )
    }
  ]);

  return (
    <div className="h-full w-full bg-base0">
      <RouterProvider router={router} />
    </div>
  );
}

export default App
