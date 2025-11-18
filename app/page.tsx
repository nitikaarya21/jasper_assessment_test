import ProductGridClient from '@/components/ProductGridClient'
import { Product } from '@/components/ProductCard'
import { headers } from "next/headers";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host");         
  const protocol = h.get("x-forwarded-proto") ?? "http"; 

  return `${protocol}://${host}`;
}



async function getProducts(): Promise<Product[]> {
  const baseUrl = await getBaseUrl(); 
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