import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Film, Ticket, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to <span className="text-primary">MovieTix</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Book your favorite movies online with ease. Enjoy the best cinema experience with comfortable seats and
              premium sound quality.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/films">
                <Film className="mr-2 h-5 w-5" />
                Browse Movies
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tickets">
                <Ticket className="mr-2 h-5 w-5" />
                My Tickets
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Film className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Latest Movies</h3>
              <p className="text-sm text-muted-foreground text-center">Watch the latest blockbusters and indie films</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Easy Booking</h3>
              <p className="text-sm text-muted-foreground text-center">Book your tickets in just a few clicks</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Premium Experience</h3>
              <p className="text-sm text-muted-foreground text-center">Enjoy premium sound and comfortable seating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
