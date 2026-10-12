"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { gsap } from "gsap";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function ErrorModal({
  open,
  onClose,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
}: ErrorModalProps) {
  const [mounted, setMounted] = useState(open);
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useLayoutEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  // Enter
  useLayoutEffect(() => {
    if (!mounted || !open || !root.current) return;
    gsap.killTweensOf(root.current.querySelectorAll(".em-overlay, .em-card"));

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".em-overlay", { opacity: 0 }, { opacity: 1, duration: 0.35 })
        .fromTo(
          ".em-card",
          { opacity: 0, y: 28, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 },
          0.05
        )
        .fromTo(
          ".em-line",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            transformOrigin: "left center",
            ease: "power2.inOut",
          },
          0.15
        )
        .fromTo(
          ".em-item",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          0.25
        )
        .fromTo(
          ".em-draw",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: "power2.inOut",
            stagger: 0.25,
          },
          0.4
        )
        .fromTo(
          ".em-break",
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.4, svgOrigin: "158 24" },
          1.15
        );

      gsap.to(".em-blink", {
        opacity: 0.25,
        duration: 0.7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".em-ping", {
        scale: 3,
        opacity: 0,
        svgOrigin: "158 24",
        duration: 1.6,
        ease: "power2.out",
        repeat: -1,
        delay: 1.2,
      });
    }, root);

    closeBtn.current?.focus();
    return () => ctx.kill();
  }, [mounted, open]);

  // Exit
  useLayoutEffect(() => {
    if (open || !mounted || !root.current) return;
    const el = root.current;
    gsap.to(el.querySelector(".em-card"), {
      opacity: 0,
      y: 14,
      scale: 0.98,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(el.querySelector(".em-overlay"), {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setMounted(false),
    });
  }, [open, mounted]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="em-overlay absolute inset-0 bg-[#07090D]/85 backdrop-blur-md"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 45% 35% at 50% 50%, rgba(255,90,110,0.10), transparent 70%), radial-gradient(ellipse 30% 25% at 62% 60%, rgba(155,114,255,0.08), transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="em-card relative w-full max-w-110 overflow-hidden rounded-2xl border border-[rgba(180,205,235,0.14)] bg-[#0B0F15] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Fine grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(180,205,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(180,205,235,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse at top, #000 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top, #000 0%, transparent 70%)",
          }}
        />
        {/* Top accent line */}
        <div
          className="em-line absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, #FF5A6E, #9B72FF 60%, transparent)",
          }}
        />

        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="em-item flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#687487]">
              <AlertTriangle size={13} className="em-blink text-[#FF5A6E]" />
              System <span className="text-[#FF5A6E]">/</span> Alert
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 rounded-md p-2 text-[#687487] transition-colors duration-200 hover:bg-[rgba(180,205,235,0.08)] hover:text-[#F4F6FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#42BFFF]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Broken signal */}
          <div className="em-item mt-7">
            <svg
              viewBox="0 0 400 48"
              className="h-12 w-full overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="arceus-err-grad"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="158"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#42BFFF" stopOpacity="0.2" />
                  <stop offset="60%" stopColor="#68D0FF" />
                  <stop offset="100%" stopColor="#FF5A6E" />
                </linearGradient>
              </defs>
              <path
                className="em-draw"
                pathLength={1}
                strokeDasharray={1}
                d="M0 24 H34 L42 10 L52 38 L62 4 L72 44 L82 14 L92 32 L100 24 H122 L130 18 L138 30 L146 24 H158"
                fill="none"
                stroke="url(#arceus-err-grad)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="em-draw"
                pathLength={1}
                strokeDasharray={1}
                d="M182 24 H400"
                fill="none"
                stroke="rgba(180,205,235,0.22)"
                strokeWidth="1"
                style={{ strokeDasharray: "2 6", strokeDashoffset: 0 }}
              />
              <g className="em-break">
                <circle
                  className="em-ping"
                  cx="158"
                  cy="24"
                  r="4"
                  fill="none"
                  stroke="#FF5A6E"
                  strokeWidth="1"
                />
                <circle cx="158" cy="24" r="3" fill="#FF5A6E" />
              </g>
            </svg>
          </div>

          {/* Content */}
          <h2
            id={titleId}
            className="em-item mt-6 text-[clamp(24px,5vw,30px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#F4F6FA]"
          >
            {title}
          </h2>
          <p
            id={descId}
            className="em-item mt-3 text-[15px] leading-relaxed text-[#A0A9B8]"
          >
            {message}
          </p>

          {/* Action */}
          <div className="em-item mt-8">
            <button
              ref={closeBtn}
              onClick={onClose}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(66,191,255,0.45)] bg-[#101722] px-4 py-3.5 text-sm font-medium text-[#F4F6FA] transition-all duration-200 hover:border-[#68D0FF] hover:bg-[#141d2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#42BFFF] active:scale-[0.99]"
            >
              Close
              <span className="text-[#68D0FF] transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
