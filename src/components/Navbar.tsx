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

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/#product" },
  { label: "Technology", href: "/#technology" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
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

export default function Navbar() {
  const pathname = usePathname();
  const active = Math.max(
    0,
    LINKS.findIndex((l) => l.href === pathname)
  );
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const els = useRef<(HTMLAnchorElement | null)[]>([]);

  const moveTo = (i: number, d = 0.6) => {
    const el = els.current[i];
    if (!el || !ind.current) return;
    gsap.to(ind.current, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
      duration: d,
      ease: "expo.out",
      overwrite: true,
    });
  };

  useIso(() => {
    let off = () => {};
    const section = root.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.set(menu.current, {
        visibility: "hidden",
        clipPath: "circle(0% at 92% 4%)",
      });
      tl.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () =>
            gsap.set(menu.current, { visibility: "hidden" }),
        })
        .set(menu.current, { visibility: "visible" })
        .to(menu.current, {
          clipPath: "circle(150% at 92% 4%)",
          duration: 0.9,
          ease: "expo.inOut",
        })
        .from(
          ".m-link",
          {
            yPercent: 110,
            opacity: 0,
            stagger: 0.07,
            duration: 0.8,
            ease: "expo.out",
          },
          "-=0.45"
        );

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
        .from(
          "[data-link]",
          {
            y: -36,
            opacity: 0,
            filter: "blur(10px)",
            stagger: 0.08,
            duration: 1,
          },
          0.5
        )
        // Do not animate the button's y transform: the magnetic interaction also
        // controls transforms and can pull the buttons outside the navbar.
        .fromTo(
          "[data-btn]",
          { autoAlpha: 0, scale: 0.94 },
          {
            autoAlpha: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.75,
            ease: "expo.out",
            clearProps: "opacity,visibility,transform",
          },
          0.8
        );

      // Release the CSS visibility lock only after GSAP has set its initial states.
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

      if (window.matchMedia("(hover:hover) and (pointer:fine)").matches)
        off = magnetic(gsap.utils.toArray("[data-magnetic]"), 0.3);
    }, section);
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    moveTo(active, 0);
    const r = () => moveTo(active, 0);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, [active]);

  useEffect(() => {
    open ? tl.current?.play() : tl.current?.reverse();
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const pill =
    "group inline-flex items-center gap-2.5 rounded-full border border-(--border-subtle) bg-(--bg-glass) px-5 py-2.5 text-sm text-(--text-primary) transition-all duration-300 hover:border-(--border-highlight) hover:shadow-[0_0_28px_rgba(66,191,255,0.22)]";

  return (
    <header ref={root} data-pending className="sticky top-0 z-40">
      <div ref={bar} className="relative z-40 h-24">
        <div
          ref={bg}
          className="absolute inset-0 bg-(--bg-glass) opacity-0 backdrop-blur-xl"
        />

        <div className="container-arceus relative flex h-full items-center justify-between">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <span data-logo className="block">
              <Image
                src="/logo.png"
                alt="Arceus logo"
                width={44}
                height={44}
                priority
              />
            </span>
            <span data-logo-text className="text-[26px] tracking-[-0.02em]">
              arceus
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <div
              className="relative flex items-center"
              onMouseLeave={() => moveTo(active)}
            >
              <div
                ref={ind}
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-0 rounded-full border border-(--border-subtle) bg-white/4 opacity-0"
              >
                <span className="absolute -bottom-[25px] left-1/2 h-0.5 w-3/5 -translate-x-1/2 rounded-full bg-(--accent-blue) shadow-[0_0_14px_var(--accent-blue)]" />
              </div>
              {LINKS.map((l, i) => (
                <Link
                  key={l.label}
                  data-link
                  href={l.href}
                  ref={(el) => {
                    els.current[i] = el;
                  }}
                  onMouseEnter={() => moveTo(i)}
                  className={`group relative z-10 block px-5 py-2.5 text-[15px] transition-colors ${
                    i === active
                      ? "text-(--text-primary)"
                      : "text-(--text-secondary) hover:text-(--text-primary)"
                  }`}
                >
                  <Roll>{l.label}</Roll>
                </Link>
              ))}
            </div>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              data-btn
              data-magnetic
              href="/buy"
              onClick={() => initiateCheckout()}
              className={pill}
            >
              Buy AirGrip V1
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link data-btn data-magnetic href="/orders" className={pill}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--status-success) opacity-70" />
                <span className="relative h-2 w-2 rounded-full bg-(--status-success)" />
              </span>
              Order status
            </Link>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-(--border-subtle) bg-(--bg-glass) lg:hidden"
          >
            <span
              className={`absolute h-px w-5 bg-(--text-primary) transition-transform duration-500 ${
                open ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`absolute h-px w-5 bg-(--text-primary) transition-transform duration-500 ${
                open ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </div>

        {/* bottom line: base + scanning light + scroll progress */}
        <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
          <div data-line className="absolute inset-0 bg-(--border-subtle)" />
          <div className="nav-scan absolute inset-y-0 left-0 w-[30vw]" />
          <div
            data-progress
            className="absolute inset-0 origin-left scale-x-0 bg-(image:--accent-gradient)"
          />
        </div>
      </div>

      {/* mobile overlay */}
      <div
        ref={menu}
        className="fixed inset-0 z-30 bg-(--bg-primary) lg:hidden"
      >
        <div className="container-arceus flex h-full flex-col justify-center gap-2 pt-24">
          {LINKS.map((l) => (
            <div key={l.label} className="overflow-hidden">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="m-link block py-1 text-[clamp(36px,10vw,64px)] font-medium tracking-[-0.03em] text-fade"
              >
                {l.label}
              </Link>
            </div>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="overflow-hidden">
              <Link
                href="/buy"
                className={`m-link ${pill}`}
                onClick={() => {
                  initiateCheckout();
                  setOpen(false);
                }}
              >
                Buy AirGrip V1 →
              </Link>
            </div>
            <div className="overflow-hidden">
              <Link
                href="/orders"
                className={`m-link ${pill}`}
                onClick={() => setOpen(false)}
              >
                Order status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
