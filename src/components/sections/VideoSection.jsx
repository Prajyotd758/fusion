'use client'
import { useState } from 'react'

export default function VideoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="py-24 px-6 bg-(--bg) border-t border-(--border)">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-medium tracking-widest text-(--text-muted) uppercase mb-3">See it in action</p>
          {/* <h2 className="  text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
            Watch how it<br />transforms your life
          </h2> */}
          <p className="text-(--text-secondary) max-w-md mx-auto">
            A 1 minute walkthrough of what makes this product truly remarkable.
          </p>
        </div>

        {/* Video container */}
        <div className="relative rounded-3xl overflow-hidden border border-(--border) bg-[#1a1814] aspect-video shadow-2xl shadow-black/20 group">
          {!playing ? (
            <>
              {/* Placeholder thumbnail */}
              <div className="absolute inset-0 flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #1a1814 0%, #2d2820 50%, #1a1814 100%)'
              }}>
                <div className="text-center">
                  <p className="text-(--text-muted) text-sm mb-6">Replace this with your product video</p>
                  {/* Play button */}
                  <button
                    onClick={() => setPlaying(true)}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-xl mx-auto"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a1814">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                  <span className="text-white/60 text-xs">Product Demo · 2:34</span>
                </div>
              </div>
            </>
          ) : (
            /* Replace the src with your actual video URL */
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Product Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </div>

        {/* Stats below video */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          {[
            { num: '10+', label: 'Reviews' },
            { num: '4.6★',    label: 'Average Rating'  },
            { num: '5 Days', label: 'Return Policy'    },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="  text-3xl text-(--text-primary) mb-1">{s.num}</p>
              <p className="text-sm text-(--text-muted)">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
