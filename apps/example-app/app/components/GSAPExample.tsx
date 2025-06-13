'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function GSAPExample() {
  const [isPlaying, setIsPlaying] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic timeline animation
    timelineRef.current = gsap.timeline({ paused: true })
      .to(boxRef.current, { rotation: 360, duration: 1 })
      .to(boxRef.current, { x: 100, duration: 1 })
      .to(boxRef.current, { y: 50, backgroundColor: '#ff6b6b', duration: 1 })
      .to(boxRef.current, { scale: 1.5, duration: 0.5 })
      .to(boxRef.current, { scale: 1, x: 0, y: 0, backgroundColor: '#4ecdc4', duration: 1 });

    // Scroll trigger animation
    if (scrollBoxRef.current) {
      gsap.fromTo(scrollBoxRef.current, 
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: scrollBoxRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
            markers: false
          }
        }
      );
    }

    // Cleanup
    return () => {
      timelineRef.current?.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const playTimeline = () => {
    if (timelineRef.current) {
      if (isPlaying) {
        timelineRef.current.pause();
      } else {
        timelineRef.current.restart();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const morphAnimation = () => {
    gsap.to(boxRef.current, {
      duration: 2,
      morphSVG: "circle",
      borderRadius: "50%",
      ease: "power2.inOut"
    });
  };

  const staggerAnimation = () => {
    const boxes = document.querySelectorAll('.stagger-box');
    gsap.fromTo(boxes, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    );
  };

  return (
    <div className="p-6 border rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">GSAP (GreenSock)</h3>
      
      <div className="space-y-6">
        {/* Timeline Animation */}
        <div>
          <button
            onClick={playTimeline}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mb-4"
          >
            {isPlaying ? 'Pause' : 'Play'} Timeline
          </button>
          <div
            ref={boxRef}
            className="w-16 h-16 bg-teal-500 rounded-lg"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Complex timeline animation</p>
        </div>

        {/* Morph Animation */}
        <div>
          <button
            onClick={morphAnimation}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mb-4"
          >
            Morph Shape
          </button>
          <div className="w-16 h-16 bg-purple-500 rounded-lg" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Shape morphing animation</p>
        </div>

        {/* Stagger Animation */}
        <div>
          <button
            onClick={staggerAnimation}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4"
          >
            Stagger Animation
          </button>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className="stagger-box w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
              >
                {num}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Staggered entrance animation</p>
        </div>

        {/* Scroll Trigger */}
        <div className="h-64 overflow-y-auto border rounded p-4">
          <div className="h-96">
            <p className="mb-4">Scroll down to see the scroll trigger animation...</p>
            <div className="h-32" />
            <div
              ref={scrollBoxRef}
              className="w-24 h-24 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold"
            >
              Scroll!
            </div>
            <div className="h-32" />
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Scroll trigger animation</p>

        {/* Physics simulation */}
        <div>
          <button
            onClick={() => {
              gsap.to('.physics-ball', {
                y: 200,
                duration: 2,
                ease: "bounce.out"
              });
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mb-4"
          >
            Drop Ball
          </button>
          <div className="physics-ball w-16 h-16 bg-red-500 rounded-full" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Physics-based bounce animation</p>
        </div>
      </div>
    </div>
  );
}