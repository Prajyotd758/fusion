"use client";
import Image from "next/image";

interface Feature {
  icon?: string;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: "⚡",
    title: "Motion Control",
    desc: "Move the cursor naturally by moving your hand in the air. No desk, mouse pad, or flat surface required. Perfect for couches, beds, presentations, and standing workspaces.",
  },
  {
    title: "Works Anywhere",
    desc: "Use AirGrip however you want while relaxing on a sofa, teaching in a classroom, standing during presentations, or working from bed. Its ergonomic handheld design removes the limitations of traditional mice.",
  },
  {
    title: "Completely Wireless",
    desc: "Powered by a plug-and-play USB dongle, AirGrip connects instantly to your device with no pairing required. Just plug it in and go — simple, reliable, and hassle-free.",
  },
  {
    title: "Rechargeable USB-C Battery",
    desc: "Built with a rechargeable battery and modern USB-C charging support. Use it continuously for up to 2 days on a single charge, and keep using it even while charging.",
  },
  {
    title: "Presentation Ready",
    desc: "Control slides, scroll content, and navigate presentations from a distance. Ideal for teachers, presenters, and professionals who want the freedom to move around while staying in control.",
  },
  {
    title: "Built for Everyday Comfort",
    desc: "Traditional mice need a flat surface. AirGrip doesn't. Hold it naturally like a remote and control your system comfortably from almost anywhere.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 px-6 bg-white border-t border-(--border)"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-widest text-(--text-muted) uppercase mb-3">
            Why Choose Us
          </p>
          <h2 className="text-4xl md:text-5xl text-(--text-primary) mb-4">
            Built different,
            <br />
            by design
          </h2>
          <p className="text-(--text-secondary) max-w-md mx-auto">
            Every detail is considered. Every feature is a reason to love it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="relative aspect-4/4 overflow-hidden rounded-2xl ">
            <Image
              src="/ctrl.png"
              alt="Feature 1"
              fill
              className="object-contain"
            />
          </div>

          <div className="relative aspect-4/4 overflow-hidden rounded-2xl ">
            <Image
              src="/dim.png"
              alt="Feature 2"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl border border-(--border) bg-(--bg) hover:border-(--text-primary) hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group"
            >
              <h3 className="font-medium text-(--text-primary) mb-2 group-hover:text-black transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-(--text-secondary) leading-relaxed whitespace-pre-line">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
