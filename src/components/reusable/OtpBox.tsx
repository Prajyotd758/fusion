// export default function OTPBox() {
//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white rounded-3xl p-7 animate-scale-in border border-(--border)">
//         {/* Top Icon */}
//         <div className="w-14 h-14 rounded-2xl bg-(--badge-bg) flex items-center justify-center mx-auto mb-5 text-2xl">
//           🔐
//         </div>

//         {/* Heading */}
//         <h2 className="text-2xl text-center text-(--text-primary) mb-2">
//           Verify your phone
//         </h2>

//         <p className="text-sm text-center text-(--text-secondary) mb-8 leading-relaxed">
//           We've sent a 6 digit OTP to
//           <br />
//           <span className="font-medium text-(--text-primary)">
//             +91 {form.phone}
//           </span>
//         </p>

//         {/* OTP Inputs */}
//         <div className="flex items-center justify-center gap-3 mb-7">
//           {[...Array(6)].map((_, index) => (
//             <input
//               key={index}
//               type="text"
//               maxLength={1}
//               value={otp[index] || ""}
//               onChange={(e) => handleOtpChange(e, index)}
//               className="w-12 h-14 rounded-xl border border-(--border) bg-(--bg) text-center text-lg font-medium outline-none focus:border-(--text-primary) transition-all"
//             />
//           ))}
//         </div>

//         {/* Verify Button */}
//         <button
//           type="button"
//           onClick={verifyOtp}
//           className="w-full py-4 bg-(--text-primary) text-white rounded-xl text-sm font-medium hover:bg-(--accent-hover) transition-all"
//         >
//           Verify OTP →
//         </button>

//         {/* Resend */}
//         <div className="mt-5 text-center">
//           <p className="text-sm text-(--text-secondary)">Didn't receive OTP?</p>

//           <button
//             type="button"
//             className="mt-1 text-sm font-medium text-(--text-primary) hover:underline"
//           >
//             Resend OTP
//           </button>
//         </div>

//         {/* Close */}
//         <button
//           onClick={() => setOtpSent(false)}
//           className="absolute top-4 right-4 text-(--text-muted) hover:text-(--text-primary)"
//         >
//           ✕
//         </button>
//       </div>
//     </div>
//   );
// }
