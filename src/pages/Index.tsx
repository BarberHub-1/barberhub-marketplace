import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedShops from "@/components/FeaturedShops";
import ServiceCategories from "@/components/ServiceCategories";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Scrolla pro topo quando a página carrega
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />
      <Hero />
      <FeaturedShops />
      <ServiceCategories />
      <Footer />
    </div>
  );
};

export default Index;
