'use client'
import Navbar from '../components/Navbar'
import HeroSection from '../components/sections/HeroSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import VideoSection from '../components/sections/VideoSection'
import ComparisonSection from '../components/sections/ComparisonSection'
import FAQSection from '../components/sections/FAQSection'
import CTASection from '../components/sections/CTASection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <VideoSection />
      <ComparisonSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
