"use client";
import { useEffect, useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Feature {
  title: string;
  desc: string;
  icon: string;
  span: string;
}

const FEATURES: Feature[] = [
  {
    span: "sm:col-span-2 lg:col-span-4",
    icon: "M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M21 12l-3-3M21 12l-3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3",
    title: "Natural Motion Control",
    desc: "Control your computer by moving AirGrip naturally through the air. Its gyroscope-powered cursor control lets you navigate your desktop without a mouse pad, desk, or flat surface.",
  },
  {
    span: "lg:col-span-2",
    icon: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
    title: "Push-to-Talk Voice Control",
    desc: "Press and hold the dedicated microphone button to give Arceus voice commands. Release it when you're done, and let your AI desktop assistant process your request and help you get things done.",
  },
  {
    span: "lg:col-span-2",
    icon: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z",
    title: "AI-Powered Desktop Assistant",
    desc: "Paired with Arceus, AirGrip becomes more than a mouse. Use voice commands to interact with your AI assistant and bring natural, hands-free interaction to your desktop workflow.",
  },
  {
    span: "lg:col-span-2",
    icon: "M3 5h18v11H3zM8 20h8M12 16v4",
    title: "Control Your Entire Desktop",
    desc: "Combine physical mouse controls with Arceus's AI capabilities to navigate your computer, interact with applications, and make everyday desktop tasks more intuitive.",
  },
  {
    span: "lg:col-span-2",
    icon: "M5 12a10 10 0 0 1 14 0M8 15a6 6 0 0 1 8 0M12 19h.01",
    title: "Dedicated Wireless Connection",
    desc: "Connect through the included USB dongle for a straightforward setup without Bluetooth pairing or manual Wi-Fi configuration. Designed to keep AirGrip's motion controls and voice input connected to your computer.",
  },
  {
    span: "lg:col-span-3",
    icon: "M3 8h15v8H3zM18 11h3v2h-3zM11 10l-2 2h4l-2 2",
    title: "Rechargeable USB-C Design",
    desc: "Charge AirGrip using a modern USB-C connection. Its built-in rechargeable battery is designed for everyday use, with an estimated runtime of up to two days depending on usage.",
  },
  {
    span: "lg:col-span-3",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 12h.01",
    title: "Designed for Freedom",
    desc: "Use AirGrip from your couch, bed, standing desk, or during presentations. Its handheld design frees you from traditional mouse surfaces while keeping essential controls within reach.",
  },
  {
    span: "sm:col-span-2 lg:col-span-6",
    icon: "M8 3h8a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zM12 3v7M5 10h14",
    title: "Physical Controls That Feel Familiar",
    desc: "Access left and right clicks, scrolling, and a dedicated stop-motion control through a handheld interface. Switch between moving your cursor and keeping it still without putting AirGrip down.",
  },
];

function Card({ f, i }: { f: Feature; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const big = f.span.includes("col-span-4") || f.span.includes("col-span-6");

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    gsap.to(el, {
      rotationY: (x / r.width - 0.5) * 6,
      rotationX: (0.5 - y / r.height) * 6,
      transformPerspective: 900,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  };
  const leave = () =>
    gsap.to(ref.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.8,
      ease: "expo.out",
      overwrite: "auto",
    });

  return (
    <div
      ref={ref}
      data-card
      onPointerMove={move}
      onPointerLeave={leave}
      className={`feat-card group p-7 sm:p-8 ${big ? "lg:p-10" : ""} ${f.span}`}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-10 flex items-start justify-between">
          <span className="eyebrow text-(--text-muted)">
            {String(i + 1).padStart(2, "0")}
          </span>
          <svg
            data-icon
            viewBox="0 0 24 24"
            className="feat-icon h-7 w-7 text-(--text-secondary)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={f.icon} pathLength={1} />
          </svg>
        </div>
        <h3
          className={`font-medium tracking-[-0.02em] text-(--text-primary) ${
            big
              ? "text-[clamp(22px,2.2vw,32px)]"
              : "text-[clamp(18px,1.6vw,22px)]"
          }`}
        >
          {f.title}
        </h3>
        <p
          className={`mt-3 leading-relaxed text-(--text-secondary) ${
            big ? "max-w-xl text-base" : "text-sm"
          }`}
        >
          {f.desc}
        </p>
        <div className="feat-bar mt-8" />
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    const ctx = gsap.context(() => {
      // header
      gsap.from("[data-eline]", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.2,
        ease: "expo.inOut",
        scrollTrigger: { trigger: "[data-head]", start: "top 85%" },
      });
      gsap.from("[data-h]", {
        yPercent: 115,
        rotate: 3,
        transformOrigin: "0 100%",
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.14,
        scrollTrigger: { trigger: "[data-head]", start: "top 85%" },
      });
      gsap.from("[data-sub]", {
        y: 20,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1,
        delay: 0.4,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-head]", start: "top 85%" },
      });

      // cards: hidden first, revealed in batches as they scroll in
      gsap.set("[data-card]", {
        y: 70,
        opacity: 0,
        scale: 0.96,
        filter: "blur(12px)",
      });
      gsap.set("[data-icon] path", { strokeDasharray: 1, strokeDashoffset: 1 });
      ScrollTrigger.batch("[data-card]", {
        start: "top 90%",
        once: true,
        onEnter: (els) => {
          gsap.to(els, {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.1,
            clearProps: "filter",
          });
          els.forEach((el, k) =>
            gsap.to(el.querySelectorAll("[data-icon] path"), {
              strokeDashoffset: 0,
              duration: 1.6,
              ease: "power2.inOut",
              delay: 0.3 + k * 0.1,
            })
          );
        },
      });

      // parallax glows
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

  const mask = "block overflow-hidden pb-[0.08em]";

  return (
    <section
      ref={root}
      id="features"
      className="relative overflow-hidden border-t border-(--border-subtle) bg-(--bg-primary) py-(--section-space)"
    >
      {/* background: fine grid + parallax glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--border-subtle)_1px,transparent_1px)] bg-size-[72px_72px] opacity-[0.18] mask-[radial-gradient(ellipse_at_50%_30%,#000,transparent_70%)]"
      />
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 h-130 w-130 rounded-full bg-[radial-gradient(circle,rgba(66,191,255,0.12),transparent_65%)]"
      />
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute -right-40 top-2/3 h-130 w-130 rounded-full bg-[radial-gradient(circle,rgba(155,114,255,0.12),transparent_65%)]"
      />

      <div className="container-arceus relative">
        <div data-head className="mb-16 max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <span data-eline className="h-px w-12 bg-(--accent-blue)" />
            <p className="eyebrow text-(--text-muted)">Why Choose Us</p>
          </div>
          <h2 className="text-[clamp(40px,5.4vw,72px)] font-medium leading-[1.04] tracking-[-0.03em]">
            <span className={mask}>
              <span data-h className="text-fade inline-block">
                Built different,
              </span>
            </span>
            <span className={mask}>
              <span data-h className="text-shimmer inline-block">
                by design
              </span>
            </span>
          </h2>
          <p data-sub className="mt-6 max-w-md text-(--text-secondary)">
            Every detail is considered. Every feature is a reason to love it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {FEATURES.map((f, i) => (
            <Card key={f.title} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
