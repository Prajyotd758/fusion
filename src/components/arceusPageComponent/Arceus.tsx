"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OrbCanvas from "./OrbCanvas";

gsap.registerPlugin(ScrollTrigger);

type Demo = { lang: string; say: string; steps: string[] };
type Panel = {
  t: string;
  d: string;
  eg?: string;
  v: "rings" | "bars" | "grid" | "dots" | "scan";
};
type Spec = { t: string; d: string; h: string };

const DEMOS: Demo[] = [
  {
    lang: "EN",
    say: "Open Spotify, then minimize everything",
    steps: ["Opening Spotify", "Minimizing all windows"],
  },
  {
    lang: "HI",
    say: "Chrome खोलो और स्क्रीनशॉट लो",
    steps: ["Opening Chrome", "Screenshot taken"],
  },
  {
    lang: "HINGLISH",
    say: "Notepad kholo aur PC sleep kar do",
    steps: ["Opening Notepad", "Putting PC to sleep"],
  },
];

const FLOW = [
  { t: "Hold", d: "Press the talk button on AirGrip and speak." },
  { t: "Stream", d: "Your voice flies to the PC over a fast wireless link." },
  { t: "Understand", d: "Speech becomes text. AI turns it into a command." },
  { t: "Done", d: "Arceus opens, clicks, types and replies." },
];

const PANELS: Panel[] = [
  {
    t: "Hands-free voice",
    d: "Press one button on AirGrip and speak.",
    eg: "Open Notepad",
    v: "rings",
  },
  {
    t: "Speaks your language",
    d: "English, Hindi, Marathi and Hinglish. Auto-detected. It replies in the language you used.",
    eg: "Chrome kholo",
    v: "bars",
  },
  {
    t: "Works offline",
    d: "Core voice recognition runs on your PC. A faster online mode kicks in when you're connected.",
    v: "grid",
  },
  {
    t: "Opens any app",
    d: "Finds your installed apps automatically and launches them by name.",
    eg: "Open Photoshop",
    v: "dots",
  },
  {
    t: "Controls your windows",
    d: "Maximize, minimize, or clear the desktop.",
    eg: "Show desktop",
    v: "scan",
  },
  {
    t: "Browser automation",
    d: "Navigate sites, read pages, click, type and take screenshots.",
    eg: "Go to GitHub and take a screenshot",
    v: "grid",
  },
  {
    t: "Sees your screen",
    d: "Ask questions about what's on your display.",
    eg: "What's on my screen?",
    v: "scan",
  },
  {
    t: "Chained commands",
    d: "Say several steps in one sentence. They run in order.",
    eg: "Open Chrome, go to YouTube, maximize",
    v: "bars",
  },
  {
    t: "Remembers you",
    d: "Learns your preferences and details. Create your own custom voice shortcuts.",
    v: "dots",
  },
  {
    t: "Talks back",
    d: "Natural spoken replies in Hindi and English.",
    v: "rings",
  },
  {
    t: "Asks when unsure",
    d: "Clarifies before running ambiguous or risky tasks.",
    v: "scan",
  },
  {
    t: "Terminal & power",
    d: "Run terminal tasks and put your PC to sleep by voice.",
    eg: "Sleep my PC",
    v: "grid",
  },
];

const SPECS: Spec[] = [
  {
    t: "Air cursor",
    d: "Move your hand, the cursor follows. Gyroscope-powered (MPU6050).",
    h: "gyro",
  },
  {
    t: "Click controls",
    d: "Left click, right click, and a freeze button to pause the cursor.",
    h: "click",
  },
  {
    t: "Push-to-talk mic",
    d: "Hold the button and speak. A built-in MEMS mic (INMP441) captures your voice.",
    h: "ptt",
  },
  {
    t: "Plug-and-play dongle",
    d: "Shows up as a standard USB mouse. No drivers, no pairing.",
    h: "dongle",
  },
  {
    t: "Low-latency link",
    d: "Raw 802.11 wireless streams voice live and keeps the cursor smooth.",
    h: "link",
  },
  { t: "Rotary dial", d: "A dial for quick adjustments.", h: "enc" },
  {
    t: "Status light",
    d: "An RGB LED shows what the device is doing.",
    h: "led",
  },
  {
    t: "Rechargeable",
    d: "Li-ion with USB charging. Battery level shows on your PC.",
    h: "batt",
  },
  {
    t: "Auto-calibration",
    d: "Calibrates at startup for stable, drift-free control.",
    h: "gyro",
  },
];

