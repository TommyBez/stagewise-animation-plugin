'use client';

import { useState } from 'react';

export default function CSSKeyframesExample() {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">CSS Keyframes</h3>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes spin-color {
          0% {
            transform: rotate(0deg);
            background-color: #3b82f6;
          }
          25% {
            transform: rotate(90deg);
            background-color: #ef4444;
          }
          50% {
            transform: rotate(180deg);
            background-color: #10b981;
          }
          75% {
            transform: rotate(270deg);
            background-color: #f59e0b;
          }
          100% {
            transform: rotate(360deg);
            background-color: #3b82f6;
          }
        }

        .bounce-animation {
          animation: bounce 2s infinite;
        }

        .pulse-animation {
          animation: pulse 1.5s infinite;
        }

        .spin-color-animation {
          animation: spin-color 3s infinite;
        }

        .custom-keyframe {
          animation: ${isAnimating ? 'bounce 1s infinite, pulse 2s infinite' : 'none'};
        }
      `}</style>
      
      <div className="space-y-4">
        {/* Bounce animation */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full bounce-animation"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Continuous bounce</span>
        </div>

        {/* Pulse animation */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-500 rounded-lg pulse-animation"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Pulsing effect</span>
        </div>

        {/* Spin with color change */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg spin-color-animation"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Spin with color change</span>
        </div>

        {/* Toggle animation */}
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 bg-purple-500 rounded-full custom-keyframe ${isAnimating ? 'opacity-100' : 'opacity-50'}`}></div>
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            {isAnimating ? 'Stop Animation' : 'Start Animation'}
          </button>
        </div>
      </div>
    </div>
  );
}