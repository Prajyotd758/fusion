"use client";
import { useState } from "react";

// const FAQS = [
//   {
//     q: "How long does shipping take?",
//     a: "We dispatch all orders within 24 hours. Delivery typically takes 5–6 business days depending on your location across India.",
//   },
//   {
//     q: "Is Cash on Delivery available?",
//     a: 'Yes! COD is available across most pin codes in India. Simply select "Cash on Delivery" at checkout.',
//   },
//   {
//     q: "What if I'm not satisfied with the product?",
//     a: "We offer a 5-day no-questions-asked return policy. If you're not happy, reach out to us and we'll arrange a full refund.",
//   },
//   {
//     q: "Are the ingredients safe?",
//     a: "Absolutely. All ingredients are 100% natural, clinically tested, and third-party verified for safety and purity. No harmful chemicals.",
//   },
//   {
//     q: "How do I track my order?",
//     a: "Once your order ships, you'll receive a tracking link via email and SMS. You can check your delivery status anytime.",
//   },
//   {
//     q: "Can I order multiple units?",
//     a: "Yes! You can update the quantity during checkout. Bulk orders may also qualify for additional discounts — reach out to us.",
//   },
// ];

const FAQS = [
  {
    question: "How does AirGrip work?",
    answer:
      "AirGrip uses a built-in gyroscope to track hand movement and control the cursor in the air. You can also switch to joystick mode for more controlled and precise navigation.",
  },
  {
    question: "Do I need a desk or mouse pad?",
    answer:
      "No. AirGrip is designed to work completely without a flat surface. You can use it while sitting on a couch, lying in bed, standing, or presenting.",
  },
  {
    question: "How does it connect to my computer?",
    answer:
      "AirGrip connects wirelessly using Bluetooth, so there’s no USB dongle required.",
  },
  {
    question: "Which devices are supported?",
    answer:
      "AirGrip supports Windows, macOS, and Linux systems with Bluetooth connectivity.",
  },
  {
    question: "How long does the battery last?",
    answer:
      "The rechargeable battery can last up to 2 days on continuous usage depending on usage patterns.",
  },
  {
    question: "Can I use it while charging?",
    answer: "Yes. AirGrip supports use while charging through its USB-C port.",
  },
  {
    question: "What is joystick mode?",
    answer:
      "Joystick mode allows you to control the cursor using the built-in joystick instead of motion tracking, offering more precise and controller-style navigation.",
  },
  {
    question: "Is AirGrip good for presentations?",
    answer:
      "Yes. AirGrip is designed for presentations, classrooms, and meetings where you want to control slides and the cursor while moving freely around the room.",
  },
  {
    question: "Can gamers use AirGrip?",
    answer:
      "AirGrip includes a joystick precision mode inspired by controller-style navigation, which some users may prefer for casual gaming and media control.",
  },
  {
    question: "Is this a prototype or a finished product?",
    answer:
      "Fusion AirGrip is currently being developed as a startup product focused on redefining how people interact with their computers.",
  },
  {
    question: "Is there any warranty for this product?",
    answer: "Yes! 1 year warranty.",
  },
  {
    question: "What if I receive a damaged or non-working product?",
    answer:
      "Every AirGrip device comes with a 1-year warranty. If your product arrives damaged or is not functioning properly, you can request a replacement unit at no additional cost. We’ll handle all replacement and shipping expenses.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "We dispatch all orders within 24 hours. Delivery typically takes 5–6 business days depending on your location across India.",
  },
  {
    question: "Is Cash on Delivery available?",
    answer:
      'Yes! COD is available across most pin codes in India. Simply select "Cash on Delivery" at checkout.',
  },
  {
    question: "What if I'm not satisfied with the product?",
    answer:
      "We offer a 5-day no-questions-asked return policy. If you're not happy, reach out to us and we'll arrange a full refund.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-24 px-6 bg-(--bg) border-t border-(--border)">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium tracking-widest text-(--text-muted) uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl text-(--text-primary) mb-4">
            Questions?
            <br />
            We have answers.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden
                ${
                  open === i
                    ? "border(--text-primary) bg-white shadow-md shadow-black/5"
                    : "border-(--border) bg-white hover:border-(--text-secondary)"
                }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-medium text-(--text-primary) text-sm pr-4">
                  {faq.question}
                </span>
                <span
                  className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200
                  ${
                    open === i
                      ? "bg-(--text-primary) border-(--text-primary) rotate-45"
                      : "border-(--border)"
                  }`}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={open === i ? "white" : "currentColor"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  open === i ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-5 text-sm text-(--text-secondary) leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
