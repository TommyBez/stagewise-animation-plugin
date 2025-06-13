'use client';

import dynamic from 'next/dynamic';
import CSSTransitionExample from './components/CSSTransitionExample';
import CSSKeyframesExample from './components/CSSKeyframesExample';

// Dynamic imports for components that use client-side libraries
const MotionExample = dynamic(() => import('./components/MotionExample'), {
  ssr: false,
  loading: () => <div className="p-6 border rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse">Loading Motion examples...</div>
});

const ReactSpringExample = dynamic(() => import('./components/ReactSpringExample'), {
  ssr: false,
  loading: () => <div className="p-6 border rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse">Loading React Spring examples...</div>
});

const GSAPExample = dynamic(() => import('./components/GSAPExample'), {
  ssr: false,
  loading: () => <div className="p-6 border rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse">Loading GSAP examples...</div>
});

const LottieExample = dynamic(() => import('./components/LottieExample'), {
  ssr: false,
  loading: () => <div className="p-6 border rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse">Loading Lottie examples...</div>
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Animation Packages Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            This example app demonstrates all the animation packages supported by the Animation Builder Plugin. 
            Each section below showcases a different animation library with interactive examples.
          </p>
        </div>

        {/* Animation Examples Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CSS Transitions */}
          <CSSTransitionExample />

          {/* CSS Keyframes */}
          <CSSKeyframesExample />

          {/* Motion (formerly Framer Motion) */}
          <MotionExample />

          {/* React Spring */}
          <ReactSpringExample />

          {/* GSAP */}
          <GSAPExample />

          {/* Lottie */}
          <LottieExample />
        </div>

        {/* Footer Information */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            About the Animation Builder Plugin
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Supported Animation Types
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <strong>CSS Transitions:</strong> Simple property transitions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>CSS Keyframes:</strong> Complex keyframe animations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  <strong>Motion:</strong> React animation library (formerly Framer Motion)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  <strong>React Spring:</strong> Spring-physics animations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  <strong>GSAP:</strong> Professional animation library
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  <strong>Lottie:</strong> After Effects animations
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                How to Use
              </h3>
              <ol className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                  Open the Stagewise Toolbar (development mode only)
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                  Select an element on the page
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                  Configure your animation in the Animation Builder panel
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">4</span>
                  Send your requirements to the AI assistant
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
