import type { Metadata } from "next";
import ArceusShowcase from "../../components/arceusPageComponent/Arceus";
import "./arceus.css";

export const metadata: Metadata = {
  title: "Arceus • Talk to your computer",
  description: "Arceus is the AI agent that works with AirGrip. Download for Windows.",
};

export default function Page() {
  return <ArceusShowcase />;
}