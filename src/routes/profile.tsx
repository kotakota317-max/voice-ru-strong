import { createFileRoute } from "@tanstack/react-router";
import { FileText, Bookmark, Phone, Bell, Lock, Info, ChevronRight, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";

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
  { icon: FileText, label: "自分の投稿", meta: "3件" },
  { icon: Bookmark, label: "保存したエリア", meta: "5件" },
  { icon: Phone, label: "緊急連絡先", meta: "4件登録済" },
  { icon: Bell, label: "通知設定", meta: "オン" },
  { icon: Lock, label: "プライバシー設定", meta: "匿名モード" },
  { icon: Info, label: "アプリについて", meta: "v1.0.0" },
];

function ProfileScreen() {
  return (
    <AppShell title="プロフィール">
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-7 w-7" />
          </div>
          <div>
            <div className="text-sm font-bold">匿名ユーザー</div>
            <div className="text-[11px] text-muted-foreground">ID非公開・位置情報のみ共有</div>
          </div>
        </div>

        <ul className="overflow-hidden rounded-3xl border border-border bg-card">
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

        <p className="px-2 text-[10px] leading-relaxed text-muted-foreground">
          Safeguard は投稿を匿名化し、位置情報はエリア単位で集計します。個人を特定する情報は保存されません。
        </p>
      </div>
    </AppShell>
  );
}