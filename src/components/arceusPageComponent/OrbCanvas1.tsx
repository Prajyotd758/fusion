// "use client";

// import { useEffect, useRef, type MutableRefObject } from "react";

// type P = {
//   hx: number;
//   hy: number;
//   hz: number;
//   s: number;
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   sx: number;
//   sy: number;
//   dz: number;
// };

// const DUR = [1, 5, 2.7, 8]; // hold, charge, blast, return
// // const DUR = [3.2, 0.9, 2.2, 2.8]; // hold, charge, blast, return
// const ease = (t: number) =>
//   t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// const COLORS = Array.from(
//   { length: 8 },
//   (_, i) => `hsl(${195 + (i / 7) * 55},100%,66%)`
// );

// export default function OrbCanvas({
//   amp,
// }: {
//   amp: MutableRefObject<{ v: number }>;
// }) {
//   const ref = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const c = ref.current!;
//     const ctx = c.getContext("2d")!;

//     let w = 0,
//       h = 0,
//       R = 0,
//       ox = 0,
//       oy = 0,
//       S = 1,
//       dim = 1;

//     let raf = 0,
//       last = 0,
//       visible = true;

//     let phase = 3,
//       pt = -2.3,
//       first = true,
//       rot = 0;

//     const N = window.innerWidth < 900 ? 900 : 1700;

//     const pts: P[] = Array.from({ length: N }, (_, i) => {
//       const y = 1 - (i / (N - 1)) * 2;
//       const r = Math.sqrt(1 - y * y);
//       const th = i * 2.399963;

//       return {
//         hx: Math.cos(th) * r,
//         hy: y,
//         hz: Math.sin(th) * r,
//         s: Math.random(),
//         x: 0,
//         y: 0,
//         vx: 0,
//         vy: 0,
//         sx: 0,
//         sy: 0,
//         dz: 0.5,
//       };
//     }).sort((a, b) => a.s - b.s);

//     const resize = () => {
//       const d = Math.min(window.devicePixelRatio || 1, 2);

//       w = c.clientWidth;
//       h = c.clientHeight;

//       c.width = w * d;
//       c.height = h * d;
//       ctx.setTransform(d, 0, 0, d, 0, 0);

//       const wide = w > 900;

//       ox = wide ? w * 0.7 : w * 0.5;
//       oy = h * 0.5;
//       R = Math.min(h * 0.34, wide ? w * 0.22 : w * 0.38);

//       S = clamp(Math.min(w, h) / 900, 0.6, 1.2);
//       dim = wide ? 1 : 0.6;
//     };

//     resize();

//     pts.forEach((p) => {
//       p.x = p.sx = Math.random() * w;
//       p.y = p.sy = Math.random() * h;
//     });

//     const ro = new ResizeObserver(resize);
//     ro.observe(c);

//     const io = new IntersectionObserver(([e]) => {
//       visible = e.isIntersecting;
//     });
//     io.observe(c);

//     let cy = 1,
//       sy = 0,
//       cx = 1,
//       sx = 0;

//     const H = { x: 0, y: 0, z: 0 };

//     const home = (p: P, k: number) => {
//       const x1 = p.hx * cy + p.hz * sy;
//       const z1 = -p.hx * sy + p.hz * cy;

//       H.x = ox + x1 * R * k;
//       H.y = oy + (p.hy * cx - z1 * sx) * R * k;
//       H.z = (p.hy * sx + z1 * cx + 1) / 2;
//     };

//     const enter = (ph: number) => {
//       if (ph === 2) {
//         const sp = Math.max(w, h) / 1000;

//         pts.forEach((p) => {
//           home(p, 0.8);

//           p.x = H.x;
//           p.y = H.y;
//           p.dz = H.z;

//           let dx = p.x - ox;
//           let dy = p.y - oy;

//           const m = Math.hypot(dx, dy) || 1;

//           dx /= m;
//           dy /= m;

//           const v = (180 + Math.pow(Math.random(), 1.4) * 1500) * sp;
//           const a = (Math.random() - 0.5) * 0.7;

//           p.vx = (dx * Math.cos(a) - dy * Math.sin(a)) * v;
//           p.vy = (dx * Math.sin(a) + dy * Math.cos(a)) * v;
//         });
//       }

