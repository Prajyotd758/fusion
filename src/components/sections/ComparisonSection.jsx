"use client";

const ROWS = [
  {
    feature: "Works Without a Surface",
    traditional: "Requires a desk or mouse pad",
    airGrip: "Works completely in the air",
  },
  {
    feature: "Device Compatibility",
    traditional: "Varies by model",
    airGrip: "Windows, macOS, Linux, Android, iPhone, iPad & tablets",
  },
  {
    feature: "Wireless Connectivity",
    traditional: "Often requires a USB dongle",
    airGrip: "Direct Bluetooth connection",
  },
  {
    feature: "Comfort & Flexibility",
    traditional: "Designed for desk use",
    airGrip: "Use on couches, beds, while standing, or while traveling",
  },
  {
    feature: "Presentation Control",
    traditional: "Need to stay near the computer",
    airGrip: "Control presentations from anywhere in the room",
  },
  {
    feature: "Grip & Handling",
    traditional: "Smooth plastic surface",
    airGrip: "Textured surface for a comfortable grip",
  },
  {
    feature: "Portability",
    traditional: "Needs a flat working surface",
    airGrip: "Compact handheld design that fits in your pocket",
  },
  {
    feature: "Battery",
    traditional: "Often uses replaceable AA/AAA batteries",
    airGrip: "Rechargeable USB-C battery",
  },
  {
    feature: "Setup",
    traditional: "May require a receiver or dongle",
    airGrip: "Pair over Bluetooth in seconds",
  },
  {
    feature: "Freedom of Movement",
    traditional: "Best used while seated at a desk",
    airGrip: "Control your device from almost anywhere",
  },
];

export default function ComparisonSection() {
  return (
    <section className="py-24 px-6 bg-white border-t border-(--border)">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-medium tracking-widest text-(--text-muted) uppercase mb-3">
            Comparison
          </p>
          <h2 className="  text-4xl md:text-5xl text-(--text-primary) mb-4">
            See the difference
            <br />
            for yourself
          </h2>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-(--border) overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-(--bg)">
            <div className="p-5 border-r border-(--border)">
              <p className="text-xs font-medium text-(--text-muted) uppercase tracking-wide">
                Feature
              </p>
            </div>
            <div className="p-5 text-center border-r border-(--border)">
              <p className="text-sm font-medium text-(--text-secondary)">
                Traditional
              </p>
            </div>
            <div className="p-5 text-center bg-(--text-primary)">
              <p className="text-sm font-medium text-white">airGrip ✦</p>
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-t border-(--border) ${
                i % 2 === 0 ? "bg-white" : "bg-(--bg)"
              }`}
            >
              <div className="p-4 px-5 border-r border-(--border)">
                <p className="text-sm text-(--text-primary)">{row.feature}</p>
              </div>
              <div className="p-4 text-center border-r border-(--border) flex items-center justify-center">
                {row.traditional}
              </div>
              <div className="p-4 text-center bg-(--text-primary)/5 flex items-center justify-center">
                {row.airGrip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
