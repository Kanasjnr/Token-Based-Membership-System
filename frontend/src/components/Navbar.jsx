import React from 'react'

function Navbar() {
  return (
    <nav className="relative z-10 w-full border-b border-white/20">
 <div className="absolute inset-0 bg-[url('/hero-bg.png?height=120&width=1440')] bg-repeat-x animate-wave"></div>
 <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          <div className="">
            <img 
              src="/eventhub.png" 
              alt="EventHub Logo" 
            //   className="h-8 w-8"
            />
            {/* <span className="text-white text-lg font-semibold">EventHub</span> */}
          </div>
          <div className="hidden sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
            <a href="#" className="text-white font-medium hover:text-opacity-80 transition-colors">
              Features
            </a>
            <a href="#" className="text-white font-medium hover:text-opacity-80 transition-colors">
              How It Works
            </a>
            <a href="#" className="text-white font-medium hover:text-opacity-80 transition-colors">
              Join
            </a>
          </div>
          <button className="bg-[#8859EC] w-[130px] h-[30px] text-white rounded-[5px] text-[15px] font-bold hover:bg-opacity-90 transition-colors animate-bounce">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar