import Features from "@/components/Features"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"
import HowItWorks from "@/components/HowItWorks"


function LandingPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  )
}

export default LandingPage