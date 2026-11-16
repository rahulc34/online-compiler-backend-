import Navbar from "../../../components/shared/Navbar";
import Footer from "../../../components/shared/Footer";

import Hero from "../components/Hero";
import Features from "../components/Features";
import Languages from "../components/Languages";
import CTA from "../components/CTA";

function Home() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <Languages />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
