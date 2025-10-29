'use client';

import { motion } from 'motion/react';
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis } from 'recharts';

export default function EasingPage() {
  return (
    <main className="p-8 grid grid-cols-[repeat(auto-fill,minmax(450px,1fr))] gap-8 content-start">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="border border-current/10 rounded-xl aspect-video flex flex-col p-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={600}
              height={300}
              data={[
                { p: 0 },
                { p: 0.25 },
                { p: 0.46 },
                { p: 0.45 },
                { p: 0.94 },
              ]}
              margin={{
                left: -50,
                bottom: -20,
              }}
            >
              <XAxis tick={false} />
              <YAxis tick={false} />
              <Line className='text-pink-400/50' dataKey="p" type="monotone" dot={false} stroke="currentColor" />
            </LineChart>
          </ResponsiveContainer>
          <motion.div
            initial={{ x: '25%' }}
            animate={{ x: '600%' }}
            transition={{
              duration: 1,
              delay: 1,
              ease: [.25, .46, .45, .94],
            }}
            className="aspect-square w-1/8 bg-red-500 absolute bottom-8"
          />
        </div>
      ))}
    </main>
  )
}
