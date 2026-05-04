import { HomeCTA } from './HomeCTA';
import Image from 'next/image';

export function CTASection() {
  return (
    <section className="relative w-full border-b border-fd-border overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/pics/abstract.png"
          alt="Abstract background"
          fill
          className="object-cover object-center"
          quality={100}
          priority
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          Start building with Manic
        </h2>
        <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Prepare for a development environment that can finally keep pace with the speed of your mind.
        </p>
        <HomeCTA variant="solid" />
      </div>
    </section>
  );
}
