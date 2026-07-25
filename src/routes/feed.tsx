import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, ShieldAlert, Heart, Bookmark, Share2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SuspectAvatar } from "@/components/SuspectAvatar";
import { TYPE_COLOR } from "@/lib/incident-types";
import { FEED_POSTS } from "@/lib/incidents-data";

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
  return (
    <AppShell title="フィード">
      <div className="space-y-3 p-3">
        <div className="rounded-2xl bg-primary/5 p-3 text-xs text-foreground/80">
          共有された被害報告です。コメント機能はありません。連帯と注意喚起のためのタイムラインです。
        </div>

        {FEED_POSTS.map((p) => (
          <article key={p.id} className="rounded-3xl border border-border bg-card p-4 shadow-sm">
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
        ))}
      </div>
    </AppShell>
  );
}