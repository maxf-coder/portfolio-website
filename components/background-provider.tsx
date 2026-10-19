"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { BackgroundCanvas } from "./background-canvas";

export type BackgroundVariant = "aurora" | "particles";

type BackgroundValue = {
  variant: BackgroundVariant;
  toggle: () => void;
};

let lastVariant: BackgroundVariant = "aurora";

function rememberVariant(next: BackgroundVariant) {
  lastVariant = next;
}

const BackgroundContext = createContext<BackgroundValue | null>(null);

export function useBackground() {
  const value = useContext(BackgroundContext);
  if (!value) throw new Error("useBackground must be used inside BackgroundProvider");
  return value;
}

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<BackgroundVariant>(lastVariant);

  const toggle = () => {
    const next = variant === "aurora" ? "particles" : "aurora";
    rememberVariant(next);
    setVariant(next);
  };

  return (
    <BackgroundContext value={{ variant, toggle }}>
      <BackgroundCanvas variant={variant} />
      {children}
    </BackgroundContext>
  );
}