const WIRE = "M 300 280 C 360 130, 480 130, 545 280 L 700 280";

const Split = ({ t, g }: { t: string; g?: boolean }) => (
  <>
    {t.split(" ").map((w, i) => (
      <span key={i}>
        <span className="ax-w">
          <span className={g ? "ax-grad" : undefined}>{w}</span>
        </span>{" "}
      </span>
    ))}
  </>
);

const Cta = ({ big }: { big?: boolean }) => (
  <div className={`ax-cta${big ? " ax-cta-big" : ""}`}>
    <div className={big ? "ax-mag" : undefined}>
      <a
        className="ax-btn ax-btn-p"
        href="https://github.com/Prajyotd758/fusion/releases/download/v1.0.0/arceus_0.1.0_x64_en-US.msi"
        download
      >
        Download for Windows <span aria-hidden>↓</span>
      </a>
    </div>
    <span className="ax-btn ax-btn-d" aria-disabled="true">
      <b className="ax-pdot" /> macOS <em>In development</em>
    </span>
  </div>
);

export default function ArceusShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const amp = useRef({ v: 0.15 });
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const el = root.current!;
    const q = <T extends Element = HTMLElement>(s: string) =>
      el.querySelector<T>(s)!;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

    /* pointer: cursor glow + magnetic button */
    // const cur = q(".ax-cursor");
    // const cqx = gsap.quickTo(cur, "x", { duration: 0.5, ease: "power3" });
    // const cqy = gsap.quickTo(cur, "y", { duration: 0.5, ease: "power3" });
    // const mag = q(".ax-mag");
    // const mqx = gsap.quickTo(mag, "x", { duration: 0.4, ease: "power3" });
    // const mqy = gsap.quickTo(mag, "y", { duration: 0.4, ease: "power3" });
    // const onMove = (e: PointerEvent) => {
    //   cqx(e.clientX);
    //   cqy(e.clientY);
    //   const r = mag.getBoundingClientRect();
    //   const dx = e.clientX - (r.left + r.width / 2);
    //   const dy = e.clientY - (r.top + r.height / 2);
    //   if (Math.hypot(dx, dy) < 180) {
    //     mqx(dx * 0.3);
    //     mqy(dy * 0.3);
    //   } else {
    //     mqx(0);
    //     mqy(0);
    //   }
    // };
    // window.addEventListener("pointermove", onMove);

    const ctx = gsap.context(() => {
      /* ---------- BOOT + HERO INTRO ---------- */
      const cnt = { n: 0 };
      const counter = q(".ax-count");
      gsap
        .timeline({
          onComplete: () => {
            html.style.overflow = "";
            ScrollTrigger.refresh();
          },
        })
        .from(".ax-bl", { autoAlpha: 0, x: -14, stagger: 0.35, duration: 0.4 })
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
        .to(".ax-bfill", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
        .to(".ax-boot-in", { autoAlpha: 0, y: -20, duration: 0.4 }, 1.9)
        .to(
          ".ax-boot-a",
          { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
          2.1
        )
        .to(
          ".ax-boot-b",
          { yPercent: 100, duration: 0.9, ease: "power4.inOut" },
          2.1
        )
        .set(".ax-boot", { display: "none" }, 3.1)
        // .from(
        //   ".ax-orbin",
        //   { scale: 0.3, autoAlpha: 0, duration: 1.8, ease: "expo.out" },
        //   2.2
        // )
        .from(
          ".ax-hero .ax-w>span",
          { yPercent: 115, duration: 1.1, stagger: 0.08, ease: "power4.out" },
          2.5
        )
        .from(
          ".ax-hfade",
          { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.12 },
          2.9
        );

      /* hero scroll exit */
      const heroST = {
        trigger: q(".ax-hero"),
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(".ax-orbwrap", {
        scale: 1.5,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: heroST,
      });
      gsap.to(".ax-copy", {
        y: -90,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: heroST,
      });

      /* language rotator */
      const wl = gsap.timeline({ repeat: -1 });
      [1, 2, 3, 4].forEach((i) =>
        wl.to(
          ".ax-words",
          { yPercent: -20 * i, duration: 0.7, ease: "power3.inOut" },
          "+=1.3"
        )
      );
      wl.set(".ax-words", { yPercent: 0 });

      /* live voice demo */
      const typed = q(".ax-typed");
      const lang = q(".ax-lang");
      const demo = gsap.timeline({ repeat: -1, delay: 3.6 });
      DEMOS.forEach((d, i) => {
        const li = `.ax-dset-${i} li`;
        const chars = Array.from(d.say);
        const o = { n: 0 };
        demo
          .call(() => {
            typed.textContent = "";
            lang.textContent = d.lang;
          })
          .set(li, { autoAlpha: 0, x: -10 })
          .to(amp.current, { v: 0.9, duration: 0.4 })
          .to(o, {
            n: chars.length,
            duration: Math.max(1.2, chars.length * 0.05),
            ease: "none",
            onUpdate: () => {
              typed.textContent = chars.slice(0, Math.round(o.n)).join("");
            },
          })
          .to(amp.current, { v: 0.2, duration: 0.6 })
          .to(li, { autoAlpha: 1, x: 0, stagger: 0.5, duration: 0.4 })
          .to({}, { duration: 1.8 });
      });

      /* ---------- SPLIT HEADINGS ---------- */
      Array.from(el.querySelectorAll<HTMLElement>(".ax-split")).forEach((h) => {
        gsap.from(h.querySelectorAll(".ax-w>span"), {
          yPercent: 115,
          stagger: 0.06,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: h, start: "top 88%", once: true },
        });
      });

      /* progress bar */
      gsap.to(".ax-prog", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      /* ---------- PINNED FLOW SCENE ---------- */
      const wire = q<SVGPathElement>(".ax-wire");
      const dot = q<SVGCircleElement>(".ax-pkt");
      const len = wire.getTotalLength();
      const steps = Array.from(el.querySelectorAll<HTMLElement>(".ax-fstep"));
      const o = { p: 0 };
      gsap.set(wire, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(".ax-win", {
        autoAlpha: 0,
        scale: 0.92,
        transformOrigin: "50% 50%",
      });
      gsap.set(".ax-t1,.ax-t2,.ax-pkt", { autoAlpha: 0 });
      gsap.set(".ax-mbar", { scaleY: 0, transformOrigin: "50% 50%" });
      gsap.set(".ax-ok", {
        autoAlpha: 0,
        scale: 0.4,
        transformOrigin: "50% 50%",
      });
      gsap.set(".ax-tl", { scaleX: 0, transformOrigin: "0% 50%" });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q(".ax-flow"),
            start: "top top",
            end: "+=3200",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        })
        .to(".ax-fline-fill", { scaleY: 1, duration: 10 }, 0)
        .to(steps[0], { opacity: 1, duration: 0.4 }, 0)
        .to(".ax-led", { fill: "#9B72FF", duration: 0.8 }, 0)
        .fromTo(
          ".ax-ptt-ring",
          { autoAlpha: 0.9, scale: 1, transformOrigin: "50% 50%" },
          { autoAlpha: 0, scale: 2.4, duration: 1.5, immediateRender: false },
          0.2
        )
        .to(
          ".ax-mbar",
          { scaleY: 1, stagger: 0.12, duration: 0.6, ease: "power2.out" },
          0.6
        )
        .to(steps[1], { opacity: 1, duration: 0.4 }, 2.5)
        .to(dot, { autoAlpha: 1, duration: 0.1 }, 2.5)
        .to(wire, { strokeDashoffset: 0, duration: 3 }, 2.5)
        .to(
          o,
          {
            p: 1,
            duration: 3,
            onUpdate: () => {
              const pt = wire.getPointAtLength(o.p * len);
              dot.setAttribute("cx", String(pt.x));
              dot.setAttribute("cy", String(pt.y));
            },
          },
          2.5
        )
        .to(".ax-dongle", { stroke: "#68D0FF", duration: 0.4 }, 4.6)
        .fromTo(
          ".ax-pulse",
          { autoAlpha: 0.9, scale: 0.5, transformOrigin: "50% 50%" },
          { autoAlpha: 0, scale: 3, duration: 1, immediateRender: false },
          4.6
        )
        .to(dot, { autoAlpha: 0, duration: 0.2 }, 5.5)
        .to(steps[2], { opacity: 1, duration: 0.4 }, 5.5)
        .to(
          ".ax-win",
          { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out" },
          5.5
        )
        .to(".ax-t1", { autoAlpha: 1, duration: 0.4 }, 6)
        .to(".ax-tl", { scaleX: 1, stagger: 0.4, duration: 0.6 }, 6)
        .to(".ax-t1", { autoAlpha: 0, duration: 0.3 }, 7.4)
        .to(".ax-t2", { autoAlpha: 1, duration: 0.4 }, 7.6)
        .to(steps[3], { opacity: 1, duration: 0.4 }, 8)
        .to(
          ".ax-ok",
          {
            autoAlpha: 1,
            scale: 1,
            stagger: 0.35,
            duration: 0.5,
            ease: "back.out(2)",
          },
          8
        )
        .to(".ax-winr", { stroke: "#42E6AA", duration: 0.5 }, 9.3);

      /* ---------- HORIZONTAL FEATURES ---------- */
      const track = q(".ax-track");
      const hs = q(".ax-h");
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const hst = {
        trigger: hs,
        start: "top top",
        end: () => "+=" + dist(),
        scrub: 0.8,
        invalidateOnRefresh: true,
      };
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: { ...hst, pin: true, anticipatePin: 1 },
      });
      gsap.to(".ax-hbar-fill", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { ...hst, scrub: true },
      });

      /* ---------- ANATOMY ---------- */
      gsap.from(".ax-spec", {
        autoAlpha: 0,
        y: 24,
        stagger: 0.07,
        duration: 0.7,
        scrollTrigger: {
          trigger: q(".ax-specs"),
          start: "top 80%",
          once: true,
        },
      });
      gsap.to(".ax-dev", {
        y: -12,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      /* ---------- MARQUEE ---------- */
      gsap.to(".ax-mq-in", {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });
    }, root);

    return () => {
      ctx.revert();
      // window.removeEventListener("pointermove", onMove);
      html.style.overflow = "";
    };
  }, []);

  const on = (id: string) => (SPECS[active].h === id ? " on" : "");

  return (
    <div ref={root} className="ax">
      <div className="ax-prog" />

      {/* BOOT */}
      <div className="ax-boot" aria-hidden>
        <div className="ax-boot-a" />
        <div className="ax-boot-b" />
        <div className="ax-boot-in">
          <div className="ax-count">000</div>
          <div className="ax-bbar">
            <i className="ax-bfill" />
          </div>
          <div className="ax-bls">
            {["Initializing Arceus", "Detecting AirGrip", "Listening"].map(
              (l) => (
                <p className="ax-bl" key={l}>
                  ▸ {l}
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="ax-hero">
        <div className="ax-orbwrap" aria-hidden>
          {/* <div className="ax-orbin">
            <OrbCanvas amp={amp} />
          </div> */}
          <OrbCanvas amp={amp} />
        </div>
        <div className="ax-copy">
          <p className="ax-eyebrow ax-hfade">
            ARCEUS · VOICE AGENT FOR WINDOWS
          </p>
          <h1>
            <Split t="Speak." />
            <br />
            <Split t="It happens." g />
          </h1>
          <div className="ax-say ax-hfade">
            <span>Say it in</span>
            <span className="ax-wwin">
              <span className="ax-words">
                {["English", "हिन्दी", "Hinglish", "English"].map((w, i) => (
                  <span key={i}>{w}</span>
                ))}
              </span>
            </span>
          </div>
          <div className="ax-term ax-hfade">
            <div className="ax-term-h">
              <i />
              <span>LISTENING</span>
              <b className="ax-lang">EN</b>
            </div>
            <p className="ax-tline">
              <span className="ax-typed" />
              <span className="ax-caret" />
            </p>
            <div className="ax-dsets">
              {DEMOS.map((d, i) => (
                <ul key={d.lang} className={`ax-dset ax-dset-${i}`}>
                  {d.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div className="ax-hfade">
            <Cta />
          </div>
        </div>
      </section>

      {/* FLOW */}
      <section className="ax-flow">
        <div className="ax-fl">
          <p className="ax-label">01 — HOW IT WORKS</p>
          <h2 className="ax-split">
            <Split t="One button. Whole computer." />
          </h2>
          <div className="ax-fsteps">
            <div className="ax-fline">
              <i className="ax-fline-fill" />
            </div>
            {FLOW.map((s, i) => (
              <div className="ax-fstep" key={s.t}>
                <span className="ax-fn">0{i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
        <svg
          className="ax-svg"
          viewBox="0 0 1000 560"
          role="img"
          aria-label="AirGrip sends your voice through the USB dongle to Arceus on your PC"
        >
          <defs>
            <linearGradient id="axw" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#42BFFF" />
              <stop offset=".6" stopColor="#568CFF" />
              <stop offset="1" stopColor="#9B72FF" />
            </linearGradient>
          </defs>
          <g transform="translate(60 130)">
            <rect className="s-body" width="140" height="300" rx="70" />
            <rect
              className="s-line"
              x="56"
              y="40"
              width="28"
              height="28"
              rx="6"
            />
            <circle className="ax-ptt-ring" cx="70" cy="130" r="18" />
            <circle className="s-line" cx="70" cy="130" r="18" />
            <circle className="s-line" cx="70" cy="190" r="14" />
            <circle className="ax-led" cx="70" cy="244" r="6" />
          </g>
          <text className="s-text" x="130" y="480" textAnchor="middle">
            AIRGRIP
          </text>
          {Array.from({ length: 7 }).map((_, i) => {
            const h = 44 - Math.abs(3 - i) * 11;
            return (
              <rect
                key={i}
                className="ax-mbar"
                x={222 + i * 10}
                y={280 - h / 2}
                width="4"
                height={h}
                rx="2"
              />
            );
          })}
          <path className="ax-wire-bg" d={WIRE} />
          <path className="ax-wire" d={WIRE} />
          <rect
            className="ax-dongle"
            x="545"
            y="266"
            width="48"
            height="28"
            rx="5"
          />
          <circle className="ax-pulse" cx="569" cy="280" r="14" />
          <text className="s-text" x="569" y="330" textAnchor="middle">
            USB DONGLE
          </text>
          <circle className="ax-pkt" cx="300" cy="280" r="5" />
          <rect
            className="s-body"
            x="700"
            y="150"
            width="270"
            height="260"
            rx="14"
          />
          <path className="s-line" d="M835 410 v30 M790 440 h90" />
          <g className="ax-win">
            <rect
              className="ax-winr"
              x="722"
              y="172"
              width="226"
              height="216"
              rx="8"
            />
            <rect
              className="ax-tl s-fill"
              x="738"
              y="206"
              width="170"
              height="6"
              rx="3"
            />
            <rect
              className="ax-tl s-fill"
              x="738"
              y="224"
              width="130"
              height="6"
              rx="3"
            />
            <rect
              className="ax-tl s-fill"
              x="738"
              y="242"
              width="150"
              height="6"
              rx="3"
            />
            {["Open Chrome", "Go to Gmail", "Maximize window"].map((c, i) => (
              <g className="ax-ok" key={c}>
                <circle cx="742" cy={292 + i * 30} r="6" fill="#42E6AA" />
                <text className="ax-chip" x="758" y={297 + i * 30}>
                  {c}
                </text>
              </g>
            ))}
          </g>
          <text className="s-text ax-t1" x="835" y="478" textAnchor="middle">
            WHISPER · SPEECH → TEXT
          </text>
          <text className="s-text ax-t2" x="835" y="478" textAnchor="middle">
            AI · TEXT → COMMAND
          </text>
        </svg>
      </section>

      {/* FEATURES */}
      <section className="ax-h">
        <div className="ax-hhead">
          <p className="ax-label">02 — WHAT ARCEUS DOES</p>
          <h2 className="ax-split">
            <Split t="Everything, by voice." />
          </h2>
        </div>
        <div className="ax-track">
          {PANELS.map((p, i) => (
            <article className="ax-panel" key={p.t}>
              <div className="ax-pv" data-v={p.v}>
                <span className="ax-pn">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
              {p.eg && <code className="ax-eg">› {p.eg}</code>}
            </article>
          ))}
        </div>
        <div className="ax-hbar">
          <i className="ax-hbar-fill" />
        </div>
      </section>

      {/* ANATOMY */}
      <section className="ax-anat">
        <div className="ax-device">
          <svg
            viewBox="0 0 420 560"
            role="img"
            aria-label="AirGrip air mouse anatomy"
          >
            <g className="ax-dev">
              <rect
                className="s-body"
                x="110"
                y="40"
                width="160"
                height="440"
                rx="80"
              />
              <rect
                className={`hs${on("click")}`}
                x="136"
                y="80"
                width="48"
                height="80"
                rx="20"
              />
              <rect
                className={`hs${on("click")}`}
                x="196"
                y="80"
                width="48"
                height="80"
                rx="20"
              />
              <rect
                className={`hs${on("gyro")}`}
                x="176"
                y="185"
                width="28"
                height="28"
                rx="6"
              />
              <circle className={`hs${on("ptt")}`} cx="190" cy="250" r="20" />
              <circle className={`hs${on("enc")}`} cx="190" cy="318" r="26" />
              <circle className={`hs${on("led")}`} cx="190" cy="372" r="7" />
              <rect
                className={`hs${on("batt")}`}
                x="162"
                y="410"
                width="56"
                height="34"
                rx="6"
              />
            </g>
            <g className={`hs${on("dongle")}`}>
              <rect x="300" y="440" width="56" height="26" rx="4" />
              <rect x="356" y="444" width="26" height="18" rx="2" />
            </g>
            {[20, 34, 48].map((r) => (
              <path
                key={r}
                className={`hs hs-a${on("link")}`}
                d={`M${330 - r} 420 A${r} ${r} 0 0 1 ${330 + r} 420`}
              />
            ))}
          </svg>
        </div>
        <div className="ax-specs">
          <p className="ax-label">03 — AIRGRIP</p>
          <h2 className="ax-split">
            <Split t="The mouse that listens." />
          </h2>
          <div className="ax-speclist">
            {SPECS.map((s, i) => (
              <button
                type="button"
                key={s.t}
                className={`ax-spec${active === i ? " on" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="sn">0{i + 1}</span>
                <span>
                  <strong>{s.t}</strong>
                  <p>{s.d}</p>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="ax-end">
        <p className="ax-label">04 — GET ARCEUS</p>
        <h2 className="ax-split ax-huge">
          <Split t="Say it." />
          <br />
          <Split t="Done." g />
        </h2>
        <Cta big />
        <p className="ax-foot">
          Windows · Simple MSI installer · Starts with Windows
        </p>
      </section>
    </div>
  );
}
