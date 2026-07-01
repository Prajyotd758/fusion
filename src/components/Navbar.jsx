"use client";
import Link from "next/link";
import Image from "next/image";
import { initiateCheckout } from "@/lib/metaPixel";

export default function Navbar() {
  return (
    <nav className="border-b border-(--border) bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[94%] mx-auto max-sm:px-1 px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl text-(--text-primary) tracking-tight hover:opacity-70 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            arceus
          </div>
        </Link>

        {/* Buy Now */}
        <div className="flex gap-2">
          <Link 
          onClick={()=> initiateCheckout()}
            href="/buy"
            className="px-5 max-sm:px-3 py-2.5 bg-(--text-primary) text-white max-sm:text-xs text-sm font-medium rounded-xl hover:bg-(--accent-hover) transition-all duration-200 hover:shadow-lg hover:shadow-black/10"
          >
            Buy Now →
          </Link>
          <Link
            href="/orders"
            className="px-5 py-2.5 bg-(--text-primary) max-sm:px-3 max-sm:text-xs text-white text-sm font-medium rounded-xl hover:bg-(--accent-hover) transition-all duration-200 hover:shadow-lg hover:shadow-black/10"
          >
            Order status →
          </Link>
        </div>
      </div>
    </nav>
  );
}
