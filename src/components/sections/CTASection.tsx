"use client";
import { useEffect, useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlowButton from "../GlobalButton";
import { magnetic } from "../../lib/magnetic";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const PRICE = 1499;
const MRP = 1999; // from your file; likely should be a higher number
const SAVE = 500;

const BADGES = [
  {
    label: "Free Shipping",
    d: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  },
  {
    label: "COD",
    d: "M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 12h.01M18 12h.01",
  },
  {
    label: "Secure",
    d: "M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6zM9 12l2 2 4-4",
  },
];

export default function CTASection() {
  const root = useRef<HTMLElement | null>(null);

  useIso(() => {
    let off = () => {};
    const ctx = gsap.context(() => {
      const st = { trigger: "[data-frame]", start: "top 80%", once: true };
      gsap
        .timeline({ scrollTrigger: st, defaults: { ease: "expo.out" } })
        .from(
          "[data-frame]",
          {
            clipPath: "inset(0 50% 0 50% round 28px)",
            opacity: 0,
            duration: 1.6,
            ease: "expo.inOut",
          },
          0
        )
        .from(
          "[data-eline]",
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1.1,
            ease: "expo.inOut",
          },
          0.6
        )
        .from("[data-eyebrow]", { opacity: 0, x: -10, duration: 0.8 }, 0.7)
        .from(
          "[data-h]",
          {
            yPercent: 115,
            rotate: 3,
            transformOrigin: "0 100%",
            duration: 1.3,
            stagger: 0.14,
          },
          0.8
        )
        .from(
          "[data-price]",
          { y: 30, opacity: 0, filter: "blur(10px)", duration: 1 },
          1.2
        )
        .to(
          "[data-strike]",
          { "--s": "100%", duration: 0.9, ease: "power3.inOut" },
          2
        )
        .from(
          "[data-save]",
          { scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(3)" },
          2.2
        )
        .from("[data-cta]", { y: 24, opacity: 0, scale: 0.9, duration: 1 }, 1.5)
        .from(
          "[data-badge]",
          { y: 16, opacity: 0, stagger: 0.1, duration: 0.9 },
          1.8
        );

      // price counts up
      const o = { v: 0 };
      gsap.to(o, {
        v: PRICE,
        duration: 2,
        ease: "power3.out",
        delay: 0.3,
        scrollTrigger: st,
        onUpdate: () => {
          const n = root.current?.querySelector("[data-num]");
          if (n) n.textContent = `₹${Math.round(o.v).toLocaleString("en-IN")}`;
        },
      });

      // ambient: rotating rings, breathing glow
      gsap.to("[data-ring-a]", {
        rotate: 360,
        duration: 40,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
      gsap.to("[data-ring-b]", {
        rotate: -360,
        duration: 60,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
      gsap.to("[data-aura]", {
        scale: 1.2,
        opacity: 0.7,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to("[data-glow]", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      if (window.matchMedia("(hover:hover) and (pointer:fine)").matches)
        off = magnetic(gsap.utils.toArray("[data-magnetic]"), 0.3);
    }, root);
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget,
      r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const mask = "block overflow-hidden pb-[0.08em]";

  return (
    <section
      ref={root}
      id="buy-now"
      className="relative overflow-hidden border-t border-(--border-subtle) bg-(--bg-primary) py-(--section-space)"
    >
  

      <div className="container-arceus relative">
        <div data-frame className="cmp-wrap" style={{ borderRadius: 28 }}>
          <div
            onPointerMove={move}
            className="cmp-inner relative px-6 py-20 text-center sm:py-28"
            style={{ borderRadius: 27 }}
          >
            {/* spotlight follows cursor */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_circle_at_var(--mx,50%)_var(--my,40%),rgba(66,191,255,.10),transparent_65%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--border-subtle)_1px,transparent_1px)] bg-size-[56px_56px] opacity-[0.12] mask-[radial-gradient(ellipse_at_center,#000,transparent_70%)]"
            />

            {/* orbit rings + aura */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div
                data-aura
                className="absolute left-1/2 top-1/2 h-90 w-90 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(86,140,255,.22),transparent_65%)] opacity-40"
              />
            </div>

            <div className="relative mx-auto max-w-3xl">
              <div className="mb-6 flex items-center justify-center gap-4">
                <span data-eline className="h-px w-12 bg-(--accent-blue)" />
                <p data-eyebrow className="eyebrow text-(--accent-blue-bright)">
                  Limited Time Offer
                </p>
                <span data-eline className="h-px w-12 bg-(--accent-blue)" />
              </div>

              <h2 className="text-[clamp(40px,6vw,80px)] font-medium leading-[1.04] tracking-[-0.03em]">
                <span className={mask}>
                  <span data-h className="text-fade inline-block">
                    Ready to experience
                  </span>
                </span>
                <span className={mask}>
                  <span data-h className="text-shimmer inline-block">
                    the difference?
                  </span>
                </span>
              </h2>

              <div data-price className="mt-10 inline-flex items-center gap-5">
                <span
                  data-num
                  className="text-[clamp(44px,5vw,64px)] font-medium tracking-[-0.03em] text-(--text-primary)"
                >
                  ₹{PRICE.toLocaleString("en-IN")}
                </span>
                <div className="text-left">
                  <span
                    data-strike
                    className="cmp-strike block text-sm text-(--text-muted)"
                  >
                    ₹{MRP.toLocaleString("en-IN")}
                  </span>
                  <span
                    data-save
                    className="mt-1 inline-block rounded-full border border-(--status-success)/40 bg-(--status-success)/10 px-3 py-1 text-xs font-medium text-(--status-success)"
                  >
                    You save ₹{SAVE}
                  </span>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-8 sm:flex-row">
                <div data-cta data-magnetic className="inline-block">
                  <GlowButton href="/buy">Order Now →</GlowButton>
                </div>
                <ul className="flex items-center gap-6">
                  {BADGES.map((b) => (
                    <li
                      key={b.label}
                      data-badge
                      className="eyebrow flex items-center gap-2 text-(--text-muted) transition-colors hover:text-(--accent-blue-bright)"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={b.d} />
                      </svg>
                      {b.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
