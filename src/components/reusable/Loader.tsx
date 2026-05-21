"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white border border-(--border) rounded-3xl px-8 py-7 flex flex-col items-center shadow-xl animate-scale-in">
        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-(--border) border-t-(--text-primary) rounded-full animate-spin mb-5" />

        {/* Text */}
        <h2 className="text-lg text-(--text-primary) mb-1">Please wait</h2>

        <p className="text-sm text-(--text-secondary) text-center">
          Processing your request...
        </p>
      </div>
    </div>
  );
}
