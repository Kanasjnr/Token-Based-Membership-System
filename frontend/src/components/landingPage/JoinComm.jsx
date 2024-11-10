import React from 'react'

const JoinComm = () => {
  return (
    <div class=" text-white py-16 px-6 sm:px-12 lg:px-24 text-center">
    <h2 class="text-3xl sm:text-4xl font-bold mb-4">Join the Eventhub Community</h2>
    <p class="mb-8 max-w-2xl text-base mx-auto">Stay updated with the latest events and features. Be part of the future of decentralized event management.</p>
    <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
        <input type="email" placeholder="Enter Your Email" class="w-full sm:w-auto py-2 px-4 text-gray-800 rounded-lg focus:outline-none"/>
        <button class="w-full sm:w-auto px-6 py-2 bg-gray-300 text-purple-800 font-semibold rounded-lg hover:bg-gray-200 transition">Subscribe</button>
    </div>
</div>
  )
}

export default JoinComm
