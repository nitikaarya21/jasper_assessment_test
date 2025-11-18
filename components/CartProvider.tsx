'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

export type Product = {
  id: string
  title: string
  description: string
  price: number
  rating: number
  image: string
  inStock?: boolean
  onSale?: boolean
}

type CartItem = { product: Product; qty: number }

type CartContextType = {
  items: CartItem[]
  add: (p: Product, qty?: number) => void
  remove: (productId: string) => void
  clear: () => void
  count: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('cart')
    if (raw) setItems(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const add = (product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { product, qty }]
    })
  }

  const remove = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  const clear = () => setItems([])

  const count = items.reduce((s, i) => s + i.qty, 0)

  return <CartContext.Provider value={{ items, add, remove, clear, count }}>{children}</CartContext.Provider>
}
