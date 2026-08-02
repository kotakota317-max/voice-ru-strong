import type { SuspectFeatures } from "@/components/SuspectAvatar";
import type { DangerZone } from "@/components/DangerMap";
import type { IncidentPin, IncidentType } from "@/components/IncidentPinMap";

export const ZONES: DangerZone[] = [];

export const INCIDENT_DOTS: { id: string; pos: [number, number] }[] = [];

export const SUSPECTS: { id: string; label: string; features: SuspectFeatures }[] = [];

export const INCIDENT_PINS: (IncidentPin & {
  time: string;
  place: string;
  detail: string;
  nearbyReports: number;
  suspectId: string;
})[] = [];

export const FEED_POSTS: {
  id: string;
  type: IncidentType;
  time: string;
  place: string;
  detail: string;
  suspect: { label: string; features: SuspectFeatures };
}[] = [];