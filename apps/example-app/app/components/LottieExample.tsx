'use client';

import { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

export default function LottieExample() {
  const [speed, setSpeed] = useState(1);

  // Sample Lottie animation URLs from LottieFiles
  const animations = [
    {
      name: 'Loading',
      url: 'https://lottie.host/4f63f3d7-3e68-4f98-b8e3-1b42de2722a2/Nmo8sKyp3V.json'
    },
    {
      name: 'Success',
      url: 'https://lottie.host/54b33864-47e1-4f6a-a562-ce895a5a6d8d/gFYNYJdHLs.json'
    },
    {
      name: 'Heart',
      url: 'https://lottie.host/d5daf6d7-0af7-47c2-af29-47298b50e85e/1lk2u0k1bd.json'
    }
  ];

  const [currentAnimation, setCurrentAnimation] = useState(animations[0]);

  return (
    <div className="p-6 border rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Lottie Animations</h3>
      
      <div className="space-y-6">
        {/* Animation Player */}
        <div className="flex flex-col items-center">
          <Player
            src={currentAnimation.url}
            className="player"
            loop
            autoplay
            style={{ height: '200px', width: '200px' }}
          />
          
          <div className="mt-4 space-y-2">
            {/* Speed Control Display */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
              {[0.5, 1, 1.5, 2].map((speedValue) => (
                <button
                  key={speedValue}
                  onClick={() => setSpeed(speedValue)}
                  className={`px-3 py-1 rounded text-sm ${
                    speed === speedValue
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {speedValue}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Animation Selector */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Select Animation:</h4>
          <div className="flex space-x-2">
            {animations.map((animation) => (
              <button
                key={animation.name}
                onClick={() => setCurrentAnimation(animation)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentAnimation.name === animation.name
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {animation.name}
              </button>
            ))}
          </div>
        </div>

        {/* Simple inline Lottie examples */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Small Examples:</h4>
          <div className="flex space-x-4">
            <Player
              autoplay
              loop
              src="https://lottie.host/54b33864-47e1-4f6a-a562-ce895a5a6d8d/gFYNYJdHLs.json"
              style={{ height: '80px', width: '80px' }}
            />
            <Player
              autoplay
              loop
              src="https://lottie.host/d5daf6d7-0af7-47c2-af29-47298b50e85e/1lk2u0k1bd.json"
              style={{ height: '80px', width: '80px' }}
            />
            <Player
              autoplay
              loop
              src="https://lottie.host/4f63f3d7-3e68-4f98-b8e3-1b42de2722a2/Nmo8sKyp3V.json"
              style={{ height: '80px', width: '80px' }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Auto-playing looped animations</p>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Lottie</strong> allows you to use After Effects animations directly in your web apps. 
            These examples use free animations from LottieFiles. You can create your own in After Effects 
            and export them with the Bodymovin plugin.
          </p>
        </div>
      </div>
    </div>
  );
}