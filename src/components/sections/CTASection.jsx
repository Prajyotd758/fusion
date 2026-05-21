'use client'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-24 px-6 bg-(--text-primary) border-t border-(--border)">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs font-medium tracking-widest text-white/40 uppercase mb-4">Limited Time Offer</p>
        <h2 className="  text-4xl md:text-5xl text-white mb-5 leading-[1.1]">
          Ready to experience<br />the difference?
        </h2>
        {/* <p className="text-white/60 max-w-md mx-auto mb-10 text-sm leading-relaxed">
          Join 10,000+ happy customers. Free shipping, COD available, and backed by our 30-day guarantee.
        </p> */}

        {/* Pricing */}
        <div className="inline-flex items-center gap-3 mb-8">
          <span className="text-4xl font-semibold text-white  ">₹1,499</span>
          <div className="text-left">
            <span className="block text-white/40 line-through text-sm">₹1,999</span>
            <span className="block text-green-400 text-xs font-medium">You save ₹500</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/buy"
            className="px-10 py-4 bg-white text-(--text-primary) font-medium rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 text-sm"
          >
            Order Now →
          </Link>
          <div className="flex items-center gap-4 text-white/40 text-xs">
            <span>🚚 Free Shipping</span>
            <span>💵 COD</span>
            <span>🔒 Secure</span>
          </div>
        </div>
      </div>
    </section>
  )
}
