'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function MotionExample() {
  const [isVisible, setIsVisible] = useState(true);
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Motion (formerly Framer Motion)</h3>
      
      <div className="space-y-6">
        {/* Basic motion */}
        <motion.div
          className="w-16 h-16 bg-purple-500 rounded-lg cursor-pointer"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        />

        {/* Layout animation */}
        <motion.div
          className="w-32 h-16 bg-pink-500 rounded-lg cursor-pointer flex items-center justify-center text-white font-semibold"
          layout
          onClick={() => setCount(count + 1)}
          animate={{ 
            x: count * 20,
            backgroundColor: count % 2 === 0 ? "#ec4899" : "#8b5cf6" 
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          Click me ({count})
        </motion.div>

        {/* Stagger animation */}
        <div className="flex space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-8 h-8 bg-indigo-500 rounded-full"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        {/* Enter/Exit animation */}
        <div className="space-y-2">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isVisible ? 'Hide' : 'Show'} Element
          </button>
          
          <AnimatePresence>
            {isVisible && (
              <motion.div
                className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                I can smoothly appear and disappear!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gesture animation */}
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full cursor-grab"
          drag
          dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
          whileDrag={{ scale: 1.1 }}
          dragElastic={0.2}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">☝️ Drag me around!</p>
      </div>
    </div>
  );
}