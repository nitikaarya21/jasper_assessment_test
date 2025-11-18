import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Product Card Demo'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden flex items-center justify-center p-6">
          {children}
      </body>
    </html>
  )
}
