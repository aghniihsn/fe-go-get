import { Navbar } from "@/components/organisms/navbar"
import { HeroSection } from "@/components/organisms/hero-section"
import { TodaysShows } from "@/components/organisms/todays-shows"
import { UpcomingMovies } from "@/components/organisms/upcoming-movies"
import { MovieGrid } from "@/components/organisms/movie-grid"

export function HomeTemplate() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />

        {/* Today's Shows and Upcoming Movies Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TodaysShows />
              <UpcomingMovies />
            </div>
          </div>
        </section>

        {/* All Movies Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">All Movies</h2>
                <p className="text-muted-foreground max-w-[600px] mx-auto">
                  Discover all available movies in our cinema
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
