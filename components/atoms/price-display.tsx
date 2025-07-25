interface PriceDisplayProps {
  price: number
  className?: string
}

export function PriceDisplay({ price, className }: PriceDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return <span className={className}>{formatPrice(price)}</span>
}
