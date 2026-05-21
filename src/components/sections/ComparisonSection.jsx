"use client";

const ROWS = [
  {
    feature: "Works Without a Surface",
    traditional: "Requires a desk or mouse pad",
    airGrip: "Works completely in the air",
  },
  {
    feature: "Wireless Connectivity",
    traditional: "Usually requires a USB dongle",
    airGrip: "Direct Bluetooth connection",
  },
  {
    feature: "Comfort & Flexibility",
    traditional: "Limited to desk usage",
    airGrip: "Use on couches, beds, or while standing",
  },
  {
    feature: "Control Modes",
    traditional: "Single navigation style",
    airGrip: "Gyroscope + joystick dual mode",
  },
  {
    feature: "Presentation Use",
    traditional: "Need to stay near the laptop",
    airGrip: "Control presentations from a distance",
  },
  {
    feature: "Portability",
    traditional: "Needs flat working space",
    airGrip: "Portable handheld design",
  },
  {
    feature: "Battery System",
    traditional: "Replaceable batteries",
    airGrip: "Rechargeable USB-C battery",
  },
  {
    feature: "Gaming-Style Precision",
    traditional: "Standard mouse movement only",
    airGrip: "Joystick-based precision mode",
  },
  {
    feature: "Cable Management",
    traditional: "Can involve wires or dongles",
    airGrip: "Minimal wireless setup",
  },
  {
    feature: "Freedom of Movement",
    traditional: "Best used while seated at a desk",
    airGrip: "Control from almost anywhere",
  },
];

// const ROWS = [
//   { feature: "Works Without a Surface", other: false, ours: true },
//   { feature: "Free Shipping", other: false, ours: true },
//   { feature: "COD Available", other: false, ours: true },
//   { feature: "30-Day Money Back", other: false, ours: true },
//   { feature: "Third-Party Tested", other: false, ours: true },
//   { feature: "Eco-Friendly Packaging", other: false, ours: true },
//   { feature: "Dedicated Support", other: true, ours: true },
//   { feature: "Works in 7 Days", other: false, ours: true },
//   { feature: "No Hidden Charges", other: false, ours: true },
// ];

const Check = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="check-icon mx-auto"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Cross = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="cross-icon mx-auto"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

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
                {/* {row.other ? <Check /> : <Cross />} */}
                {row.traditional}
              </div>
              <div className="p-4 text-center bg-(--text-primary)/5 flex items-center justify-center">
                {/* {row.ours ? <Check /> : <Cross />} */}
                {row.airGrip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
