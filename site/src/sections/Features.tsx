import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { FEATURES } from "../data/features";
import "./Features.css";

export default function Features() {
  return (
    <Section id="features" title="Features">
      <Reveal as="ul" className="featlist">
        {FEATURES.map((f) => (
          <li key={f.name} title={f.hint}>{f.name}</li>
        ))}
        <li className="more">And some other stuff I forgot</li>
      </Reveal>
    </Section>
  );
}
