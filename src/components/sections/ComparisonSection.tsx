"use client";
import { useEffect, useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ComparisonRow {
  feature: string;
  traditional: string;
  airGrip: string;
}

const ROWS: ComparisonRow[] = [
  {
    feature: "AI-Powered Assistance",
    traditional: "No built-in AI assistant",
    airGrip:
      "Works with Arceus, an AI desktop assistant for voice-driven interaction and everyday tasks",
  },
  {
    feature: "Voice Control",
    traditional: "Usually requires a separate microphone and software",
    airGrip:
      "Dedicated push-to-talk microphone button to give voice commands to Arceus",
  },
  {
    feature: "Works Without a Surface",
    traditional: "Requires a desk or mouse pad",
    airGrip: "Control the cursor by moving your hand through the air",
  },
  {
    feature: "Desktop Interaction",
    traditional: "Primarily limited to conventional mouse input",
    airGrip: "Combines physical mouse controls with Arceus AI assistance",
  },
  {
    feature: "Device Compatibility",
    traditional: "Varies by model",
    airGrip:
      "Designed for desktop and laptop computers running Windows, macOS, or Linux",
  },
  {
    feature: "Wireless Connectivity",
    traditional: "May require Bluetooth pairing or a receiver",
    airGrip: "Dedicated USB dongle for a straightforward wireless connection",
  },
  {
    feature: "Comfort & Flexibility",
    traditional: "Primarily designed for desk use",
    airGrip: "Use from a couch, bed, standing workspace, or presentation area",
  },
  {
    feature: "Presentation Control",
    traditional: "Often used close to a desk",
    airGrip: "Navigate slides and control the cursor while moving around",
  },
  {
    feature: "Grip & Handling",
    traditional: "Typically designed for tabletop handling",
    airGrip: "Handheld design with a textured grip",
  },
  {
    feature: "Portability",
    traditional: "Usually needs a flat working surface",
    airGrip: "Compact handheld design that travels with your laptop",
  },
  {
    feature: "Battery & Charging",
    traditional: "May use replaceable batteries or wired power",
    airGrip: "Built-in rechargeable battery with USB-C charging",
  },
  {
    feature: "Setup",
    traditional: "May require pairing or receiver configuration",
    airGrip:
      "Connect the dedicated USB dongle and launch Arceus for AI features",
  },
  {
    feature: "Freedom of Movement",
    traditional: "Best suited to conventional desk use",
    airGrip: "Control your computer without being tied to a mouse pad",
  },
];

const COLS = "lg:grid-cols-[0.9fr_1fr_1.3fr]";

export default function ComparisonSection() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    const ctx = gsap.context(() => {
      const head = { trigger: "[data-head]", start: "top 85%" };
      gsap.from("[data-eline]", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.2,
        ease: "expo.inOut",
        scrollTrigger: head,
      });
      gsap.from("[data-h]", {
        yPercent: 115,
        rotate: 3,
        transformOrigin: "0 100%",
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.14,
        scrollTrigger: head,
      });

      // frame draws open, header cells drop in
      gsap.from("[data-frame]", {
        clipPath: "inset(0 50% 0 50% round 24px)",
        opacity: 0,
        duration: 1.6,
        ease: "expo.inOut",
        scrollTrigger: { trigger: "[data-frame]", start: "top 88%" },
      });
      gsap.from("[data-hcell]", {
        y: -20,
        opacity: 0,
        filter: "blur(8px)",
        stagger: 0.12,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-frame]", start: "top 80%" },
      });

      // scroll-linked progress rail
      gsap.fromTo(
        "[data-rail]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: "[data-rows]",
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );

      // every row: slide in, strike out the old way, draw the check
      gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 90%" },
        });
        tl.from(
          row.querySelector("[data-f]"),
          { x: -30, opacity: 0, duration: 0.9, ease: "expo.out" },
          0
        )
          .from(
            row.querySelector("[data-t]"),
            { opacity: 0, y: 14, duration: 0.8, ease: "expo.out" },
            0.1
          )
          .to(
            row.querySelector("[data-strike]"),
            { "--s": "100%", duration: 0.9, ease: "power3.inOut" },
            0.7
          )
          .to(
            row.querySelector("[data-t]"),
            { opacity: 0.45, duration: 0.6 },
            0.9
          )
          .from(
            row.querySelector("[data-a]"),
            {
              x: 40,
              opacity: 0,
              filter: "blur(10px)",
              duration: 1,
              ease: "expo.out",
            },
            0.35
          )
          .fromTo(
            row.querySelector("[data-check] path"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" },
            0.9
          )
          .fromTo(
            row.querySelector("[data-check]"),
            { scale: 0.4 },
            { scale: 1, duration: 0.9, ease: "elastic.out(1,0.6)" },
            0.9
          );
      });

      gsap.to("[data-glow]", {
        yPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty(
      "--mx",
      `${e.clientX - el.getBoundingClientRect().left}px`
    );
  };

  const mask = "block overflow-hidden pb-[0.08em]";

  return (
    <section
      ref={root}
      id="comparison"
      className="relative overflow-hidden border-t border-(--border-subtle) bg-(--bg-primary) py-(--section-space)"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--border-subtle)_1px,transparent_1px)] bg-size-[72px_72px] opacity-[0.14] mask-[radial-gradient(ellipse_at_50%_20%,#000,transparent_70%)]"
      />
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-130 w-130 rounded-full bg-[radial-gradient(circle,rgba(155,114,255,0.13),transparent_65%)]"
      />
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute -left-40 top-3/4 h-130 w-130 rounded-full bg-[radial-gradient(circle,rgba(66,191,255,0.11),transparent_65%)]"
      />

      <div className="container-arceus relative">
        <div data-head className="mb-14 max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <span data-eline className="h-px w-12 bg-(--accent-blue)" />
            <p className="eyebrow text-(--text-muted)">Comparison</p>
          </div>
          <h2 className="text-[clamp(40px,5.4vw,72px)] font-medium leading-[1.04] tracking-[-0.03em]">
            <span className={mask}>
              <span data-h className="text-fade inline-block">
                See the difference
              </span>
            </span>
            <span className={mask}>
              <span data-h className="text-shimmer inline-block">
                for yourself
              </span>
            </span>
          </h2>
        </div>

        <div data-frame className="cmp-wrap">
          <div className="cmp-inner">
            {/* header (desktop) */}
            <div className={`hidden lg:grid ${COLS}`}>
              <div data-hcell className="p-6 px-8">
                <p className="eyebrow text-(--text-muted)">Feature</p>
              </div>
              <div data-hcell className="p-6">
                <p className="eyebrow text-(--text-secondary)">Traditional</p>
              </div>
              <div data-hcell className="cmp-hl p-6 pl-8">
                <p className="eyebrow flex items-center gap-3 text-(--text-primary)">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--accent-blue) opacity-75" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-(--accent-blue)" />
                  </span>
                  <span className="text-shimmer">AirGrip</span>
                </p>
              </div>
            </div>

            <div data-rows className="relative">
              <span
                data-rail
                aria-hidden
                className="absolute left-0 top-0 z-10 hidden h-full w-px bg-(image:--accent-gradient) lg:block"
              />
              {ROWS.map((r) => (
                <div
                  key={r.feature}
                  data-row
                  onPointerMove={move}
                  className={`cmp-row grid grid-cols-1 ${COLS}`}
                >
                  <div
                    data-f
                    className="cmp-feature relative z-1 px-6 pt-6 text-base font-medium tracking-[-0.01em] text-(--text-primary) lg:p-6 lg:px-8"
                  >
                    {r.feature}
                  </div>
                  <div
                    data-t
                    className="relative z-1 px-6 pt-2 text-sm leading-relaxed text-(--text-muted) lg:p-6"
                  >
                    <span className="eyebrow mb-1 block text-(--text-muted) lg:hidden">
                      Traditional
                    </span>
                    <span data-strike className="cmp-strike">
                      {r.traditional}
                    </span>
                  </div>
                  <div
                    data-a
                    className="cmp-hl relative z-1 mt-4 flex items-start gap-4 p-6 text-sm leading-relaxed text-(--text-primary) lg:mt-0 lg:pl-8"
                  >
                    <svg
                      data-check
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-5 w-5 shrink-0 text-(--status-success) drop-shadow-[0_0_8px_rgba(66,230,170,.6)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        pathLength={1}
                        strokeDasharray={1}
                      />
                    </svg>
                    <div>
                      <span className="eyebrow mb-1 block text-(--accent-blue) lg:hidden">
                        AirGrip
                      </span>
                      {r.airGrip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
