import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { EventsSection } from "@/components/events-section"
import { SpeakersSection } from "@/components/speakers-section"
import { AboutSection } from "@/components/about-section"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <EventsSection />
        <SpeakersSection />
        <AboutSection />
      </main>
      <SiteFooter />
    </div>
  )
}
