'use client';

import { useState } from 'react';

export default function CSSTransitionExample() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">CSS Transitions</h3>
      
      <div className="space-y-4">
        {/* Hover transition */}
        <div
          className="p-4 bg-blue-500 text-white rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-105 hover:shadow-lg"
        >
          Hover me for smooth transition
        </div>

        {/* Click transition */}
        <div
          className={`p-4 rounded-lg cursor-pointer transition-all duration-500 ease-in-out ${
            isClicked 
              ? 'bg-green-500 text-white transform rotate-3 scale-110' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => setIsClicked(!isClicked)}
        >
          Click me to toggle state
        </div>

        {/* Multiple property transition */}
        <div
          className="w-16 h-16 bg-purple-500 rounded-full transition-all duration-700 ease-in-out hover:w-32 hover:bg-pink-500 hover:rounded-lg"
        >
        </div>
      </div>
    </div>
  );
}