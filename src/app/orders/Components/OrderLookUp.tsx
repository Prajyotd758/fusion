"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

interface OrderLookupProps {
  onFound: (orderDetails: any) => void;
}

interface OrderResponse {
  success: boolean;
  order?: any;
  message?: string;
}

const TOKENS = {
  "--bg-primary": "#07090D",
  "--bg-secondary": "#0B0F15",
  "--bg-elevated": "#101722",
  "--text-primary": "#F4F6FA",
  "--text-secondary": "#A0A9B8",
  "--text-muted": "#687487",
  "--border-subtle": "rgba(180,205,235,0.14)",
  "--border-highlight": "rgba(66,191,255,0.45)",
} as React.CSSProperties;

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function OrderLookup({ onFound }: OrderLookupProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [form, setForm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  /* intro + ambient glow */
  useIso(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-intro]", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
        })
        .from("[data-card]", { y: 32, opacity: 0, duration: 0.9 }, "-=0.6");

      gsap.to("[data-glow]", {
        xPercent: 10,
        yPercent: -8,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* "Orbital scan": rotating rings, a radar sweep with afterglow,
     orbiting nodes that flash when the beam crosses them, drifting dust */
  useIso(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const g = canvas?.getContext("2d");
    if (!canvas || !root || !g) return;

    const TAU = Math.PI * 2;
    const hasConic = typeof g.createConicGradient === "function";
    let w = 0,
      h = 0,
      cx = 0,
      cy = 0,
      maxR = 0;
    const intro = { p: 0 };

    const RINGS = [
      { f: 0.3, rot: 0.05, ticks: 0, nodes: [{ a: 0.6, s: 0.22 }] },
      {
        f: 0.45,
        rot: -0.035,
        ticks: 96,
        nodes: [
          { a: 2.4, s: -0.16 },
          { a: 4.9, s: -0.16 },
        ],
      },
      { f: 0.6, rot: 0.025, ticks: 0, nodes: [{ a: 1.2, s: 0.12 }] },
      {
        f: 0.78,
        rot: -0.018,
        ticks: 160,
        nodes: [
          { a: 3.6, s: -0.09 },
          { a: 5.8, s: -0.09 },
          { a: 0.2, s: -0.09 },
        ],
      },
      { f: 0.98, rot: 0.012, ticks: 0, nodes: [{ a: 4.4, s: 0.07 }] },
    ];
    const dust = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      v: 0.006 + Math.random() * 0.014,
      r: 0.4 + Math.random() * 1.1,
      p: Math.random() * TAU,
    }));

    const draw = (time: number, dt: number) => {
      const P = intro.p;
      const head = (time * 0.85) % TAU; // sweep angle
      g.clearRect(0, 0, w, h);

      // breathing bloom
      const breathe = 0.5 + 0.5 * Math.sin(time * 0.6);
      const bloom = g.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.7);
      bloom.addColorStop(0, `rgba(66,191,255,${(0.07 + 0.04 * breathe) * P})`);
      bloom.addColorStop(0.5, `rgba(155,114,255,${0.03 * P})`);
      bloom.addColorStop(1, "rgba(155,114,255,0)");
      g.fillStyle = bloom;
      g.fillRect(0, 0, w, h);

      // radar wedge (soft, leading edge sharp)
      if (hasConic) {
        const wg = g.createConicGradient(head, cx, cy);
        wg.addColorStop(0, "rgba(66,191,255,0)");
        wg.addColorStop(0.75, "rgba(66,191,255,0)");
        wg.addColorStop(1, `rgba(104,208,255,${0.1 * P})`);
        g.fillStyle = wg;
        g.beginPath();
        g.arc(cx, cy, maxR, 0, TAU);
        g.fill();
      }

      // gradient used to light the rings as the beam passes
      let sweep: CanvasGradient | string = `rgba(104,208,255,${0.4 * P})`;
      if (hasConic) {
        const sg = g.createConicGradient(head, cx, cy);
        sg.addColorStop(0, "rgba(104,208,255,0)");
        sg.addColorStop(0.6, "rgba(104,208,255,0)");
        sg.addColorStop(0.85, `rgba(155,114,255,${0.35 * P})`);
        sg.addColorStop(1, `rgba(104,208,255,${0.95 * P})`);
        sweep = sg;
      }

      for (const r of RINGS) {
        const rad = r.f * maxR * (0.8 + 0.2 * P);

        g.lineWidth = 1;
        g.strokeStyle = `rgba(180,205,235,${0.07 * P})`;
        g.beginPath();
        g.arc(cx, cy, rad, 0, TAU);
        g.stroke();

        if (r.ticks) {
          const rot = time * r.rot;
          g.strokeStyle = `rgba(180,205,235,${0.14 * P})`;
          g.beginPath();
          for (let i = 0; i < r.ticks; i++) {
            const a = rot + (i / r.ticks) * TAU;
            const len = i % 8 === 0 ? 9 : 4;
            const c = Math.cos(a),
              s = Math.sin(a);
            g.moveTo(cx + c * rad, cy + s * rad);
            g.lineTo(cx + c * (rad - len), cy + s * (rad - len));
          }
          g.stroke();
        }

        g.lineWidth = 1.6;
        g.strokeStyle = sweep;
        g.beginPath();
        g.arc(cx, cy, rad, 0, TAU);
        g.stroke();

        for (const n of r.nodes) {
          const a = n.a + time * n.s;
          const x = cx + Math.cos(a) * rad;
          const y = cy + Math.sin(a) * rad;
          const behind = (((head - a) % TAU) + TAU) % TAU;
          const flash = Math.exp(-behind * 2.2); // 1 when beam just crossed

          const dir = n.s < 0 ? -1 : 1;
          for (let i = 1; i <= 8; i++) {
            const ta = a - dir * i * 0.018;
            g.fillStyle = `rgba(104,208,255,${(0.35 - 0.04 * i) * P})`;
            g.beginPath();
            g.arc(
              cx + Math.cos(ta) * rad,
              cy + Math.sin(ta) * rad,
              1.8 * (1 - i / 10),
              0,
              TAU
            );
            g.fill();
          }

          const gr = 14 + flash * 14;
          const glow = g.createRadialGradient(x, y, 0, x, y, gr);
          glow.addColorStop(0, `rgba(104,208,255,${(0.35 + 0.5 * flash) * P})`);
          glow.addColorStop(1, "rgba(104,208,255,0)");
          g.fillStyle = glow;
          g.fillRect(x - gr, y - gr, gr * 2, gr * 2);

          g.fillStyle = `rgba(244,246,250,${(0.7 + 0.3 * flash) * P})`;
          g.beginPath();
          g.arc(x, y, 2 + flash * 1.5, 0, TAU);
          g.fill();
        }
      }

      // drifting dust
      for (const d of dust) {
        d.y -= d.v * dt;
        if (d.y < -0.02) {
          d.y = 1.02;
          d.x = Math.random();
        }
        const tw = 0.5 + 0.5 * Math.sin(time * 1.2 + d.p);
        g.fillStyle = `rgba(200,225,255,${(0.08 + 0.3 * tw) * P})`;
        g.beginPath();
        g.arc(d.x * w, d.y * h, d.r, 0, TAU);
        g.fill();
      }

      // vignette to focus the center
      const vg = g.createRadialGradient(cx, cy, maxR * 0.25, cx, cy, maxR);
      vg.addColorStop(0, "rgba(7,9,13,0)");
      vg.addColorStop(1, "rgba(7,9,13,0.85)");
      g.fillStyle = vg;
      g.fillRect(0, 0, w, h);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = root.clientWidth;
      h = root.clientHeight;
      cx = w / 2;
      cy = h / 2;
      maxR = Math.hypot(w, h) / 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    resize();

    const tick = (time: number, delta: number) =>
      draw(time, Math.min(delta, 50) / 1000);
    gsap.ticker.add(tick);
    const introTween = gsap.to(intro, {
      p: 1,
      duration: 2.6,
      ease: "power3.out",
    });

    return () => {
      gsap.ticker.remove(tick);
      introTween.kill();
      ro.disconnect();
    };
  }, []);

  /* error: slide in + subtle shake on the input */
  useIso(() => {
    if (!error) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-error]", {
        y: -8,
        opacity: 0,
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.fromTo(
        "[data-input]",
        { x: -6 },
        { x: 0, duration: 0.5, ease: "elastic.out(1, 0.4)", clearProps: "x" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [error]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const phone = form.trim();

    if (!phone) {
      setError("Please enter your contact number.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError(
        "Phone number must be exactly 10 digits, with no letters or spaces."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/order-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data: OrderResponse = await res.json();

      if (res.ok && data.success && data.order) {
        onFound(data.order);
      } else {
        setError(data.message || "Order not found.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={rootRef}
      style={TOKENS}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-(--bg-primary) px-4 py-12 text-(color:--text-primary)"
    >
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          data-glow
          className="absolute -top-32 left-1/2 h-[520px] w-[820px] max-w-full -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(66,191,255,0.16), rgba(155,114,255,0.06) 60%, transparent)",
          }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-10 text-center">
          <div
            data-intro
            className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-(color:--border-highlight) bg-[#42BFFF]/10"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#68D0FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <p
            data-intro
            className="mb-3 text-[11px] uppercase tracking-[0.2em] text-(color:--text-muted)"
          >
            Order tracking
          </p>

          <h1
            data-intro
            className="mb-3 text-[clamp(32px,6vw,44px)] font-semibold leading-[1.05] tracking-[-0.03em]"
          >
            Track your order
          </h1>

          <p data-intro className="text-sm text-(color:--text-secondary)">
            Enter your registered contact number to continue.
          </p>
        </div>

        <div
          data-card
          className="rounded-2xl border border-(color:--border-subtle) bg-(--bg-elevated)/80 p-[clamp(20px,5vw,32px)] backdrop-blur-md"
        >
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="phone"
                  className="text-[11px] font-medium uppercase tracking-[0.14em] text-(color:--text-secondary)"
                >
                  Contact Number
                </label>
                <span className="text-[10px] tracking-[0.14em] text-(color:--text-muted)">
                  {form.length}/10
                </span>
              </div>

              <input
                ref={inputRef}
                data-input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="9876543210"
                maxLength={10}
                value={form}
                aria-invalid={!!error}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setForm(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setError("");
                }}
                className="w-full rounded-lg border border-(color:--border-subtle) bg-(--bg-secondary) px-4 py-3 text-sm tracking-wider text-(color:--text-primary) outline-none transition-colors placeholder:text-(color:--text-muted) focus:border-(color:--border-highlight) focus:ring-2 focus:ring-[#42BFFF]/15 aria-[invalid=true]:border-red-400/50"
              />
            </div>

            {error && (
              <div
                data-error
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3"
              >
                <span className="mt-0.5 text-sm text-red-300">⚠</span>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg border border-(color:--border-highlight) bg-(--bg-secondary) py-3.5 text-sm font-medium transition-colors hover:bg-[#42BFFF]/10 focus-visible:outline-2 focus-visible:outline-[#42BFFF]/60 disabled:opacity-60"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px"
                style={{
                  background:
                    "linear-gradient(100deg, #42BFFF, #568CFF, #9B72FF)",
                }}
              />
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border border-white/30 border-t-white" />
                  <span>Searching…</span>
                </>
              ) : (
                <>
                  Find My Order
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
