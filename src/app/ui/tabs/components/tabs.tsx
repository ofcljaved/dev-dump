'use client';

import { AtSign, Bolt, LayoutGrid, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react";

interface TabsProps {
  isSlow: boolean;
}
export function Tabs({ isSlow }: TabsProps) {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <ul
      className={cn(
        "flex gap-6 items-center relative",
        "before:absolute before:rounded-full before:[position-anchor:--active-tab] before:mix-blend-difference",
        "before:transition-all before:ease",
        isSlow ? "before:duration-[2s]" : "before:duration-300",
        "before:top-[anchor(top)] before:left-[anchor(left)] before:right-[anchor(right)] before:bottom-[anchor(bottom)]",
        "before:bg-white",
      )}
    >
      {TABS.map((tab) => (
        <li key={tab.name}>
          <button
            data-tab={tab.name}
            data-active={activeTab === tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={cn(
              "outline-none transition-all duration-300",
              "flex gap-1.5 items-center border rounded-full px-4 py-1.5 cursor-pointer border-transparent text-neutral-900",
              "hover:text-neutral-800 focus-visible:text-neutral-800",
              "focus-visible:ring-4 focus-visible:ring-neutral-300",
              "data-[active=true]:[anchor-name:--active-tab]",
              "dark:text-neutral-300 dark:focus-visible:text-neutral-50 dark:hover:text-neutral-50 dark:focus-visible:ring-neutral-500",
            )}
          >
            <tab.icon className="size-4" />
            {tab.name}
          </button>
        </li>
      ))}
    </ul>
  )
}

const TABS = [
  {
    name: 'Home',
    icon: LayoutGrid,
  },
  {
    name: 'Profile',
    icon: User,
  },
  {
    name: 'Settings',
    icon: Bolt,
  },
  {
    name: 'Messages',
    icon: AtSign,
  }
]
