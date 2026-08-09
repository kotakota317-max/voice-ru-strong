import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { markTourComplete, useTourActive, type TourId, type TourStep } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

type Rect = { top: number; left: number; width: number; height: number };

const PAD = 8;
const GAP = 14;
const EDGE = 12;

function readRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

function isVisible(el: Element) {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

export function SpotlightTour({
  id,
  steps,
  finalLabel = "はじめる",
}: {
  id: TourId;
  steps: TourStep[];
  finalLabel?: string;
}) {
  const active = useTourActive(id);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!active || !mounted) return null;
  return createPortal(
    <TourOverlay id={id} steps={steps} finalLabel={finalLabel} />,
    document.body,
  );
}

function TourOverlay({
  id,
  steps,
  finalLabel,
}: {
  id: TourId;
  steps: TourStep[];
  finalLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [ready, setReady] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tipSize, setTipSize] = useState({ w: 280, h: 140 });

  const finish = useCallback(() => markTourComplete(id), [id]);

  // Resolve the current target; gracefully skip steps whose element is absent.
  useEffect(() => {
    let raf = 0;
    let tries = 0;
    setReady(false);
    const tick = () => {
      const step = steps[index];
      if (!step) {
        finish();
        return;
      }
      const el = document.querySelector(step.selector);
      if (el && isVisible(el)) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        setRect(readRect(el));
        setReady(true);
        return;
      }
      tries += 1;
      if (tries > 60) {
        // Element never appeared on this screen — skip this step.
        if (index + 1 >= steps.length) finish();
        else setIndex((i) => i + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, steps, finish]);

  // Keep the spotlight glued to the element while scrolling / resizing.
  useEffect(() => {
    if (!ready) return;
    const step = steps[index];
    let raf = 0;
    const sync = () => {
      const el = step && document.querySelector(step.selector);
      if (el) setRect(readRect(el));
      raf = requestAnimationFrame(sync);
    };
    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, [ready, index, steps]);

  useLayoutEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTipSize({ w: r.width, h: r.height });
  }, [index, ready]);

  if (!ready || !rect) {
    return <div className="fixed inset-0 z-[3000] animate-fade-in bg-black/50" />;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const hole = {
    top: rect.top - PAD,
    left: rect.left - PAD,
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
  };

  const spaceBelow = vh - (hole.top + hole.height);
  const placeBelow = spaceBelow > tipSize.h + GAP + EDGE || hole.top < tipSize.h + GAP + EDGE;
  const tipTop = placeBelow
    ? Math.min(hole.top + hole.height + GAP, vh - tipSize.h - EDGE)
    : Math.max(hole.top - tipSize.h - GAP, EDGE);

  const targetCenterX = rect.left + rect.width / 2;
  const maxWidth = Math.min(320, vw - EDGE * 2);
  const tipLeft = Math.max(
    EDGE,
    Math.min(targetCenterX - tipSize.w / 2, vw - tipSize.w - EDGE),
  );
  const arrowLeft = Math.max(16, Math.min(targetCenterX - tipLeft, tipSize.w - 16));

  const isLast = index === steps.length - 1;
  const step = steps[index]!;

  return (
    <div className="fixed inset-0 z-[3000] animate-fade-in">
      {/* dim + spotlight cutout */}
      <div
        className="pointer-events-none absolute rounded-2xl ring-2 ring-white/80 transition-all duration-300 ease-out"
        style={{
          top: hole.top,
          left: hole.left,
          width: hole.width,
          height: hole.height,
          borderRadius: step.radius ?? 16,
          boxShadow: "0 0 0 9999px rgba(15, 18, 25, 0.62)",
        }}
      />
      {/* interaction blocker (spotlight stays visually clickable, taps advance) */}
      <button
        aria-label="次へ"
        onClick={() => (isLast ? markTourComplete(id) : setIndex((i) => i + 1))}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
      />

      {/* tooltip */}
      <div
        ref={tooltipRef}
        className="absolute animate-scale-in rounded-2xl bg-card p-4 shadow-2xl ring-1 ring-black/10 transition-all duration-300 ease-out"
        style={{ top: tipTop, left: tipLeft, width: maxWidth }}
      >
        {/* arrow */}
        <span
          className={cn(
            "absolute h-3 w-3 rotate-45 bg-card ring-1 ring-black/10",
            placeBelow ? "-top-1.5" : "-bottom-1.5",
          )}
          style={{
            left: arrowLeft - 6,
            clipPath: placeBelow
              ? "polygon(0 0, 100% 0, 0 100%)"
              : "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        />

        {step.title && <div className="text-sm font-bold">{step.title}</div>}
        <p className="mt-1 text-[13px] leading-relaxed text-foreground/80">{step.body}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-muted-foreground">
            {index + 1} / {steps.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => markTourComplete(id)}
              className="rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted"
            >
              スキップ
            </button>
            <button
              onClick={() => (isLast ? markTourComplete(id) : setIndex((i) => i + 1))}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition active:scale-95"
            >
              {isLast ? finalLabel : "次へ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}