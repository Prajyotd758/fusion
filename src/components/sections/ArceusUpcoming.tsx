"use client";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { magnetic } from "../../lib/magnetic";
import GlowButton from "../GlobalButton";
import { useRouter } from "next/navigation";

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

function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const g = c.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio, 2);
    let w = 0,
      h = 0,
      raf = 0;
    const m = { x: -1499, y: -1499 };
    const size = () => {
      w = c.offsetWidth;
      h = c.offsetHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const n = window.innerWidth < 768 ? 40 : 150;
    const p = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
    const mv = (e: MouseEvent) => {
      const r = c.getBoundingClientRect();
      m.x = e.clientX - r.left;
      m.y = e.clientY - r.top;
    };
    const draw = () => {
      g.clearRect(0, 0, w, h);
      for (let i = 0; i < n; i++) {
        const a = p[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        g.shadowBlur = 10;
        g.shadowColor = "#68D0FF";
        g.fillStyle = "rgba(140,220,255,0.95)";
        g.beginPath();
        g.arc(a.x, a.y, 1.8, 0, 6.283);
        g.fill();
        g.shadowBlur = 0;
        g.fillRect(a.x, a.y, 1.5, 1.5);
        for (let j = i + 1; j < n; j++) {
          const d = Math.hypot(a.x - p[j].x, a.y - p[j].y);
          if (d < 110) {
            g.strokeStyle = `rgba(104,208,255,${0.12 * (1 - d / 110)})`;
            g.beginPath();
            g.moveTo(a.x, a.y);
            g.lineTo(p[j].x, p[j].y);
            g.stroke();
          }
        }
        const dm = Math.hypot(a.x - m.x, a.y - m.y);
        if (dm < 170) {
          g.strokeStyle = `rgba(104,208,255, 0.5)`;
          g.beginPath();
          g.moveTo(a.x, a.y);
          g.lineTo(m.x, m.y);
          g.stroke();
          a.x += (a.x - m.x) * 0.002;
          a.y += (a.y - m.y) * 0.002;
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("mousemove", mv);
    window.addEventListener("resize", size);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("resize", size);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-1 h-full w-full mask-[linear-gradient(90deg,#000,#000_35%,transparent_75%)]"
    />
  );
}

export default function Arceus() {
  const router = useRouter();
  const root = useRef<HTMLElement>(null);
  const videoWrap = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useIso(() => {
    let off = () => {};
    const section = root.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Intro
      const intro = gsap.timeline({
        paused: true,
        defaults: { ease: "expo.out" },
      });

      intro
        .from(
          "[data-video-in]",
          {
            opacity: 0,
            scale: 1.3,
            filter: "blur(30px)",
            duration: 2.2,
          },
          0
        )
        .from(
          "[data-eyebrow]",
          {
            clipPath: "inset(0 100% 0 0)",
            duration: 1.1,
            ease: "expo.inOut",
          },
          0.1
        )
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

      // Establish the animation's initial states before revealing the content.
      intro.progress(0).pause();
      section.removeAttribute("data-pending");
      intro.play();

      // Scroll: video drifts + zooms, copy lifts away
      const st = {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(videoWrap.current, {
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

      // Pointer: spotlight + depth parallax + magnetic button
      if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
        const q = (p: string) =>
          gsap.quickTo(videoWrap.current, p, {
            duration: 1.2,
            ease: "power3.out",
          });
        const vx = q("x"),
          vy = q("y");
        const el = root.current!;
        const mv = (e: MouseEvent) => {
          vx((e.clientX / innerWidth - 0.5) * -30);
          vy((e.clientY / innerHeight - 0.5) * -20);
        };
        const leave = () => {
          vx(0);
          vy(0);
        };
        el.addEventListener("mousemove", mv);
        el.addEventListener("mouseleave", leave);
        const mag = magnetic(gsap.utils.toArray("[data-magnetic]"), 0.3);
        off = () => {
          el.removeEventListener("mousemove", mv);
          el.removeEventListener("mouseleave", leave);
          mag();
        };
      }
    }, section);
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (showForm)
      gsap.fromTo(
        ".modal-card",
        { y: 40, scale: 0.94, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: "expo.out" }
      );
  }, [showForm]);

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const handleSave = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/interested", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setShowForm(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const line = "block overflow-hidden py-[0.04em]";

  return (
    <section
      data-pending
      ref={root}
      className="relative min-h-[calc(100svh-97px)] overflow-hidden bg-(--bg-primary)"
    >
      {/* Video (right) */}
      <div
        ref={videoWrap}
        className="pointer-events-none absolute top-[-20%] right-0 h-[130%] max-lg:left-0 max-lg:flex max-lg:justify-center"
      >
        <div
          data-video-in
          className="h-full mask-[linear-gradient(90deg,transparent,#000_40%),linear-gradient(180deg,transparent,#000_12%,#000_85%,transparent)] mask-intersect"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-auto max-w-none"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-(--bg-primary)/55 lg:hidden" />
      </div>

      <Particles />

      {/* Content */}
      <div className="container-arceus relative z-10 flex min-h-[calc(100svh-97px)] flex-col justify-center pt-8 pb-28">
        <div ref={content} className="max-w-215">
          <h1
            aria-label="The Future of Computer Interaction Fits in Your Hand"
            className="mt-8 text-[clamp(44px,6.4vw,88px)] font-medium leading-[1.02] tracking-[-0.03em]"
          >
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
            AirGrip gives you precise control in your hand, while Arceus lets
            you interact with your computer through natural voice and AI.
            <br />
          </p>

          <div data-fade className="mt-10 flex flex-wrap items-center gap-8">
            <button
              data-magnetic
              onClick={() => {
                router.push("/buy");
                setError("");
              }}
              className="btn-primary"
            >
              Buy now
            </button>

            {/* <button
              data-magnetic
              onClick={toggleVideo}
              className="btn-ghost"
              aria-pressed={!playing}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-(--border-subtle) bg-(--bg-glass) text-[10px] text-(--text-primary)">
                {playing ? "❚❚" : "▶"}
              </span>
              {playing ? "Pause Demo" : "Watch Demo"}
            </button> */}
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