//       if (ph === 3) {
//         pts.forEach((p) => {
//           p.sx = p.x;
//           p.sy = p.y;
//         });
//       }
//     };

//     const frame = (ts: number) => {
//       raf = requestAnimationFrame(frame);

//       const dt = Math.min((ts - last) / 1000 || 0, 0.05);
//       last = ts;

//       if (!visible) return;

//       pt += dt;
//       rot += dt * 0.22;

//       if (pt >= DUR[phase]) {
//         pt -= DUR[phase];

//         if (phase === 3) first = false;

//         phase = (phase + 1) % 4;
//         enter(phase);
//       }

//       cy = Math.cos(rot);
//       sy = Math.sin(rot);
//       cx = Math.cos(0.3);
//       sx = Math.sin(0.3);

//       const vis = first && phase === 3 ? clamp(pt / 0.8) : 1;

//       const a =
//         amp.current.v * (0.7 + 0.3 * Math.sin(ts * 0.03)) +
//         0.03 * Math.sin(ts * 0.0018);

//       const charge = phase === 1 ? ease(pt / DUR[1]) : 0;

//       // Smooth, pronounced particle growth and brightness during charging.
//       const chargePower = charge * charge;
//       const particleBoost = 1 + chargePower * 2.5;
//       const brightnessBoost = 1 + chargePower * 1.8;

//       const bt = phase === 2 ? pt : 99;

//       ctx.clearRect(0, 0, w, h);
//       ctx.save();

//       // No ctx.translate() here: the canvas remains stable before the blast.
//       ctx.globalCompositeOperation = "lighter";

//       /* intensified charge glow */
//       if (charge > 0) {
//         const glowRadius = R * (1.1 + charge * 0.75);

//         const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, glowRadius);

//         g.addColorStop(0, `rgba(235,250,255,${0.75 * charge})`);

//         g.addColorStop(0.18, `rgba(104,208,255,${0.65 * charge})`);

//         g.addColorStop(0.5, `rgba(66,191,255,${0.3 * charge})`);

//         g.addColorStop(1, "rgba(66,191,255,0)");

//         ctx.globalAlpha = dim;
//         ctx.fillStyle = g;

//         ctx.fillRect(
//           ox - glowRadius,
//           oy - glowRadius,
//           glowRadius * 2,
//           glowRadius * 2
//         );

//         // Bright core appears near the peak of the charge.
//         const core = Math.pow(charge, 3);

//         if (core > 0.01) {
//           const coreGlow = ctx.createRadialGradient(
//             ox,
//             oy,
//             0,
//             ox,
//             oy,
//             R * 0.55 * charge
//           );

//           coreGlow.addColorStop(0, `rgba(255,255,255,${0.8 * core})`);

//           coreGlow.addColorStop(0.3, `rgba(180,235,255,${0.55 * core})`);

//           coreGlow.addColorStop(1, "rgba(66,191,255,0)");

//           ctx.globalAlpha = dim;
//           ctx.fillStyle = coreGlow;

//           ctx.fillRect(ox - R, oy - R, R * 2, R * 2);
//         }
//       }

//       /* particles */
//       const streaks: number[] = [];
//       let b = -1;

//       for (const p of pts) {
//         let al = 0.12;

//         if (phase === 0) {
//           home(p, 1 + a * 0.12 * Math.sin(p.hy * 7 + ts * 0.004 + p.s * 6));

//           p.x = H.x;
//           p.y = H.y;
//           p.dz = H.z;
//         } else if (phase === 1) {
//           // Pull particles inward and make the sphere visibly denser.
//           home(p, 1 - 0.2 * charge);

//           const scatter = (1 - charge) * 8 * S;

//           p.x = H.x + (Math.random() - 0.5) * scatter;
//           p.y = H.y + (Math.random() - 0.5) * scatter;
//           p.dz = H.z;
//         } else if (phase === 2) {
//           const dr = Math.exp(-1.5 * dt);

//           p.vx = p.vx * dr + Math.sin(p.y * 0.01 + ts * 0.002) * 30 * dt;

//           p.vy = p.vy * dr + Math.cos(p.x * 0.01 + ts * 0.002) * 30 * dt;

