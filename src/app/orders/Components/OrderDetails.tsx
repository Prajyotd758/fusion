"use client";

import { Dispatch, SetStateAction, act, useState } from "react";
import Link from "next/link";
import Image from "next/image";
//
import { getStatusMeta } from "../../../lib/mockApi";
import FileUploadZone from "./FileUploadZone";
import { errorType } from "../../buy/page";
import Loader from "@/src/components/reusable/Loader";
import ErrorModal from "@/src/components/reusable/ErrorModal";

const ISSUE_REASONS: string[] = [
  "Damaged Product",
  "Product Not Working",
  "Missing Item",
  "Wrong Item Delivered",
  "Quality Not as Expected",
];

const STATUS_COLORS: Record<string, string> = {
  in_process: "bg-amber-50 text-amber-700 border-amber-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  return_complete: "bg-green-50 text-green-700 border-green-200",
  replacement_complete: "bg-green-50 text-green-700 border-green-200",
  return_initiated: "bg-blue-50 text-blue-700 border-blue-200",
  replacement_initiated: "bg-purple-50 text-purple-700 border-purple-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

type ActionType = "return" | "replacement" | "review" | null;

interface Order {
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
  setOrder: (orderDetails: any) => void;
  onReset: () => void;
}

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState<number>(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={(hovered || value) >= n ? "#f59e0b" : "none"}
            stroke={(hovered || value) >= n ? "#f59e0b" : "#d1d5db"}
            strokeWidth="1.5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function OrderDetail({
  order,
  setOrder,
  onReset,
}: OrderDetailProps) {
  const [action, setAction] = useState<ActionType>(null);

  const [reason, setReason] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const [rating, setRating] = useState<number>(0);

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [loader, setLoader] = useState<boolean>(false);

  const [error, setErrorModal] = useState<errorType>({
    visible: false,
    title: "",
    message: "",
  });

  const meta = getStatusMeta(order.status);

  function isOlderThan5Days(date: string): boolean {
    const inputDate = new Date(date);
    const currentDate = new Date();

    // Difference in milliseconds
    const diffTime = currentDate.getTime() - inputDate.getTime();

    // Convert to days
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 6;
  }

  const uploadToCloudinary = async (file: File | Blob) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fusion");
    formData.append("folder", "Fusion_user_shared_images");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dgojbbk4m/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const uploadVideoToCloudinary = async (file: File | Blob) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fusion");
    formData.append("folder", "Fusion_user_shared_videos");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dgojbbk4m/video/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (action === "review" && rating === 0) {
      setErrorModal({
        visible: true,
        title: "Please select a rating.",
        message: "",
      });
      return;
    }

    if ((action === "return" || action === "replacement") && !reason) {
      setErrorModal({
        visible: true,
        title: "Please fill all the necessary field.",
        message: "",
      });
      return;
    }

    setLoader(true);

    try {
      let uploadedUrls: Array<string> | null = null;
      let uploadedVideoUrl: Array<string> | null = null;

      const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5 MB
      const VIDEO_MAX_SIZE = 15 * 1024 * 1024; // 15 MB

      // Validate Images
      for (const image of images) {
        if (image.size > IMAGE_MAX_SIZE) {
          setErrorModal({
            visible: true,
            title: "File too large",
            message: "File size must be under 5 MB",
          });
          return;
        }
      }

      // Validate Videos
      for (const video of videos) {
        if (video.size > VIDEO_MAX_SIZE) {
          setErrorModal({
            visible: true,
            title: "File too large",
            message: "Video size must be under 15 MB",
          });
          return;
        }
      }

      if (images.length > 0) {
        uploadedUrls = await Promise.all(
          images.map((image) => uploadToCloudinary(image))
        );
      }

      if (videos.length > 0) {
        uploadedVideoUrl = await Promise.all(
          videos.map((video) => uploadVideoToCloudinary(video))
        );
      }

      const url = action === "review" ? "/api/review" : "/api/order-update";
      const body =
        action === "review"
          ? {
              orderID: order._id,
              rating,
              comment,
              uploadedUrls,
            }
          : {
              orderID: order._id,
              action,
              reason,
              comment,
              uploadedUrls,
              uploadedVideoUrl,
            };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        if (action === "replacement" || action === "return") {
          setOrder((prev : any) => ({
            ...prev,
            status:
              action === "return"
                ? "return_initiated"
                : "replacement_initiated",
          }));
        } else {
          setOrder((prev : any) => ({
            ...prev,
            reviewAdded: true,
          }));
        }
        setSubmitted(true);
      } else {
        setErrorModal({
          visible: true,
          title: "Something went wrong!",
          message: "Please try again later",
        });
      }
    } catch (error) {
      console.log(error);
      setErrorModal({
        visible: true,
        title: "Something went wrong!",
        message: "Please try again later",
      });
    } finally {
      setLoader(false);
    }
  };

  if (error.visible) {
    return (
      <ErrorModal
        open={error.visible}
        onClose={() =>
          setErrorModal((prev) => ({
            visible: false,
            title: "",
            message: "",
          }))
        }
        title={error.title}
        message={error.message}
      />
    );
  }

  if (loader) {
    return <Loader />;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-[#1a1814] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 className="text-3xl font-semibold text-[#1a1814] mb-3">
            {action === "review"
              ? "Review submitted!"
              : `${
                  action === "return" ? "Return" : "Replacement"
                } request submitted!`}
          </h2>

          <p className="text-gray-500 text-sm mb-8">
            {action === "review"
              ? "Thank you for your feedback. It means a lot to us."
              : `We've received your ${action} request. Our team will reach out within 24–48 hours.`}
          </p>

          <button
            onClick={() => {
              setSubmitted(false);
              setAction(null);
              setReason("");
              setComment("");
              setImages([]);
              setVideos([]);
              setRating(0);
            }}
            className="px-6 py-3 bg-[#1a1814] text-white text-sm rounded-xl hover:bg-[#333] transition-colors"
          >
            Ok
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[94%] mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl text-(--text-primary) tracking-tight hover:opacity-70 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              Fusion
            </div>
          </Link>

          <button
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-3xl p-7 mb-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-[#1a1814]">
                {order.name}
              </h2>

              <p className="text-sm text-gray-500 mt-0.5">
                {order.phone} · {order.email}
              </p>
            </div>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-medium border shrink-0 ${
                STATUS_COLORS[order.status] || ""
              }`}
            >
              {meta.label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-gray-100">
            {[
              {
                label: "Product",
                value: order.product,
              },
              {
                label: "Qty",
                value: order.quantity,
              },
              {
                label: "Amount",
                value: `₹${order.amount.toLocaleString()}`,
              },
              {
                label: "Payment",
                value: order.payment,
              },
              {
                label: "Date",
                value: new Date(order.createdAt).toLocaleString(),
              },
              {
                label: "Address",
                value: `${order.address}, ${order.city}, ${order.state}`,
                span: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={item.span ? "col-span-2 sm:col-span-4" : ""}
              >
                <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>

                <p className="text-sm font-medium text-[#1a1814]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {!action && order.status !== "in_process" && (
          <div className="space-y-3 mb-6">
            {/* <p className="text-sm font-medium text-gray-600 mb-4">
              What would you like to do?
            </p> */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                !isOlderThan5Days(order.createdAt) &&
                  order.status === "delivered" && {
                    key: "return",
                    icon: "↩️",
                    label: "Request Return",
                    desc: "Get a refund for your order, valid for 5 days after delivery",
                  },

                order.status === "delivered" && {
                  key: "replacement",
                  icon: "🔄",
                  label: "Request Replacement",
                  desc: "Get a new item delivered",
                },

                !order.reviewAdded && {
                  key: "review",
                  icon: "⭐",
                  label: "Add Review & Rating",
                  desc: "Share your experience",
                },
              ]
                .filter(Boolean)
                .map((opt: any) => (
                  <button
                    key={opt.key}
                    onClick={() =>
                      setAction(opt.key as Exclude<ActionType, null>)
                    }
                    className="p-5 bg-white border border-gray-200 rounded-2xl text-left hover:border-[#1a1814] hover:shadow-md hover:shadow-black/5 transition-all group"
                  >
                    <span className="text-2xl block mb-3">{opt.icon}</span>

                    <p className="text-sm font-medium text-[#1a1814] group-hover:text-black">
                      {opt.label}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>
                  </button>
                ))}
            </div>
          </div>
        )}

        {action && (
          <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm">
            <div className="flex items-center justify-between mb-7">
              <h3 className="text-xl font-semibold text-[#1a1814]">
                {action === "return" && "Return Request"}

                {action === "replacement" && "Replacement Request"}

                {action === "review" && "Your Review"}
              </h3>

              <button
                onClick={() => {
                  setAction(null);
                  setReason("");
                  setComment("");
                  setImages([]);
                  setVideos([]);
                  setRating(0);
                }}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                ← Change
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {(action === "return" || action === "replacement") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason <span className="text-red-400">*</span>
                    </label>

                    <select
                      value={reason}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setReason(e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1a1814] focus:ring-2 focus:ring-black/5 transition-all bg-white"
                    >
                      <option value="">Select a reason…</option>

                      {ISSUE_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Details <span className="text-red-400">*</span>
                    </label>

                    <textarea
                      value={comment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setComment(e.target.value)
                      }
                      rows={4}
                      placeholder="Describe the issue in more detail. This helps us resolve it faster."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1a1814] focus:ring-2 focus:ring-black/5 transition-all resize-none"
                    />
                  </div>

                  <FileUploadZone
                    label="Upload Images (optional)"
                    accept="image/*"
                    multiple
                    icon="🖼️"
                    files={images}
                    onChange={setImages}
                  />

                  <FileUploadZone
                    label="Upload Video (optional)"
                    accept="video/*"
                    multiple={false}
                    icon="🎥"
                    files={videos}
                    onChange={setVideos}
                  />
                </>
              )}

              {action === "review" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Your Rating <span className="text-red-400">*</span>
                    </label>

                    <StarRating value={rating} onChange={setRating} />

                    {rating > 0 && (
                      <p className="text-xs text-gray-400 mt-2">
                        {
                          [
                            "",
                            "Terrible",
                            "Poor",
                            "Average",
                            "Good",
                            "Excellent",
                          ][rating]
                        }{" "}
                        — {rating}/5
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>

                    <textarea
                      value={comment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setComment(e.target.value)
                      }
                      rows={5}
                      placeholder="Share your honest experience with the product. What did you love? What could be better?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1a1814] focus:ring-2 focus:ring-black/5 transition-all resize-none"
                    />
                  </div>

                  <FileUploadZone
                    label="Add Photos (optional)"
                    accept="image/*"
                    multiple
                    icon="📸"
                    files={images}
                    onChange={setImages}
                  />
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loader}
                  className="w-full py-4 bg-[#1a1814] text-white font-medium rounded-xl hover:bg-[#333] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                >
                  {/* {submitting ? (
                    <>
                      <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />

                      <span>Submitting…</span>
                    </>
                  ) : (
                    <> */}
                  {action === "return" && "Submit Return Request →"}

                  {action === "replacement" && "Submit Replacement Request →"}

                  {action === "review" && "Submit Review →"}
                  {/* </> */}
                  {/* )} */}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
