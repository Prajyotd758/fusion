"use client";
import { useEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";

export default function Field({
  label, name, type = "text", placeholder, length, form, setForm, errors, setErrors,
}: any) {
  const wrap = useRef<HTMLDivElement>(null);
  const check = useRef<SVGPathElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const err = errors[name];
  const val: string = form[name] ?? "";
  const valid = val.trim().length > 0 && !err;

  // error: shake
  useEffect(() => {
    if (err)
      gsap.fromTo(wrap.current, { x: 0 },
        { keyframes: { x: [-9, 9, -6, 6, -3, 3, 0] }, duration: 0.5, ease: "power2.out" });
  }, [err]);

  // valid: check draws itself
  useEffect(() => {
    gsap.to(check.current, { strokeDashoffset: valid ? 0 : 1, duration: 0.5, ease: "power2.out" });
  }, [valid]);

  // length progress
  useEffect(() => {
    if (length && bar.current)
      gsap.to(bar.current, { scaleX: val.length / length, duration: 0.35, ease: "power3.out" });
  }, [val, length]);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div data-bx className="group/f">
      <label htmlFor={name} className="eyebrow mb-3 block text-(--text-muted) transition-all duration-300 group-focus-within/f:translate-x-1 group-focus-within/f:text-(--accent-blue-bright)">
        {label}
      </label>
      <div ref={wrap}>
        <div onPointerMove={move} className={`fld ${err ? "err" : ""}`}>
          <span className="fld-light" />
          <input
            id={name}
            name={name}
            type={type}
            maxLength={length}
            placeholder={placeholder}
            value={val}
            aria-invalid={!!err}
            onChange={(e) => {
              setForm((f: any) => ({ ...f, [name]: e.target.value }));
              if (err) setErrors((x: any) => ({ ...x, [name]: undefined }));
            }}
            className="relative z-1 w-full rounded-[11px] border-0 px-4 py-3.5 pr-11 text-sm outline-none transition-[padding] duration-300 focus:pl-5"
          />
          <svg viewBox="0 0 24 24" className="absolute right-3.5 top-1/2 z-3 h-5 w-5 -translate-y-1/2 text-(--status-success) drop-shadow-[0_0_6px_rgba(66,230,170,.7)]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path ref={check} d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
          </svg>
        </div>
      </div>
      {length && (
        <span className="mt-2 block h-px bg-(--border-subtle)">
          <span ref={bar} className="block h-full origin-left scale-x-0 bg-(image:--accent-gradient)" />
        </span>
      )}
      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
    </div>
  );
}