//           p.x += p.vx * dt;
//           p.y += p.vy * dt;

//           if (Math.abs(p.vx) + Math.abs(p.vy) > 160 && bt < 1.6) {
//             streaks.push(p.x, p.y, p.x - p.vx * 0.03, p.y - p.vy * 0.03);
//           }
//         } else {
//           const u = ease(clamp((Math.max(0, pt) - p.s * 0.9) / 1.7));

//           home(p, 1);

//           const off = Math.sin(u * Math.PI) * (1 - u) * 60 * (p.s - 0.5) * S;

//           p.x = p.sx + (H.x - p.sx) * u + off;
//           p.y = p.sy + (H.y - p.sy) * u - off;
//           p.dz = H.z;
//         }

//         al = 0.15 + p.dz * 0.85;

//         // Original particle size, dramatically increased during charge.
//         const baseSize = (0.7 + p.dz * 1.8) * S;
//         const sz = baseSize * particleBoost;

//         const bk = Math.min(7, Math.floor(p.s * 8));

//         if (bk !== b) {
//           ctx.fillStyle = COLORS[bk];
//           b = bk;
//         }

//         ctx.globalAlpha = Math.min(1, al * vis * dim * brightnessBoost);

//         // Larger, brighter particles are visible at the charge peak.
//         ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);

//         // White-cyan highlight on the brightest charging particles.
//         if (charge > 0.45 && p.dz > 0.35) {
//           const highlight = Math.pow(charge, 3);

//           ctx.fillStyle = "#eafaff";
//           ctx.globalAlpha = highlight * 0.9 * vis * dim;

//           const coreSize = sz * 0.48;

//           ctx.fillRect(
//             p.x - coreSize / 2,
//             p.y - coreSize / 2,
//             coreSize,
//             coreSize
//           );
//         }
//       }

//       /* blast streaks */
//       if (streaks.length) {
//         ctx.globalAlpha = 0.5 * (1 - clamp(bt / 1.6)) * dim;

//         ctx.strokeStyle = "rgb(140,215,255)";
//         ctx.lineWidth = 1.2 * S;
//         ctx.beginPath();

//         for (let i = 0; i < streaks.length; i += 4) {
//           ctx.moveTo(streaks[i], streaks[i + 1]);
//           ctx.lineTo(streaks[i + 2], streaks[i + 3]);
//         }

//         ctx.stroke();
//       }

//       /* flash + shockwaves */
//       if (bt < 1.6) {
//         const f = clamp(1 - bt / 0.5);

//         if (f > 0) {
//           const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, R * 2.4);

//           g.addColorStop(0, `rgba(255,255,255,${0.9 * f})`);

//           g.addColorStop(0.25, `rgba(104,208,255,${0.5 * f})`);

//           g.addColorStop(1, "rgba(66,191,255,0)");

//           ctx.globalAlpha = dim;
//           ctx.fillStyle = g;
//           ctx.fillRect(0, 0, w, h);
//         }

//         [0, 0.15].forEach((d, i) => {
//           const t = clamp((bt - d) / 1.4);

//           if (t <= 0 || t >= 1) return;

//           const o = 1 - Math.pow(1 - t, 3);

//           ctx.globalAlpha = Math.pow(1 - t, 2) * 0.8 * dim;

//           ctx.strokeStyle = i ? "rgb(155,114,255)" : "rgb(104,208,255)";

//           ctx.lineWidth = (4 * (1 - t) + 1) * S;
//           ctx.beginPath();

//           ctx.arc(ox, oy, R * 0.3 + o * Math.max(w, h) * 0.85, 0, Math.PI * 2);

//           ctx.stroke();
//         });
//       }

//       ctx.restore();
//     };

//     raf = requestAnimationFrame(frame);

//     return () => {
//       cancelAnimationFrame(raf);
//       ro.disconnect();
//       io.disconnect();
//     };
//   }, [amp]);

//   return <canvas ref={ref} className="ax-canvas" aria-hidden />;
// }

// "use client";

// import { useEffect, useRef, type MutableRefObject } from "react";

// type P = {
//   hx: number;
//   hy: number;
//   hz: number;
//   s: number;
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   sx: number;
//   sy: number;
//   dz: number;
// };

