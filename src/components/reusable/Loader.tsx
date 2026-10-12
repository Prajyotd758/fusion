"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoaderProps {
  label?: string;
  messages?: string[];
}

const DEFAULT_MESSAGES = [
  "Initializing",
  "Establishing link",
  "Processing request",
  "Finalizing",
];

const wave = (amp: number) =>
  `M0 0 q100 ${-amp} 200 0 ${"t200 0 ".repeat(7)}V400H0Z`;

const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  x: 50 + i * 62,
  r: 1.6 + (i % 3) * 0.9,
}));

const FILL_TOP = 12;
const FILL_EMPTY = 228;

export default function Loader({
  label = "Loading",
  messages = DEFAULT_MESSAGES,
}: LoaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState(messages[0]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance
      gsap.fromTo(
        ".ldr-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        ".ldr-fade",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.15,
          ease: "power3.out",
        }
      );

      // Wave drift (seamless: translate by exactly one period)
      gsap.fromTo(
        ".ldr-wave-front",
        { x: 0 },
        { x: -400, duration: 3.2, ease: "none", repeat: -1 }
      );
      gsap.fromTo(
        ".ldr-wave-back",
        { x: -400 },
        { x: 0, duration: 4.6, ease: "none", repeat: -1 }
      );

      // Surface sway
      gsap.to(".ldr-level-tilt", {
        rotation: 1.2,
        svgOrigin: "400 120",
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Bubbles
      gsap.utils.toArray<SVGCircleElement>(".ldr-bubble").forEach((b) => {
        gsap.fromTo(
          b,
          { y: gsap.utils.random(120, 230), opacity: 0.85 },
          {
            y: 8,
            opacity: 0,
            x: `+=${gsap.utils.random(-14, 14)}`,
            duration: gsap.utils.random(2.2, 4),
            ease: "power1.in",
            repeat: -1,
            delay: gsap.utils.random(0, 2.5),
          }
        );
      });

      // Fill cycle
      const setPct = (y: number) => {
        const p = Math.max(
          0,
          Math.min(1, (FILL_EMPTY - y) / (FILL_EMPTY - FILL_TOP))
        );
        if (counter.current)
          counter.current.textContent = String(Math.round(p * 100)).padStart(
            3,
            "0"
          );
      };
      const level = { y: FILL_EMPTY };
      const apply = () => {
        gsap.set(".ldr-level", { y: level.y });
        setPct(level.y);
      };
      apply();

      const fill = gsap.timeline({ repeat: -1 });
      fill
        .to(level, {
          y: FILL_TOP,
          duration: 4.4,
          ease: "power1.inOut",
          onUpdate: apply,
        })
        .to(".ldr-outline", {
          stroke: "#68D0FF",
          duration: 0.25,
          yoyo: true,
          repeat: 1,
        })
        .to(
          ".ldr-glow",
          {
            opacity: 1,
            scale: 1.04,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          "<"
        )
        .to(
          level,
          { y: FILL_EMPTY, duration: 1, ease: "power3.in", onUpdate: apply },
          "+=0.35"
        );

      // Status cycle
      const tl = gsap.timeline({ repeat: -1 });
      messages.forEach((m) => {
        tl.call(() => setStatus(m))
          .fromTo(
            ".ldr-status",
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
          )
          .to(
            ".ldr-status",
            { opacity: 0, y: -6, duration: 0.3, ease: "power2.in" },
            "+=1.1"
          );
      });
    }, root);

    return () => ctx.revert();
  }, [messages]);

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      aria-label={label}
      className="ldr-overlay fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-[#07090D]/92 backdrop-blur-md"
    >
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 35% at 50% 52%, rgba(66,191,255,0.12), transparent 70%), radial-gradient(ellipse 30% 25% at 66% 58%, rgba(155,114,255,0.09), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(180,205,235,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(180,205,235,0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, #000 0%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, #000 0%, transparent 65%)",
        }}
      />


      <div className="relative flex flex-col items-center">
        {/* Liquid wordmark */}
        <div
          className="ldr-glow ldr-fade w-[clamp(300px,72vw,760px)] opacity-90"
          style={{ filter: "drop-shadow(0 0 28px rgba(66,191,255,0.25))" }}
        >
          <svg viewBox="0 0 800 220" className="h-auto w-full overflow-visible">
            <defs>
              <linearGradient
                id="arceus-liquid"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="800"
                y2="0"
              >
                <stop offset="0%" stopColor="#42BFFF" />
                <stop offset="55%" stopColor="#568CFF" />
                <stop offset="100%" stopColor="#9B72FF" />
              </linearGradient>
              <clipPath id="arceus-clip">
                <text
                  x="30"
                  y="168"
                  fontSize="172"
                  fontWeight="700"
                  textLength="740"
                  lengthAdjust="spacingAndGlyphs"
                  style={{ fontFamily: "inherit", letterSpacing: "-0.02em" }}
                >
                  ARCEUS
                </text>
              </clipPath>
            </defs>

            {/* Empty vessel */}
            <text
              x="30"
              y="168"
              fontSize="172"
              fontWeight="700"
              textLength="740"
              lengthAdjust="spacingAndGlyphs"
              fill="rgba(180,205,235,0.04)"
              className="ldr-outline"
              stroke="rgba(180,205,235,0.28)"
              strokeWidth="1.2"
              style={{ fontFamily: "inherit", letterSpacing: "-0.02em" }}
            >
              ARCEUS
            </text>

            {/* Liquid, clipped to the letterforms */}
            <g clipPath="url(#arceus-clip)">
              <g className="ldr-level">
                <g className="ldr-level-tilt">
                  <g className="ldr-wave-back">
                    <path
                      d={wave(12)}
                      fill="url(#arceus-liquid)"
                      opacity="0.4"
                    />
                  </g>
                  <g className="ldr-wave-front">
                    <path
                      d={wave(8)}
                      fill="url(#arceus-liquid)"
                      stroke="rgba(244,246,250,0.6)"
                      strokeWidth="1.5"
                    />
                  </g>
                  <g>
                    {BUBBLES.map((b, i) => (
                      <circle
                        key={i}
                        className="ldr-bubble"
                        cx={b.x}
                        cy={0}
                        r={b.r}
                        fill="rgba(244,246,250,0.8)"
                      />
                    ))}
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Readout */}
        <div className="ldr-fade mt-10 flex w-[clamp(300px,72vw,760px)] items-end justify-between font-mono">
          <div className="flex flex-col gap-2">
            <h2 className="text-[11px] uppercase tracking-[0.34em] text-[#F4F6FA]">
              {label}
            </h2>
          </div>
          <div className="flex items-baseline gap-1 text-[#687487]">
            <span
              ref={counter}
              className="text-[22px] tabular-nums tracking-tight text-[#F4F6FA]"
            >
              000
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em]">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useLayoutEffect, useRef, useState } from "react";
// import { gsap } from "gsap";

