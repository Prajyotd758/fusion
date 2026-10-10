"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
//
import { getStatusMeta } from "../../../lib/mockApi";
import FileUploadZone from "./FileUploadZone";
import { errorType } from "../../buy/page";
import Loader from "@/src/components/reusable/Loader";
import ErrorModal from "@/src/components/reusable/ErrorModal";

/* ───────── constants ───────── */

const ISSUE_REASONS: string[] = [
  "Damaged Product",
  "Product Not Working",
  "Missing Item",
  "Wrong Item Delivered",
  "Quality Not as Expected",
];

const RETURN_WINDOW_DAYS = 5;
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const VIDEO_MAX_SIZE = 15 * 1024 * 1024;
const RATING_LABELS = ["", "Terrible", "Poor", "Average", "Good", "Excellent"];

// Arceus tokens, scoped here so the page never depends on global setup.
const TOKENS = {
  "--bg-primary": "#07090D",
  "--bg-secondary": "#0B0F15",
  "--bg-elevated": "#101722",
  "--text-primary": "#F4F6FA",
  "--text-secondary": "#A0A9B8",
  "--text-muted": "#687487",
  "--accent-blue": "#42BFFF",
  "--border-subtle": "rgba(180,205,235,0.14)",
  "--border-highlight": "rgba(66,191,255,0.45)",
} as React.CSSProperties;

const STATUS_COLORS: Record<string, string> = {
  in_process: "text-amber-300 border-amber-400/30 bg-amber-400/10",
  delivered: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  return_complete: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  replacement_complete:
    "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  return_initiated: "text-sky-300 border-sky-400/30 bg-sky-400/10",
  replacement_initiated:
    "text-violet-300 border-violet-400/30 bg-violet-400/10",
  cancelled: "text-red-300 border-red-400/30 bg-red-400/10",
};

const CARD =
  "bg-(--bg-elevated) border border-(color:--border-subtle) rounded-2xl";
const INPUT =
  "w-full rounded-lg border border-(color:--border-subtle) bg-(--bg-secondary) px-4 py-3 text-sm text-(color:--text-primary) outline-none transition-colors placeholder:text-(color:--text-muted) focus:border-(color:--border-highlight) focus:ring-2 focus:ring-[#42BFFF]/15 [color-scheme:dark]";
const LABEL =
  "mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-(color:--text-secondary)";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ───────── types ───────── */

type ActionType = "return" | "replacement" | "review" | null;

export interface Order {
  _id: string;
  name: string;
  email: string;
  product: string;
  amount: string;
  payment: string;
  address: string;
  status: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  quantity: number;
  createdAt: string;
  reviewAdded: boolean;
}

interface OrderDetailProps {
  order: Order;
  setOrder: Dispatch<SetStateAction<Order | null>>;
  onReset: () => void;
}

/* ───────── helpers ───────── */

function isOlderThanWindow(date: string): boolean {
  const diffDays = (Date.now() - new Date(date).getTime()) / 86400000;
  return diffDays >= RETURN_WINDOW_DAYS + 1;
}

