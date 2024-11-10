import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (

    <nav className="relative z-10 w-full overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-repeat-x h-[200px] w-full animate-wave"></div>
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-repeat-x h-[200px] w-full animate-wave" style={{ animationDelay: '-3s', opacity: '0.9' }}></div>
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-repeat-x h-[200px] w-full animate-wave" style={{ animationDelay: '-4s', opacity: '0.7' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-24 sm:h-32">
          <div className="flex-shrink-0">
            <img 
              src="/eventhub.png" 
              alt="EventHub Logo" 

              className="h-10 sm:h-12 w-auto animate-fade-in"
            />
          </div>
          <div className="hidden md:flex flex-row items-center gap-5 text-sm lg:gap-6">
            <a href="#" className="text-white font-bold text-lg hover:text-opacity-80 transition-colors animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Features
            </a>
            <a href="#" className="text-white font-bold text-lg hover:text-opacity-80 transition-colors animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              How It Works
            </a>
            <a href="#" className="text-white font-bold text-lg hover:text-opacity-80 transition-colors animate-fade-in-up" style={{ animationDelay: '300ms' }}>

              Join
            </a>
          </div>
          <div className="hidden md:block">

            <button className="bg-[#8859EC] w-36 h-10 text-white rounded-md text-base font-bold hover:bg-opacity-90 transition-colors animate-fade-in-up" style={{ animationDelay: '400ms' }}>

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

      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0) translateZ(0) scaleY(1); }
          50% { transform: translateX(-25%) translateZ(0) scaleY(0.55); }
          100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
        }
        .animate-wave {
          animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
          transform-origin: 0% 100%;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out;
          animation-fill-mode: both;
        }
      `}</style>

    </nav>
  )
}