export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽'
}

export function calcDiscount(original: number, current: number): number {
  return Math.round((1 - current / original) * 100)
}
