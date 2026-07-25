import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SuspectAvatar, type SuspectFeatures } from "@/components/SuspectAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "報告する — Safeguard" },
      { name: "description", content: "被害を匿名で報告し、加害者の外見特徴からアバターを組み立てて共有できます。" },
      { property: "og:title", content: "報告する — Safeguard" },
      { property: "og:description", content: "被害を匿名で報告し、加害者の外見特徴からアバターを組み立てて共有できます。" },
    ],
  }),
  component: ReportScreen,
});

type OptionGroup = {
  key: keyof SuspectFeatures;
  label: string;
  options: { value: string; label: string }[];
};

const GROUPS: OptionGroup[] = [
  { key: "hairStyle", label: "髪型", options: [
    { value: "short", label: "短髪" }, { value: "long", label: "長髪" },
    { value: "center-part", label: "センター分け" }, { value: "buzz", label: "坊主" },
    { value: "bald", label: "禿頭" },
  ]},
  { key: "bangs", label: "前髪", options: [
    { value: "none", label: "なし" }, { value: "straight", label: "ぱっつん" },
    { value: "swept", label: "流し" }, { value: "split", label: "分け" },
  ]},
  { key: "hairColor", label: "髪色", options: [
    { value: "black", label: "黒" }, { value: "brown", label: "茶" },
    { value: "blonde", label: "金" }, { value: "gray", label: "白髪" },
  ]},
  { key: "faceShape", label: "顔型", options: [
    { value: "oval", label: "卵型" }, { value: "round", label: "丸型" },
    { value: "square", label: "四角" }, { value: "long", label: "面長" },
  ]},
  { key: "skinTone", label: "肌の色", options: [
    { value: "light", label: "色白" }, { value: "medium", label: "普通" },
    { value: "tan", label: "小麦色" }, { value: "dark", label: "浅黒い" },
  ]},
  { key: "eyes", label: "目", options: [
    { value: "small", label: "小さい" }, { value: "average", label: "普通" },
    { value: "large", label: "大きい" }, { value: "narrow", label: "細い" },
  ]},
  { key: "brows", label: "眉毛", options: [
    { value: "thin", label: "細い" }, { value: "average", label: "普通" }, { value: "thick", label: "太い" },
  ]},
  { key: "nose", label: "鼻", options: [
    { value: "small", label: "小さい" }, { value: "average", label: "普通" }, { value: "large", label: "大きい" },
  ]},
  { key: "mouth", label: "口", options: [
    { value: "thin", label: "薄い" }, { value: "average", label: "普通" }, { value: "full", label: "厚い" },
  ]},
  { key: "beard", label: "ひげ", options: [
    { value: "none", label: "なし" }, { value: "stubble", label: "無精ひげ" },
    { value: "goatee", label: "顎ひげ" }, { value: "full", label: "フル" },
  ]},
  { key: "facewear", label: "眼鏡・マスク", options: [
    { value: "none", label: "なし" }, { value: "glasses", label: "眼鏡" },
    { value: "black-glasses", label: "黒縁眼鏡" }, { value: "sunglasses", label: "サングラス" },
    { value: "white-mask", label: "白マスク" }, { value: "black-mask", label: "黒マスク" },
  ]},
  { key: "headwear", label: "帽子", options: [
    { value: "none", label: "なし" }, { value: "black-cap", label: "黒キャップ" },
    { value: "white-cap", label: "白キャップ" }, { value: "hat", label: "ハット" },
  ]},
  { key: "top", label: "服装（上・種類）", options: [
    { value: "tshirt", label: "Tシャツ" }, { value: "hoodie-navy", label: "パーカー" },
    { value: "jacket", label: "ジャケット" }, { value: "suit", label: "スーツ" },
  ]},
  { key: "topColor", label: "服装（上・色）", options: [
    { value: "black", label: "黒" }, { value: "white", label: "白" },
    { value: "gray", label: "グレー" }, { value: "navy", label: "ネイビー" },
    { value: "red", label: "赤" }, { value: "green", label: "緑" },
  ]},
  { key: "bottom", label: "服装（下・種類）", options: [
    { value: "jeans", label: "ジーンズ" }, { value: "slacks", label: "スラックス" },
    { value: "shorts", label: "ショートパンツ" }, { value: "skirt", label: "スカート" },
  ]},
  { key: "bottomColor", label: "服装（下・色）", options: [
    { value: "black", label: "黒" }, { value: "blue", label: "青" },
    { value: "gray", label: "グレー" }, { value: "beige", label: "ベージュ" },
  ]},
  { key: "shoes", label: "靴", options: [
    { value: "sneakers-white", label: "白スニーカー" }, { value: "sneakers-black", label: "黒スニーカー" },
    { value: "leather", label: "革靴" }, { value: "boots", label: "ブーツ" },
  ]},
  { key: "bag", label: "バッグ", options: [
    { value: "none", label: "なし" }, { value: "black-backpack", label: "黒リュック" },
    { value: "shoulder-bag", label: "ショルダー" }, { value: "handbag", label: "手提げ" },
  ]},
  { key: "accessory", label: "アクセサリー", options: [
    { value: "none", label: "なし" }, { value: "watch", label: "腕時計" },
    { value: "earring", label: "ピアス" }, { value: "necklace", label: "ネックレス" },
  ]},
  { key: "ageGroup", label: "年齢層", options: [
    { value: "teen", label: "10代" }, { value: "20s", label: "20代" },
    { value: "30s", label: "30代" }, { value: "40s", label: "40代" },
    { value: "50s", label: "50代" }, { value: "60plus", label: "60代以上" },
  ]},
  { key: "height", label: "身長", options: [
    { value: "short", label: "低い(〜165)" }, { value: "average", label: "普通(165-175)" }, { value: "tall", label: "高い(175〜)" },
  ]},
  { key: "build", label: "体格", options: [
    { value: "slim", label: "細身" }, { value: "average", label: "普通" }, { value: "large", label: "大柄" },
  ]},
];

