import SiteLayout from "./layout/SiteLayout";
import Hero from "./sections/Hero";
import Showcase from "./sections/Showcase";
import Features from "./sections/Features";
import Buy from "./sections/Buy";

export default function App() {
  return (
    <SiteLayout>
      <Hero />
      <Showcase />
      <Features />
      <Buy />
    </SiteLayout>
  );
}