// interface LoaderProps {
//   label?: string;
//   messages?: string[];
// }

// const DEFAULT_MESSAGES = [
//   "Initializing",
//   "Establishing link",
//   "Processing request",
//   "Finalizing",
// ];

// const TICKS = Array.from({ length: 72 }, (_, i) => {
//   const a = (i / 72) * Math.PI * 2;
//   const long = i % 6 === 0;
//   const r1 = 94;
//   const r2 = long ? 88 : 91;
//   return {
//     x1: (100 + Math.cos(a) * r1).toFixed(2),
//     y1: (100 + Math.sin(a) * r1).toFixed(2),
//     x2: (100 + Math.cos(a) * r2).toFixed(2),
//     y2: (100 + Math.sin(a) * r2).toFixed(2),
//     long,
//   };
// });

// const BARS = 28;

// export default function Loader({
//   label = "Loading",
//   messages = DEFAULT_MESSAGES,
// }: LoaderProps) {
//   const root = useRef<HTMLDivElement>(null);
//   const [status, setStatus] = useState(messages[0]);

//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       // Entrance
//       gsap.fromTo(
//         ".ldr-overlay",
//         { opacity: 0 },
//         { opacity: 1, duration: 0.4, ease: "power2.out" }
//       );
//       gsap.fromTo(
//         ".ldr-hud",
//         { opacity: 0, scale: 0.88 },
//         { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }
//       );
//       gsap.fromTo(
//         ".ldr-fade",
//         { opacity: 0, y: 10 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.7,
//           stagger: 0.1,
//           delay: 0.25,
//           ease: "power3.out",
//         }
//       );

