"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlowButton from "../GlobalButton";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "What is AirGrip, and how does it work?",
    answer:
      "AirGrip is a handheld wireless interface that lets you control your computer by moving your hand through the air. Its built-in gyroscope tracks your movements to control the cursor, while physical buttons handle clicking, scrolling, and other essential controls.",
  },
  {
    question: "What is Arceus?",
    answer:
      "Arceus is an AI-powered desktop assistant designed to make interacting with your computer more natural. It combines voice input, AI processing, and desktop interaction to help you perform tasks using natural language instead of relying entirely on manual input.",
  },
  {
    question: "How do AirGrip and Arceus work together?",
    answer:
      "AirGrip is the physical interface, while Arceus provides the intelligence. Use AirGrip to control your cursor, click, and scroll, or press its dedicated push-to-talk button to give voice commands to Arceus. Together, they combine physical control with AI-powered desktop assistance.",
  },
  {
    question: "Can I control my computer using voice commands?",
    answer:
      "Yes. With Arceus running, press and hold AirGrip's dedicated microphone button, speak your command, and release the button when you're done. Arceus processes your request and helps you carry out supported tasks on your computer.",
  },
  {
    question: "Does AirGrip have built-in AI?",
    answer:
      "AirGrip is the hardware interface, while Arceus is the AI software that powers intelligent interactions. Using them together gives you motion-based cursor control and voice-driven AI assistance through a single handheld device.",
  },
  {
    question: "Do I need a desk or mouse pad?",
    answer:
      "No. AirGrip controls the cursor through hand movements in the air, so you don't need a traditional mouse surface. Use it while sitting on a couch, relaxing in bed, standing at a desk, or giving a presentation.",
  },
  {
    question: "How does AirGrip connect to my computer?",
    answer:
      "AirGrip uses a dedicated USB dongle for its wireless connection. Plug the dongle into your computer to connect the device. To use AI and voice features, install and run the Arceus desktop application.",
  },
  {
    question: "Which operating systems are supported?",
    answer:
      "AirGrip and Arceus are designed for desktop and laptop computers running Windows, macOS, and Linux. Feature availability may vary depending on the operating system and the current version of the Arceus application.",
  },
  {
    question: "Does Arceus require an internet connection?",
    answer:
      "Some Arceus features can use local processing, while AI-powered tasks may require an internet connection depending on the model or service being used. Internet availability and feature support depend on your configuration.",
  },
  {
    question: "Can Arceus perform tasks automatically?",
    answer:
      "Arceus is designed to help you interact with your computer through natural-language commands and AI-assisted workflows. The actions it can perform depend on the capabilities implemented in the current version and the applications or system functions it supports.",
  },
  {
    question: "Does AirGrip record audio all the time?",
    answer:
      "No. AirGrip uses a dedicated push-to-talk button for voice input. Hold the button to activate voice capture and release it when you're finished speaking. Audio capture is intended to be controlled by the button rather than running continuously.",
  },
  {
    question: "How long does the battery last?",
    answer:
      "AirGrip uses a rechargeable battery with USB-C charging. Battery life depends on usage, wireless activity, and how frequently you use the microphone and other features. Actual runtime may vary.",
  },
  {
    question: "Can I use AirGrip while charging?",
    answer:
      "AirGrip is designed around USB-C charging. Whether it can be used reliably during charging depends on the current hardware configuration, so check the product documentation for the supported charging behavior.",
  },
  {
    question: "Is AirGrip suitable for presentations?",
    answer:
      "Yes. AirGrip lets you navigate your cursor and scroll without staying beside a desk. Combined with Arceus voice commands, it offers another way to interact with your computer during demonstrations, meetings, and presentations.",
  },
  {
    question: "Can I use AirGrip for gaming?",
    answer:
      "AirGrip is primarily designed for desktop control and productivity. It may work with casual games that support mouse input, but it is not intended as a dedicated competitive gaming mouse.",
  },
  {
    question: "Is there a warranty?",
    answer:
      "Yes. AirGrip comes with a 1-year warranty covering manufacturing defects, subject to the terms and conditions of the warranty policy.",
  },
  {
    question: "What if I receive a damaged or defective product?",
    answer:
      "If your AirGrip arrives damaged or develops a covered manufacturing defect, contact our support team with your order details. We'll guide you through the applicable replacement process under our warranty policy.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are dispatched according to the processing timeline shown at checkout. Delivery usually takes around 5–6 business days across India, depending on your location and courier service.",
  },
  {
    question: "Is Cash on Delivery (COD) available?",
    answer:
      "Cash on Delivery may be available for eligible delivery pin codes. Check the available payment options during checkout to confirm whether COD is supported for your order.",
  },
  {
    question: "What if I'm not satisfied with my purchase?",
    answer:
      "Please refer to the return policy displayed on our website for the applicable return window, eligibility conditions, and refund process. Contact our support team if you need help with a return.",
  },
];

