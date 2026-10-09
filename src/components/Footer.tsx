"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Key = "contact" | "email" | "privacy" | "terms" | "refund" | "shipping";

const MODAL_CONTENT = {
  contact: {
    title: "Contact Us",
    content: (
      <div className="space-y-4 text-sm text-(--text-secondary)">
        <p>
          We're here to help! Reach out to us through any of the channels below.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-lg">📧</span>
            <div>
              <p className="font-medium text-(--text-primary)">Email</p>
              <p>arceus.in.service@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  email: {
    title: "Email Us",
    content: (
      <div className="text-sm text-(--text-secondary) space-y-3">
        <p>For any queries, complaints, or feedback, drop us an email at:</p>
        <a
          href="mailto:arceus.in.service@gmail.com"
          className="block font-medium text-(--text-primary) text-base"
        >
          arceus.in.service@gmail.com
        </a>
        <p>We typically respond within 24 business hours.</p>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    content: (
      <div className="text-sm text-(--text-secondary) space-y-3 leading-relaxed">
        <p>
          We respect your privacy and are committed to protecting your personal
          information.
        </p>
        <p>
          <strong className="text-(--text-primary)">Data Collection:</strong> We
          collect only the information necessary to process your order — name,
          email, phone, and delivery address.
        </p>
        <p>
          <strong className="text-(--text-primary)">Data Use:</strong> Your data
          is used solely for order processing, delivery, and customer support.
          We never sell your information to third parties.
        </p>
        <p>
          <strong className="text-(--text-primary)">Cookies:</strong> We use
          minimal cookies for analytics and to improve your experience.
        </p>
        <p>
          <strong className="text-(--text-primary)">Security:</strong> All
          transactions are secured with SSL encryption.
        </p>
        {/* <p>Last updated: January 2025</p> */}
      </div>
    ),
  },
  terms: {
    title: "Terms & Conditions",
    content: (
      <div className="text-sm text-(--text-secondary) space-y-3 leading-relaxed">
        <p>By placing an order, you agree to the following terms:</p>
        <p>
          <strong className="text-(--text-primary)">Pricing:</strong> All prices
          are in Indian Rupees (INR) and inclusive of applicable taxes.
        </p>
        <p>
          <strong className="text-(--text-primary)">Order Accuracy:</strong>{" "}
          Please ensure all order details are correct before submission.
        </p>
        <p>
          <strong className="text-(--text-primary)">
            Intellectual Property:
          </strong>{" "}
          All content on this site is the property of our brand.
        </p>
        {/* <p>
          <strong className="text-(--text-primary)">Disputes:</strong> Any
          disputes shall be subject to the jurisdiction of Mumbai courts.
        </p> */}
      </div>
    ),
  },
  refund: {
    title: "Refund Policy",
    content: (
      <div className="text-sm text-(--text-secondary) space-y-3 leading-relaxed">
        <p>Your satisfaction is our priority. Here's our refund policy:</p>
        <p>
          <strong className="text-(--text-primary)">5-Day Guarantee:</strong> If
          you're not satisfied, contact us within 5 days of delivery for a full
          refund.
        </p>
        <p>
          <strong className="text-(--text-primary)">Process:</strong> Email us
          at refunds@yourbrand.com with your order ID. We'll initiate the refund
          within 3–5 business days.
        </p>
        <p>
          <strong className="text-(--text-primary)">Condition:</strong> Products
          must be returned in their original packaging. Return shipping is free
          for defective items.
        </p>
        <p>
          <strong className="text-(--text-primary)">Refund Method:</strong>{" "}
          Refunds are credited to the original payment method or via bank
          transfer for COD orders.
        </p>
      </div>
    ),
  },
  shipping: {
    title: "Shipping Policy",
    content: (
      <div className="text-sm text-(--text-secondary) space-y-3 leading-relaxed">
        <p>
          <strong className="text-(--text-primary)">Free Shipping:</strong> All
          orders across India ship for free — no minimum order value.
        </p>
        <p>
          <strong className="text-(--text-primary)">Dispatch Time:</strong>{" "}
          Orders are dispatched within 24 hours of confirmation (Mon–Sat).
        </p>
        <p>
          <strong className="text-(--text-primary)">Delivery Time:</strong> 4–5
          business days for metros; 5–7 days for tier-2 and tier-3 cities.
        </p>
        <p>
          <strong className="text-(--text-primary)">Delayed Orders:</strong> In
          rare cases of delays, contact us and we'll resolve it promptly.
        </p>
      </div>
    ),
  },
};

const LINKS: { key: Key; label: string }[] = [
  { key: "contact", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "terms", label: "Terms" },
  { key: "refund", label: "Refund Policy" },
  { key: "shipping", label: "Shipping Policy" },
];

function Roll({ children }: { children: string }) {
  const t =
    "block transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)]";
  return (
    <span className="relative block overflow-hidden">
      <span className={`${t} group-hover:-translate-y-full`}>{children}</span>
      <span
        aria-hidden
        className={`${t} absolute inset-0 translate-y-full text-(--accent-blue-bright) group-hover:translate-y-0`}
      >
        {children}
      </span>
    </span>
  );
}

export default function Footer() {
  const root = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const closing = useRef(false);
  const [modal, setModal] = useState<Key | null>(null);
  const active = modal ? MODAL_CONTENT[modal] : null;
  const idx = LINKS.findIndex((l) => l.key === modal);

  // footer scroll animations
  useIso(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top 85%", once: true };
      gsap
        .timeline({ scrollTrigger: st, defaults: { ease: "expo.out" } })
        .from(
          "[data-ft-line]",
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1.6,
            ease: "expo.inOut",
          },
          0
        )
        .from(
          "[data-ft-brand]",
          { y: 24, opacity: 0, filter: "blur(8px)", duration: 1 },
          0.3
        )
        .from(
          "[data-ft-link]",
          {
            y: 30,
            opacity: 0,
            filter: "blur(8px)",
            stagger: 0.08,
            duration: 1,
          },
          0.4
        )
        .from(
          "[data-ft-meta]",
          { opacity: 0, y: 12, stagger: 0.1, duration: 0.9 },
          0.9
        );

      // giant wordmark: letters rise, then drift with scroll
      gsap.from("[data-ft-char]", {
        yPercent: 110,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: "[data-ft-word]",
          start: "top 95%",
          once: true,
        },
      });
      gsap.fromTo(
        "[data-ft-word]",
        { yPercent: 18 },
        {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
      gsap.to("[data-ft-glow]", {
        scale: 1.25,
        opacity: 0.8,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);
    root.current?.removeAttribute("data-pending");
    return () => ctx.revert();
  }, []);

  // modal: open animation
  useIso(() => {
    if (!modal) return;
    closing.current = false;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          "[data-backdrop]",
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          0
        )
        .fromTo(
          "[data-card]",
          {
            clipPath: "inset(50% 50% 50% 50% round 24px)",
            y: 50,
            scale: 0.92,
            rotateX: 14,
            transformPerspective: 1000,
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            y: 0,
            scale: 1,
            rotateX: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.inOut",
          },
          0
        )
        .fromTo(
          "[data-scan]",
          { yPercent: -100, opacity: 1 },
          { yPercent: 700, opacity: 0, duration: 1.4, ease: "power2.inOut" },
          0.3
        )
        .from("[data-m-eyebrow]", { x: -16, opacity: 0, duration: 0.8 }, 0.6)
        .from(
          "[data-m-title]",
          { yPercent: 120, rotate: 3, transformOrigin: "0 100%", duration: 1 },
          0.65
        )
        .from(
          "[data-m-rule]",
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1.1,
            ease: "expo.inOut",
          },
          0.7
        )
        .from(
          "[data-m-close]",
          { scale: 0, rotate: -180, duration: 0.9, ease: "back.out(2)" },
          0.8
        )
        .from(
          "[data-body] > *",
          {
            y: 22,
            opacity: 0,
            filter: "blur(8px)",
            stagger: 0.09,
            duration: 1,
          },
          0.85
        );
    }, panel);
    return () => ctx.revert();
  }, [modal]);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    gsap
      .timeline({ onComplete: () => setModal(null) })
      .to(
        "[data-body] > *",
        { y: -10, opacity: 0, stagger: 0.03, duration: 0.25 },
        0
      )
      .to(
        "[data-card]",
        {
          y: 30,
          scale: 0.94,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.45,
          ease: "power3.in",
        },
        0.1
      )
      .to("[data-backdrop]", { opacity: 0, duration: 0.4 }, 0.15);
  };

  // esc to close + scroll lock
  useEffect(() => {
    if (!modal) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [modal]);

  return (
    <>
      <footer
        ref={root}
        data-pending
        className="relative overflow-hidden border-t border-(--border-subtle) bg-(--bg-primary) pt-20"
      >
        <div
          data-ft-glow
          aria-hidden
          className="pointer-events-none absolute left-1/2 bottom-0 h-130 w-[min(900px,100vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(86,140,255,0.16),transparent_65%)] opacity-50"
        />
        <div className="container-arceus relative">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
            <div data-ft-brand>
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Arceus logo"
                  width={44}
                  height={44}
                />
                <span className="text-[26px] tracking-[-0.02em]">arceus</span>
              </div>
              <p className="eyebrow mt-6 text-(--text-muted)">
                Hardware + AI = A Smarter You
              </p>
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-1 gap-x-10 sm:grid-cols-2"
            >
              {LINKS.map((l, i) => (
                <button
                  key={l.key}
                  data-ft-link
                  onClick={() => setModal(l.key)}
                  className="group flex items-center gap-5 border-t border-(--border-subtle) py-5 text-left"
                >
                  <span className="eyebrow w-6 text-(--text-muted) transition-colors group-hover:text-(--accent-blue)">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-lg tracking-[-0.01em] text-(--text-secondary) transition-colors group-hover:text-(--text-primary)">
                    <Roll>{l.label}</Roll>
                  </span>
                  <span
                    aria-hidden
                    className="text-(--accent-blue-bright) opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  >
                    →
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="relative mt-16 flex items-center gap-6">
            <span data-ft-line className="h-px flex-1 bg-(--border-subtle)" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 py-6">
            <p data-ft-meta className="eyebrow text-(--text-muted)">
              © {new Date().getFullYear()} Arceus. All rights reserved.
            </p>
            <button
              data-ft-meta
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group eyebrow flex items-center gap-3 text-(--text-secondary) hover:text-(--text-primary)"
            >
              Back to top
              <span className="grid h-8 w-8 place-items-center rounded-full border border-(--border-subtle) transition-all duration-300 group-hover:-translate-y-1 group-hover:border-(--border-highlight)">
                ↑
              </span>
            </button>
          </div>
        </div>

        {/* giant wordmark */}
        <div
          aria-hidden
          className="pointer-events-none relative select-none overflow-hidden text-center"
        >
          <div
            data-ft-word
            className="flex justify-center text-[clamp(90px,22vw,380px)] font-semibold uppercase leading-[0.85] tracking-[-0.04em]"
          >
            {[..."arceus"].map((c, i) => (
              <span key={i} className="overflow-hidden pb-[0.06em]">
                <span
                  data-ft-char
                  className="inline-block bg-linear-to-b from-white/25 to-transparent bg-clip-text text-transparent"
                >
                  {c}
                </span>
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* modal */}
      {active && (
        <div
          ref={panel}
          className="fixed inset-0 z-50 grid place-items-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ft-title"
        >
          <div
            data-backdrop
            onClick={close}
            className="absolute inset-0 bg-[rgba(3,5,8,0.75)] backdrop-blur-md"
          />
          <div
            data-card
            className="cmp-wrap relative w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cmp-inner">
              <span
                data-scan
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-linear-to-b from-transparent via-(--accent-blue)/25 to-transparent"
              />
              <div className="relative flex items-start justify-between gap-4 px-7 pb-5 pt-7">
                <div className="min-w-0">
                  <p
                    data-m-eyebrow
                    className="eyebrow mb-3 text-(--accent-blue-bright)"
                  >
                    {String(idx + 1).padStart(2, "0")} /{" "}
                    {String(LINKS.length).padStart(2, "0")}
                  </p>
                  <h3 id="ft-title" className="overflow-hidden pb-1">
                    <span
                      data-m-title
                      className="text-fade inline-block text-[clamp(26px,4vw,34px)] font-medium tracking-[-0.02em]"
                    >
                      {active.title}
                    </span>
                  </h3>
                </div>
                <button
                  data-m-close
                  onClick={close}
                  aria-label="Close"
                  className="group grid h-10 w-10 shrink-0 place-items-center rounded-full border border-(--border-subtle) bg-(--bg-glass) transition-colors hover:border-(--border-highlight)"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    className="transition-transform duration-500 group-hover:rotate-90"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div
                data-m-rule
                className="mx-7 h-px bg-(image:--accent-gradient)"
              />
              <div className="max-h-[60vh] overflow-y-auto px-7 py-6">
                <div
                  data-body
                  className="leading-relaxed [&_a]:text-(--accent-blue-bright) [&_a]:underline-offset-4 hover:[&_a]:underline"
                >
                  {active.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