function ReportScreen() {
  const [type, setType] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [place, setPlace] = useState("");
  const [station, setStation] = useState("");
  const [line, setLine] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [detail, setDetail] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "unknown">("male");
  const [notes, setNotes] = useState("");
  const [features, setFeatures] = useState<SuspectFeatures>({
    gender: "male",
    hairColor: "black",
    hairStyle: "short",
    bangs: "none",
    faceShape: "oval",
    skinTone: "light",
    eyes: "average",
    brows: "average",
    nose: "average",
    mouth: "average",
    beard: "none",
    headwear: "none",
    facewear: "none",
    top: "tshirt",
    bag: "none",
  });

  const chosenCount = useMemo(
    () => Object.values(features).filter((v) => v && v !== "none").length,
    [features],
  );

  return (
    <AppShell title="報告する">
      <div className="space-y-5 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          匿名で報告できます。位置情報とAIの分析により、危険エリアの可視化に役立ちます。
        </p>

        {/* Type */}
        <div className="space-y-1.5">
          <Label>被害種別</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="種別を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="痴漢">痴漢</SelectItem>
              <SelectItem value="盗撮">盗撮</SelectItem>
              <SelectItem value="ストーカー">ストーカー</SelectItem>
              <SelectItem value="性暴力">性暴力</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <Label>日時</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy/MM/dd HH:mm") : "日時を選択"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Place */}
        <div className="space-y-1.5">
          <Label>場所</Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="例: 新宿駅 東口" className="pl-9" />
          </div>
        </div>

        {/* Station / Line / Car */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>駅名</Label>
            <Input value={station} onChange={(e) => setStation(e.target.value)} placeholder="例: 新宿駅" />
          </div>
          <div className="space-y-1.5">
            <Label>路線名</Label>
            <Input value={line} onChange={(e) => setLine(e.target.value)} placeholder="例: 山手線" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>車両番号</Label>
            <Input value={carNumber} onChange={(e) => setCarNumber(e.target.value)} placeholder="例: 3号車" />
          </div>
        </div>

        {/* Detail */}
        <div className="space-y-1.5">
          <Label>状況の詳細</Label>
          <Textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="いつ・どこで・何が起きたか" rows={4} />
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <Label>加害者の性別（推定）</Label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { v: "male", l: "男性" },
              { v: "female", l: "女性" },
              { v: "unknown", l: "わからない" },
            ] as const).map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => {
                  setGender(o.v);
                  setFeatures((f) => ({ ...f, gender: o.v }));
                }}
                className={cn(
                  "rounded-xl border py-2 text-sm font-semibold transition",
                  gender === o.v
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {/* Suspect builder */}
        <div className="rounded-3xl border border-border bg-card p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-bold">加害者の特徴</div>
              <div className="text-[11px] text-muted-foreground">選択に応じてアバターが更新されます</div>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {chosenCount}項目選択済
            </span>
          </div>

          <div className="mt-3 flex justify-center">
            <SuspectAvatar features={features} size={140} className="ring-4 ring-white shadow-lg" />
          </div>

          <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {GROUPS.map((g) => (
              <div key={g.key}>
                <div className="mb-1 text-[11px] font-semibold text-muted-foreground">{g.label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {g.options.map((o) => {
                    const active = (features as any)[g.key] === o.value;
                    return (
                      <button
                        key={o.value as string}
                        type="button"
                        onClick={() => setFeatures((f) => ({ ...f, [g.key]: o.value }))}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted",
                        )}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <div className="mb-1 text-[11px] font-semibold text-muted-foreground">その他特徴</div>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ほくろ・傷・タトゥー・話し方・アクセントなど"
                rows={3}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Pattern recognition notice */}
        <div className="flex items-start gap-2 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-xs text-orange-900">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="leading-relaxed">
            <span className="font-bold">この特徴に一致する報告が近くで複数確認されています。</span>
            <br />
            同一人物による連続犯行の可能性があります。
          </p>
        </div>

        <Button size="lg" className="h-14 w-full rounded-2xl text-base font-bold">
          <Send className="mr-2 h-5 w-5" />
          報告を送信
        </Button>
      </div>
    </AppShell>
  );
}