import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, ShieldAlert, Heart, Bookmark, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { SpotlightTour } from "@/components/onboarding/SpotlightTour";
import { FEED_TOUR } from "@/components/onboarding/tours";
import { SuspectAvatar } from "@/components/SuspectAvatar";
import { TYPE_COLOR } from "@/lib/incident-types";
import {
  reportsQueryOptions,
  asIncidentType,
  formatOccurredAt,
  describeSuspect,
} from "@/lib/reports";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "フィード — Safeguard" },
      { name: "description", content: "近くで共有された被害報告をSNS感覚で確認できるフィード。" },
      { property: "og:title", content: "フィード — Safeguard" },
      { property: "og:description", content: "近くで共有された被害報告をSNS感覚で確認できるフィード。" },
    ],
  }),
  component: FeedScreen,
});

function FeedScreen() {
  const { data: reports = [], isLoading, isError, error } = useQuery(reportsQueryOptions);

  return (
    <AppShell title="フィード">
      <div className="space-y-3 p-3" data-tour="feed-list">
        <div className="rounded-2xl bg-primary/5 p-3 text-xs text-foreground/80">
          共有された被害報告です。コメント機能はありません。連帯と注意喚起のためのタイムラインです。
        </div>

        {isError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            投稿の読み込みに失敗しました: {(error as Error).message}
          </div>
        )}

        {isLoading && (
          <div className="rounded-3xl border border-border bg-card py-12 text-center text-xs text-muted-foreground">
            読み込み中…
          </div>
        )}

        {!isLoading && !isError && reports.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-16 text-center">
            <ShieldAlert className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-semibold">まだ投稿はありません</p>
            <p className="mt-1 text-xs text-muted-foreground">No reports yet.</p>
          </div>
        )}

        {reports.map((r, idx) => {
          const p = {
            id: r.id,
            type: asIncidentType(r.type),
            time: formatOccurredAt(r.occurred_at),
            place: [r.place, r.station, r.line, r.car_number].filter(Boolean).join(" / ") || "場所未設定",
            detail: r.detail || "詳細は記載されていません。",
            suspect: { label: describeSuspect(r.suspect_features, r.suspect_notes), features: r.suspect_features },
          };
          return (
          <article
            key={p.id}
            data-tour={idx === 0 ? "feed-post" : undefined}
            className="rounded-3xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <SuspectAvatar features={p.suspect.features} size={56} className="ring-2 ring-white shadow" />
                <span
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-card"
                  style={{ background: TYPE_COLOR[p.type] }}
                  aria-label={p.type}
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: TYPE_COLOR[p.type] }}
                  >
                    {p.type}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {p.time}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {p.place}
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed">{p.detail}</p>

            <div className="mt-3 rounded-2xl bg-muted/50 p-2.5 text-[11px]">
              <span className="font-semibold">加害者の特徴:</span>{" "}
              <span className="text-muted-foreground">{p.suspect.label}</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-muted-foreground">
              <button className="flex items-center gap-1.5 text-xs font-medium">
                <Heart className="h-4 w-4" /> 共感
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium">
                <Bookmark className="h-4 w-4" /> 保存
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium">
                <Share2 className="h-4 w-4" /> 拡散
              </button>
            </div>
          </article>
          );
        })}
      </div>
      <SpotlightTour id="feed" steps={FEED_TOUR} finalLabel="使ってみる" />
    </AppShell>
  );
}