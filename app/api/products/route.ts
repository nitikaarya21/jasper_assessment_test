import { NextResponse } from 'next/server'

export async function GET() {
  const products = [
    {
      id: '1',
      title: 'Classic Leather',
      description: 'Comfortable Leather chair with modern finish.',
      price: 129.0,
      rating: 4.6,
      image: '/images/chair.jpg',
      inStock: true,
      onSale: true
    },
    {
      id: '2',
      title: 'Elegant Chair',
      description: 'Hand-crafted elegent Chair with warm light.',
      price: 159.0,
      rating: 4.2,
      image: '/images/elegent.avif',
      inStock: false,
      onSale: false
    },
    {
      id: '3',
      title: 'Cushion Chair',
      description: 'Cushion Chair for Cafe, balcony Space etc.',
      price: 29.0,
      rating: 4.2,
      image: '/images/shopping.webp',
      inStock: true,
      onSale: false
    }
  ]
  return NextResponse.json(products)
}
