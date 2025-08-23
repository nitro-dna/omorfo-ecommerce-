'use client'

import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  structuredData?: any
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
}

interface ProductStructuredData {
  name: string
  description: string
  image: string
  price: number
  currency: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  brand: string
  category: string
  sku?: string
  mpn?: string
  gtin?: string
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
  offers: {
    price: number
    priceCurrency: string
    availability: string
    url: string
  }
}

interface OrganizationStructuredData {
  name: string
  url: string
  logo: string
  description: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint: {
    telephone: string
    contactType: string
    email: string
  }
  sameAs: string[]
}

export function SEO({
  title = 'ómorfo - Premium Custom Posters',
  description = 'Discover and purchase high-quality custom posters. From abstract art to vintage designs, find the perfect poster for your space with ómorfo.',
  keywords = 'posters, wall art, custom posters, home decor, art prints, vintage posters, abstract art',
  image = '/og-image.jpg',
  url = 'https://omorfo.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'ómorfo',
  section,
  tags = [],
  structuredData,
  noindex = false,
  nofollow = false,
  canonical
}: SEOProps) {
  const fullTitle = title.includes('ómorfo') ? title : `${title} - ómorfo`
  const fullUrl = canonical || url
  const fullImage = image.startsWith('http') ? image : `https://omorfo.com${image}`

  // Generate meta robots content
  const robots = []
  if (noindex) robots.push('noindex')
  if (nofollow) robots.push('nofollow')
  if (!noindex && !nofollow) robots.push('index, follow')

  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type === 'product' ? 'Product' : type === 'article' ? 'Article' : 'WebSite',
      name: fullTitle,
      description,
      url: fullUrl,
      image: fullImage,
      publisher: {
        '@type': 'Organization',
        name: 'ómorfo',
        logo: {
          '@type': 'ImageObject',
          url: 'https://omorfo.com/logo.png'
        }
      }
    }

    if (structuredData) {
      return { ...baseData, ...structuredData }
    }

    return baseData
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots.join(', ')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="ómorfo" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:type" content={type} />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@omorfo" />
      <meta name="twitter:creator" content="@omorfo" />

      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no, address=no, email=no" />
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />
    </Head>
  )
}

// Specialized SEO components

// Product SEO Component
export function ProductSEO({
  product,
  url
}: {
  product: ProductStructuredData
  url: string
}) {
  const structuredData = {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    category: product.category,
    sku: product.sku,
    mpn: product.mpn,
    gtin: product.gtin,
    aggregateRating: product.aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: product.aggregateRating.ratingValue,
      reviewCount: product.aggregateRating.reviewCount
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency,
      availability: product.offers.availability,
      url: product.offers.url
    }
  }

  return (
    <SEO
      title={product.name}
      description={product.description}
      type="product"
      url={url}
      image={product.image}
      structuredData={structuredData}
    />
  )
}

// Article SEO Component
export function ArticleSEO({
  title,
  description,
  image,
  url,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags
}: {
  title: string
  description: string
  image: string
  url: string
  publishedTime: string
  modifiedTime?: string
  author: string
  section?: string
  tags?: string[]
}) {
  const structuredData = {
    '@type': 'Article',
    headline: title,
    description,
    image,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'ómorfo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://omorfo.com/logo.png'
      }
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  }

  return (
    <SEO
      title={title}
      description={description}
      type="article"
      url={url}
      image={image}
      publishedTime={publishedTime}
      modifiedTime={modifiedTime}
      author={author}
      section={section}
      tags={tags}
      structuredData={structuredData}
    />
  )
}

// Organization SEO Component
export function OrganizationSEO({
  organization
}: {
  organization: OrganizationStructuredData
}) {
  const structuredData = {
    '@type': 'Organization',
    name: organization.name,
    url: organization.url,
    logo: organization.logo,
    description: organization.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: organization.address.streetAddress,
      addressLocality: organization.address.addressLocality,
      addressRegion: organization.address.addressRegion,
      postalCode: organization.address.postalCode,
      addressCountry: organization.address.addressCountry
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: organization.contactPoint.telephone,
      contactType: organization.contactPoint.contactType,
      email: organization.contactPoint.email
    },
    sameAs: organization.sameAs
  }

  return (
    <SEO
      title={organization.name}
      description={organization.description}
      structuredData={structuredData}
    />
  )
}

// Breadcrumb SEO Component
export function BreadcrumbSEO({
  items
}: {
  items: Array<{ name: string; url: string }>
}) {
  const structuredData = {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

// FAQ SEO Component
export function FAQSEO({
  questions
}: {
  questions: Array<{ question: string; answer: string }>
}) {
  const structuredData = {
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}