//       // Rings
//       gsap.to(".ldr-ticks", {
//         rotation: 360,
//         svgOrigin: "100 100",
//         duration: 40,
//         ease: "none",
//         repeat: -1,
//       });
//       gsap.to(".ldr-arc", {
//         rotation: 360,
//         svgOrigin: "100 100",
//         duration: 1.8,
//         ease: "none",
//         repeat: -1,
//       });
//       gsap.to(".ldr-dash", {
//         rotation: -360,
//         svgOrigin: "100 100",
//         duration: 14,
//         ease: "none",
//         repeat: -1,
//       });

//       // Core pulse + ripple
//       gsap.to(".ldr-core", {
//         scale: 1.35,
//         svgOrigin: "100 100",
//         duration: 1.1,
//         ease: "sine.inOut",
//         repeat: -1,
//         yoyo: true,
//       });
//       gsap.fromTo(
//         ".ldr-ripple",
//         { scale: 0.4, opacity: 0.7, svgOrigin: "100 100" },
//         {
//           scale: 1.5,
//           opacity: 0,
//           svgOrigin: "100 100",
//           duration: 2,
//           ease: "power2.out",
//           repeat: -1,
//         }
//       );

//       // Waveform
//       gsap.utils.toArray<HTMLElement>(".ldr-bar").forEach((bar, i) => {
//         gsap.fromTo(
//           bar,
//           { scaleY: 0.15 },
//           {
//             scaleY: () => gsap.utils.random(0.3, 1),
//             duration: () => gsap.utils.random(0.35, 0.7),
//             ease: "sine.inOut",
//             repeat: -1,
//             yoyo: true,
//             repeatRefresh: true,
//             delay: i * 0.03,
//           }
//         );
//       });

//       // Indeterminate progress sweep
//       gsap.fromTo(
//         ".ldr-sweep",
//         { xPercent: -100 },
//         { xPercent: 250, duration: 1.6, ease: "power2.inOut", repeat: -1 }
//       );

//       // Status text cycle
//       const tl = gsap.timeline({ repeat: -1 });
//       messages.forEach((m) => {
//         tl.call(() => setStatus(m))
//           .fromTo(
//             ".ldr-status",
//             { opacity: 0, y: 6 },
//             { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
//           )
//           .to(
//             ".ldr-status",
//             { opacity: 0, y: -6, duration: 0.3, ease: "power2.in" },
//             "+=1.1"
//           );
//       });
//     }, root);

//     return () => ctx.revert();
//   }, [messages]);

//   return (
//     <div
//       ref={root}
//       role="status"
//       aria-live="polite"
//       aria-label={label}
//       className="ldr-overlay fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-[#07090D]/90 backdrop-blur-md"
//     >
//       {/* Atmosphere */}
//       <div
//         className="pointer-events-none absolute inset-0"
//         style={{
//           background:
//             "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(66,191,255,0.14), transparent 70%), radial-gradient(ellipse 30% 30% at 62% 58%, rgba(155,114,255,0.10), transparent 70%)",
//         }}
//       />
//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.35]"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(180,205,235,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(180,205,235,0.07) 1px, transparent 1px)",
//           backgroundSize: "56px 56px",
//           maskImage:
//             "radial-gradient(circle at center, #000 0%, transparent 65%)",
//           WebkitMaskImage:
//             "radial-gradient(circle at center, #000 0%, transparent 65%)",
//         }}
//       />