async function uploadToCloudinary(
  file: File,
  kind: "image" | "video"
): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", "arceus");
  fd.append("folder", `arceus_user_shared_${kind}s`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dgojbbk4m/${kind}/upload`,
    { method: "POST", body: fd }
  );
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Upload failed");
  }
  return data.secure_url;
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = (hovered || value) >= n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(n)}
            onBlur={() => setHovered(0)}
            onClick={(e) => {
              onChange(n);
              gsap.fromTo(
                e.currentTarget,
                { scale: 0.8 },
                { scale: 1, duration: 0.45, ease: "power3.out" }
              );
            }}
            className="rounded-md p-0.5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#42BFFF]/50"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill={on ? "#68D0FF" : "none"}
              stroke={on ? "#68D0FF" : "#687487"}
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="transition-all duration-200"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

/* ───────── component ───────── */

export default function OrderDetail({
  order,
  setOrder,
  onReset,
}: OrderDetailProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [action, setAction] = useState<ActionType>(null);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setErrorModal] = useState<errorType>({
    visible: false,
    title: "",
    message: "",
  });

  const meta = getStatusMeta(order.status);

  const resetForm = () => {
    setAction(null);
    setReason("");
    setComment("");
    setImages([]);
    setVideos([]);
    setRating(0);
  };

  const showError = (title: string, message = "") =>
    setErrorModal({ visible: true, title, message });

  /* intro + success animations */
  useIso(() => {
    const ctx = gsap.context(() => {
      if (submitted) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-ring]", { scale: 0.6, opacity: 0, duration: 0.8 })
          .fromTo(
            "[data-check]",
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" },
            "-=0.4"
          )
          .from(
            "[data-success]",
            { y: 18, opacity: 0, duration: 0.6, stagger: 0.1 },
            "-=0.4"
          );
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-nav]", { y: -16, opacity: 0, duration: 0.6 })
        .from("[data-card]", { y: 28, opacity: 0, duration: 0.8 }, "-=0.3")
        .from(
          "[data-info]",
          { y: 12, opacity: 0, duration: 0.5, stagger: 0.05 },
          "-=0.5"
        )
        .from(
          "[data-action]",
          { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 },
          "-=0.4"
        );
    }, rootRef);
    return () => ctx.revert();
  }, [submitted]);

  /* ambient glow drift */
  useIso(() => {
    const ctx = gsap.context(() => {
      gsap.to("[data-glow]", {
        xPercent: 10,
        yPercent: -8,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* form panel entrance when an action is picked */
  useIso(() => {
    if (!action) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-panel]", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.from("[data-field]", {
        y: 14,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        delay: 0.15,
        ease: "power3.out",
        clearProps: "all",
      });
    }, rootRef);
    return () => ctx.revert();
  }, [action]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loader || !action) return;

    if (action === "review" && rating === 0) {
      return showError("Please select a rating.");
    }
    if (
      (action === "return" || action === "replacement") &&
      (!reason || !comment.trim())
    ) {
      return showError("Please fill all the necessary fields.");
    }
    if (images.some((f) => f.size > IMAGE_MAX_SIZE)) {
      return showError("File too large", "Image size must be under 5 MB");
    }
    if (videos.some((f) => f.size > VIDEO_MAX_SIZE)) {
      return showError("File too large", "Video size must be under 15 MB");
    }

    setLoader(true);
    try {
      const uploadedUrls = images.length
        ? await Promise.all(images.map((f) => uploadToCloudinary(f, "image")))
        : null;
      const uploadedVideoUrl =
        action !== "review" && videos.length
          ? await Promise.all(videos.map((f) => uploadToCloudinary(f, "video")))
          : null;

      const isReview = action === "review";
      const res = await fetch(isReview ? "/api/review" : "/api/order-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isReview
            ? {
                orderID: order._id,
                rating,
                comment: comment.trim(),
                uploadedUrls,
              }
            : {
                orderID: order._id,
                action,
                reason,
                comment: comment.trim(),
                uploadedUrls,
                uploadedVideoUrl,
              }
        ),
      });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error("Request failed");

      setOrder((prev) => {
        if (!prev) return prev;

        return isReview
          ? { ...prev, reviewAdded: true }
          : {
              ...prev,
              status:
                action === "return"
                  ? "return_initiated"
                  : "replacement_initiated",
            };
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      showError("Something went wrong!", "Please try again later");
    } finally {
      setLoader(false);
    }
  };

  /* available actions */
  const eligible =
    order.status === "delivered" || order.status === "replacement_complete";
  const canReview =
    !order.reviewAdded &&
    order.status !== "in_process" &&
    order.status !== "cancelled";

  const options = [
    eligible &&
      !isOlderThanWindow(order.createdAt) && {
        key: "return" as const,
        icon: "↩",
        label: "Request Return",
        desc: `Get a refund, valid for ${RETURN_WINDOW_DAYS} days after delivery`,
      },
    eligible && {
      key: "replacement" as const,
      icon: "⇄",
      label: "Request Replacement",
      desc: "Get a new item delivered",
    },
    canReview && {
      key: "review" as const,
      icon: "★",
      label: "Add Review & Rating",
      desc: "Share your experience",
    },
  ].filter(Boolean) as {
    key: Exclude<ActionType, null>;
    icon: string;
    label: string;
    desc: string;
  }[];

  const amountNum = Number(order.amount);
  const info = [
    { label: "Product", value: order.product },
    { label: "Qty", value: order.quantity },
    {
      label: "Amount",
      value: Number.isNaN(amountNum)
        ? order.amount
        : `₹${amountNum.toLocaleString("en-IN")}`,
    },
    { label: "Payment", value: order.payment },
    { label: "Date", value: new Date(order.createdAt).toLocaleString() },
    {
      label: "Address",
      value: [order.address, order.city, order.state, order.pincode]
        .filter(Boolean)
        .join(", "),
      span: true,
    },
  ];

  const submitLabel = {
    return: "Submit Return Request",
    replacement: "Submit Replacement Request",
    review: "Submit Review",
  };

  return (
    <div
      ref={rootRef}
      style={TOKENS}
      className="relative min-h-screen overflow-x-hidden bg-(--bg-primary) text-(color:--text-primary)"
    >
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          data-glow
          className="absolute -top-40 left-1/2 h-[520px] w-[820px] max-w-full -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(66,191,255,0.16), rgba(155,114,255,0.06) 60%, transparent)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(180,205,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(180,205,235,1) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "linear-gradient(to bottom, black, transparent 70%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black, transparent 70%)",
          }}
        />
      </div>

      {/* nav */}
      {/* <nav
        data-nav
        className="sticky top-0 z-40 border-b border-(color:--border-subtle) bg-(--bg-primary)/70 backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-[clamp(24px,7.2vw,120px)]">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg tracking-tight transition-opacity hover:opacity-70"
          >
            <Image src="/logo.png" alt="Arceus" width={32} height={32} />
            arceus
          </Link>
          {!submitted && (
            <button
              onClick={onReset}
              className="rounded-md px-2 py-1 text-xs uppercase tracking-[0.14em] text-(color:--text-secondary) transition-colors hover:text-(color:--text-primary) focus-visible:outline-2 focus-visible:outline-[#42BFFF]/60"
            >
              ← Back
            </button>
          )}
        </div>
      </nav> */}

      <main className="relative mx-auto max-w-3xl px-6 py-[clamp(32px,6vw,72px)]">
        {submitted ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div
              data-ring
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-(color:--border-highlight) bg-[#42BFFF]/10"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#68D0FF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  data-check
                  d="M20 6 9 17l-5-5"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={0}
                />
              </svg>
            </div>
            <h2
              data-success
              className="mb-3 text-[clamp(28px,4vw,40px)] font-semibold leading-tight tracking-[-0.02em]"
            >
              {action === "review"
                ? "Review submitted"
                : `${
                    action === "return" ? "Return" : "Replacement"
                  } request submitted`}
            </h2>
            <p
              data-success
              className="mb-8 max-w-sm text-sm text-(color:--text-secondary)"
            >
              {action === "review"
                ? "Thank you for your feedback. It means a lot to us."
                : `We've received your ${action} request. Our team will reach out within 24–48 hours.`}
            </p>
            <button
              data-success
              onClick={() => {
                setSubmitted(false);
                resetForm();
              }}
              className="rounded-lg border border-(color:--border-highlight) bg-(--bg-elevated) px-8 py-3 text-sm transition-colors hover:bg-[#42BFFF]/10 focus-visible:outline-2 focus-visible:outline-[#42BFFF]/60"
            >
              Ok
            </button>
          </div>
        ) : (
          <>
            {/* summary */}
            <section
              data-card
              className={`${CARD} mb-6 p-[clamp(20px,4vw,32px)]`}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-(color:--text-muted)">
                    Order · {order._id.slice(-8).toUpperCase()}
                  </p>
                  <h1 className="truncate text-2xl font-semibold tracking-[-0.02em]">
                    {order.name}
                  </h1>
                  <p className="mt-1 break-words text-sm text-(color:--text-secondary)">
                    {[order.phone, order.email].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider ${
                    STATUS_COLORS[order.status] ||
                    "border-(color:--border-subtle) text-(color:--text-secondary)"
                  }`}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  {meta?.label ?? order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-5 border-t border-(color:--border-subtle) pt-6 sm:grid-cols-4">
                {info.map((item) => (
                  <div
                    key={item.label}
                    data-info
                    className={item.span ? "col-span-2 sm:col-span-4" : ""}
                  >
                    <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-(color:--text-muted)">
                      {item.label}
                    </p>
                    <p className="break-words text-sm font-medium">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* action picker */}
            {!action &&
              (options.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {options.map((opt, i) => (
                    <button
                      key={opt.key}
                      data-action
                      onClick={() => setAction(opt.key)}
                      onPointerMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty(
                          "--mx",
                          `${e.clientX - r.left}px`
                        );
                        e.currentTarget.style.setProperty(
                          "--my",
                          `${e.clientY - r.top}px`
                        );
                      }}
                      className={`${CARD} group relative overflow-hidden p-5 text-left transition-colors duration-300 hover:border-(color:--border-highlight) focus-visible:outline-2 focus-visible:outline-[#42BFFF]/60`}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgba(66,191,255,0.12), transparent 70%)",
                        }}
                      />
                      <div className="relative">
                        <div className="mb-5 flex items-center justify-between">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-(color:--border-subtle) bg-(--bg-secondary) text-base text-[#68D0FF]">
                            {opt.icon}
                          </span>
                          <span className="text-[10px] tracking-[0.18em] text-(color:--text-muted)">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{opt.label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-(color:--text-secondary)">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p
                  data-action
                  className="px-1 text-center text-sm text-(color:--text-muted)"
                >
                  {order.status === "in_process"
                    ? "Actions will be available once your order is delivered."
                    : "No actions are available for this order."}
                </p>
              ))}

            {/* form */}
            {action && (
              <section
                data-panel
                className={`${CARD} p-[clamp(20px,4vw,32px)]`}
              >
                <div className="mb-7 flex items-center justify-between">
                  <h2 className="text-xl font-semibold tracking-[-0.01em]">
                    {action === "return" && "Return Request"}
                    {action === "replacement" && "Replacement Request"}
                    {action === "review" && "Your Review"}
                  </h2>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs uppercase tracking-[0.14em] text-(color:--text-secondary) transition-colors hover:text-(color:--text-primary)"
                  >
                    ← Change
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {action !== "review" ? (
                    <>
                      <div data-field>
                        <label htmlFor="reason" className={LABEL}>
                          Reason <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="reason"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className={INPUT}
                        >
                          <option value="">Select a reason…</option>
                          {ISSUE_REASONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div data-field>
                        <label htmlFor="details" className={LABEL}>
                          Details <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          id="details"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={4}
                          maxLength={1000}
                          placeholder="Describe the issue in more detail. This helps us resolve it faster."
                          className={`${INPUT} resize-none`}
                        />
                      </div>

                      <div data-field>
                        <FileUploadZone
                          label="Upload Images (optional)"
                          accept="image/*"
                          multiple
                          icon="🖼️"
                          files={images}
                          onChange={setImages}
                        />
                      </div>
                      <div data-field>
                        <FileUploadZone
                          label="Upload Video (optional)"
                          accept="video/*"
                          multiple={false}
                          icon="🎥"
                          files={videos}
                          onChange={setVideos}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div data-field>
                        <span className={LABEL}>
                          Your Rating <span className="text-red-400">*</span>
                        </span>
                        <StarRating value={rating} onChange={setRating} />
                        {rating > 0 && (
                          <p className="mt-2 text-xs text-(color:--text-secondary)">
                            {RATING_LABELS[rating]} — {rating}/5
                          </p>
                        )}
                      </div>

                      <div data-field>
                        <label htmlFor="review" className={LABEL}>
                          Your Review
                        </label>
                        <textarea
                          id="review"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={5}
                          maxLength={1000}
                          placeholder="Share your honest experience with the product. What did you love? What could be better?"
                          className={`${INPUT} resize-none`}
                        />
                      </div>

                      <div data-field>
                        <FileUploadZone
                          label="Add Photos (optional)"
                          accept="image/*"
                          multiple
                          icon="📸"
                          files={images}
                          onChange={setImages}
                        />
                      </div>
                    </>
                  )}

                  <div data-field className="pt-2">
                    <button
                      type="submit"
                      disabled={loader}
                      className="group relative w-full overflow-hidden rounded-lg border border-(color:--border-highlight) bg-(--bg-secondary) py-4 text-sm font-medium transition-colors hover:bg-[#42BFFF]/10 focus-visible:outline-2 focus-visible:outline-[#42BFFF]/60 disabled:opacity-60"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-px"
                        style={{
                          background:
                            "linear-gradient(100deg, #42BFFF, #568CFF, #9B72FF)",
                        }}
                      />
                      {submitLabel[action]}
                      <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}
      </main>

      {loader && <Loader />}
      {error.visible && (
        <ErrorModal
          open={error.visible}
          onClose={() =>
            setErrorModal({ visible: false, title: "", message: "" })
          }
          title={error.title}
          message={error.message}
        />
      )}
    </div>
  );
}
