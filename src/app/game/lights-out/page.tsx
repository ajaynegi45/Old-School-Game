"use client";

import dynamic from "next/dynamic";

// Dynamically import the LightsOut component from components folder
const LightsOutGame = dynamic(() => import("@/components/LightsOut"), {
  ssr: false,
});

export default function LightsOutPage() {
  return (
    <main>
      <LightsOutGame />
    </main>
  );
}

