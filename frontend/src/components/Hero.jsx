import React from 'react'

function Hero() {
  return (
    <div className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-white">Revolutionize Your </span>
            <span className="text-white animate-pulse">Events</span>
            <span className="text-white"> with Web3</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white max-w-3xl mx-auto animate-fade-in-up">
            Create, join, and vote on events using EVH tokens.
          </p>
          <p className="mt-2 text-lg sm:text-xl text-white max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
            Empower your community with decentralized decision-making.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero