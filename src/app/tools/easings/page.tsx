'use client';

import { motion } from 'motion/react';

export default function EasingPage() {
  return (
    <main className="p-8 grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-8 content-start">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="border-l border-b border-current/20 aspect-video p-4 flex">
          <motion.div
            initial={{ x: '0%' }}
            animate={{ x: '400%' }}
            transition={{
              duration: 1,
              delay: 1,
              ease: [.25, .46, .45, .94]
            }}
            className="aspect-square w-1/5 bg-red-500 mt-auto"
          />
        </div>
      ))}
    </main>
  )
}
