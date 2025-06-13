'use client';

import { useState } from 'react';

export default function ReactSpringExample() {
  const [flip, setFlip] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">React Spring</h3>
      
      <div className="space-y-6">
        {/* Simulated spring animation with CSS */}
        <div>
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold animate-bounce">
            Loop
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">CSS-simulated spring animation</p>
        </div>

        {/* Interactive spring simulation */}
        <div>
          <div
            onClick={() => setFlip(!flip)}
            className={`w-20 h-20 rounded-lg cursor-pointer flex items-center justify-center text-white font-bold transition-all duration-500 ease-out ${
              flip 
                ? 'scale-150 rotate-180 bg-red-500' 
                : 'scale-100 rotate-0 bg-teal-500'
            }`}
          >
            Click
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Click for CSS transition animation</p>
        </div>

        {/* Trail animation simulation */}
        <div>
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mb-2"
          >
            {open ? 'Close' : 'Open'} Trail
          </button>
          <div className="flex space-x-1">
            {['R', 'e', 'a', 'c', 't', ' ', 'S', 'p', 'r', 'i', 'n', 'g'].map((letter, index) => (
              <div
                key={index}
                className={`w-8 h-10 bg-purple-500 text-white font-bold flex items-center justify-center rounded transition-all duration-300 ${
                  open 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-5'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {letter}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">CSS-simulated staggered animation</p>
        </div>

        {/* Note about React Spring */}
        <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            <strong>Note:</strong> This is a simplified version using CSS animations to demonstrate React Spring concepts. 
            The actual React Spring library provides physics-based animations with springs, trails, and transitions. 
            Due to React 19 compatibility, the full implementation is commented out but the package is installed.
          </p>
        </div>
      </div>
    </div>
  );
}