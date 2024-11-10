import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Feautres'
import SwapSteps from './components/SwapSteps'


function App() {
  return (
    <div className="min-h-screen bg-[#3A06AA] relative overflow-hidden">
      
      <Navbar  />
      <Hero />
      <Features />
      <SwapSteps/>
    </div>
  )
}

export default App