import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Bookmark, Phone, Bell, Lock, Info, ChevronRight, User, HelpCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SpotlightTour } from "@/components/onboarding/SpotlightTour";
import { PROFILE_TOUR } from "@/components/onboarding/tours";
import { resetTour, TOUR_LABELS, type TourId } from "@/lib/onboarding";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "プロフィール — Safeguard" },
      { name: "description", content: "投稿履歴・保存エリア・緊急連絡先・通知やプライバシー設定を管理。" },
      { property: "og:title", content: "プロフィール — Safeguard" },
      { property: "og:description", content: "投稿履歴・保存エリア・緊急連絡先・通知やプライバシー設定を管理。" },
    ],
  }),
  component: ProfileScreen,
});

const SECTIONS = [
  { icon: FileText, label: "自分の投稿", meta: "0件" },
  { icon: Bookmark, label: "保存したエリア", meta: "0件" },
  { icon: Phone, label: "緊急連絡先", meta: "未登録" },
  { icon: Bell, label: "通知設定", meta: "オン" },
  { icon: Lock, label: "プライバシー設定", meta: "匿名モード" },
  { icon: Info, label: "アプリについて", meta: "v1.0.0" },
];

function ProfileScreen() {
  const navigate = useNavigate();
  const [replayOpen, setReplayOpen] = useState(false);

  const REPLAY_TARGETS: { id: TourId; to: "/" | "/report" | "/feed" | "/incidents" | "/profile" }[] = [
    { id: "app", to: "/profile" },
    { id: "report", to: "/report" },
    { id: "feed", to: "/feed" },
    { id: "map", to: "/incidents" },
  ];

  const replay = (id: TourId, to: "/" | "/report" | "/feed" | "/incidents" | "/profile") => {
    resetTour(id);
    setReplayOpen(false);
    if (id !== "app") navigate({ to });
  };

  return (
    <AppShell title="プロフィール">
      <div className="space-y-4 p-4">
        <div data-tour="profile-card" className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-7 w-7" />
          </div>
          <div>
            <div className="text-sm font-bold">匿名ユーザー</div>
            <div className="text-[11px] text-muted-foreground">ID非公開・位置情報のみ共有</div>
          </div>
        </div>

        <ul data-tour="profile-settings" className="overflow-hidden rounded-3xl border border-border bg-card">
          {SECTIONS.map((s, i) => (
            <li key={s.label} className={i > 0 ? "border-t border-border" : ""}>
              <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-muted/40">
                <s.icon className="h-5 w-5 text-primary" />
                <span className="flex-1 text-sm font-medium">{s.label}</span>
                <span className="text-[11px] text-muted-foreground">{s.meta}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>

        <button
          data-tour="profile-replay"
          onClick={() => setReplayOpen(true)}
          className="flex w-full items-center gap-3 rounded-3xl border border-border bg-card px-4 py-3.5 text-left transition hover:bg-muted/40"
        >
          <HelpCircle className="h-5 w-5 text-primary" />
          <span className="flex-1 text-sm font-medium">使い方をもう一度見る</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <p className="px-2 text-[10px] leading-relaxed text-muted-foreground">
          Safeguard は投稿を匿名化し、位置情報はエリア単位で集計します。個人を特定する情報は保存されません。
        </p>
      </div>

      <Dialog open={replayOpen} onOpenChange={setReplayOpen}>
        <DialogContent className="max-w-[20rem] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base">チュートリアルをもう一度見る</DialogTitle>
            <DialogDescription className="text-xs">
              見たい案内を選んでください。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {REPLAY_TARGETS.map((t) => (
              <button
                key={t.id}
                onClick={() => replay(t.id, t.to)}
                className="flex w-full items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-medium transition hover:bg-muted/50"
              >
                {TOUR_LABELS[t.id]}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <SpotlightTour id="profile" steps={PROFILE_TOUR} finalLabel="使ってみる" />
    </AppShell>
  );
}