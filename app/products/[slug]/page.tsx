import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/products/product-detail'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { supabase } from '@/lib/supabase'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('name, description, images')
      .eq('slug', params.slug)
      .single()
    
    if (error || !product) {
      return {
        title: 'Product Not Found - ómorfo',
      }
    }

    return {
      title: `${product.name} - ómorfo`,
      description: product.description,
      openGraph: {
        title: `${product.name} - ómorfo`,
        description: product.description,
        images: product.images,
      },
    }
  } catch (error) {
    return {
      title: 'Product Not Found - ómorfo',
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('slug', params.slug)
      .single()

    if (error || !product) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <Suspense fallback={<LoadingSpinner />}>
            <ProductDetail product={product} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }
}
