'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import React from 'react'
import { useCart, Product as CartProduct } from './CartProvider'

export type Product = CartProduct

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-200"
      aria-labelledby={`title-${product.id}`}
    >
      <figure className="relative h-56 w-full">
        <Image
          src={product.image}
          alt={product.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 640px) 100vw, 400px"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {!product.inStock && (
            <span className="text-xs px-2 py-1 bg-red-600 text-white rounded">Out of stock</span>
          )}
          {product.onSale && product.inStock && (
            <span className="text-xs px-2 py-1 bg-yellow-400 text-black rounded">Sale</span>
          )}
        </div>
      </figure>

      <div className="p-4 text-center">
        <h3 id={`title-${product.id}`} className="font-semibold text-lg">
          {product.title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between text-sm">
          <div>
            <span className="font-medium">${product.price.toFixed(2)}</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">• {product.rating} ★</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button
          disabled={!product.inStock}
          onClick={() => add(product)}
          aria-label={product.inStock ? `Add ${product.title} to cart` : `${product.title} is out of stock`}
          className={`w-full px-4 py-3 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 transition
            ${product.inStock ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of stock'}
        </button>
      </div>
    </motion.article>
  )
}
