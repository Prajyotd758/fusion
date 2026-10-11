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

const DUR = [3.2, 0.9, 2.2, 2.8]; // hold, charge, blast, return
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const COLORS = Array.from(
  { length: 8 },
  (_, i) => `hsl(${195 + (i / 7) * 55},100%,66%)`
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
          let dx = p.x - ox,
            dy = p.y - oy;
          const m = Math.hypot(dx, dy) || 1;
          dx /= m;
          dy /= m;
          const v = (180 + Math.pow(Math.random(), 1.4) * 1500) * sp;
          const a = (Math.random() - 0.5) * 0.7;
          p.vx = (dx * Math.cos(a) - dy * Math.sin(a)) * v;
          p.vy = (dx * Math.sin(a) + dy * Math.cos(a)) * v;
        });
      }
      if (ph === 3)
        pts.forEach((p) => {
          p.sx = p.x;
          p.sy = p.y;
        });
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
      if (bt < 0.45)
        ctx.translate(
          (Math.random() - 0.5) * 14 * (1 - bt / 0.45),
          (Math.random() - 0.5) * 14 * (1 - bt / 0.45)
        );
      ctx.globalCompositeOperation = "lighter";

      /* charge glow */
      if (charge > 0) {
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, R * 1.1);
        g.addColorStop(0, `rgba(180,230,255,${0.55 * charge})`);
        g.addColorStop(1, "rgba(66,191,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(ox - R * 1.2, oy - R * 1.2, R * 2.4, R * 2.4);
      }

      /* particles */
      const streaks: number[] = [];
      let b = -1;
      for (const p of pts) {
        let al = 0.12;
        if (phase === 0 || (phase === 3 && false)) {
          home(p, 1 + a * 0.12 * Math.sin(p.hy * 7 + ts * 0.004 + p.s * 6));
          p.x = H.x;
          p.y = H.y;
          p.dz = H.z;
        } else if (phase === 1) {
          home(p, 1 - 0.2 * charge);
          p.x = H.x + (Math.random() - 0.5) * 8 * charge * S;
          p.y = H.y + (Math.random() - 0.5) * 8 * charge * S;
          p.dz = H.z;
        } else if (phase === 2) {
          const dr = Math.exp(-1.5 * dt);
          p.vx = p.vx * dr + Math.sin(p.y * 0.01 + ts * 0.002) * 30 * dt;
          p.vy = p.vy * dr + Math.cos(p.x * 0.01 + ts * 0.002) * 30 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (Math.abs(p.vx) + Math.abs(p.vy) > 160 && bt < 1.6)
            streaks.push(p.x, p.y, p.x - p.vx * 0.03, p.y - p.vy * 0.03);
        } else {
          const u = ease(clamp((Math.max(0, pt) - p.s * 0.9) / 1.7));
          home(p, 1);
          const off = Math.sin(u * Math.PI) * (1 - u) * 60 * (p.s - 0.5) * S;
          p.x = p.sx + (H.x - p.sx) * u + off;
          p.y = p.sy + (H.y - p.sy) * u - off;
          p.dz = H.z;
        }
        al = 0.15 + p.dz * 0.85;
        const sz = (0.7 + p.dz * 1.8) * S;
        const bk = Math.min(7, Math.floor(p.s * 8));
        if (bk !== b) {
          ctx.fillStyle = COLORS[bk];
          b = bk;
        }
        ctx.globalAlpha = al * vis * dim;
        ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
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

// "use client";

// import { useEffect, useRef, type MutableRefObject } from "react";

// const N = 1100;

// export default function OrbCanvas({ amp }: { amp: MutableRefObject<{ v: number }> }) {
//   const ref = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const c = ref.current!;
//     const ctx = c.getContext("2d")!;
//     const pts = Array.from({ length: N }, (_, i) => {
//       const y = 1 - (i / (N - 1)) * 2;
//       const r = Math.sqrt(1 - y * y);
//       const th = i * 2.399963;
//       return { x: Math.cos(th) * r, y, z: Math.sin(th) * r, s: ((i * 37) % 100) / 100 };
//     });
//     let w = 0, raf = 0, visible = true, mx = 0, my = 0, tx = 0, ty = 0, rot = 0;

//     const resize = () => {
//       const d = Math.min(window.devicePixelRatio || 1, 2);
//       w = c.clientWidth;
//       c.width = w * d;
//       c.height = w * d;
//       ctx.setTransform(d, 0, 0, d, 0, 0);
//     };
//     resize();
//     const ro = new ResizeObserver(resize);
//     ro.observe(c);
//     const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
//     io.observe(c);
//     const move = (e: PointerEvent) => {
//       tx = e.clientX / window.innerWidth - 0.5;
//       ty = e.clientY / window.innerHeight - 0.5;
//     };
//     window.addEventListener("pointermove", move);

//     const draw = (ts: number) => {
//       raf = requestAnimationFrame(draw);
//       if (!visible) return;
//       mx += (tx - mx) * 0.05;
//       my += (ty - my) * 0.05;
//       rot += 0.0035;
//       const a = amp.current.v * (0.7 + 0.3 * Math.sin(ts * 0.03)) + 0.035 * Math.sin(ts * 0.0018);
//       const cy = Math.cos(rot + mx * 1.2), sy = Math.sin(rot + mx * 1.2);
//       const cx = Math.cos(my * 0.8 + 0.3), sx = Math.sin(my * 0.8 + 0.3);
//       const R = w * 0.3, m = w / 2;
//       ctx.clearRect(0, 0, w, w);
//       for (const p of pts) {
//         const x1 = p.x * cy + p.z * sy;
//         const z1 = -p.x * sy + p.z * cy;
//         const y2 = p.y * cx - z1 * sx;
//         const z2 = p.y * sx + z1 * cx;
//         const k = R * (1 + a * 0.45 * Math.sin(p.y * 7 + ts * 0.004 + p.s * 6));
//         const depth = (z2 + 1) / 2;
//         const s = 0.7 + depth * 1.8;
//         ctx.fillStyle = `hsla(${200 + (y2 + 1) * 35},100%,${58 + depth * 14}%,${0.12 + depth * 0.85})`;
//         ctx.fillRect(m + x1 * k - s / 2, m + y2 * k - s / 2, s, s);
//       }
//     };
//     raf = requestAnimationFrame(draw);

//     return () => {
//       cancelAnimationFrame(raf);
//       ro.disconnect();
//       io.disconnect();
//       window.removeEventListener("pointermove", move);
//     };
//   }, [amp]);

//   return <canvas ref={ref} className="ax-canvas" aria-hidden />;
// }
