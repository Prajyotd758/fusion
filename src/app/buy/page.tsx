"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { RecaptchaVerifier } from "firebase/auth";
import { purchase } from "../../lib/metapixel";
import { magnetic } from "../../lib/magnetic";
import GlowButton from "../../components/GlobalButton";
import Loader from "../../components/reusable/Loader";
import Field from "@/src/components/reusable/Field";
import ErrorModal from "@/src/components/reusable/ErrorModal";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ---- edit product data here ----
const PRODUCT = {
  name: "AirGrip",
  image: "/airgrip-front.png",
  blurb:
    "Handheld air mouse with a push-to-talk button for Arceus voice control.",
  price: 1499,
  qty: 1,
  perks: [
    "Gyroscope cursor control, no mouse pad needed",
    "Push-to-talk microphone button",
    "Dedicated USB dongle, USB-C rechargeable",
  ],
};
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payment: string;
};
type Errors = Partial<Record<keyof FormData, string>>;
export type errorType = { visible: boolean; title: string; message: string };

const validStates = [
  "andhra pradesh",
  "arunachal pradesh",
  "assam",
  "bihar",
  "chhattisgarh",
  "goa",
  "gujarat",
  "haryana",
  "himachal pradesh",
  "jharkhand",
  "karnataka",
  "kerala",
  "madhya pradesh",
  "maharashtra",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "punjab",
  "rajasthan",
  "sikkim",
  "tamil nadu",
  "telangana",
  "tripura",
  "uttar pradesh",
  "uttarakhand",
  "west bengal",
  "delhi",
];

