/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// ----------------------
// Module mocks
// ----------------------

// Mock next/image -> plain <img> so JSDOM can render it
jest.mock('next/image', () => {
  return function MockImage(props: any) {
    // Keep alt & src for accessibility assertions
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} src={props.src} alt={props.alt} />
  }
})

// Mock framer-motion -> passthrough components (motion.article etc.)
jest.mock('framer-motion', () => {
  const React = require('react')
  const passthrough = (tag: string) => (props: any) => React.createElement(tag, props, props.children)
  return {
    motion: new Proxy(
      {},
      {
        get: (_target: any, prop: string) => passthrough(prop),
      }
    ),
  }
})

// Import components after mocks so they pick up mocked modules
import ProductCard from '../components/ProductCard'
import ProductGridClient from '../components/ProductGridClient'
import { CartProvider } from '../components/CartProvider'

// ----------------------
// Helper: product factory (no JSON)
// ----------------------
type ProductShape = {
  id: string
  title: string
  description: string
  price: number
  rating: number
  image: string
  inStock: boolean
  onSale?: boolean
}

/**
 * Create product objects programmatically (factory).
 * This avoids any external JSON/fixture files and keeps types consistent.
 */
function makeProduct(overrides?: Partial<ProductShape>): ProductShape {
  const base: ProductShape = {
    id: String(Math.floor(Math.random() * 10000)),
    title: 'Default Chair',
    description: 'Comfortable seat with modern finish.',
    price: 49.0,
    rating: 4.2,
    image: '/images/default.jpg',
    inStock: true,
    onSale: false,
  }
  return { ...base, ...overrides }
}

// ----------------------
// Tests
// ----------------------
describe('ProductCard - unit', () => {
  const testProducts = [
    makeProduct({
      id: 'p1',
      title: 'Classic Leather',
      price: 129,
      image: '/images/chair.jpg',
      inStock: true,
      onSale: true,
    }),
    makeProduct({
      id: 'p2',
      title: 'Elegant Chair',
      price: 159.0,
      image: '/images/elegant.avif',
      inStock: false,
    }),
    makeProduct({
      id: 'p3',
      title: 'Cushion Chair',
      price: 29.0,
      image: '/images/shopping.webp',
      inStock: true,
    }),
  ]

  test.each(testProducts)('renders product "%s" correctly', (product) => {
    render(
      <CartProvider>
        <ProductCard product={product as any} />
      </CartProvider>
    )

    // Title
    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument()

    // Price formatted as $xx.xx
    const priceText = `$${product.price.toFixed(2)}`
    expect(screen.getByText(priceText)).toBeInTheDocument()

    // Image: role=img with alt matching title and correct src
    const img = screen.getByRole('img', { name: new RegExp(product.title, 'i') })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', product.image)

    // Button exists and has aria-label
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-label')

    // Disabled state if out of stock
    if (!product.inStock) {
      expect(btn).toBeDisabled()
      expect(btn).toHaveTextContent(/out of stock/i)
    } else {
      expect(btn).toBeEnabled()
      // CTA is expected to be "Add to Cart" or similar when in-stock
      expect(btn).toHaveTextContent(/add to cart|view more/i)
    }

    // cleanup between iterations is handled by testing-library automatically
  })
})

describe('ProductGridClient - responsiveness classes', () => {
  it('renders grid wrapper with responsive Tailwind classes', () => {
    // Create small product list to render the grid
    const products = [makeProduct({ id: 'a' }), makeProduct({ id: 'b' }), makeProduct({ id: 'c' })]

    const { container } = render(
      <CartProvider>
        {/* ProductGridClient internally uses ThemeProvider & CartProvider in production code;
            rendering inside CartProvider is sufficient for DOM checks here. */}
        <ProductGridClient products={products as any} />
      </CartProvider>
    )

    // Ensure grid container exists and contains the responsive grid classes.
    // This proves you included Tailwind responsive classes like 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'.
    const grid = container.querySelector('div.grid')
    expect(grid).toBeTruthy()

    // Check for at least one responsive class token on the grid element
    const classList = grid?.className ?? ''
    expect(classList).toMatch(/grid-cols-1/)
    // Typical responsive tokens you should have:
    expect(classList).toMatch(/sm:grid-cols-2|md:grid-cols-3|lg:grid-cols-4/)

    // Also verify number of rendered product cards equals products length
    const articles = container.querySelectorAll('article')
    expect(articles.length).toBe(products.length)
  })
})
