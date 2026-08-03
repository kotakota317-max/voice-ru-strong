import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SuspectFeatures } from "@/components/SuspectAvatar";
import type { IncidentType } from "@/lib/incident-types";

export type ReportRow = {
  id: string;
  type: string;
  occurred_at: string;
  place: string;
  station: string;
  line: string;
  car_number: string;
  detail: string;
  suspect_gender: string;
  suspect_features: SuspectFeatures;
  suspect_notes: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

export type NewReport = {
  type: string;
  occurred_at: string;
  place: string;
  station: string;
  line: string;
  car_number: string;
  detail: string;
  suspect_gender: string;
  suspect_features: SuspectFeatures;
  suspect_notes: string;
  lat: number | null;
  lng: number | null;
};

export const INCIDENT_TYPES: IncidentType[] = ["痴漢", "盗撮", "ストーカー", "性暴力"];

export function asIncidentType(value: string): IncidentType {
  return (INCIDENT_TYPES as string[]).includes(value) ? (value as IncidentType) : "痴漢";
}

export async function fetchReports(): Promise<ReportRow[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("occurred_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ReportRow[];
}

export const reportsQueryOptions = queryOptions({
  queryKey: ["reports"],
  queryFn: fetchReports,
});

export async function createReport(input: NewReport): Promise<ReportRow> {
  const { data, error } = await supabase
    .from("reports")
    .insert(input as never)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as ReportRow;
}

/** Best-effort browser geolocation; resolves to null when unavailable or denied. */
export function getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 300000 },
    );
  });
}

export function formatOccurredAt(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function describeSuspect(features: SuspectFeatures, notes: string): string {
  const parts = Object.values(features ?? {}).filter((v) => v && v !== "none").length;
  const base = `特徴 ${parts}項目が登録されています`;
  return notes ? `${base}／${notes}` : base;
}
