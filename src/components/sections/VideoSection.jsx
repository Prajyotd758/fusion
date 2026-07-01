"use client";
import { useState } from "react";

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const [showImages, setShowImages] = useState(false);

  return (
    <section className="py-24 px-6 bg-(--bg) border-t border-(--border)">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-medium tracking-widest text-(--text-muted) uppercase mb-3">
            Customer Reviews
          </p>

          <p className="text-(--text-secondary) max-w-md mx-auto">
            Hear what early users think about the product.
          </p>
        </div>

        {/* Rating Summary */}
        <div className="border border-(--border) rounded-3xl p-8 bg-[var(--card-bg)] mb-10">
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

        {/* Image Gallery */}
        {showImages && (
          <div className="mt-10 border border-(--border) rounded-3xl p-6">
            <h3 className="text-lg font-medium text-(--text-primary) mb-5">
              Customer Images
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "/review.jpeg",
              ].map((img, i) => (
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

        {/* Reviews */}
        <div className="space-y-6">
          {[
            {
              rating: 5,
              review:
                "Very comfortable to use. The grip feels premium and the Bluetooth connection was easy to set up.",
            },
            {
              rating: 5,
              review:
                "Love the design. It stands out from other products and feels great in hand.",
            },
            {
              rating: 3,
              review:
                "product quality is good but sometimes the mouse starts moving automatically,need to restart to work correctly again",
            },
            {
              rating: 2,
              review:
                "works slowly when connected multiple bluetooth devices",
            },
          ].map((review, index) => (
            <div
              key={index}
              className="border border-(--border) rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-(--text-primary)">
                  {review.name}
                </h3>

                <span className="text-yellow-400">
                  {"★".repeat(review.rating)}
                </span>
              </div>

              <p className="text-(--text-secondary)">{review.review}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-3 gap-6 mt-14">
          {[
            { num: "12+", label: "Reviews" },
            { num: "4.8★", label: "Average Rating" },
            { num: "5 Days", label: "Return Policy" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl text-(--text-primary) mb-1">{s.num}</p>
              <p className="text-sm text-(--text-muted)">{s.label}</p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
// export default function VideoSection() {
//   const [playing, setPlaying] = useState(false)

//   return (
//     <section className="py-24 px-6 bg-(--bg) border-t border-(--border)">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-14">
//           <p className="text-xs font-medium tracking-widest text-(--text-muted) uppercase mb-3">See it in action</p>
//           {/* <h2 className="  text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
//             Watch how it<br />transforms your life
//           </h2> */}
//           <p className="text-(--text-secondary) max-w-md mx-auto">
//             A 1 minute walkthrough of what makes this product truly remarkable.
//           </p>
//         </div>

//         {/* Video container */}
//         <div className="relative rounded-3xl overflow-hidden border border-(--border) bg-[#1a1814] aspect-video shadow-2xl shadow-black/20 group">
//           {!playing ? (
//             <>
//               {/* Placeholder thumbnail */}
//               <div className="absolute inset-0 flex items-center justify-center" style={{
//                 background: 'linear-gradient(135deg, #1a1814 0%, #2d2820 50%, #1a1814 100%)'
//               }}>
//                 <div className="text-center">
//                   <p className="text-(--text-muted) text-sm mb-6">Replace this with your product video</p>
//                   {/* Play button */}
//                   <button
//                     onClick={() => setPlaying(true)}
//                     className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-xl mx-auto"
//                   >
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a1814">
//                       <path d="M8 5v14l11-7z"/>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//               <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
//                   <span className="text-white/60 text-xs">Product Demo · 2:34</span>
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* Replace the src with your actual video URL */
//             <iframe
//               className="w-full h-full"
//               src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
//               title="Product Video"
//               allow="autoplay; encrypted-media"
//               allowFullScreen
//             />
//           )}
//         </div>

//         {/* Stats below video */}
//         <div className="grid grid-cols-3 gap-6 mt-12">
//           {[
//             { num: '10+', label: 'Reviews' },
//             { num: '4.6★',    label: 'Average Rating'  },
//             { num: '5 Days', label: 'Return Policy'    },
//           ].map((s, i) => (
//             <div key={i} className="text-center">
//               <p className="  text-3xl text-(--text-primary) mb-1">{s.num}</p>
//               <p className="text-sm text-(--text-muted)">{s.label}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }
