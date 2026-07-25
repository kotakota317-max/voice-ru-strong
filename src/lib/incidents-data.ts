import type { SuspectFeatures } from "@/components/SuspectAvatar";
import type { DangerZone } from "@/components/DangerMap";
import type { IncidentPin, IncidentType } from "@/components/IncidentPinMap";

export const ZONES: DangerZone[] = [
  { id: "shinjuku", name: "新宿駅周辺", center: [35.6896, 139.7006], radius: 900, level: "critical", reports: 42 },
  { id: "shibuya", name: "渋谷駅周辺", center: [35.658, 139.7016], radius: 850, level: "danger", reports: 31 },
  { id: "ikebukuro", name: "池袋駅周辺", center: [35.7295, 139.7109], radius: 800, level: "danger", reports: 27 },
  { id: "roppongi", name: "六本木エリア", center: [35.6627, 139.7314], radius: 600, level: "caution", reports: 12 },
  { id: "ueno", name: "上野駅周辺", center: [35.7138, 139.7772], radius: 700, level: "caution", reports: 14 },
  { id: "tokyo", name: "東京駅周辺", center: [35.6812, 139.7671], radius: 500, level: "safe", reports: 3 },
  { id: "akihabara", name: "秋葉原駅周辺", center: [35.6984, 139.7731], radius: 550, level: "danger", reports: 22 },
];

export const INCIDENT_DOTS: { id: string; pos: [number, number] }[] = [
  { id: "d1", pos: [35.6905, 139.7025] },
  { id: "d2", pos: [35.688, 139.6985] },
  { id: "d3", pos: [35.66, 139.7] },
  { id: "d4", pos: [35.7305, 139.7115] },
  { id: "d5", pos: [35.6975, 139.7745] },
  { id: "d6", pos: [35.663, 139.732] },
];

export const SUSPECTS: { id: string; label: string; features: SuspectFeatures }[] = [
  {
    id: "s1",
    label: "20代・男性",
    features: { hairColor: "black", hairStyle: "short", headwear: "black-cap", facewear: "white-mask", top: "hoodie-black", bag: "black-backpack" },
  },
  {
    id: "s2",
    label: "30代・男性",
    features: { hairColor: "brown", hairStyle: "center-part", facewear: "glasses", top: "hoodie-navy" },
  },
  {
    id: "s3",
    label: "40代・男性",
    features: { hairColor: "black", hairStyle: "buzz", facewear: "black-glasses", top: "suit", bag: "shoulder-bag" },
  },
];

export const INCIDENT_PINS: (IncidentPin & {
  time: string;
  place: string;
  detail: string;
  nearbyReports: number;
  suspectId: string;
})[] = [
  { id: "p1", type: "痴漢", pos: [35.6905, 139.7025], time: "2026/07/24 22:15", place: "新宿駅 東口付近", detail: "満員電車内での被害", nearbyReports: 12, suspectId: "s1" },
  { id: "p2", type: "盗撮", pos: [35.658, 139.7016], time: "2026/07/23 19:40", place: "渋谷スクランブル交差点", detail: "エスカレーターで携帯を向けられた", nearbyReports: 8, suspectId: "s2" },
  { id: "p3", type: "ストーカー", pos: [35.7295, 139.7109], time: "2026/07/22 23:05", place: "池袋駅 西口", detail: "帰宅ルートを尾行された", nearbyReports: 5, suspectId: "s3" },
  { id: "p4", type: "性暴力", pos: [35.6627, 139.7314], time: "2026/07/20 01:20", place: "六本木交差点付近", detail: "路上で腕を掴まれた", nearbyReports: 3, suspectId: "s1" },
  { id: "p5", type: "痴漢", pos: [35.6975, 139.7745], time: "2026/07/24 08:10", place: "秋葉原駅ホーム", detail: "通勤ラッシュ時", nearbyReports: 9, suspectId: "s2" },
  { id: "p6", type: "盗撮", pos: [35.7138, 139.7772], time: "2026/07/21 17:30", place: "上野公園", detail: "ベンチ付近で不審な撮影", nearbyReports: 4, suspectId: "s3" },
];

export const FEED_POSTS: {
  id: string;
  type: IncidentType;
  time: string;
  place: string;
  detail: string;
  suspect: { label: string; features: SuspectFeatures };
}[] = [
  {
    id: "f1",
    type: "痴漢",
    time: "2時間前",
    place: "新宿駅・山手線ホーム",
    detail: "満員電車内で背後から接触された。周囲は気づかず。",
    suspect: { label: "黒髪・短髪・黒キャップ・白マスク・黒リュック", features: { hairColor: "black", hairStyle: "short", headwear: "black-cap", facewear: "white-mask", top: "hoodie-black", bag: "black-backpack" } },
  },
  {
    id: "f2",
    type: "ストーカー",
    time: "本日 07:20",
    place: "渋谷駅・道玄坂",
    detail: "駅から自宅方向まで約15分尾行された。声をかけると走って逃げた。",
    suspect: { label: "茶髪・センター分け・眼鏡・ネイビーのパーカー", features: { hairColor: "brown", hairStyle: "center-part", facewear: "glasses", top: "hoodie-navy" } },
  },
  {
    id: "f3",
    type: "盗撮",
    time: "昨日 18:45",
    place: "池袋駅・地下通路",
    detail: "エスカレーターで下からスマートフォンを向けられた。",
    suspect: { label: "坊主・黒縁眼鏡・スーツ・ショルダーバッグ", features: { hairColor: "black", hairStyle: "buzz", facewear: "black-glasses", top: "suit", bag: "shoulder-bag" } },
  },
];