'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper'
import { DeliveryMethodSelector } from '@/components/checkout/DeliveryMethodSelector'
import { useCartStore } from '@/store/cartStore'
import { usePrice } from '@/lib/usePrice'
import { useCurrencyStore } from '@/store/currencyStore'
import type { CheckoutFormData } from '@/types'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backanddommoda.onrender.com'
const DELIVERY_TJS = 40

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const getTotalPrice = useCartStore((s) => s.getTotalPrice)
  const promoDiscount = useCartStore((s) => s.promoDiscount)
  const promoCode = useCartStore((s) => s.promoCode)
  const clearCart = useCartStore((s) => s.clearCart)
  const fmt = usePrice()
  const rate = useCurrencyStore((s) => s.rate)
  const orderCompleted = useRef(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      deliveryMethod: 'courier',
      city: 'Душанбе',
    },
  })

  const deliveryMethod = watch('deliveryMethod')

  // Redirect if cart is empty (but not right after completing an order)
  useEffect(() => {
    if (items.length === 0 && !orderCompleted.current) {
      router.replace('/cart')
    }
  }, [items.length, router])

  const totalPrice = getTotalPrice()
  const deliveryCost = deliveryMethod === 'courier' ? DELIVERY_TJS : 0
  const finalTotalTJS = Math.round(Math.max(0, totalPrice - promoDiscount) * rate) + deliveryCost

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        brand: item.product.brand,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
        unit_price: item.product.price,
      }))

      const res = await fetch(`${BACKEND}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_method: data.deliveryMethod,
          city: null,
          street: null,
          building: null,
          apartment: null,
          zip_code: null,
          recipient_name: null,
          phone: `+992${data.phone}`,
          email: null,
          comment: data.comment ?? null,
          items: orderItems,
          promo_code: promoCode,
          promo_discount: promoDiscount,
        }),
      })

      if (!res.ok) {
        setSubmitError('Ошибка при оформлении заказа. Попробуйте снова.')
        return
      }

      const order = await res.json() as { id: string }
      orderCompleted.current = true
      clearCart()
      router.push(`/checkout/success?order=${order.id}`)
    } catch {
      setSubmitError('Не удалось подключиться к серверу. Попробуйте снова.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <>
      <TopAppBar variant="checkout" />

      <main className="max-w-3xl mx-auto px-4 py-8 pb-28">
        <CheckoutStepper currentStep={1} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-12">
          {/* Delivery method */}
          <section>
            <h2 className="font-headline font-bold uppercase tracking-widest text-lg mb-6 text-primary border-b border-outline-variant pb-2">
              Способ доставки
            </h2>
            <DeliveryMethodSelector
              value={deliveryMethod}
              onChange={(v) => setValue('deliveryMethod', v)}
            />
          </section>

          {/* Recipient — только телефон */}
          <section>
            <h2 className="font-headline font-bold uppercase tracking-widest text-lg mb-6 text-primary border-b border-outline-variant pb-2">
              Контакт для связи
            </h2>
            <div className="relative">
              <span className="absolute left-0 top-3 text-primary text-base font-medium">+992</span>
              <input
                id="phone"
                type="tel"
                placeholder="000 000 000"
                className="form-input pl-12"
                {...register('phone', {
                  required: 'Укажите телефон',
                  minLength: { value: 9, message: 'Минимум 9 цифр' },
                  pattern: { value: /^[0-9\s\-()]+$/, message: 'Только цифры' },
                })}
              />
              {errors.phone != null && (
                <p className="text-error text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </section>

          {/* Comment */}
          <section>
            <h2 className="font-headline font-bold uppercase tracking-widest text-lg mb-6 text-primary border-b border-outline-variant pb-2">
              Комментарий к заказу
            </h2>
            <div>
              <label htmlFor="comment" className="sr-only">
                Комментарий
              </label>
              <textarea
                id="comment"
                rows={3}
                placeholder="Необязательно"
                className="form-input resize-none"
                {...register('comment')}
              />
            </div>
          </section>

          {submitError && (
            <p className="text-error text-sm text-center">{submitError}</p>
          )}
          {/* Spacer so sticky bar doesn't overlap */}
          <div className="h-8" />
        </form>
      </main>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 w-full flex flex-row items-center justify-between bg-surface z-50 h-20 border-t border-outline-variant shadow-sm">
        <div className="flex flex-col items-start justify-center text-primary px-6 w-1/2 h-full">
          <span className="font-body text-sm font-medium tracking-tight text-secondary">
            Total:
          </span>
          <div className="flex items-center gap-1">
            <span aria-hidden="true" className="material-symbols-outlined text-sm">
              payments
            </span>
            <span className="font-bold text-lg">{finalTotalTJS.toLocaleString('ru-RU')} сом</span>
          </div>
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="flex flex-row items-center justify-center bg-primary text-on-primary w-1/2 h-full uppercase font-bold tracking-widest hover:bg-primary-fixed transition-colors gap-2 text-sm disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <>
              <span>ОФОРМИТЬ</span>
              <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </>
  )
}
