export function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ")
}

export function formatPrice(price: number): string {
  return `${price} AED`
}
