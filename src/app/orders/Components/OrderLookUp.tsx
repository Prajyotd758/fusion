"use client";

import { useState } from "react";

interface OrderLookupProps {
  onFound: (orderDetails: any) => void;
}

interface OrderResponse {
  success: boolean;
  order?: any;
  message?: string;
}

export default function OrderLookup({ onFound }: OrderLookupProps) {
  const [form, setForm] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phoneRegex = /^\d{10}$/;

    if (!form.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    if (!phoneRegex.test(form)) {
      setError(
        "Phone number must be exactly 10 digits and should not contain any letters"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/order-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: form,
        }),
      });

      const data: OrderResponse = await res.json();

      if (data.success && data.order) {
        onFound(data.order);
      } else {
        setError(data.message || "Order not found.");
      }
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1a1814] mb-5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <h1 className="text-3xl font-semibold text-[#1a1814] mb-2">
            Track your order
          </h1>

          <p className="text-sm text-gray-500">
            Enter your registered contact number to continue.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Contact Number
              </label>

              <input
                type="tel"
                placeholder="9999999999"
                maxLength={10}
                value={form}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setForm(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1a1814] focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <span className="text-red-500 text-sm mt-0.5">⚠</span>

                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1a1814] text-white text-sm font-medium rounded-xl hover:bg-[#333] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Searching…</span>
                </>
              ) : (
                "Find My Order →"
              )}
            </button>
          </form>

          {/* <p className="text-center text-xs text-gray-400 mt-5">
            Try Order ID: ORD-1003 · Contact: 9988776655
          </p> */}
        </div>
      </div>
    </div>
  );
}
