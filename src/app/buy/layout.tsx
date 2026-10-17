import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy AirGrip Air Mouse",
  description:
    "Order the AirGrip gyro air mouse with push-to-talk voice and USB dongle.",
  alternates: { canonical: "/buy" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