// const DUR = [1, 5, 2.7, 8]; // hold, charge, blast, return
// const ease = (t: number) =>
//   t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// // One glow palette (the gather color) used in every phase
// const COLORS = Array.from(
//   { length: 8 },
//   (_, i) => `hsl(${190 + (i / 7) * 50},100%,84%)`
// );
// const TONE = "190,230,255"; // same tone for flash, streaks, rings, charge glow
// // const BASE = 0.4; // constant glow/size boost
// const GLOW_LVL = 0.8;

// export default function OrbCanvas({
//   amp,
// }: {
//   amp: MutableRefObject<{ v: number }>;
// }) {
//   const ref = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const c = ref.current!;
//     const ctx = c.getContext("2d")!;

//     let w = 0,
//       h = 0,
//       R = 0,
//       ox = 0,
//       oy = 0,
//       S = 1,
//       dim = 1;
//     let raf = 0,
//       last = 0,
//       visible = true;
//     let phase = 3,
//       pt = -2.3,
//       first = true,
//       rot = 0;

//     const N = window.innerWidth < 900 ? 900 : 1700;

//     const pts: P[] = Array.from({ length: N }, (_, i) => {
//       const y = 1 - (i / (N - 1)) * 2;
//       const r = Math.sqrt(1 - y * y);
//       const th = i * 2.399963;
//       return {
//         hx: Math.cos(th) * r,
//         hy: y,
//         hz: Math.sin(th) * r,
//         s: Math.random(),
//         x: 0,
//         y: 0,
//         vx: 0,
//         vy: 0,
//         sx: 0,
//         sy: 0,
//         dz: 0.5,
//       };
//     }).sort((a, b) => a.s - b.s);

//     const resize = () => {
//       const d = Math.min(window.devicePixelRatio || 1, 2);
//       w = c.clientWidth;
//       h = c.clientHeight;
//       c.width = w * d;
//       c.height = h * d;
//       ctx.setTransform(d, 0, 0, d, 0, 0);

//       const wide = w > 900;
//       ox = wide ? w * 0.7 : w * 0.5;
//       oy = h * 0.5;
//       R = Math.min(h * 0.34, wide ? w * 0.22 : w * 0.38);
//       S = clamp(Math.min(w, h) / 900, 0.6, 1.2);
//       dim = wide ? 1 : 0.6;
//     };
//     resize();

//     pts.forEach((p) => {
//       p.x = p.sx = Math.random() * w;
//       p.y = p.sy = Math.random() * h;
//     });

//     const ro = new ResizeObserver(resize);
//     ro.observe(c);
//     const io = new IntersectionObserver(([e]) => {
//       visible = e.isIntersecting;
//     });
//     io.observe(c);

//     let cy = 1,
//       sy = 0,
//       cx = 1,
//       sx = 0;
//     const H = { x: 0, y: 0, z: 0 };

//     const home = (p: P, k: number) => {
//       const x1 = p.hx * cy + p.hz * sy;
//       const z1 = -p.hx * sy + p.hz * cy;
//       H.x = ox + x1 * R * k;
//       H.y = oy + (p.hy * cx - z1 * sx) * R * k;
//       H.z = (p.hy * sx + z1 * cx + 1) / 2;
//     };

//     const enter = (ph: number) => {
//       if (ph === 2) {
//         const sp = Math.max(w, h) / 1000;
//         pts.forEach((p) => {
//           home(p, 0.8);
//           p.x = H.x;
//           p.y = H.y;
//           p.dz = H.z;

//           let dx = p.x - ox;
//           let dy = p.y - oy;
//           const m = Math.hypot(dx, dy) || 1;
//           dx /= m;
//           dy /= m;

//           const v = (180 + Math.pow(Math.random(), 1.4) * 1500) * sp;
//           const a = (Math.random() - 0.5) * 0.7;
//           p.vx = (dx * Math.cos(a) - dy * Math.sin(a)) * v;
//           p.vy = (dx * Math.sin(a) + dy * Math.cos(a)) * v;
//         });
//       }
//       if (ph === 3)
//         pts.forEach((p) => {
//           p.sx = p.x;
//           p.sy = p.y;
//         });
//     };

