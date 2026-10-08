"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Review {
  rating: number;
  review: string;
}

const REVIEWS: Review[] = [
  {
    rating: 5,
    review:
      "Very comfortable to use. The grip feels premium and the dongle connection was easy to set up.",
  },
  {
    rating: 5,
    review:
      "Love the design. It stands out from other products and feels great in hand.",
  },
  { rating: 4, review: "product is good" },
];
const IMAGES = ["/review.jpeg"];
const SCORE = 4.1;

const Stars = ({ n }: { n: number }) => (
  <span
    className="inline-flex gap-0.5 text-lg"
    aria-label={`${n} out of 5 stars`}
  >
    {[0, 1, 2, 3, 4].map((k) => (
      <span
        key={k}
        data-star={k < n ? "on" : "off"}
        className={`inline-block ${
          k < n
            ? "text-(--accent-blue-bright) drop-shadow-[0_0_8px_rgba(66,191,255,.7)]"
            : "text-(--text-muted)/40"
        }`}
      >
        ★
      </span>
    ))}
  </span>
);

export default function ReviewsSection() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const [showImages, setShowImages] = useState(false);

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
      gsap.from("[data-sub]", {
        y: 20,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1,
        delay: 0.4,
        ease: "expo.out",
        scrollTrigger: head,
      });

      // score panel: frame opens, number counts up, stars fill to 4.1
      const st = { trigger: "[data-score]", start: "top 85%", once: true };
      gsap.from("[data-score]", {
        clipPath: "inset(0 50% 0 50% round 24px)",
        opacity: 0,
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: st,
      });
      const o = { v: 0 };
      gsap.to(o, {
        v: SCORE,
        duration: 2,
        ease: "power3.out",
        delay: 0.4,
        scrollTrigger: st,
        onUpdate: () => {
          const n = root.current?.querySelector("[data-num]");
          if (n) n.textContent = o.v.toFixed(1);
        },
      });
      gsap.fromTo(
        "[data-fill]",
        { width: "0%" },
        {
          width: `${(SCORE / 5) * 100}%`,
          duration: 2,
          ease: "power3.out",
          delay: 0.4,
          scrollTrigger: st,
        }
      );
      gsap.from("[data-meta]", {
        y: 16,
        opacity: 0,
        filter: "blur(6px)",
        duration: 1,
        stagger: 0.12,
        delay: 0.7,
        ease: "expo.out",
        scrollTrigger: st,
      });

      // review cards: slide up, stars pop one by one
      gsap.set("[data-review]", { y: 60, opacity: 0, filter: "blur(10px)" });
      ScrollTrigger.batch("[data-review]", {
        start: "top 90%",
        once: true,
        onEnter: (els) => {
          gsap.to(els, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
            clearProps: "filter",
          });
          els.forEach((el, k) =>
            gsap.fromTo(
              el.querySelectorAll('[data-star="on"]'),
              { scale: 0, rotate: -90 },
              {
                scale: 1,
                rotate: 0,
                duration: 0.7,
                ease: "back.out(2.5)",
                stagger: 0.07,
                delay: 0.3 + k * 0.12,
              }
            )
          );
        },
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
    root.current?.removeAttribute("data-pending");
    return () => ctx.revert();
  }, []);

  // images panel: smooth height + staggered thumbnails
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const p = panel.current!;
    if (showImages) {
      gsap.to(p, {
        height: "auto",
        opacity: 1,
        duration: 0.8,
        ease: "expo.out",
      });
      gsap.fromTo(
        p.querySelectorAll("[data-thumb]"),
        { scale: 0.8, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.15,
        }
      );
    } else
      gsap.to(p, { height: 0, opacity: 0, duration: 0.5, ease: "expo.inOut" });
  }, [showImages]);

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
      data-pending
      id="reviews"
      className="relative overflow-hidden border-t border-(--border-subtle) bg-(--bg-primary) py-(--section-space)"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--border-subtle)_1px,transparent_1px)] bg-size-[72px_72px] opacity-[0.14] mask-[radial-gradient(ellipse_at_50%_20%,#000,transparent_70%)]"
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
        <div data-head className="mb-14 max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <span data-eline className="h-px w-12 bg-(--accent-blue)" />
            <p className="eyebrow text-(--text-muted)">Customer Reviews</p>
          </div>
          <h2 className="text-[clamp(40px,5.4vw,72px)] font-medium leading-[1.04] tracking-[-0.03em]">
            <span className={mask}>
              <span data-h className="text-fade inline-block">
                Hear from
              </span>
            </span>
            <span className={mask}>
              <span data-h className="text-shimmer inline-block">
                early users
              </span>
            </span>
          </h2>
          <p data-sub className="mt-6 max-w-md text-(--text-secondary)">
            Hear what early users think about the product.
          </p>
        </div>

        {/* score */}
        <div data-score className="cmp-wrap mb-6">
          <div className="cmp-inner flex flex-col gap-8 p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              <span
                data-num
                className="text-[clamp(64px,8vw,104px)] font-medium leading-none tracking-[-0.04em] text-fade"
              >
                4.1
              </span>
              <div>
                <div
                  data-meta
                  className="relative inline-block text-2xl leading-none"
                >
                  <span aria-hidden className="text-(--text-muted)/40">
                    ★★★★★
                  </span>
                  <span
                    data-fill
                    aria-hidden
                    className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-(--accent-blue-bright) drop-shadow-[0_0_10px_rgba(66,191,255,.7)]"
                  >
                    ★★★★★
                  </span>
                </div>
                <p data-meta className="eyebrow mt-3 text-(--text-muted)">
                  Based on 12 reviews
                </p>
              </div>
            </div>
            <button
              data-meta
              onClick={() => setShowImages((s) => !s)}
              aria-expanded={showImages}
              className="group eyebrow relative self-start py-2 text-(--text-primary) md:self-auto"
            >
              {showImages ? "Hide Images" : `See Images (${IMAGES.length})`}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-30 bg-(image:--accent-gradient) transition-transform duration-500 group-hover:scale-x-100" />
            </button>
          </div>
        </div>

        {/* images */}
        <div
          ref={panel}
          style={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="feat-card mb-6 p-6 sm:p-8">
            <h3 className="eyebrow relative z-10 mb-5 text-(--text-secondary)">
              Customer Images
            </h3>
            <div className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {IMAGES.map((img, i) => (
                <div
                  key={i}
                  data-thumb
                  className="group aspect-square overflow-hidden rounded-xl border border-(--border-subtle)"
                >
                  <img
                    src={img}
                    alt={`Customer review ${i + 1}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* reviews */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              data-review
              onPointerMove={move}
              className="feat-card group p-7 sm:p-8"
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-8 flex items-start justify-between">
                  <Stars n={r.rating} />
                  <span className="eyebrow text-(--text-muted)">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="flex-1 text-[15px] leading-relaxed text-(--text-secondary) transition-colors duration-300 group-hover:text-(--text-primary)">
                  “{r.review}”
                </p>
                <div className="feat-bar mt-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
