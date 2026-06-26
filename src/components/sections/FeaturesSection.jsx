"use client";

const FEATURES = [
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
    desc: "Powered by Bluetooth connectivity, AirGrip connects directly to your device without needing a USB dongle. Cleaner setup, fewer things to carry, and no more worrying about losing receivers.",
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
    desc: "Traditional mice need a flat surface. AirGrip doesn’t. Hold it naturally like a remote and control your system comfortably from almost anywhere.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 px-6 bg-white border-t border-[var(--border)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-widest text-[var(--text-muted)] uppercase mb-3">
            Why Choose Us
          </p>
          <h2 className="  text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
            Built different,
            <br />
            by design
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
            Every detail is considered. Every feature is a reason to love it.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text-primary)] hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group"
            >
              {/* <span className="text-3xl block mb-4">{f.icon}</span> */}
              <h3 className="font-medium text-[var(--text-primary)] mb-2 group-hover:text-black transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
