import { Navbar } from "@/components/organisms/navbar"
import { HeroSection } from "@/components/organisms/hero-section"
import { MovieGrid } from "@/components/organisms/movie-grid"

export function HomeTemplate() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Now Playing</h2>
                <p className="text-muted-foreground max-w-[600px] mx-auto">
                  Discover the latest movies playing in theaters near you
                </p>
              </div>
              <MovieGrid />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
