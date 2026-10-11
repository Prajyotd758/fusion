"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initiateCheckout } from "../lib/metapixel";
import { magnetic } from "../lib/magnetic";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DownloadIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
  </svg>
);

const StatusDot = () => (
  <span className="relative flex h-2 w-2">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--status-success) opacity-70" />
    <span className="relative h-2 w-2 rounded-full bg-(--status-success)" />
  </span>
);

export default function Navbar() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menuMounted = useRef(false);

  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const isRoute = (p: string) =>
    pathname === p || !!pathname?.startsWith(`${p}/`);
  const showBuy = !isRoute("/buy");
  const showOrders = !isRoute("/orders");
  const showDownload = !isRoute("/arceus");

  useIso(() => {
    const section = root.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(
          "[data-line]",
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1.6,
            ease: "expo.inOut",
          },
          0
        )
        .from(
          "[data-logo]",
          { rotate: -180, scale: 0.3, opacity: 0, duration: 1.3 },
          0.1
        )
        .from(
          "[data-logo-text]",
          {
            clipPath: "inset(0 100% 0 0)",
            x: -16,
            duration: 1,
            ease: "expo.inOut",
          },
          0.4
        )
        .fromTo(
          "[data-btn]",
          { autoAlpha: 0, scale: 0.94 },
          {
            autoAlpha: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.75,
            clearProps: "opacity,visibility,transform",
          },
          0.6
        );

      section.removeAttribute("data-pending");

      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      let hidden = false,
        solid = false;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (s) => {
          const y = s.scroll();
          const wantSolid = y > 20;
          if (wantSolid !== solid) {
            solid = wantSolid;
            gsap.to(bg.current, { opacity: solid ? 1 : 0, duration: 0.4 });
          }
          const wantHide = y > 160 && s.direction === 1;
          const wantShow = s.direction === -1 || y <= 160;
          if (wantHide && !hidden) {
            hidden = true;
            setOpen(false);
            gsap.to(bar.current, {
              yPercent: -100,
              duration: 0.6,
              ease: "expo.inOut",
            });
          } else if (wantShow && hidden) {
            hidden = false;
            gsap.to(bar.current, {
              yPercent: 0,
              duration: 0.6,
              ease: "expo.out",
            });
          }
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  // Magnetic hover (desktop pills): re-bind when visible buttons change
  useIso(() => {
    const section = root.current;
    if (
      !section ||
      !window.matchMedia("(hover:hover) and (pointer:fine)").matches
    )
      return;
    let off = () => {};
    const ctx = gsap.context(() => {
      off = magnetic(gsap.utils.toArray("[data-magnetic]"), 0.3);
    }, section);
    return () => {
      off();
      ctx.revert();
    };
  }, [showBuy, showOrders]);

  // Mobile menu: staggered reveal (same feel as the intro buttons)
  useIso(() => {
    const el = panel.current;
    if (!el) return;
    if (!menuMounted.current) {
      menuMounted.current = true;
      return;
    }
    const items = el.querySelectorAll("[data-mitem]");
    gsap.killTweensOf([el, items]);
    if (open) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" }
      );
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: -10, scale: 0.94 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.09,
          duration: 0.75,
          delay: 0.05,
          ease: "expo.out",
        }
      );
    } else {
      gsap.to(el, { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.in" });
    }
  }, [open]);

  // Close menu on route change, Escape, outside tap
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const pill =
    "group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-(--border-subtle) bg-(--bg-glass) px-3.5 py-2 text-xs text-(--text-primary) transition-all duration-300 hover:border-(--border-highlight) hover:shadow-[0_0_28px_rgba(66,191,255,0.22)] sm:gap-2.5 sm:px-5 sm:py-2.5 sm:text-sm";
  const row =
    "group flex items-center justify-between gap-3 rounded-xl border border-(--border-subtle) bg-(--bg-elevated) px-4 py-3.5 text-sm text-(--text-primary) transition-colors duration-300 hover:border-(--border-highlight) active:bg-(--bg-secondary)";
  const arrow = (
    <span className="transition-transform duration-300 group-hover:translate-x-1">
      →
    </span>
  );

  return (
    <header ref={root} data-pending className="sticky top-0 z-40">
      <div ref={bar} className="relative z-40 h-20 sm:h-24">
        <div
          ref={bg}
          className="absolute inset-0 bg-(--bg-glass) opacity-0 backdrop-blur-xl"
        />

        <div className="container-arceus relative flex h-full items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span data-logo className="block">
              <Image
                src="/logo.png"
                alt="Arceus logo"
                width={44}
                height={44}
                priority
              />
            </span>
            <span
              data-logo-text
              className="text-[26px] tracking-[-0.02em] max-[480px]:hidden"
            >
              arceus
            </span>
          </Link>

          {/* desktop / tablet: three inline pills */}
          <div className="hidden items-center gap-3 md:flex">
            {showDownload && (
              <Link
                key="arceus"
                data-btn
                data-magnetic
                href="/arceus"
                onClick={() => initiateCheckout()}
                className={pill}
              >
                Download Arceus
                {arrow}
              </Link>
            )}
            {showBuy && (
              <Link
                key="buy"
                data-btn
                data-magnetic
                href="/buy"
                onClick={() => initiateCheckout()}
                className={pill}
              >
                Buy AirGrip
                {arrow}
              </Link>
            )}
            {showOrders && (
              <Link
                key="orders"
                data-btn
                data-magnetic
                href="/orders"
                className={pill}
              >
                <StatusDot />
                Order status
              </Link>
            )}
          </div>

          {/* mobile: menu toggle */}
          <button
            data-btn
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-glass) text-(--text-primary) transition-colors duration-300 hover:border-(--border-highlight) md:hidden"
          >
            <span
              className={`absolute h-px w-4 bg-current transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-current transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </button>
        </div>

        {/* mobile panel */}
        <div
          ref={panel}
          id="mobile-menu"
          className="invisible absolute inset-x-0 top-full border-b border-(--border-subtle) bg-(--bg-glass) opacity-0 backdrop-blur-xl md:hidden"
        >
          <div className="container-arceus flex flex-col gap-2 py-4">
            <a
              data-mitem
              href="/arceus"
              download
              onClick={() => setOpen(false)}
              className={row}
            >
              <span className="flex items-center gap-2.5">
                <DownloadIcon />
                Download Arceus
              </span>
              {arrow}
            </a>
            {showBuy && (
              <Link
                data-mitem
                href="/buy"
                onClick={() => {
                  initiateCheckout();
                  setOpen(false);
                }}
                className={row}
              >
                Buy AirGrip
                {arrow}
              </Link>
            )}
            {showOrders && (
              <Link
                data-mitem
                href="/orders"
                onClick={() => setOpen(false)}
                className={row}
              >
                <span className="flex items-center gap-2.5">
                  <StatusDot />
                  Order status
                </span>
                {arrow}
              </Link>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
          <div data-line className="absolute inset-0 bg-(--border-subtle)" />
          <div className="nav-scan absolute inset-y-0 left-0 w-[30vw]" />
          <div
            data-progress
            className="absolute inset-0 origin-left scale-x-0 bg-(image:--accent-gradient)"
          />
        </div>
      </div>
    </header>
  );
}