//       {/* HUD */}
//       <div className="relative flex flex-col items-center">
//         <div className="ldr-hud relative h-[clamp(180px,34vw,260px)] w-[clamp(180px,34vw,260px)]">
//           <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
//             <defs>
//               <linearGradient
//                 id="arceus-loader-grad"
//                 x1="0"
//                 y1="0"
//                 x2="1"
//                 y2="1"
//               >
//                 <stop offset="0%" stopColor="#42BFFF" />
//                 <stop offset="55%" stopColor="#568CFF" />
//                 <stop offset="100%" stopColor="#9B72FF" />
//               </linearGradient>
//               <radialGradient id="arceus-loader-core">
//                 <stop offset="0%" stopColor="#F4F6FA" />
//                 <stop offset="45%" stopColor="#68D0FF" />
//                 <stop offset="100%" stopColor="#42BFFF" stopOpacity="0" />
//               </radialGradient>
//             </defs>

//             <g className="ldr-ticks">
//               {TICKS.map((t, i) => (
//                 <line
//                   key={i}
//                   x1={t.x1}
//                   y1={t.y1}
//                   x2={t.x2}
//                   y2={t.y2}
//                   stroke={
//                     t.long ? "rgba(160,169,184,0.7)" : "rgba(180,205,235,0.22)"
//                   }
//                   strokeWidth={t.long ? 1 : 0.6}
//                 />
//               ))}
//             </g>

//             <circle
//               cx="100"
//               cy="100"
//               r="78"
//               fill="none"
//               stroke="rgba(180,205,235,0.10)"
//               strokeWidth="1"
//             />
//             <circle
//               className="ldr-arc"
//               cx="100"
//               cy="100"
//               r="78"
//               fill="none"
//               stroke="url(#arceus-loader-grad)"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeDasharray="120 371"
//             />

//             <circle
//               className="ldr-dash"
//               cx="100"
//               cy="100"
//               r="62"
//               fill="none"
//               stroke="rgba(66,191,255,0.35)"
//               strokeWidth="0.8"
//               strokeDasharray="2 7"
//             />

//             <circle
//               className="ldr-ripple"
//               cx="100"
//               cy="100"
//               r="30"
//               fill="none"
//               stroke="#42BFFF"
//               strokeWidth="0.8"
//             />
//             <circle
//               cx="100"
//               cy="100"
//               r="30"
//               fill="none"
//               stroke="rgba(180,205,235,0.14)"
//               strokeWidth="1"
//             />
//             <circle
//               className="ldr-core"
//               cx="100"
//               cy="100"
//               r="14"
//               fill="url(#arceus-loader-core)"
//             />
//             <circle cx="100" cy="100" r="2.5" fill="#F4F6FA" />

//             {/* Crosshair markers */}
//             <g stroke="rgba(180,205,235,0.35)" strokeWidth="0.8">
//               <line x1="100" y1="2" x2="100" y2="10" />
//               <line x1="100" y1="190" x2="100" y2="198" />
//               <line x1="2" y1="100" x2="10" y2="100" />
//               <line x1="190" y1="100" x2="198" y2="100" />
//             </g>
//           </svg>
//         </div>

//         {/* Waveform */}
//         <div className="ldr-fade mt-8 flex h-8 items-center gap-[3px]">
//           {Array.from({ length: BARS }, (_, i) => (
//             <span
//               key={i}
//               className="ldr-bar block h-full w-[2px] origin-center rounded-full"
//               style={{
//                 background: "linear-gradient(180deg, #68D0FF, #9B72FF)",
//                 opacity: 0.35 + 0.65 * Math.sin((i / (BARS - 1)) * Math.PI),
//               }}
//             />
//           ))}
//         </div>

//         {/* Label + status */}
//         <div className="ldr-fade mt-7 flex flex-col items-center gap-2 text-center">
//           <h2 className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#F4F6FA]">
//             {label}
//           </h2>
//         </div>

//         {/* Progress sweep */}
//         <div className="ldr-fade relative mt-6 h-px w-[clamp(140px,28vw,220px)] overflow-hidden bg-[rgba(180,205,235,0.14)]">
//           <div
//             className="ldr-sweep absolute inset-y-0 left-0 w-2/5"
//             style={{
//               background:
//                 "linear-gradient(100deg, transparent, #42BFFF, #9B72FF, transparent)",
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
