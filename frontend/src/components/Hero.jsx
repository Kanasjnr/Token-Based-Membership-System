import React from 'react'

export default function Hero() {
  return (
    <section className="relative z-10 py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white">
            Revolutionize Your{' '}
            <span className="inline-block animate-pulse">Events</span>{' '}
            with Web3
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto animate-fade-in-up">
            Create, join, and vote on events using EVH tokens.
          </p>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            Empower your community with decentralized decision-making.
          </p>
          <div className="mt-8 sm:mt-10 flex justify-center space-x-4">
            <a
              href="#create-event"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
            >
              Create Event
            </a>
            <a
              href="#learn-more"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}