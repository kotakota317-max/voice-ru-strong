import type { TourStep } from "@/lib/onboarding";

export const APP_TOUR: TourStep[] = [
  {
    selector: '[data-tour="nav-report"]',
    title: "報告する",
    body: "ここから被害を報告できます。起きたことを、書ける範囲で残せます。",
    radius: 12,
  },
  {
    selector: '[data-tour="nav-feed"]',
    title: "フィード",
    body: "みんなの投稿を確認できます。ほかの方が共有した報告を見られます。",
    radius: 12,
  },
  {
    selector: '[data-tour="nav-map"]',
    title: "被害マップ",
    body: "報告された被害の場所を地図で確認できます。",
    radius: 12,
  },
  {
    selector: '[data-tour="nav-profile"]',
    title: "プロフィール",
    body: "プロフィールや設定を確認できます。",
    radius: 12,
  },
];

export const REPORT_TOUR: TourStep[] = [
  {
    selector: '[data-tour="report-type"]',
    body: "まず、どんな被害だったか選択します。",
  },
  {
    selector: '[data-tour="report-suspect"]',
    body: "覚えている範囲で、相手の特徴を入力できます。すべて分からなくて大丈夫です。",
  },
  {
    selector: '[data-tour="report-location"]',
    body: "被害が起きた場所を設定できます。",
  },
  {
    selector: '[data-tour="report-submit"]',
    body: "内容を確認して、報告を投稿します。",
  },
];

export const FEED_TOUR: TourStep[] = [
  {
    selector: '[data-tour="feed-list"]',
    body: "ここでは、みんなの報告を見ることができます。",
  },
  {
    selector: '[data-tour="feed-filter"]',
    body: "条件を絞って、必要な情報を探せます。",
  },
  {
    selector: '[data-tour="feed-post"]',
    body: "投稿をタップすると、詳しい情報を確認できます。",
  },
];

export const MAP_TOUR: TourStep[] = [
  {
    selector: '[data-tour="map-canvas"]',
    body: "報告された被害を地図上で確認できます。",
  },
  {
    selector: ".leaflet-marker-icon",
    body: "ピンをタップすると、その場所で報告された内容を確認できます。",
  },
  {
    selector: '[data-tour="map-legend"]',
    body: "被害の種類などで表示を絞り込めます。",
  },
];

export const PROFILE_TOUR: TourStep[] = [
  {
    selector: '[data-tour="profile-card"]',
    body: "プロフィールを確認・編集できます。",
  },
  {
    selector: '[data-tour="profile-settings"]',
    body: "通知などの設定を変更できます。",
  },
  {
    selector: '[data-tour="profile-replay"]',
    body: "オンボーディングをもう一度見ることもできます。",
  },
];