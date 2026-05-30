'use client'

import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { usePrice } from '@/lib/usePrice'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore()
  const { product, selectedSize, selectedColor, quantity } = item
  const fmt = usePrice()

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeItem(product.id, selectedSize, selectedColor)
    } else {
      updateQuantity(product.id, selectedSize, selectedColor, quantity - 1)
    }
  }

  const handleIncrement = () => {
    updateQuantity(product.id, selectedSize, selectedColor, quantity + 1)
  }

  const handleRemove = () => {
    removeItem(product.id, selectedSize, selectedColor)
  }

  const colorLabel =
    product.colors.find((c) => c.hex === selectedColor)?.label ?? selectedColor

  return (
    <article className="flex gap-4 p-4 bg-surface-container-lowest border border-outline-variant rounded relative hover:shadow-sm transition-shadow">
      {/* Remove button */}
      <button
        aria-label="Удалить товар"
        onClick={handleRemove}
        className="absolute top-2 right-2 text-on-surface-variant hover:text-error transition-colors p-1 z-10"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>

      {/* Image */}
      <div className="w-20 h-24 flex-shrink-0 bg-surface-container-low rounded overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={80}
          height={96}
          className="w-full h-full object-cover mix-blend-multiply"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow justify-between min-w-0">
        <div>
          <p className="font-headline font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-1">
            {product.brand}
          </p>
          <h3 className="font-body text-sm text-on-surface line-clamp-2 pr-6">
            {product.name}
          </h3>
          <div className="text-xs text-on-surface-variant mt-1 flex gap-3">
            <span>Размер: {selectedSize}</span>
            <span>Цвет: {colorLabel}</span>
          </div>
        </div>

        {/* Stepper + Price */}
        <div className="flex items-end justify-between mt-3">
          {/* Quantity stepper */}
          <div className="flex items-center border border-outline-variant rounded overflow-hidden h-8">
            <button
              aria-label="Уменьшить количество"
              onClick={handleDecrement}
              className="w-8 h-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="w-8 text-center font-body text-sm font-medium">
              {quantity}
            </span>
            <button
              aria-label="Увеличить количество"
              onClick={handleIncrement}
              disabled={quantity >= 10}
              className="w-8 h-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            {product.priceOriginal != null && (
              <div className="text-xs text-outline line-through mb-0.5">
                {fmt(product.priceOriginal * quantity)}
              </div>
            )}
            <div className="font-headline font-bold text-base text-primary">
              {fmt(product.price * quantity)}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
