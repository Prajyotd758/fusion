"use client";
import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "How does AirGrip work?",
    answer:
      "AirGrip uses a built-in gyroscope to detect your hand movements and move the cursor naturally in the air, giving you complete control without needing a desk.",
  },
  {
    question: "Do I need a desk or mouse pad?",
    answer:
      "No. AirGrip works completely in the air. You can comfortably use it while sitting on a couch, lying in bed, standing, traveling, or giving presentations.",
  },
  {
    question: "How does it connect to my device?",
    answer:
      "AirGrip connects wirelessly using a plug-and-play USB dongle. Simply plug it into your device and it's ready to use instantly—no pairing or additional software required.",
  },
  {
    question: "Which devices are supported?",
    answer:
      "AirGrip works with Windows, macOS, Linux, Android, iPhone (iOS), iPad, and most tablets with a USB or USB-C port.",
  },
  {
    question: "Can I use AirGrip with my Android phone or iPhone?",
    answer:
      "Yes. AirGrip works with compatible Android phones and iPhones that support external mouse input via a USB or USB-C dongle connection.",
  },
  {
    question: "Does AirGrip work with tablets and iPads?",
    answer:
      "Yes. AirGrip is compatible with Android tablets and iPads, making it ideal for browsing, presentations, media control, and productivity on the go.",
  },
  {
    question: "How long does the battery last?",
    answer:
      "The rechargeable battery lasts up to 2 days of continuous use, depending on usage patterns.",
  },
  {
    question: "Can I use it while charging?",
    answer:
      "Yes. You can continue using AirGrip while it's charging through the USB-C port.",
  },
  {
    question: "Is AirGrip good for presentations?",
    answer:
      "Absolutely. AirGrip lets you control your cursor and slides while moving freely around the room, making it perfect for presentations, classrooms, meetings, and conferences.",
  },
  {
    question: "Can I use AirGrip for gaming?",
    answer:
      "AirGrip is suitable for casual games that support mouse input. It is not recommended for competitive or fast-paced gaming where ultra-low latency is essential.",
  },
  {
    question: "Is there a warranty?",
    answer:
      "Yes. Every AirGrip comes with a 1-year warranty covering manufacturing defects.",
  },
  {
    question: "What if I receive a damaged or defective product?",
    answer:
      "If your AirGrip arrives damaged or isn't working properly, we'll replace it at no additional cost. All replacement shipping charges are covered by us.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are dispatched within 24 hours. Delivery usually takes 5–6 business days across India, depending on your location.",
  },
  {
    question: "Is Cash on Delivery (COD) available?",
    answer:
      'Yes. Cash on Delivery is available for most serviceable pin codes across India. Simply select "Cash on Delivery" during checkout.',
  },
  {
    question: "What if I'm not satisfied with my purchase?",
    answer:
      "We offer a 5-day no-questions-asked return policy. If you're not completely satisfied, contact us and we'll arrange a full refund.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

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