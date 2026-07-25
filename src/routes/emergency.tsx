import { createFileRoute, Link } from "@tanstack/react-router";
import { Siren, VolumeX, Phone, ArrowLeft, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "緊急通報 — Safeguard" },
      { name: "description", content: "サイレンや無音SOSで即時に助けを求められる緊急画面。" },
      { property: "og:title", content: "緊急通報 — Safeguard" },
      { property: "og:description", content: "サイレンや無音SOSで即時に助けを求められる緊急画面。" },
    ],
  }),
  component: EmergencyScreen,
});

const CONTACTS = [
  { label: "母", tel: "090-0000-0001" },
  { label: "父", tel: "090-0000-0002" },
  { label: "友達", tel: "090-0000-0003" },
  { label: "恋人", tel: "090-0000-0004" },
];

function EmergencyScreen() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-gradient-to-b from-red-600 via-red-700 to-red-900 text-white">
      <header className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <Link to="/" className="flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> 戻る
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest opacity-80">Emergency</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-start px-4 pb-8">
        {/* Main siren button */}
        <button
          className={`mt-4 flex h-72 w-72 flex-col items-center justify-center rounded-full bg-white text-red-700 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] ring-8 ring-white/30 transition-transform active:scale-95 ${
            pulse ? "scale-[1.03]" : "scale-100"
          }`}
        >
          <Siren className="h-16 w-16" />
          <span className="mt-2 text-2xl font-black leading-tight">痴漢です！</span>
          <span className="text-lg font-bold">助けてください！</span>
          <span className="mt-2 text-[11px] font-medium opacity-70">タップで大音量サイレン</span>
        </button>

        {/* Silent SOS */}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-black/30 py-4 text-sm font-semibold ring-1 ring-white/20 backdrop-blur active:scale-[0.98]">
          <VolumeX className="h-5 w-5" />
          無音SOSを送信
        </button>

        {/* Contacts */}
        <div className="mt-6 w-full">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-80">よく使う連絡先</div>
          <div className="grid grid-cols-4 gap-2">
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={`tel:${c.tel}`}
                className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-3 text-xs font-bold ring-1 ring-white/20 active:scale-95"
              >
                <Phone className="h-5 w-5" />
                {c.label}
              </a>
            ))}
          </div>
        </div>

        {/* Mini map */}
        <div className="mt-6 w-full overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
          <div className="flex items-center gap-2 px-3 py-2 text-xs">
            <MapPin className="h-4 w-4" /> 現在地: 新宿区新宿3丁目付近
          </div>
          <div className="relative h-32">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90"
              style={{
                backgroundImage:
                  "url('https://a.basemaps.cartocdn.com/light_all/13/7276/3225.png'), linear-gradient(135deg,#fff,#eee)",
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 ring-4 ring-white shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}