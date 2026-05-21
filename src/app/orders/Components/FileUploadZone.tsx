"use client";

import { useRef } from "react";

interface FileUploadZoneProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  files: File[];
  onChange: React.Dispatch<React.SetStateAction<File[]>>;
  icon?: React.ReactNode;
}

export default function FileUploadZone({
  label,
  accept,
  multiple = false,
  files,
  onChange,
  icon,
}: FileUploadZoneProps) {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const dropped = Array.from(e.dataTransfer.files).filter((f) => {
      if (accept === "image/*") return f.type.startsWith("image/");
      if (accept === "video/*") return f.type.startsWith("video/");
      return true;
    });

    onChange((prev) => [...prev, ...dropped]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    onChange((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{" "}
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => ref.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 transition-all"
      >
        <div className="text-3xl mb-2">{icon}</div>

        <p className="text-sm text-gray-500">
          Drag & drop or{" "}
          <span className="text-gray-900 font-medium underline">browse</span>
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {accept === "image/*" ? "JPG, PNG, WEBP" : "MP4, MOV, AVI"} · Max{" "}
          {accept === "image/*" ? "5MB" : "15MB"}
          each
        </p>

        <input
          ref={ref}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5"
            >
              <span className="text-xs text-gray-600 truncate max-w-30">
                {f.name}
              </span>

              <button
                type="button"
                onClick={() =>
                  onChange((prev) => prev.filter((_, j) => j !== i))
                }
                className="text-gray-400 hover:text-gray-700 transition-colors text-xs ml-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
