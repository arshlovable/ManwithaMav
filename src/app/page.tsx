import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { QuoteProvider } from "@/components/quote-dialog";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { MavJobs } from "@/components/sections/mav-jobs";
import { Pricing } from "@/components/sections/pricing";
import { Problem } from "@/components/sections/problem";
import { Securement } from "@/components/sections/securement";
import { ServiceArea } from "@/components/sections/service-area";
import { Steps } from "@/components/sections/steps";
import { WhyMav } from "@/components/sections/why-mav";

export default function HomePage() {
  return (
    <QuoteProvider>
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <Problem />
        <MavJobs />
        <Steps />
        <Pricing />
        <WhyMav />
        <ServiceArea />
        <Securement />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileCtaBar />
    </QuoteProvider>
  );
}
