import React from 'react'
// import swapPhoto from "../../public/Tokenswap.svg"

const SwapSteps = () => {
  return (
    <div class=" text-white py-16 px-6 sm:px-12 lg:px-24">
    <h2 class="text-3xl sm:text-4xl font-bold text-center mb-8 lg:mb-16">How It Works </h2>
    <div class="flex flex-col wrap md:flex-row items-center md:justify-between space-y-8 md:space-y-0 md:space-x-8">
        <div class=" space-y-2 lg:space-y-8  md:w-1/2">
            <div class="flex items-center justify-start space-x-4">
                <div class="bg-white text-purple-800 font-bold rounded-full h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center">1</div>
                <p className='lg:text-[26px]'>Swap USDT for EVH tokens</p>
            </div>
            <div class="flex items-center justify-start justify-start space-x-4">
                <div class="bg-white text-purple-800 font-bold rounded-full h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center">2</div>
                <p className='lg:text-[26px]'>Create or join events using EVH</p>
            </div>
            <div class="flex items-center justify-start space-x-4">
                <div class="bg-white text-purple-800 font-bold rounded-full h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center">3</div>
                <p className='lg:text-[26px]'>Creators propose event changes</p>
            </div>
            <div class="flex items-center justify-start space-x-4">
                <div class="bg-white text-purple-800 font-bold rounded-full h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center">4</div>
                <p className='lg:text-[26px]'>Participants vote based on token holdings</p>
            </div>
            <div class="flex items-center justify-start space-x-4">
                <div class="bg-white text-purple-800 font-bold rounded-full h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center">5</div>
                <p className='lg:text-[26px]'>Enjoy community-driven events!</p>
            </div>
        </div>
        
        <div class=" bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3 text-purple-800">
            
            {/* <img src={swapPhoto} alt="Swap" /> */}

            <div class="text-center swaptextclr text-lg font-bold mb-4">Swap</div>
            <div class="space-y-4">
                <div class="flex swapbg items-center justify-between p-4 bg-gray-100 rounded-lg">
                    <span class="text-sm bg-black text-gray-300 py-1 px-2 rounded-md font-semibold">Usdt</span>
                    <input type="number" placeholder="0.00" class="text-right text-gray-300 bg-transparent  focus:outline-none w-20 sm:w-32"/>
                </div>
                <div class="flex items-center justify-center">
                    <div class="text-2xl swaptextclr font-bold">⇅</div>
                </div>
                <div class="flex swapbg items-center justify-between p-4 bg-gray-100 rounded-lg">
                    <span class="text-sm bg-black text-gray-300 py-1 px-2 rounded-md font-semibold">EVH</span>
                    <input type="number" placeholder="0.00" class="text-right text-gray-300  bg-transparent focus:outline-none w-20 sm:w-32"/>
                </div>
                <p class="text-center text-sm text-gray-600">1 EVH = 1.53 USDT</p>
                <button class="w-full py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition">Swap</button>
            </div>

        </div>
    </div>
</div>
  )
}

export default SwapSteps
