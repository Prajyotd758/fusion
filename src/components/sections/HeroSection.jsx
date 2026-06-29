"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  { bg: "#e8e4dd", label: "Slide 1", emoji: "✨", path: "/left.png" },
  { bg: "#dde4e8", label: "Slide 2", emoji: "🌿", path: "/front.png" },
  { bg: "#e4dde8", label: "Slide 3", emoji: "💎", path: "/right.png" },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (idx) => {
    if (idx === active || animating) return;
    setAnimating(true);
    setActive(idx);
    setTimeout(() => setAnimating(false), 500);
  };

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const getSlides = () => {
    const prev = (active - 1 + SLIDES.length) % SLIDES.length;
    const next = (active + 1) % SLIDES.length;
    return [SLIDES[prev], SLIDES[active], SLIDES[next]];
  };

  const [left, center, right] = getSlides();

  return (
    <section className="pt-20 pb-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14 animate-fade-up">
          {/* <p className="text-xs font-medium tracking-widest text-[var(--text-muted)] uppercase mb-4">
            Introducing
          </p> */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl text-(--text-primary) leading-[1.1] mb-5">
            Move Beyond the Desk
            <br />A Mouse That Works Anywhere
          </h1>
          <p className="text-(--text-secondary) text-lg max-w-xl mx-auto leading-relaxed">
            Designed for work, gaming, presentations, and everyday use — without
            needing a desk.
            <br />A wireless air mouse built for comfort, mobility,
            and freedom.
          </p>
        </div>

        {/* Badges + Price */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 animate-fade-up delay-200">
          <span className="text-3xl font-semibold text-(--text-primary)">
            ₹999
          </span>
          <span className="text-(--text-muted) line-through text-lg">
            ₹1,499
          </span>
          {/* <span className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
            43% OFF
          </span> */}
          <span className="px-3 py-1 rounded-full bg-(--badge-bg)] border border-(--border) text-(--badge-text)] text-xs font-medium">
            💵 COD Available
          </span>
          <span className="px-3 py-1 rounded-full bg-(--badge-bg)] border border-(--border) text-(--badge-text)] text-xs font-medium">
            🚚 Free Shipping
          </span>
        </div>

        {/* Carousel */}
        <div
          className="flex items-center justify-center gap-5 mb-12"
          style={{ height: 480 }}
        >
          {/* Left */}
          <div
            className="carousel-slide side cursor-pointer"
            style={{ background: left.bg }}
            onClick={() => goTo((active - 1 + SLIDES.length) % SLIDES.length)}
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Image
                src={left.path}
                alt={left.label}
                fill
                className="mb-3 object-contain"
              />
            </div>
          </div>

          {/* Center */}
          <div
            className="carousel-slide center"
            style={{
              background: center.bg,
              transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Image
                src={center.path}
                alt={center.label}
                fill
                className="mb-3 object-contain"
              />
            </div>
          </div>

          {/* Right */}
          <div
            className="carousel-slide side cursor-pointer"
            style={{ background: right.bg }}
            onClick={() => goTo((active + 1) % SLIDES.length)}
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Image
                src={right.path}
                alt={right.label}
                fill
                className="mb-3 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active
                  ? "w-6 h-2 bg-(--text-primary)"
                  : "w-2 h-2 bg-(--border)"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-400">
          <Link
            href="/buy"
            className="px-8 py-4 bg-(--text-primary) text-white font-medium rounded-xl hover:bg-(--accent-hover) transition-all duration-200 hover:shadow-xl hover:shadow-black/15 hover:-translate-y-0.5 text-sm"
          >
            Order Now — ₹999 →
          </Link>
          <a
            href="#features"
            className="text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
          >
            See all features ↓
          </a>
        </div>
      </div>
    </section>
  );
}
