import gsap from "gsap";

export function magnetic(els: Element[], s = 0.35) {
  const off: (() => void)[] = [];
  els.forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: Event) => {
      const m = e as MouseEvent;
      const r = el.getBoundingClientRect();
      x((m.clientX - (r.left + r.width / 2)) * s);
      y((m.clientY - (r.top + r.height / 2)) * s);
    };
    const leave = () => { x(0); y(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    off.push(() => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    });
  });
  return () => off.forEach((f) => f());
}