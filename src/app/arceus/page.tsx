import type { Metadata } from "next";
import ArceusShowcase from "../../components/arceusPageComponent/Arceus";
import "./arceus.css";

export const metadata: Metadata = {
  title: "Arceus: AI Voice Agent for Windows",
  description:
    "Arceus is the AI desktop agent that controls your Windows PC by voice. Works with the AirGrip air mouse. Download for Windows.",
  alternates: { canonical: "/arceus" },
};

export default function Page() {
  return <ArceusShowcase />;
}
