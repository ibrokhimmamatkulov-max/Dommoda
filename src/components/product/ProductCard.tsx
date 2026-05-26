'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice } from '@/lib/formatPrice'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id))
  const toggle = useWishlistStore((s) => s.toggle)

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
  }

  return (
    <article className="group cursor-pointer">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative w-full aspect-[3/4] bg-surface-container mb-3 overflow-hidden rounded">
          <Image
            src={product.images[0]}
            alt={`${product.brand} ${product.name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Wishlist button */}
          <div className="absolute top-2 left-2 z-10">
            <button
              aria-label={isInWishlist ? 'Remove from favorites' : 'Add to favorites'}
              onClick={handleWishlistClick}
              className="p-1.5 bg-surface-container-lowest/80 backdrop-blur-sm rounded-full text-primary hover:text-accent transition-colors focus:outline-none"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-[20px]"
                style={
                  isInWishlist
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {isInWishlist ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>

          {/* Discount badge */}
          {product.discountPercent != null && (
            <div className="absolute top-2 right-2 z-10 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 tracking-wider">
              -{product.discountPercent}%
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-bold text-xs uppercase text-on-surface-variant tracking-wide mb-1">
            {product.brand}
          </span>
          <h3 className="text-sm text-on-surface line-clamp-2 mb-2">{product.name}</h3>
          <div className="flex items-center gap-2 mt-auto">
            <span className="font-headline font-bold text-sm text-primary">
              {formatPrice(product.price)}
            </span>
            {product.priceOriginal != null && (
              <span className="font-body text-xs text-outline line-through">
                {formatPrice(product.priceOriginal)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
