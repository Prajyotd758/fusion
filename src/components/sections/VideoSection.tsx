"use client";
import { useState } from "react";

interface Review {
  rating: number;
  review: string;
}

export default function VideoSection() {
  const [showImages, setShowImages] = useState(false);

  const reviews: Review[] = [
    {
      rating: 5,
      review:
        "Very comfortable to use. The grip feels premium and the dongle connection was easy to set up.",
    },
    {
      rating: 5,
      review:
        "Love the design. It stands out from other products and feels great in hand.",
    },
    {
      rating: 4,
      review: "product is good",
    },
  ];

  return (
    <section className="py-24 px-6 bg-(--bg) border-t border-(--border)">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium tracking-widest text-(--text-muted) uppercase mb-3">
            Customer Reviews
          </p>

          <p className="text-(--text-secondary) max-w-md mx-auto">
            Hear what early users think about the product.
          </p>
        </div>

        <div className="border border-(--border) rounded-3xl p-8 bg-(--card-bg) mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-5xl font-semibold text-(--text-primary)">
                  4.1
                </span>

                <div>
                  <div className="text-yellow-400 text-xl">★★★★★</div>

                  <p className="text-sm text-(--text-muted)">
                    Based on 12 reviews
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowImages(!showImages)}
              className="text-sm underline text-(--text-primary) hover:opacity-70 transition"
            >
              {showImages ? "Hide Images" : "See Images (1)"}
            </button>
          </div>
        </div>

        {showImages && (
          <div className="mt-10 border border-(--border) rounded-3xl p-6">
            <h3 className="text-lg font-medium text-(--text-primary) mb-5">
              Customer Images
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["/review.jpeg"].map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden border border-(--border)"
                >
                  <img
                    src={img}
                    alt={`Review ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="border border-(--border) rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-400">
                  {"★".repeat(review.rating)}
                </span>
              </div>

              <p className="text-(--text-secondary)">{review.review}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}