//     const frame = (ts: number) => {
//       raf = requestAnimationFrame(frame);

//       const dt = Math.min((ts - last) / 1000 || 0, 0.05);
//       last = ts;
//       if (!visible) return;

//       pt += dt;
//       rot += dt * 0.22;

//       if (pt >= DUR[phase]) {
//         pt -= DUR[phase];
//         if (phase === 3) first = false;
//         phase = (phase + 1) % 4;
//         enter(phase);
//       }

//       cy = Math.cos(rot);
//       sy = Math.sin(rot);
//       cx = Math.cos(0.3);
//       sx = Math.sin(0.3);

//       const vis = first && phase === 3 ? clamp(pt / 0.8) : 1;
//       const charge = phase === 1 ? ease(pt / DUR[1]) : 0;
//       const bt = phase === 2 ? pt : 99;

//       ctx.clearRect(0, 0, w, h);
//       ctx.save();
//       ctx.globalCompositeOperation = "lighter";

//       /* charge glow */
//       if (charge > 0) {
//         const glowRadius = R * (1.1 + charge * 0.75);
//         const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, glowRadius);
//         g.addColorStop(0, `rgba(${TONE},${0.75 * charge})`);
//         g.addColorStop(0.35, `rgba(${TONE},${0.3 * charge})`);
//         g.addColorStop(1, `rgba(${TONE},0)`);
//         ctx.globalAlpha = dim;
//         ctx.fillStyle = g;
//         ctx.fillRect(
//           ox - glowRadius,
//           oy - glowRadius,
//           glowRadius * 2,
//           glowRadius * 2
//         );

//         const core = Math.pow(charge, 3);
//         if (core > 0.01) {
//           const cg = ctx.createRadialGradient(
//             ox,
//             oy,
//             0,
//             ox,
//             oy,
//             R * 0.55 * charge
//           );
//           cg.addColorStop(0, `rgba(255,255,255,${0.7 * core})`);
//           cg.addColorStop(0.3, `rgba(${TONE},${0.5 * core})`);
//           cg.addColorStop(1, `rgba(${TONE},0)`);
//           ctx.globalAlpha = dim;
//           ctx.fillStyle = cg;
//           ctx.fillRect(ox - R, oy - R, R * 2, R * 2);
//         }
//       }

//       /* particles */
//       /* particles */
//       const streaks: number[] = [];
//       for (const p of pts) {
//         let grow = 0; // 0 = small, 1 = bigger

//         if (phase === 0) {
//           home(p, 1);
//           p.x = H.x;
//           p.y = H.y;
//           p.dz = H.z;
//           grow = ease(clamp(pt / 1.0)); // sphere formed -> grow
//         } else if (phase === 1) {
//           home(p, 1 - 0.2 * charge);
//           p.x = H.x;
//           p.y = H.y;
//           p.dz = H.z;
//           grow = 1;
//         } else if (phase === 2) {
//           const dr = Math.exp(-1.5 * dt);
//           p.vx = p.vx * dr + Math.sin(p.y * 0.01 + ts * 0.002) * 30 * dt;
//           p.vy = p.vy * dr + Math.cos(p.x * 0.01 + ts * 0.002) * 30 * dt;
//           p.x += p.vx * dt;
//           p.y += p.vy * dt;
//           if (Math.abs(p.vx) + Math.abs(p.vy) > 160 && bt < 1.6)
//             streaks.push(p.x, p.y, p.x - p.vx * 0.03, p.y - p.vy * 0.03);
//           grow = 1 - ease(clamp(bt / 0.3)); // explode -> small again
//         } else {
//           // const u = ease(clamp((Math.max(0, pt) - p.s * 0.9) / 1.7));
//           const u = ease(
//             clamp((Math.max(0, pt) - p.s * DUR[3] * 0.33) / (DUR[3] * 0.62))
//           );
//           home(p, 1);
//           const off = Math.sin(u * Math.PI) * (1 - u) * 60 * (p.s - 0.5) * S;
//           p.x = p.sx + (H.x - p.sx) * u + off;
//           p.y = p.sy + (H.y - p.sy) * u - off;
//           p.dz = H.z;
//           grow = 0; // gathering -> small
//         }

