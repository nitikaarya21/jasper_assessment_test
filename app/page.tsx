import ProductGridClient from '@/components/ProductGridClient'
import { Product } from '@/components/ProductCard'


async function getProducts(): Promise<Product[]> {
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' })
if (!res.ok) return []
return res.json()
}


export default async function Page() {
const products = await getProducts()
const onAdd = (p: Product) => {
  // in a real app this would be client logic; here we use simple alert
  alert(`Added ${p.title} to cart`)
}
return (
  <main className="w-full flex justify-center">
      <div className="py-6">
        {products.length > 0 ? (
          <ProductGridClient products={products} />
        ) : (
          <p>No products available</p>
        )}
      </div>
    </main>
)
}