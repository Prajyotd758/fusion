"use client";
import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { magnetic } from "../../lib/magnetic";
import { useRouter } from "next/navigation";
import OrbCanvas from "../arceusPageComponent/OrbCanvas1"; // <- fix path to wherever OrbCanvas1 lives

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const Chars = ({ text, cls = "" }: { text: string; cls?: string }) => (
  <>
    {text.split(" ").map((w, i) => (
      <span key={i} className="inline-block whitespace-nowrap">
        {[...w].map((c, j) => (
          <span key={j} data-char className={`inline-block ${cls}`}>
            {c}
          </span>
        ))}
        {"\u00A0"}
      </span>
    ))}
  </>
);

export default function Arceus() {
  const router = useRouter();
  const root = useRef<HTMLElement>(null);
  const orbWrap = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const amp = useRef({ v: 0.15 });

  useIso(() => {
    let off = () => {};
    const section = root.current;
    if (!section) return;

    const html = document.documentElement;

    const ctx = gsap.context(() => {
      // Text intro (starts when the loader opens)
      const intro = gsap.timeline({
        paused: true,
        defaults: { ease: "expo.out" },
      });

      intro
        .from("[data-orb-in]", { opacity: 0, scale: 0.3, duration: 2.2 }, 0)
        .from(
          "[data-char]",
          {
            yPercent: 120,
            rotate: 8,
            opacity: 0,
            transformOrigin: "0% 100%",
            duration: 1.1,
            stagger: 0.03,
          },
          0.35
        )
        .from(
          "[data-grad]",
          {
            clipPath: "inset(0 100% 0 0)",
            x: -30,
            filter: "blur(14px)",
            duration: 1.4,
            ease: "expo.inOut",
          },
          0.6
        )
        .from(
          "[data-fade]",
          {
            y: 30,
            opacity: 0,
            filter: "blur(8px)",
            duration: 1,
            stagger: 0.12,
          },
          0.9
        )
        .from(
          "[data-strip-line]",
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1.6,
            ease: "expo.inOut",
          },
          1
        )
        .from("[data-strip-txt]", { opacity: 0, y: 10, stagger: 0.1 }, 1.2);

      intro.progress(0).pause();
      section.removeAttribute("data-pending");

      // Boot loader: 0 -> 100, then panels split and the intro starts

      const cnt = { n: 0 };
      const counter = section.querySelector<HTMLElement>("[data-count]")!;
      gsap
        .timeline({
          onComplete: () => {
            html.style.overflow = "";
            ScrollTrigger.refresh();
          },
        })
        .from("[data-bl]", {
          autoAlpha: 0,
          x: -14,
          stagger: 0.35,
          duration: 0.4,
        })
        .to(
          cnt,
          {
            n: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              counter.textContent = String(Math.round(cnt.n)).padStart(3, "0");
            },
          },
          0
        )
        .to(
          "[data-bfill]",
          { scaleX: 1, duration: 1.6, ease: "power2.inOut" },
          0
        )
        .to("[data-boot-in]", { autoAlpha: 0, y: -20, duration: 0.4 }, 1.9)
        .to(
          "[data-boot-a]",
          { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
          2.1
        )
        .to(
          "[data-boot-b]",
          { yPercent: 100, duration: 0.9, ease: "power4.inOut" },
          2.1
        )
        .add(() => {
          intro.play();
        }, 2.3)
        .set("[data-boot]", { display: "none" }, 3.1);

      // Scroll: orb drifts + zooms, copy lifts away
      const st = {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(orbWrap.current, {
        yPercent: 15,
        scale: 1.12,
        ease: "none",
        scrollTrigger: st,
      });
      gsap.to(content.current, {
        yPercent: -14,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: st,
      });

      // Looping progress
      gsap.fromTo(
        "[data-prog]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 9,
          ease: "none",
          repeat: -1,
          transformOrigin: "left",
        }
      );

      // Pointer: depth parallax + magnetic button
      if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
        const q = (p: string) =>
          gsap.quickTo(orbWrap.current, p, {
            duration: 1.2,
            ease: "power3.out",
          });
        const vx = q("x"),
          vy = q("y");
        const mv = (e: MouseEvent) => {
          vx((e.clientX / innerWidth - 0.5) * -30);
          vy((e.clientY / innerHeight - 0.5) * -20);
        };
        const leave = () => {
          vx(0);
          vy(0);
        };
        section.addEventListener("mousemove", mv);
        section.addEventListener("mouseleave", leave);
        const mag = magnetic(gsap.utils.toArray("[data-magnetic]"), 0.3);
        off = () => {
          section.removeEventListener("mousemove", mv);
          section.removeEventListener("mouseleave", leave);
          mag();
        };
      }
    }, section);

    return () => {
      off();
      ctx.revert();
      html.style.overflow = "";
    };
  }, []);

  const line = "block overflow-hidden py-[0.04em]";

  return (
    <section
      data-pending
      ref={root}
      className="relative min-h-[calc(100svh-97px)] overflow-hidden bg-(--bg-primary)"
    >
      {/* Boot loader */}
      <div data-boot aria-hidden className="fixed inset-0 z-100">
        <div
          data-boot-a
          className="absolute inset-x-0 top-0 h-1/2 bg-(--bg-primary)"
        />
        <div
          data-boot-b
          className="absolute inset-x-0 bottom-0 h-1/2 bg-(--bg-primary)"
        />
        <div
          data-boot-in
          className="absolute inset-0 flex flex-col items-start justify-center gap-6 px-[clamp(24px,7.2vw,120px)]"
        >
          <div
            data-count
            className="text-[clamp(72px,14vw,200px)] font-medium leading-none tracking-[-0.04em] tabular-nums text-(--text-primary)"
          >
            000
          </div>
          <div className="h-px w-full max-w-120 bg-(--border-subtle)">
            <i
              data-bfill
              className="block h-full origin-left scale-x-0 bg-(--accent-blue)"
            />
          </div>
          <div className="flex flex-col gap-1">
            {["Initializing Arceus", "Detecting AirGrip", "Listening"].map(
              (l) => (
                <p key={l} data-bl className="eyebrow text-(--text-muted)">
                  ▸ {l}
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Explosion animation */}
      <div
        ref={orbWrap}
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div data-video-in className="h-full w-full max-lg:opacity-60">
          <OrbCanvas amp={amp} />
        </div>
      </div>

      {/* Content */}
      <div className="container-arceus relative z-10 flex min-h-[calc(100svh-97px)] flex-col justify-center pt-8 pb-28">
        <div ref={content} className="max-w-215">
          <h1 className="mt-8 text-[clamp(44px,6.4vw,88px)] font-medium leading-[1.02] tracking-[-0.03em]">
            <span className="sr-only">
              The Future of Computer Interaction Fits in Your Hand. AirGrip air
              mouse with Arceus AI voice control.
            </span>
            <span aria-hidden className={line}>
              <Chars text="The Future of" cls="text-fade" />
            </span>
            <span aria-hidden className={line}>
              <span data-grad className="text-shimmer inline-block">
                Computer Interaction
              </span>
            </span>
            <span aria-hidden className={line}>
              <Chars text="Fits in Your Hand" cls="text-fade" />
            </span>
          </h1>

          <p
            data-fade
            className="mt-8 text-[clamp(20px,2vw,30px)] font-light tracking-[-0.01em] text-(--text-secondary)"
          >
            Your Computer{" "}
            <span className="font-normal text-(--text-primary)">
              Just Got a New Interface
            </span>
          </p>

          <p
            data-fade
            className="mt-5 max-w-120 text-[15px] leading-relaxed text-(--text-secondary) sm:text-base"
          >
            AirGrip is a gyroscopic air mouse that gives you precise control in
            your hand, while Arceus lets you control your Windows PC through
            natural voice and AI.
          </p>

          <div data-fade className="mt-10 flex flex-wrap items-center gap-8">
            <button
              data-magnetic
              onClick={() => router.push("/buy")}
              className="btn-primary"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom technical strip */}
      <div className="container-arceus absolute inset-x-0 bottom-8 z-10 hidden items-center gap-6 sm:flex">
        <span
          data-strip-txt
          className="eyebrow whitespace-nowrap text-(--text-muted)"
        >
          Hardware + AI = Work Made Easier
        </span>
        <span data-strip-line className="h-px flex-1 bg-(--border-subtle)" />
        <span
          data-strip-txt
          className="eyebrow flex items-center gap-4 text-(--text-muted)"
        >
          01
          <span className="relative h-px w-28 bg-(--border-subtle)">
            <span data-prog className="absolute inset-0 bg-(--accent-blue)" />
          </span>
          03
        </span>
      </div>
    </section>
  );
}
