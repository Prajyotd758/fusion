"use client";
import Link from "next/link";
import { useRef, type ReactNode, type PointerEvent } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
};

export default function GlowButton({
  children,
  href,
  icon,
  onClick,
  disabled,
  type = "button",
  className = "",
}: Props) {
  const ref = useRef<any>(null);

  const move = (e: PointerEvent) => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const inner = (
    <>
      <span className="glow-layer" aria-hidden />
      <span className="glow-rim" aria-hidden />
      <span className="relative z-10 flex items-center gap-3">
        {icon}
        {children}
      </span>
    </>
  );
  const cls = `glow-btn ${className}`;

  return href ? (
    <Link
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={move}
      className={cls}
    >
      {inner}
    </Link>
  ) : (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onPointerMove={move}
      className={cls}
    >
      {inner}
    </button>
  );
}