//         const al = 0.15 + p.dz * 0.85;
//         const base = (0.7 + p.dz * 1.8) * S;
//         const sz = base * 1.8;
//         ctx.fillStyle = COLORS[Math.min(7, Math.floor(p.s * 8))];

//         ctx.globalAlpha = Math.min(1, al * (1 + GLOW_LVL * 0.5)) * vis * dim;
//         ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);

//         // constant glow halo, independent of particle size
//         const hs = base * 3.2;
//         ctx.globalAlpha = 0.14 * GLOW_LVL * al * vis * dim;
//         ctx.fillRect(p.x - hs / 2, p.y - hs / 2, hs, hs);
//       }

//       /* blast streaks */
//       if (streaks.length) {
//         ctx.globalAlpha = 0.5 * (1 - clamp(bt / 1.6)) * dim;
//         ctx.strokeStyle = `rgb(${TONE})`;
//         ctx.lineWidth = 1.2 * S;
//         ctx.beginPath();
//         for (let i = 0; i < streaks.length; i += 4) {
//           ctx.moveTo(streaks[i], streaks[i + 1]);
//           ctx.lineTo(streaks[i + 2], streaks[i + 3]);
//         }
//         ctx.stroke();
//       }

//       /* flash + shockwaves */
//       if (bt < 1.6) {
//         const f = clamp(1 - bt / 0.5);
//         if (f > 0) {
//           const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, R * 2.4);
//           g.addColorStop(0, `rgba(255,255,255,${0.9 * f})`);
//           g.addColorStop(0.25, `rgba(${TONE},${0.4 * f})`);
//           g.addColorStop(1, `rgba(${TONE},0)`);
//           ctx.globalAlpha = dim;
//           ctx.fillStyle = g;
//           ctx.fillRect(0, 0, w, h);
//         }

//         [0, 0.15].forEach((d) => {
//           const t = clamp((bt - d) / 1.4);
//           if (t <= 0 || t >= 1) return;
//           const o = 1 - Math.pow(1 - t, 3);
//           ctx.globalAlpha = Math.pow(1 - t, 2) * 0.8 * dim;
//           ctx.strokeStyle = `rgb(${TONE})`;
//           ctx.lineWidth = (4 * (1 - t) + 1) * S;
//           ctx.beginPath();
//           ctx.arc(ox, oy, R * 0.3 + o * Math.max(w, h) * 0.85, 0, Math.PI * 2);
//           ctx.stroke();
//         });
//       }

//       ctx.restore();
//     };

//     raf = requestAnimationFrame(frame);

//     return () => {
//       cancelAnimationFrame(raf);
//       ro.disconnect();
//       io.disconnect();
//     };
//   }, [amp]);

//   return <canvas ref={ref} className="ax-canvas" aria-hidden />;
// }

"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

type P = {
  hx: number;
  hy: number;
  hz: number;
  s: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  sx: number;
  sy: number;
  dz: number;
};

const DUR = [1, 5, 2.7, 8]; // hold, charge, blast, return
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// one light glow palette, used in every phase
const COLORS = Array.from(
  { length: 8 },
  (_, i) => `hsl(${190 + (i / 7) * 50},100%,84%)`
);

