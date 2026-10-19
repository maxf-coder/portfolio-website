"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { BackgroundCanvas } from "./background-canvas";

type BackgroundVariant = "aurora" | "particles";

type BackgroundValue = {
  variant: BackgroundVariant;
  toggle: () => void;
};

const BackgroundContext = createContext<BackgroundValue | null>(null);

export function useBackground() {
  const value = useContext(BackgroundContext);
  if (!value) throw new Error("useBackground must be used inside BackgroundProvider");
  return value;
}

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<BackgroundVariant>("aurora");

  const toggle = () => {
    setVariant((current) => (current === "aurora" ? "particles" : "aurora"));
  };

  return (
    <BackgroundContext value={{ variant, toggle }}>
      <BackgroundCanvas variant={variant} />
      {children}
    </BackgroundContext>
  );
}