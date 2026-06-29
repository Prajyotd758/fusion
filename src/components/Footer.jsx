"use client";
import { useState } from "react";
import Image from "next/image";

const MODAL_CONTENT = {
  contact: {
    title: "Contact Us",
    content: (
      <div className="space-y-4 text-sm text-(--text-secondary)">
        <p>
          We're here to help! Reach out to us through any of the channels below.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-lg">📧</span>
            <div>
              <p className="font-medium text-(--text-primary)">Email</p>
              <p>arceus.in.service@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  email: {
    title: "Email Us",
    content: (
      <div className="text-sm text-(--text-secondary) space-y-3">
        <p>For any queries, complaints, or feedback, drop us an email at:</p>
        <a
          href="mailto:arceus.in.service@gmail.com"
          className="block font-medium text-(--text-primary) text-base"
        >
          arceus.in.service@gmail.com
        </a>
        <p>We typically respond within 24 business hours.</p>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    content: (
      <div className="text-sm text-(--text-secondary) space-y-3 leading-relaxed">
        <p>
          We respect your privacy and are committed to protecting your personal
          information.
        </p>
        <p>
          <strong className="text-(--text-primary)">Data Collection:</strong> We
          collect only the information necessary to process your order — name,
          email, phone, and delivery address.
        </p>
        <p>
          <strong className="text-(--text-primary)">Data Use:</strong> Your data
          is used solely for order processing, delivery, and customer support.
          We never sell your information to third parties.
        </p>
        <p>
          <strong className="text-(--text-primary)">Cookies:</strong> We use
          minimal cookies for analytics and to improve your experience.
        </p>
        <p>
          <strong className="text-(--text-primary)">Security:</strong> All
          transactions are secured with SSL encryption.
        </p>
        {/* <p>Last updated: January 2025</p> */}
      </div>
    ),
  },
  terms: {
    title: "Terms & Conditions",
    content: (
      <div className="text-sm text-(--text-secondary) space-y-3 leading-relaxed">
        <p>By placing an order, you agree to the following terms:</p>
        <p>
          <strong className="text-(--text-primary)">Pricing:</strong> All prices
          are in Indian Rupees (INR) and inclusive of applicable taxes.
        </p>
        <p>
          <strong className="text-(--text-primary)">Order Accuracy:</strong>{" "}
          Please ensure all order details are correct before submission.
        </p>
        <p>
          <strong className="text-(--text-primary)">
            Intellectual Property:
          </strong>{" "}
          All content on this site is the property of our brand.
        </p>
        {/* <p>
          <strong className="text-(--text-primary)">Disputes:</strong> Any
          disputes shall be subject to the jurisdiction of Mumbai courts.
        </p> */}
      </div>
    ),
  },
  refund: {
    title: "Refund Policy",
    content: (
      <div className="text-sm text-(--text-secondary) space-y-3 leading-relaxed">
        <p>Your satisfaction is our priority. Here's our refund policy:</p>
        <p>
          <strong className="text-(--text-primary)">5-Day Guarantee:</strong>{" "}
          If you're not satisfied, contact us within 5 days of delivery for a
          full refund.
        </p>
        <p>
          <strong className="text-(--text-primary)">Process:</strong> Email us
          at refunds@yourbrand.com with your order ID. We'll initiate the refund
          within 3–5 business days.
        </p>
        <p>
          <strong className="text-(--text-primary)">Condition:</strong> Products
          must be returned in their original packaging. Return shipping is free
          for defective items.
        </p>
        <p>
          <strong className="text-(--text-primary)">Refund Method:</strong>{" "}
          Refunds are credited to the original payment method or via bank
          transfer for COD orders.
        </p>
      </div>
    ),
  },
  shipping: {
    title: "Shipping Policy",
    content: (
      <div className="text-sm text-(--text-secondary) space-y-3 leading-relaxed">
        <p>
          <strong className="text-(--text-primary)">Free Shipping:</strong> All
          orders across India ship for free — no minimum order value.
        </p>
        <p>
          <strong className="text-(--text-primary)">Dispatch Time:</strong>{" "}
          Orders are dispatched within 24 hours of confirmation (Mon–Sat).
        </p>
        <p>
          <strong className="text-(--text-primary)">Delivery Time:</strong> 4–5
          business days for metros; 5–7 days for tier-2 and tier-3 cities.
        </p>
        <p>
          <strong className="text-(--text-primary)">Delayed Orders:</strong> In
          rare cases of delays, contact us and we'll resolve it promptly.
        </p>
      </div>
    ),
  },
};

const LINKS = [
  { key: "contact", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "terms", label: "Terms" },
  { key: "refund", label: "Refund Policy" },
  { key: "shipping", label: "Shipping Policy" },
];

export default function Footer() {
  const [modal, setModal] = useState(null);
  const active = modal ? MODAL_CONTENT[modal] : null;

  return (
    <>
      <footer className="py-12 px-6 border-t border-(--border) bg-(--bg)">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              arceus
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {LINKS.map((link) => (
                <button
                  key={link.key}
                  onClick={() => setModal(link.key)}
                  className="text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <p className="text-xs text-(--text-muted)">
              © {new Date().getFullYear()} Brand. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {active && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-7 py-5 border-b border-(--border)">
              <h3 className="  text-xl text-(--text-primary)">
                {active.title}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="w-8 h-8 rounded-full bg-(--badge-bg) flex items-center justify-center hover:bg-(--border) transition-colors"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-7 py-6 max-h-[60vh] overflow-y-auto">
              {active.content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
