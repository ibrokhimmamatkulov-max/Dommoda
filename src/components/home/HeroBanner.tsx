import Image from 'next/image'
import Link from 'next/link'
import type { Banner } from '@/types'

interface HeroBannerProps {
  banner: Banner
}

export function HeroBanner({ banner }: HeroBannerProps) {
  return (
    <section className="relative w-full aspect-square overflow-hidden">
      <Image
        src={banner.imageUrl}
        alt={banner.alt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="inline-block bg-accent text-white font-bold px-3 py-1 text-sm tracking-wider mb-3 w-max">
          {banner.badgeText}
        </div>
        <h1 className="font-headline font-bold uppercase text-on-secondary text-3xl leading-tight mb-6 w-3/4">
          {banner.headline}
        </h1>
        <Link
          href={banner.ctaUrl}
          className="bg-primary text-on-secondary px-8 py-3 font-medium uppercase tracking-wide text-sm hover:bg-tertiary transition-colors w-max"
        >
          {banner.ctaText}
        </Link>
      </div>
    </section>
  )
}
