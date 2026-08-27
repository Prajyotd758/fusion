"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  bg: string;
  label: string;
  path: string;
}

const SLIDES: Slide[] = [
  { bg: "#e4e8dd", label: "Slide 1", path: "/airgrip-left.png" },
  { bg: "#dde8e4", label: "Slide 2", path: "/airgrip-front.png" },
  { bg: "#e8dde4", label: "Slide 3", path: "/airgrip-right.png" },
];

export default function Arceus() {
  const [active, setActive] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  const [interested, setInterested] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const goTo = (idx: number) => {
    if (idx === active || animating) return;
    setAnimating(true);
    setActive(idx);
    setTimeout(() => setAnimating(false), 500);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const handleInterested = () => {
    setShowForm(true);
    setError("");
  };

  const handleSave = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/interested", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setInterested(true);
      setShowForm(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="pt-20 pb-24 px-6 overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 animate-fade-up">
          <span className="inline-block px-6 py-4 mb-5 rounded-full text-xs font-medium tracking-widest uppercase bg-(--text-primary) text-white">
            Coming Soon
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl text-(--text-primary) leading-[1.1] mb-5">
            The Future of Computer Interaction Fits in Your Hand
          </h1>
          <p className="text-3xl sm:text-2xl md:text-4xl text-(--text-primary) leading-[1.1] mb-5">
            Your Computer Just Got a New Interface
          </p>
          <p className="text-(--text-secondary) text-lg max-w-xl mx-auto leading-relaxed">
            AirGrip gives you precise control in your hand, while Arceus lets
            you interact with your computer through natural voice and AI.
            <br />
            Be the first to know when it launches.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-400">
          <button
            onClick={handleInterested}
            disabled={interested}
            className="px-8 py-4 bg-(--text-primary) text-white font-medium rounded-xl hover:bg-(--accent-hover) transition-all duration-200 hover:shadow-xl hover:shadow-black/15 hover:-translate-y-0.5 text-sm disabled:opacity-60"
          >
            {interested ? "Thanks — we'll notify you ✓" : "I'm Interested →"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-(--text-muted) hover:text-(--text-primary)"
            >
              ✕
            </button>
            <h3 className="text-xl font-medium text-(--text-primary) mb-2">
              Stay in the loop
            </h3>
            <p className="text-sm text-(--text-secondary) mb-5">
              Enter your email and we'll notify you when it launches.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-(--border) text-sm mb-2 outline-none focus:border-(--text-primary)"
            />
            {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
            <button
              onClick={handleSave}
              disabled={submitting}
              className="w-full mt-2 px-6 py-3 bg-(--text-primary) text-white font-medium rounded-xl hover:bg-(--accent-hover) transition-all duration-200 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
