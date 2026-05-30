'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ProductImageCarouselProps {
  images: string[]
  productName: string
}

export function ProductImageCarousel({
  images,
  productName,
}: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  if (images.length === 0) return null

  if (images.length === 1) {
    return (
      <div className="w-full aspect-[3/4] bg-surface-container relative overflow-hidden">
        <Image
          src={images[0]}
          alt={productName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    )
  }

  const goTo = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(images.length - 1, index)))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 40) return
    if (delta < 0) {
      goTo(activeIndex + 1)
    } else {
      goTo(activeIndex - 1)
    }
  }

  return (
    <section aria-label="Product images">
      {/* Main image — swipeable */}
      <div
        className="w-full aspect-[3/4] bg-surface-container relative overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[activeIndex]}
          alt={`${productName} — фото ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Image indicators">
        {images.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Фото ${i + 1}`}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === activeIndex ? 'bg-primary' : 'bg-outline-variant'
            }`}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto no-scrollbar snap-x">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Выбрать фото ${i + 1}`}
            className={`w-16 h-20 flex-shrink-0 bg-surface-container rounded overflow-hidden snap-start border-2 transition-colors ${
              i === activeIndex
                ? 'border-primary'
                : 'border-transparent hover:border-outline-variant'
            }`}
          >
            <Image
              src={src}
              alt={`Thumbnail ${i + 1}`}
              width={64}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
