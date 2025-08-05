import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-blue-500 text-white text-3xl font-bold">
        Tailwind 4.1 is Working!
      </div>
    </>
  )
}

export default App
