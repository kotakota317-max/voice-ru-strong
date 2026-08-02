import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { X, MapPin, Clock, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ClientOnly } from "@/components/ClientOnly";
import { TYPE_COLOR, type IncidentType } from "@/lib/incident-types";
const IncidentPinMap = lazy(() => import("@/components/IncidentPinMap").then((m) => ({ default: m.IncidentPinMap })));
import { SuspectAvatar } from "@/components/SuspectAvatar";
import { INCIDENT_PINS, SUSPECTS } from "@/lib/incidents-data";

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

function IncidentMapScreen() {
  const [selected, setSelected] = useState<(typeof INCIDENT_PINS)[number] | null>(null);

  return (
    <AppShell fullBleed>
      <div className="relative w-full" style={{ height: "calc(100vh - 80px)" }}>
        <div className="absolute inset-0">
          <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
              <IncidentPinMap pins={INCIDENT_PINS} onPinClick={(p) => setSelected(INCIDENT_PINS.find((x) => x.id === p.id) ?? null)} />
            </Suspense>
          </ClientOnly>
        </div>

        {/* Legend */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="pointer-events-auto rounded-2xl bg-white/95 p-2.5 shadow-lg ring-1 ring-black/5 backdrop-blur">
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

        {INCIDENT_PINS.length === 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-28 z-[1000] px-3">
            <div className="rounded-3xl bg-white/95 p-5 text-center shadow-2xl ring-1 ring-black/5 backdrop-blur">
              <p className="text-sm font-semibold">まだ投稿はありません</p>
              <p className="mt-1 text-xs text-muted-foreground">No reports yet.</p>
            </div>
          </div>
        )}

        {selected && (
          <div className="absolute inset-x-0 bottom-24 z-[1000] px-3">
            <div className="rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
              <button onClick={() => setSelected(null)} className="absolute right-3 top-3 rounded-full bg-muted p-1">
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-start gap-3">
                <SuspectAvatar
                  features={SUSPECTS.find((s) => s.id === selected.suspectId)?.features ?? {}}
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
    </AppShell>
  );
}