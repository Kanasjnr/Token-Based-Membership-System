import React from 'react'
import { Calendar, Users, Box } from 'lucide-react'

function Features() {
  const features = [
    {
      title: 'Create Event',
      description: 'Easily create and manage events on the blockchain.',
      icon: Calendar,
    },
    {
      title: 'Join with Tokens',
      description: 'Use EVH tokens to participate in exclusive events.',
      icon: Users,
    },
    {
      title: 'Proposal Voting',
      description: 'Vote on event proposals based on your token holdings.',
      icon: Box,
    },
  ]

  return (
    <div className="relative z-10 py-16 sm:py-24">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 animate-fade-in-up">
      Key Features
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="w-[289px] h-[250px] bg-white backdrop-blur-lg rounded-[20px] p-6 text-center transform transition-all duration-300 hover:scale-105 animate-fade-in-up mx-auto"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="flex justify-center mb-4">
            <feature.icon className="h-12 w-12 text-[#3A06AA] animate-bounce" />
          </div>
          <h3 className="text-[28px] font-bold text-black mb-2">{feature.title}</h3>
          <p className="text-black font-regular text-[18px] ">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</div>

  )
}

export default Features