export default function BuyPage() {
  const root = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "cod",
  });
  const [error, setError] = useState<errorType>({
    visible: false,
    title: "",
    message: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone))
      e.phone =
        "Phone number must be exactly 10 digits and should not contain any letters";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    else if (!/^[a-zA-Z\s]+$/.test(form.city))
      e.city = "Please enter a valid city";
    if (!form.state.trim()) e.state = "State is required";
    else if (!validStates.includes(form.state.trim().toLowerCase()))
      e.state = "Please enter a valid Indian state";
    if (!form.pincode.trim()) e.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode))
      e.pincode = "Pincode must be exactly 6 digits";
    return e;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setOtpSent(true);
  };

  const saveUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: "in_process",
          quantity: PRODUCT.qty,
          amount: String(PRODUCT.price),
          product: PRODUCT.name,
          reviewAdded: false,
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else
        setError({
          visible: true,
          title: "Something went wrong",
          message: "Please try again later",
        });
    } catch {
      setError({
        visible: true,
        title: "Something went wrong",
        message: "Try again after some time!",
      });
    } finally {
      setLoading(false);
    }
  };

  // page animations (form view / success view)
  const view = submitted ? "done" : "form";
  useIso(() => {
    let off = () => {};
    const ctx = gsap.context(() => {
      if (view === "form") {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(
            "[data-bx-line]",
            {
              scaleX: 0,
              transformOrigin: "left",
              duration: 1.5,
              ease: "expo.inOut",
            },
            0
          )
          .from(
            "[data-bx-top]",
            {
              y: -20,
              opacity: 0,
              filter: "blur(8px)",
              stagger: 0.1,
              duration: 1,
            },
            0.2
          )
          .from(
            "[data-eline]",
            {
              scaleX: 0,
              transformOrigin: "left",
              duration: 1.1,
              ease: "expo.inOut",
            },
            0.4
          )
          .from(
            "[data-h]",
            {
              yPercent: 115,
              rotate: 3,
              transformOrigin: "0 100%",
              duration: 1.3,
              stagger: 0.12,
            },
            0.5
          )
          .from(
            "[data-sub]",
            { y: 16, opacity: 0, filter: "blur(8px)", duration: 1 },
            0.9
          )
          .from(
            "[data-bx]",
            {
              y: 36,
              opacity: 0,
              filter: "blur(8px)",
              stagger: 0.07,
              duration: 1,
            },
            1
          )
          .from(
            "[data-sum]",
            {
              clipPath: "inset(0 50% 0 50% round 24px)",
              opacity: 0,
              duration: 1.5,
              ease: "expo.inOut",
            },
            0.7
          )
          .from(
            "[data-sum-i]",
            {
              x: 24,
              opacity: 0,
              filter: "blur(6px)",
              stagger: 0.09,
              duration: 1,
            },
            1.4
          );
        if (window.matchMedia("(hover:hover) and (pointer:fine)").matches)
          off = magnetic(gsap.utils.toArray("[data-magnetic]"), 0.25);
      } else {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(
            "[data-ring]",
            { scale: 0.2, opacity: 0, duration: 1.6, stagger: 0.15 },
            0
          )
          .fromTo(
            "[data-circle]",
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
            0.2
          )
          .fromTo(
            "[data-tick]",
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" },
            1
          )
          .from(
            "[data-done-h]",
            {
              yPercent: 115,
              rotate: 3,
              transformOrigin: "0 100%",
              duration: 1.3,
              stagger: 0.12,
            },
            0.9
          )
          .from(
            "[data-done-p]",
            {
              y: 20,
              opacity: 0,
              filter: "blur(8px)",
              stagger: 0.1,
              duration: 1,
            },
            1.3
          );
        gsap.to("[data-ring]", {
          scale: 1.12,
          opacity: 0.5,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: 0.4,
          delay: 2,
        });
      }
    }, root);
    root.current?.removeAttribute("data-pending");
    return () => {
      off();
      ctx.revert();
    };
  }, [view]);

  // confirm modal animation
  useIso(() => {
    if (!otpSent) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          "[data-cf-bg]",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          0
        )
        .fromTo(
          "[data-cf-card]",
          {
            clipPath: "inset(50% 50% 50% 50% round 24px)",
            y: 50,
            scale: 0.92,
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "expo.inOut",
          },
          0
        )
        .from(
          "[data-cf-i]",
          {
            y: 22,
            opacity: 0,
            filter: "blur(8px)",
            stagger: 0.09,
            duration: 1,
          },
          0.7
        );
    }, root);
    return () => ctx.revert();
  }, [otpSent]);

  useEffect(() => {
    if (!otpSent) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOtpSent(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [otpSent]);

  const mask = "block overflow-hidden pb-[0.08em]";
  const rows = [
    {
      l: "Name",
      v: form.name,
      d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
    },
    {
      l: "Contact",
      v: `+91 ${form.phone}`,
      d: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
    },
    {
      l: "Delivery Address",
      v: form.address,
      d: "M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    },
  ];

  return (
    <div
      ref={root}
      data-pending
      className="relative min-h-screen overflow-hidden bg-(--bg-primary)"
    >
      <div id="recaptcha-container" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--border-subtle)_1px,transparent_1px)] bg-size-[72px_72px] opacity-[0.12] mask-[radial-gradient(ellipse_at_50%_10%,#000,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 h-130 w-130 rounded-full bg-[radial-gradient(circle,rgba(66,191,255,0.11),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-2/3 h-130 w-130 rounded-full bg-[radial-gradient(circle,rgba(155,114,255,0.11),transparent_65%)]"
      />

      {submitted ? (
        <div className="container-arceus relative grid min-h-screen place-items-center py-20 text-center">
          <div className="max-w-md">
            <div className="relative mx-auto mb-10 grid h-28 w-28 place-items-center">
              <span
                data-ring
                className="absolute inset-0 rounded-full border border-(--accent-blue)/30"
              />
              <span
                data-ring
                className="absolute -inset-5 rounded-full border border-(--accent-violet)/25"
              />
              <svg
                viewBox="0 0 48 48"
                className="relative h-20 w-20 text-(--status-success) drop-shadow-[0_0_14px_rgba(66,230,170,.6)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  data-circle
                  cx="24"
                  cy="24"
                  r="20"
                  pathLength={1}
                  strokeDasharray={1}
                />
                <path
                  data-tick
                  d="M14 25l7 7 13-14"
                  pathLength={1}
                  strokeDasharray={1}
                />
              </svg>
            </div>
            <h1 className="text-[clamp(36px,5vw,56px)] font-medium leading-[1.05] tracking-[-0.03em]">
              <span className={mask}>
                <span data-done-h className="text-shimmer inline-block">
                  Order Placed!
                </span>
              </span>
            </h1>
            <p data-done-p className="mt-5 text-(--text-secondary)">
              Thank you, {form.name}. Your order is confirmed.
            </p>
            <div data-done-p className="mt-10 inline-block">
              <GlowButton href="/">Back to Home</GlowButton>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* <header className="relative">
            <div className="container-arceus flex h-24 items-center justify-between">
              <Link href="/" data-bx-top className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Arceus logo"
                  width={44}
                  height={44}
                  priority
                />
                <span className="text-[26px] tracking-[-0.02em]">arceus</span>
              </Link>
              <span
                data-bx-top
                className="eyebrow flex items-center gap-3 rounded-full border border-(--border-subtle) bg-(--bg-glass) px-5 py-2.5 text-(--text-secondary)"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--status-success) opacity-70" />
                  <span className="relative h-2 w-2 rounded-full bg-(--status-success)" />
                </span>
                Secure Checkout
              </span>
            </div>
            <span
              data-bx-line
              className="absolute inset-x-0 bottom-0 h-px bg-(--border-subtle)"
            />
          </header> */}

          <div className="container-arceus relative grid gap-14 py-16 lg:grid-cols-5 lg:gap-16">
            {/* form */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center gap-4">
                <span data-eline className="h-px w-12 bg-(--accent-blue)" />
                <p className="eyebrow text-(--text-muted)">Checkout</p>
              </div>
              <h1 className="text-[clamp(36px,4.6vw,60px)] font-medium leading-[1.04] tracking-[-0.03em]">
                <span className={mask}>
                  <span data-h className="text-fade inline-block">
                    Complete
                  </span>
                </span>
                <span className={mask}>
                  <span data-h className="text-shimmer inline-block">
                    your order
                  </span>
                </span>
              </h1>
              <p
                data-sub
                className="mb-10 mt-5 text-sm text-(--text-secondary)"
              >
                Fill in your details to place the order.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Full Name"
                    name="name"
                    placeholder="John doe"
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="john@email.com"
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                  />
                </div>
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  length={10}
                  placeholder="9876543210"
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  setErrors={setErrors}
                />
                <Field
                  label="Delivery Address"
                  name="address"
                  placeholder="Flat / House no, Street, Area"
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  setErrors={setErrors}
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Field
                    label="City"
                    name="city"
                    placeholder="Mumbai"
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                  />
                  <Field
                    label="State"
                    name="state"
                    placeholder="Maharashtra"
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                  />
                  <Field
                    label="Pincode"
                    name="pincode"
                    placeholder="400001"
                    length={6}
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                  />
                </div>

                <div data-bx>
                  <p className="eyebrow mb-3 text-(--text-muted)">
                    Payment Method
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      aria-pressed
                      className="relative flex items-center gap-4 rounded-xl border border-(--border-highlight) bg-(--bg-elevated) p-4 text-left shadow-[0_0_30px_rgba(66,191,255,0.12)]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-(--accent-blue-bright)"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                      </svg>
                      <span className="text-sm font-medium">
                        Cash on Delivery
                      </span>
                      <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-(--accent-blue) shadow-[0_0_8px_var(--accent-blue)]" />
                    </button>
                  </div>
                </div>

                <div data-bx data-magnetic className="inline-block pt-2">
                  <GlowButton
                    type="submit"
                    onClick={() => purchase(PRODUCT.price)}
                  >
                    Continue →
                  </GlowButton>
                </div>
              </form>
            </div>

            {/* summary */}
            <div className="lg:col-span-2">
              <div data-sum className="cmp-wrap sticky top-8">
                <div className="cmp-inner p-6 sm:p-8">
                  <div
                    data-sum-i
                    className="mb-6 flex items-center justify-between"
                  >
                    <h2 className="eyebrow text-(--text-secondary)">
                      Order Summary
                    </h2>
                    <span className="eyebrow text-(--text-muted)">
                      Qty {PRODUCT.qty}
                    </span>
                  </div>
                  <div
                    data-sum-i
                    className="flex gap-5 border-b border-(--border-subtle) pb-6"
                  >
                    <div>
                      <p className="text-lg font-medium tracking-[-0.01em]">
                        {PRODUCT.name}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-(--text-secondary)">
                        {PRODUCT.blurb}
                      </p>
                    </div>
                  </div>
                  <ul
                    data-sum-i
                    className="space-y-2.5 border-b border-(--border-subtle) py-6"
                  >
                    {PRODUCT.perks.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-3 text-sm text-(--text-secondary)"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="mt-0.5 h-4 w-4 shrink-0 text-(--status-success)"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div
                    data-sum-i
                    className="space-y-3 border-b border-(--border-subtle) py-6 text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="text-(--text-secondary)">Price</span>
                      <span>{inr(PRODUCT.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-(--text-secondary)">Shipping</span>
                      <span className="font-medium text-(--status-success)">
                        Free
                      </span>
                    </div>
                  </div>
                  <div
                    data-sum-i
                    className="flex items-center justify-between pt-6"
                  >
                    <span className="font-medium">Total</span>
                    <span className="text-3xl font-medium tracking-[-0.03em] text-fade">
                      {inr(PRODUCT.price * PRODUCT.qty)}
                    </span>
                  </div>
                  <p
                    data-sum-i
                    className="eyebrow mt-6 flex items-center justify-center gap-2 rounded-xl border border-(--border-subtle) bg-(--bg-glass) p-3 text-(--text-muted)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6zM9 12l2 2 4-4" />
                    </svg>
                    Safe &amp; secure checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* confirm modal */}
      {otpSent && !submitted && (
        <div
          className="fixed inset-0 z-50 grid place-items-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cf-title"
        >
          <div
            data-cf-bg
            onClick={() => setOtpSent(false)}
            className="absolute inset-0 bg-[rgba(3,5,8,0.75)] backdrop-blur-md"
          />
          <div data-cf-card className="cmp-wrap relative w-full max-w-md">
            <div className="cmp-inner p-7 sm:p-8">
              <button
                onClick={() => setOtpSent(false)}
                aria-label="Close"
                className="group absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-(--border-subtle) bg-(--bg-glass) hover:border-(--border-highlight)"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="transition-transform duration-500 group-hover:rotate-90"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <p data-cf-i className="eyebrow mb-3 text-(--accent-blue-bright)">
                Final step
              </p>
              <h2
                id="cf-title"
                data-cf-i
                className="text-fade text-[28px] font-medium tracking-[-0.02em]"
              >
                Confirm your order
              </h2>
              <p
                data-cf-i
                className="mb-6 mt-2 text-sm leading-relaxed text-(--text-secondary)"
              >
                Please review your details before placing the order. These
                details will be shared with the delivery partner.
              </p>
              <div className="mb-6 divide-y divide-(--border-subtle) rounded-2xl border border-(--border-subtle) bg-(--bg-primary)">
                {rows.map((r) => (
                  <div
                    key={r.l}
                    data-cf-i
                    className="flex items-center gap-4 px-4 py-3.5"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 shrink-0 text-(--accent-blue-bright)"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={r.d} />
                    </svg>
                    <div className="min-w-0">
                      <p className="eyebrow text-(--text-muted)">{r.l}</p>
                      <p className="mt-1 wrap-break-word text-sm font-medium">
                        {r.v}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div data-cf-i className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="flex-1 rounded-full border border-(--border-subtle) py-4 text-sm text-(--text-secondary) transition-colors hover:border-(--border-highlight) hover:text-(--text-primary)"
                >
                  Edit details
                </button>
                <GlowButton onClick={saveUser} className="flex-1">
                  Confirm &amp; Place order →
                </GlowButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && <Loader />}
      <ErrorModal
        open={error.visible}
        onClose={() => setError({ visible: false, title: "", message: "" })}
        title={error.title}
        message={error.message}
      />
    </div>
  );
}
