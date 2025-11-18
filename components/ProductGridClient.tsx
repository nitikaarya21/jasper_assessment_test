'use client'
import React from 'react'
import ProductCard from './ProductCard'
import { Product } from './ProductCard'
import { CartProvider, useCart } from './CartProvider'
import { ThemeProvider } from './ThemeProvider'
import ThemeToggle from './ThemeToggle'

function CartStatus() {
  const { count, items, clear } = useCart()
  return (
    <div className="flex items-center gap-3">
      <div className="text-sm">Cart: <strong>{count}</strong></div>
      {items.length > 0 && (
        <button onClick={clear} className="px-2 py-1 text-xs border rounded">Clear</button>
      )}
    </div>
  )
}

export default function ProductGridClient({ products }: { products: Product[] }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <ThemeToggle />
            <CartStatus />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 items-start justify-center">
            {products.map((p) => (
              <div key={p.id} className="w-full flex justify-center">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </CartProvider>
    </ThemeProvider>
  )
}
