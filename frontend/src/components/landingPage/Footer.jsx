import React from 'react'

const Footer = () => {
    return (
        <footer class="text-gray-300 py-8 px-6 sm:px-12 lg:px-24 text-center">
            <div class="text-sm mb-4">&copy; 2024 Eventhub. All rights reserved.</div>
            <div class="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <a href="#" class="hover:text-white transition">Terms Of Service</a>
                <a href="#" class="hover:text-white transition">Privacy Policy</a>
                <a href="#" class="hover:text-white transition">Contact Us</a>
            </div>
        </footer>
    )
}

export default Footer
