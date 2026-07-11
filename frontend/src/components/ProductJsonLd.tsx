import { useEffect } from 'react'
import type { Product } from '../data/products'
import { US_SHIPPING_USD } from '../lib/currency'
import { BUSINESS, hasPhysicalAddress } from '../data/business'

const SHOP = BUSINESS.shopUrl

function productImage(slug: string): string {
  return `${SHOP}/products/emotional/${slug}/hero-960.webp`
}

type Props = {
  product: Product
  imageUrl?: string
}

/** Product + Offer JSON-LD, with no AggregateRating (no fabricated reviews). */
export function ProductJsonLd({ product, imageUrl }: Props) {
  useEffect(() => {
    const price = product.tiers[0]?.price ?? product.base_price
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title_ar,
      description: product.description_en || product.subtitle_ar,
      image: [imageUrl || productImage(product.slug)],
      sku: product.slug,
      mpn: product.mpn,
      brand: {
        '@type': 'Brand',
        name: product.brand || 'Nafas',
      },
      offers: {
        '@type': 'Offer',
        url: `${SHOP}/product/${product.slug}`,
        priceCurrency: 'USD',
        price: price.toFixed(2),
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: US_SHIPPING_USD.toFixed(2),
            currency: 'USD',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'US',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 3,
              maxValue: 7,
              unitCode: 'DAY',
            },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'US',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 30,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
          merchantReturnLink: BUSINESS.returnsUrl,
        },
      },
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'nafas-product-jsonld'
    script.text = JSON.stringify(data)
    document.getElementById('nafas-product-jsonld')?.remove()
    document.head.appendChild(script)
    document.title = `${product.title_ar} | Nafas`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', product.description_en || product.subtitle_ar)

    return () => {
      document.getElementById('nafas-product-jsonld')?.remove()
    }
  }, [product, imageUrl])

  return null
}

export function OrganizationJsonLd() {
  useEffect(() => {
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: BUSINESS.legalName || BUSINESS.brandName,
      url: SHOP,
      logo: `${SHOP}/brand/nafas-logo.png`,
      email: BUSINESS.supportEmail,
      areaServed: {
        '@type': 'Country',
        name: BUSINESS.salesCountryName,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: BUSINESS.supportEmail,
        ...(BUSINESS.supportPhone ? { telephone: BUSINESS.supportPhone } : {}),
        availableLanguage: 'English',
        areaServed: BUSINESS.salesCountry,
      },
    }
    if (hasPhysicalAddress()) {
      data.address = {
        '@type': 'PostalAddress',
        streetAddress: [BUSINESS.addressLine1, BUSINESS.addressLine2].filter(Boolean).join(', '),
        addressLocality: BUSINESS.city,
        addressRegion: BUSINESS.region,
        postalCode: BUSINESS.postalCode,
        addressCountry: BUSINESS.country,
      }
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'nafas-org-jsonld'
    script.text = JSON.stringify(data)
    document.getElementById('nafas-org-jsonld')?.remove()
    document.head.appendChild(script)
    return () => {
      document.getElementById('nafas-org-jsonld')?.remove()
    }
  }, [])
  return null
}
