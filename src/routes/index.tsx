import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { Search, Sparkles, FileBarChart2, MapPin, Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ClientOnly } from "@/components/ClientOnly";
import type { DangerZone } from "@/components/DangerMap";
const DangerMap = lazy(() => import("@/components/DangerMap").then((m) => ({ default: m.DangerMap })));
import { SuspectAvatar } from "@/components/SuspectAvatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ZONES } from "@/lib/incidents-data";
import { reportsQueryOptions } from "@/lib/reports";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Voiceるー痴漢・ストーカー・性犯罪アプリ" },
      { name: "description", content: "痴漢は口にしてはいけないことではなく、れっきとした犯罪。\n私たちVoiceるは被害者が我慢しなくてもいい世の中を目指します。\n\n・サイレンと連動して家族や恋人に位置情報とSOS通知を送信\n・被害の詳細を加害者の似顔絵アバター付きで投稿＆シェア\n・投稿をAIが分析しマップで可視化\n\n誰もが安心して過ごせる未来を目指して！" },
      { property: "og:title", content: "Voiceるー痴漢・ストーカー・性犯罪アプリ" },
      { property: "og:description", content: "痴漢は口にしてはいけないことではなく、れっきとした犯罪。\n私たちVoiceるは被害者が我慢しなくてもいい世の中を目指します。\n\n・サイレンと連動して家族や恋人に位置情報とSOS通知を送信\n・被害の詳細を加害者の似顔絵アバター付きで投稿＆シェア\n・投稿をAIが分析しマップで可視化\n\n誰もが安心して過ごせる未来を目指して！" },
    ],
  }),
  component: DangerAreaScreen,
});

const LEVEL_META: Record<DangerZone["level"], { label: string; color: string }> = {
  safe: { label: "安全", color: "bg-emerald-500" },
  caution: { label: "注意", color: "bg-yellow-500" },
  danger: { label: "危険", color: "bg-orange-500" },
  critical: { label: "非常に危険", color: "bg-red-500" },
};

function DangerAreaScreen() {
  const [selected, setSelected] = useState<DangerZone | null>(ZONES[0] ?? null);
  const [sheetOpen, setSheetOpen] = useState(true);
  const { data: reports = [] } = useQuery(reportsQueryOptions);
  const incidentDots = reports
    .filter((r) => r.lat != null && r.lng != null)
    .map((r) => ({ id: r.id, pos: [r.lat as number, r.lng as number] as [number, number] }));

  return (
    <AppShell fullBleed>
      <div className="relative w-full" style={{ height: "calc(100vh - 80px)" }}>
        {/* Map layer */}
        <div className="absolute inset-0">
          <ClientOnly
            fallback={<div className="h-full w-full animate-pulse bg-muted" />}
          >
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
              <DangerMap
                zones={ZONES}
                incidents={incidentDots}
                onZoneClick={(z) => {
                  setSelected(z);
                  setSheetOpen(true);
                }}
              />
            </Suspense>
          </ClientOnly>
        </div>

        {/* Search bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2.5 shadow-lg ring-1 ring-black/5 backdrop-blur">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="駅名・場所を検索"
              className="h-8 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="pointer-events-auto mt-2 flex flex-wrap gap-1.5">
            {(["safe", "caution", "danger", "critical"] as const).map((lvl) => (
              <span
                key={lvl}
                className="flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-medium shadow ring-1 ring-black/5"
              >
                <span className={`h-2 w-2 rounded-full ${LEVEL_META[lvl].color}`} />
                {LEVEL_META[lvl].label}
              </span>
            ))}
          </div>
        </div>

        {ZONES.length === 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-28 z-[1000] px-3">
            <div className="rounded-3xl bg-white/95 p-5 text-center shadow-2xl ring-1 ring-black/5 backdrop-blur">
              <p className="text-sm font-semibold">まだ投稿はありません</p>
              <p className="mt-1 text-xs text-muted-foreground">No reports yet.</p>
            </div>
          </div>
        )}

        {/* Slide-up info card */}
        {selected && sheetOpen && (
          <div className="absolute inset-x-0 bottom-24 z-[1000] px-3">
            <div className="rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
              <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-muted" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    エリア
                  </div>
                  <h2 className="text-lg font-bold">{selected.name}</h2>
                </div>
                <span
                  className={`rounded-full ${LEVEL_META[selected.level].color} px-2.5 py-1 text-[11px] font-bold text-white`}
                >
                  {LEVEL_META[selected.level].label}
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                最近の報告件数: <span className="font-semibold text-foreground">{selected.reports}件</span>（過去30日）
              </div>

              <div className="mt-4">
                <div className="mb-2 text-xs font-semibold">最近報告された特徴</div>
                <div className="flex gap-3">
                  {SUSPECTS.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-1">
                      <SuspectAvatar features={s.features} size={56} className="ring-2 ring-white shadow" />
                      <span className="text-[10px] text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-2xl bg-primary/5 p-3 text-xs">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="leading-relaxed text-foreground/80">
                  <span className="font-semibold">AIが投稿データを分析し、危険エリアを可視化しています。</span>
                  <br />
                  時間帯・曜日・過去の傾向から危険度を算出しています。
                </p>
              </div>

              <div className="mt-3 rounded-2xl border border-border p-3">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <FileBarChart2 className="h-4 w-4 text-primary" />
                  地域の警察署向けレポート
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  このエリアの匿名データを要約したPDFを生成できます。警察の判断材料としてご利用ください。
                </p>
                <Button className="mt-2 h-9 w-full text-xs">AIレポートを作成</Button>
              </div>

              <button
                onClick={() => setSheetOpen(false)}
                className="mt-3 flex w-full items-center justify-center gap-1 text-[11px] text-muted-foreground"
              >
                <Info className="h-3 w-3" /> カードを閉じる
              </button>
            </div>
          </div>
        )}

        {!sheetOpen && selected && (
          <button
            onClick={() => setSheetOpen(true)}
            className="absolute inset-x-0 bottom-24 z-[1000] mx-auto w-max rounded-full bg-white px-4 py-2 text-xs font-medium shadow-lg ring-1 ring-black/5"
          >
            {selected.name} の情報を表示
          </button>
        )}
      </div>
    </AppShell>
  );
}