import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CarParts from "@/components/CarParts";
import MOTTracking from "@/components/MOTTracking";
import Suppliers from "@/components/Suppliers";
import ServiceRequest from "@/components/ServiceRequest";
import Trust from "@/components/Trust";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Header />
      <Hero />
      <Services />
      <CarParts />
      <MOTTracking />
      <Suppliers />
      <ServiceRequest />
      <Trust />
      <Contact />
      <Footer />
    </div>
  );
}