export default function OrbCanvas({
  amp,
}: {
  amp: MutableRefObject<{ v: number }>;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;

    let w = 0,
      h = 0,
      R = 0,
      ox = 0,
      oy = 0,
      S = 1,
      dim = 1;

    let raf = 0,
      last = 0,
      visible = true;

    let phase = 3,
      pt = -2.3,
      first = true,
      rot = 0;

    const N = window.innerWidth < 900 ? 900 : 1700;

    const pts: P[] = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.399963;

      return {
        hx: Math.cos(th) * r,
        hy: y,
        hz: Math.sin(th) * r,
        s: Math.random(),
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        sx: 0,
        sy: 0,
        dz: 0.5,
      };
    }).sort((a, b) => a.s - b.s);

    const resize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);

      w = c.clientWidth;
      h = c.clientHeight;

      c.width = w * d;
      c.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);

      const wide = w > 900;

      ox = wide ? w * 0.7 : w * 0.5;
      oy = h * 0.5;
      R = Math.min(h * 0.34, wide ? w * 0.22 : w * 0.38);

      S = clamp(Math.min(w, h) / 900, 0.6, 1.2);
      dim = wide ? 1 : 0.6;
    };

    resize();

    pts.forEach((p) => {
      p.x = p.sx = Math.random() * w;
      p.y = p.sy = Math.random() * h;
    });

    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(c);

    let cy = 1,
      sy = 0,
      cx = 1,
      sx = 0;

    const H = { x: 0, y: 0, z: 0 };

    const home = (p: P, k: number) => {
      const x1 = p.hx * cy + p.hz * sy;
      const z1 = -p.hx * sy + p.hz * cy;

      H.x = ox + x1 * R * k;
      H.y = oy + (p.hy * cx - z1 * sx) * R * k;
      H.z = (p.hy * sx + z1 * cx + 1) / 2;
    };

    const enter = (ph: number) => {
      if (ph === 2) {
        const sp = Math.max(w, h) / 1000;

        pts.forEach((p) => {
          home(p, 0.8);

          p.x = H.x;
          p.y = H.y;
          p.dz = H.z;

          let dx = p.x - ox;
          let dy = p.y - oy;

          const m = Math.hypot(dx, dy) || 1;

          dx /= m;
          dy /= m;

          const v = (180 + Math.pow(Math.random(), 1.4) * 1500) * sp;
          const a = (Math.random() - 0.5) * 0.7;

          p.vx = (dx * Math.cos(a) - dy * Math.sin(a)) * v;
          p.vy = (dx * Math.sin(a) + dy * Math.cos(a)) * v;
        });
      }

      if (ph === 3) {
        pts.forEach((p) => {
          p.sx = p.x;
          p.sy = p.y;
        });
      }
    };

    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);

      const dt = Math.min((ts - last) / 1000 || 0, 0.05);
      last = ts;

      if (!visible) return;

      pt += dt;
      rot += dt * 0.22;

      if (pt >= DUR[phase]) {
        pt -= DUR[phase];

        if (phase === 3) first = false;

        phase = (phase + 1) % 4;
        enter(phase);
      }

      cy = Math.cos(rot);
      sy = Math.sin(rot);
      cx = Math.cos(0.3);
      sx = Math.sin(0.3);

      const vis = first && phase === 3 ? clamp(pt / 0.8) : 1;

      const a =
        amp.current.v * (0.7 + 0.3 * Math.sin(ts * 0.03)) +
        0.03 * Math.sin(ts * 0.0018);

      const charge = phase === 1 ? ease(pt / DUR[1]) : 0;

      const bt = phase === 2 ? pt : 99;

      ctx.clearRect(0, 0, w, h);
      ctx.save();

      ctx.globalCompositeOperation = "lighter";

      /* intensified charge glow */
      if (charge > 0) {
        const glowRadius = R * (1.1 + charge * 0.75);

        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, glowRadius);

        g.addColorStop(0, `rgba(235,250,255,${0.75 * charge})`);
        g.addColorStop(0.18, `rgba(104,208,255,${0.65 * charge})`);
        g.addColorStop(0.5, `rgba(66,191,255,${0.3 * charge})`);
        g.addColorStop(1, "rgba(66,191,255,0)");

        ctx.globalAlpha = dim;
        ctx.fillStyle = g;

        ctx.fillRect(
          ox - glowRadius,
          oy - glowRadius,
          glowRadius * 2,
          glowRadius * 2
        );

        // Bright core appears near the peak of the charge.
        const core = Math.pow(charge, 3);

        if (core > 0.01) {
          const coreGlow = ctx.createRadialGradient(
            ox,
            oy,
            0,
            ox,
            oy,
            R * 0.55 * charge
          );

          coreGlow.addColorStop(0, `rgba(255,255,255,${0.8 * core})`);
          coreGlow.addColorStop(0.3, `rgba(180,235,255,${0.55 * core})`);
          coreGlow.addColorStop(1, "rgba(66,191,255,0)");

          ctx.globalAlpha = dim;
          ctx.fillStyle = coreGlow;

          ctx.fillRect(ox - R, oy - R, R * 2, R * 2);
        }
      }

      /* particles */
      const streaks: number[] = [];
      let b = -1;

      for (const p of pts) {
        let al = 0.12;

        if (phase === 0) {
          home(p, 1 + a * 0.12 * Math.sin(p.hy * 7 + ts * 0.004 + p.s * 6));

          p.x = H.x;
          p.y = H.y;
          p.dz = H.z;
        } else if (phase === 1) {
          // Pull particles inward and make the sphere visibly denser.
          home(p, 1 - 0.2 * charge);

          const scatter = (1 - charge) * 8 * S;

          p.x = H.x + (Math.random() - 0.5) * scatter;
          p.y = H.y + (Math.random() - 0.5) * scatter;
          p.dz = H.z;
        } else if (phase === 2) {
          const dr = Math.exp(-1.5 * dt);

          p.vx = p.vx * dr + Math.sin(p.y * 0.01 + ts * 0.002) * 30 * dt;
          p.vy = p.vy * dr + Math.cos(p.x * 0.01 + ts * 0.002) * 30 * dt;

          p.x += p.vx * dt;
          p.y += p.vy * dt;

          if (Math.abs(p.vx) + Math.abs(p.vy) > 160 && bt < 1.6) {
            streaks.push(p.x, p.y, p.x - p.vx * 0.03, p.y - p.vy * 0.03);
          }
        } else {
          // const u = ease(clamp((Math.max(0, pt) - p.s * 0.9) / 1.7));
          const u = ease(
            clamp((Math.max(0, pt) - p.s * DUR[3] * 0.33) / (DUR[3] * 0.62))
          );

          home(p, 1);

          const off = Math.sin(u * Math.PI) * (1 - u) * 60 * (p.s - 0.5) * S;

          p.x = p.sx + (H.x - p.sx) * u + off;
          p.y = p.sy + (H.y - p.sy) * u - off;
          p.dz = H.z;
        }

        al = 0.15 + p.dz * 0.85;

        // same size in every phase
        const base = (0.7 + p.dz * 1.8) * S;
        const sz = base * 1.8;

        const bk = Math.min(7, Math.floor(p.s * 8));

        if (bk !== b) {
          ctx.fillStyle = COLORS[bk];
          b = bk;
        }

        ctx.globalAlpha = Math.min(1, al * 1.4) * vis * dim;
        ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);

        // same soft glow in every phase
        const hs = base * 3.2;
        ctx.globalAlpha = 0.11 * al * vis * dim;
        ctx.fillRect(p.x - hs / 2, p.y - hs / 2, hs, hs);
      }

      /* blast streaks */
      if (streaks.length) {
        ctx.globalAlpha = 0.5 * (1 - clamp(bt / 1.6)) * dim;

        ctx.strokeStyle = "rgb(140,215,255)";
        ctx.lineWidth = 1.2 * S;
        ctx.beginPath();

        for (let i = 0; i < streaks.length; i += 4) {
          ctx.moveTo(streaks[i], streaks[i + 1]);
          ctx.lineTo(streaks[i + 2], streaks[i + 3]);
        }

        ctx.stroke();
      }

      /* flash + shockwaves */
      if (bt < 1.6) {
        const f = clamp(1 - bt / 0.5);

        if (f > 0) {
          const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, R * 2.4);

          g.addColorStop(0, `rgba(255,255,255,${0.9 * f})`);
          g.addColorStop(0.25, `rgba(104,208,255,${0.5 * f})`);
          g.addColorStop(1, "rgba(66,191,255,0)");

          ctx.globalAlpha = dim;
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }

        [0, 0.15].forEach((d, i) => {
          const t = clamp((bt - d) / 1.4);

          if (t <= 0 || t >= 1) return;

          const o = 1 - Math.pow(1 - t, 3);

          ctx.globalAlpha = Math.pow(1 - t, 2) * 0.8 * dim;

          ctx.strokeStyle = i ? "rgb(155,114,255)" : "rgb(104,208,255)";

          ctx.lineWidth = (4 * (1 - t) + 1) * S;
          ctx.beginPath();

          ctx.arc(ox, oy, R * 0.3 + o * Math.max(w, h) * 0.85, 0, Math.PI * 2);

          ctx.stroke();
        });
      }

      ctx.restore();
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [amp]);

  return <canvas ref={ref} className="ax-canvas" aria-hidden />;
}
