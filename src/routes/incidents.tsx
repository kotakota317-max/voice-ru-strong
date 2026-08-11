import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { X, MapPin, Clock, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SpotlightTour } from "@/components/onboarding/SpotlightTour";
import { MAP_TOUR } from "@/components/onboarding/tours";
import { ClientOnly } from "@/components/ClientOnly";
import { TYPE_COLOR, type IncidentType } from "@/lib/incident-types";
const IncidentPinMap = lazy(() => import("@/components/IncidentPinMap").then((m) => ({ default: m.IncidentPinMap })));
import { SuspectAvatar } from "@/components/SuspectAvatar";
import { useQuery } from "@tanstack/react-query";
import {
  reportsQueryOptions,
  asIncidentType,
  formatOccurredAt,
  describeSuspect,
  resolveIncidentLocation,
  type ReportRow,
} from "@/lib/reports";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "被害マップ — Safeguard" },
      { name: "description", content: "被害種別ごとに色分けされたピンで被害地点を確認できます。" },
      { property: "og:title", content: "被害マップ — Safeguard" },
      { property: "og:description", content: "被害種別ごとに色分けされたピンで被害地点を確認できます。" },
    ],
  }),
  component: IncidentMapScreen,
});

const TYPES: IncidentType[] = ["痴漢", "盗撮", "ストーカー", "性暴力"];

type SelectedPin = {
  id: string;
  type: IncidentType;
  pos: [number, number];
  time: string;
  place: string;
  detail: string;
  suspect: ReportRow["suspect_features"];
  nearbyReports: number;
};

function IncidentMapScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resolvedCoords, setResolvedCoords] = useState<Record<string, [number, number]>>({});
  const { data: reports = [], isError, error } = useQuery(reportsQueryOptions);

  useEffect(() => {
    const unresolved = reports.filter(
      (r) =>
        (r.lat == null || r.lng == null) &&
        [r.place, r.station, r.line].some(Boolean) &&
        !(r.id in resolvedCoords),
    );

    if (unresolved.length === 0) return;

    let canceled = false;

    (async () => {
      const resolved = await Promise.all(
        unresolved.map(async (r) => {
          const query = [r.place, r.station, r.line].filter(Boolean).join(" ").trim();
          if (!query) return null;
          const coords = await resolveIncidentLocation(query);
          if (coords.lat == null || coords.lng == null) return null;
          return { id: r.id, coords: [coords.lat, coords.lng] as [number, number] };
        }),
      );

      if (canceled) return;

      setResolvedCoords((current) => {
        const next = { ...current };
        resolved.forEach((item) => {
          if (item) next[item.id] = item.coords;
        });
        return next;
      });
    })();

    return () => {
      canceled = true;
    };
  }, [reports, resolvedCoords]);

  const pins: SelectedPin[] = reports
    .map((r) => {
      const resolved = resolvedCoords[r.id];
      const lat = r.lat ?? resolved?.[0];
      const lng = r.lng ?? resolved?.[1];
      if (lat == null || lng == null) return null;
      return {
        id: r.id,
        type: asIncidentType(r.type),
        pos: [lat, lng] as [number, number],
        time: formatOccurredAt(r.occurred_at),
        place: [r.place, r.station, r.line, r.car_number].filter(Boolean).join(" / ") || "場所未設定",
        detail: describeSuspect(r.suspect_features, r.suspect_notes),
        suspect: r.suspect_features,
        nearbyReports: reports.length,
      };
    })
    .filter((p): p is SelectedPin => Boolean(p));

  const selected = pins.find((p) => p.id === selectedId) ?? null;

  return (
    <AppShell fullBleed>
      <div className="relative w-full" style={{ height: "calc(100vh - 80px)" }}>
        <div className="absolute inset-0" data-tour="map-canvas">
          <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
              <IncidentPinMap pins={pins} onPinClick={(p) => setSelectedId(p.id)} />
            </Suspense>
          </ClientOnly>
        </div>

        {/* Legend */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div
            data-tour="map-legend"
            className="pointer-events-auto rounded-2xl bg-white/95 p-2.5 shadow-lg ring-1 ring-black/5 backdrop-blur"
          >
            <div className="text-[11px] font-semibold text-muted-foreground">被害種別</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <span key={t} className="flex items-center gap-1.5 rounded-full bg-muted/60 px-2 py-1 text-[11px] font-medium">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: TYPE_COLOR[t] }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {pins.length === 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-28 z-[1000] px-3">
            <div className="rounded-3xl bg-white/95 p-5 text-center shadow-2xl ring-1 ring-black/5 backdrop-blur">
              <p className="text-sm font-semibold">まだ投稿はありません</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isError ? `読み込みに失敗しました: ${(error as Error).message}` : "No reports yet."}
              </p>
            </div>
          </div>
        )}

        {selected && (
          <div className="absolute inset-x-0 bottom-24 z-[1000] px-3">
            <div className="rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
              <button onClick={() => setSelectedId(null)} className="absolute right-3 top-3 rounded-full bg-muted p-1">
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-start gap-3">
                <SuspectAvatar
                  features={selected.suspect}
                  size={72}
                  className="ring-2 ring-white shadow"
                />
                <div className="flex-1">
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: TYPE_COLOR[selected.type] }}
                  >
                    {selected.type}
                  </span>
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {selected.time}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {selected.place}
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-muted/50 p-3 text-xs">
                <div className="mb-1 font-semibold">加害者の特徴</div>
                <p className="text-muted-foreground">{selected.detail}</p>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                <Users className="h-4 w-4 text-primary" />
                周辺の報告件数: <span className="font-semibold">{selected.nearbyReports}件</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <SpotlightTour id="map" steps={MAP_TOUR} finalLabel="使ってみる" />
    </AppShell>
  );
}