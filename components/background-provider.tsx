"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { BackgroundCanvas } from "./background-canvas";

export type BackgroundVariant = "aurora" | "particles";

type BackgroundValue = {
  variant: BackgroundVariant;
  toggle: () => void;
};

const STORAGE_KEY = "portfolio-background";

let lastVariant: BackgroundVariant = "aurora";
const listeners = new Set<() => void>();

function readVariant(): BackgroundVariant {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "aurora" || stored === "particles") return stored;
  } catch {
  }
  return lastVariant;
}

function readServerVariant(): BackgroundVariant {
  return "aurora";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function writeVariant(next: BackgroundVariant) {
  lastVariant = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
  }
  for (const listener of listeners) listener();
}

const BackgroundContext = createContext<BackgroundValue | null>(null);

export function useBackground() {
  const value = useContext(BackgroundContext);
  if (!value) throw new Error("useBackground must be used inside BackgroundProvider");
  return value;
}

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const variant = useSyncExternalStore(subscribe, readVariant, readServerVariant);

  const toggle = () => {
    writeVariant(variant === "aurora" ? "particles" : "aurora");
  };

  return (
    <BackgroundContext value={{ variant, toggle }}>
      <BackgroundCanvas variant={variant} />
      {children}
    </BackgroundContext>
  );
}