export default function FAQSection() {
  const root = useRef<HTMLElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const first = useRef(true);
  const [open, setOpen] = useState<number | null>(0);

  useIso(() => {
    const ctx = gsap.context(() => {
      const head = { trigger: "[data-head]", start: "top 85%" };
      gsap.from("[data-eline]", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.2,
        ease: "expo.inOut",
        scrollTrigger: head,
      });
      gsap.from("[data-h]", {
        yPercent: 115,
        rotate: 3,
        transformOrigin: "0 100%",
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.14,
        scrollTrigger: head,
      });
      gsap.from("[data-sub]", {
        y: 20,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1,
        delay: 0.4,
        ease: "expo.out",
        scrollTrigger: head,
      });

      gsap.set("[data-item]", { x: 60, opacity: 0, filter: "blur(8px)" });
      ScrollTrigger.batch("[data-item]", {
        start: "top 92%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
            clearProps: "filter",
          }),
      });

      gsap.fromTo(
        "[data-rail]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: "[data-list]",
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );
      gsap.to("[data-glow]", {
        yPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    root.current?.removeAttribute("data-pending");
    return () => ctx.revert();
  }, []);

  // accordion: smooth height to/from auto, answer text rises in
  useEffect(() => {
    panels.current.forEach((p, i) => {
      if (!p) return;
      if (i === open) {
        gsap.to(p, {
          height: "auto",
          duration: 0.7,
          ease: "expo.out",
          overwrite: true,
        });
        if (!first.current)
          gsap.fromTo(
            p.firstElementChild,
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.12, ease: "expo.out" }
          );
      } else {
        gsap.to(p, {
          height: 0,
          duration: 0.5,
          ease: "expo.inOut",
          overwrite: true,
        });
      }
    });
    first.current = false;
  }, [open]);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget,
      r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const mask = "block overflow-hidden pb-[0.08em]";

  return (
    <section
      ref={root}
      data-pending
      id="faq"
      className="relative overflow-hidden border-t border-(--border-subtle) bg-(--bg-primary) py-(--section-space)"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--border-subtle)_1px,transparent_1px)] bg-size-[72px_72px] opacity-[0.14] mask-[radial-gradient(ellipse_at_30%_20%,#000,transparent_70%)]"
      />
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-130 w-130 rounded-full bg-[radial-gradient(circle,rgba(66,191,255,0.12),transparent_65%)]"
      />
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute -right-40 top-3/4 h-130 w-130 rounded-full bg-[radial-gradient(circle,rgba(155,114,255,0.12),transparent_65%)]"
      />

      <div className="container-arceus relative grid gap-14 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        {/* sticky left column */}
        <div data-head className="lg:sticky lg:top-32 lg:self-start">
          <div className="mb-6 flex items-center gap-4">
            <span data-eline className="h-px w-12 bg-(--accent-blue)" />
            <p className="eyebrow text-(--text-muted)">FAQ</p>
          </div>
          <h2 className="text-[clamp(40px,5vw,68px)] font-medium leading-[1.04] tracking-[-0.03em]">
            <span className={mask}>
              <span data-h className="text-fade inline-block">
                Questions?
              </span>
            </span>
            <span className={mask}>
              <span data-h className="text-shimmer inline-block">
                We have answers.
              </span>
            </span>
          </h2>
          <p data-sub className="mt-6 max-w-sm text-(--text-secondary)">
            Can&apos;t find what you need? Reach out and we&apos;ll get back to
            you.
          </p>
          <div data-sub className="mt-8 flex items-center gap-6">
            <GlowButton href="/#contact">Contact us →</GlowButton>
            <span className="eyebrow hidden text-(--text-muted) lg:block">
              {String((open ?? 0) + 1).padStart(2, "0")} /{" "}
              {String(FAQS.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* list */}
        <div data-list className="relative space-y-3 lg:pl-8">
          <span
            data-rail
            aria-hidden
            className="absolute left-0 top-0 hidden h-full w-px bg-(image:--accent-gradient) lg:block"
          />
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                data-item
                onPointerMove={move}
                className={`feat-card ${isOpen ? "faq-open" : ""}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="relative z-10 flex w-full items-center gap-5 px-6 py-5 text-left sm:px-8"
                >
                  <span
                    className={`eyebrow w-7 shrink-0 transition-colors duration-300 ${
                      isOpen ? "text-(--accent-blue)" : "text-(--text-muted)"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex-1 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-300 sm:text-base ${
                      isOpen
                        ? "text-(--text-primary)"
                        : "text-(--text-secondary) hover:text-(--text-primary)"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                      isOpen
                        ? "rotate-135 border-(--accent-blue) text-(--accent-blue-bright) shadow-[0_0_16px_rgba(66,191,255,.5)]"
                        : "border-(--border-subtle) text-(--text-secondary)"
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-${i}`}
                  role="region"
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  style={{ height: i === 0 ? "auto" : 0 }}
                  className="relative z-10 overflow-hidden"
                >
                  <div className="px-6 pb-6 sm:pl-20 sm:pr-8">
                    <p className="max-w-2xl text-sm leading-relaxed text-(--text-secondary) sm:text-[15px]">
                      {faq.answer}
                    </p>
                    <div className="feat-bar mt-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
