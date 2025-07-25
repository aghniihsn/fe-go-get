import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image src="/movietix-logo.png" alt="MovieTix" width={48} height={48} className={sizeClasses[size]} />
      {showText && <span className="text-xl font-bold text-primary">MovieTix</span>}
    </Link>
  )
}
