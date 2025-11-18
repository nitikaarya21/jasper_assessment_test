'use client'
import React from 'react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-pressed={theme === 'dark'}
      className="px-3 py-1 rounded-md border text-sm bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
    >
      {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  )
}
