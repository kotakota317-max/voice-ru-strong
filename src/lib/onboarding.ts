import { useCallback, useSyncExternalStore } from "react";

export type TourId = "app" | "report" | "feed" | "map" | "profile";

export const TOUR_KEYS: Record<TourId, string> = {
  app: "voiceRu_onboarding_completed",
  report: "voiceRu_report_onboarding_completed",
  feed: "voiceRu_feed_onboarding_completed",
  map: "voiceRu_map_onboarding_completed",
  profile: "voiceRu_profile_onboarding_completed",
};

export const TOUR_LABELS: Record<TourId, string> = {
  app: "アプリ全体",
  report: "報告",
  feed: "フィード",
  map: "マップ",
  profile: "プロフィール",
};

export type TourStep = {
  /** CSS selector of the real UI element to highlight. Missing targets are skipped. */
  selector: string;
  title?: string;
  body: string;
  /** Radius of the spotlight cutout. */
  radius?: number;
};

const listeners = new Set<() => void>();
let version = 0;

function emit() {
  version += 1;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function isDone(id: TourId): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(TOUR_KEYS[id]) === "true";
  } catch {
    return true;
  }
}

export function markTourComplete(id: TourId) {
  try {
    window.localStorage.setItem(TOUR_KEYS[id], "true");
  } catch {
    /* storage unavailable */
  }
  emit();
}

export function resetTour(id: TourId) {
  try {
    window.localStorage.removeItem(TOUR_KEYS[id]);
  } catch {
    /* storage unavailable */
  }
  emit();
}

/**
 * Whether the given tour should currently run.
 * Tab tours wait until the main app tour is finished so the two never overlap.
 */
export function useTourActive(id: TourId): boolean {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => `${version}:${isDone(id)}:${isDone("app")}`,
    () => "server",
  );
  if (snapshot === "server") return false;
  if (isDone(id)) return false;
  if (id !== "app" && !isDone("app")) return false;
  return true;
}

export function useCompleteTour(id: TourId) {
  return useCallback(() => markTourComplete(id), [id]);
}