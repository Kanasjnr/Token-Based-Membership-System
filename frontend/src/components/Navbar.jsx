import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="relative z-10 w-full">
      <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-repeat-x animate-wave h-[200px]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-24 sm:h-32">
          <div className="flex-shrink-0">
            <img 
              src="/eventhub.png" 
              alt="EventHub Logo" 
              className="h-10 sm:h-12 w-auto"
            />
          </div>
          <div className="hidden md:flex flex-row items-center gap-5 text-sm lg:gap-6">
            <a href="#" className="text-white font-bold text-lg hover:text-opacity-80 transition-colors">
              Features
            </a>
            <a href="#" className="text-white font-bold text-lg hover:text-opacity-80 transition-colors">
              How It Works
            </a>
            <a href="#" className="text-white font-bold text-lg hover:text-opacity-80 transition-colors">
              Join
            </a>
          </div>
          <div className="hidden md:block">
            <button className="bg-[#8859EC] w-36 h-10 text-white rounded-md text-base font-bold hover:bg-opacity-90 transition-colors">
              Connect Wallet
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-opacity-80 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full z-20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#3A06AA]">
            <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-bold">Features</a>
            <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-bold">How It Works</a>
            <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-bold">Join</a>
            <div className="px-3 py-2">
              <button className="bg-[#8859EC] w-full h-10 text-white rounded-md text-base font-bold hover:bg-opacity-90 transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}