# SafePath Japan

App Name: Voiceる（ボイスル）

Type: iPhone mobile web app (PWA-ready)

Language: All interface text must be Japanese only. No English anywhere.

Target: People who commute by train in Japan; victims of 痴漢, 盗撮, ストーカー, 性暴力

CRITICAL RULES

Do NOT create login, signup, onboarding, tutorial, or welcome screens

The app opens directly to the AI危険エリアマップ (full-screen map)

A floating red emergency button labeled 「緊急」 must be visible on every screen, bottom-right corner, always on top

Tapping the emergency button opens the Emergency screen immediately — no confirmation dialogs, no menus

Bottom navigation has 5 tabs: 報告する, 被害マップ, AI危険エリア, フィード, プロフィール

The emergency button is separate from bottom nav

Use Apple Human Interface Guidelines style: rounded cards, soft shadows, readable typography

Accent color: blue-purple (#6C63FF or similar)

Emergency color: bright red (#FF3B30)

No cartoon illustrations, no gaming style, no cute mascots

Design must feel trustworthy, modern, calm, and professional

SCREEN 1: AI危険エリア (Default Screen)

Full-screen Google Maps style map using Leaflet or Mapbox

Heatmap overlay with Snapchat-style colors:

Green = 安全

Yellow = 注意

Orange = 危険

Red = 非常に危険

Show multiple colored danger zones around major Tokyo stations (Shinjuku, Shibuya, Ikebukuro, etc.)

Display small incident markers on the map

Search bar at top: 「駅名・場所を検索」

Bottom info card (slides up when tapping an area):

エリア名

危険度

最近の報告件数

「最近報告された特徴」 section showing 3 small circular suspect avatars

Add a section explaining: 「AIが投稿データを分析し、危険エリアを可視化しています。」

Add a card: 「地域の警察署向けレポート」 with button 「AIレポートを作成」 (generates a summary report for police review — do NOT imply automatic police action)

SCREEN 2: 緊急通報 (Emergency Screen)

Large red emergency interface

Main button (large, prominent): 「痴漢です！助けてください！」

Below it: 「サイレンを鳴らして周囲へ知らせる」

Second button: 「サイレント通報」

Below: 「音を出さずに位置情報とSOSを送信」

Emergency contacts section with quick-select buttons: 母, 父, 友達, 恋人

Small map showing current location

This screen should feel urgent and simple — minimal text, big buttons

SCREEN 3: 報告する (Report Form)

Clean form with these fields:

被害種別 (select: 痴漢, 盗撮, ストーカー, 性暴力)

日時 (date/time picker)

場所 (text input)

駅名 (text input)

路線名 (text input)

車両番号 (text input)

状況説明 (textarea)

加害者情報 section (at the top of the form):

1. 加害者の性別（推定） — selectable buttons: 男性, 女性, わからない

2. Appearance Builder — organized as scrollable option rows. Each category shows the label and selectable buttons/chips. When the user taps an option, it highlights.

Categories and options:

髪型: 坊主, ベリーショート, ショート, ミディアム, ロング, ポニーテール, お団子, パーマ, くせ毛

前髪: なし, センター分け, 七三, ぱっつん, 右分け, 左分け, オールバック

髪色: 黒, 茶色, 金髪, 白髪, その他

顔型: 丸顔, 面長, ベース型, 卵型, 逆三角形

肌の色: 明るい, 普通, やや濃い, 濃い

目: 一重, 奥二重, 二重, つり目, たれ目, 細い, 大きい

眉毛: 細い, 太い, 濃い, 薄い, 平行, アーチ

鼻: 高い, 低い, 普通

口: 小さい, 普通, 大きい, 厚い唇, 薄い唇

ひげ: なし, 口ひげ, あごひげ, 両方

眼鏡: なし, 黒縁, 細フレーム, サングラス

マスク: なし, 白, 黒, その他

帽子: なし, キャップ, ニット帽, ハット

服装 — Upper body color: 白, 黒, グレー, ネイビー, 青, 赤, その他

服装 — Upper body type: Tシャツ, パーカー, シャツ, スーツ, 制服, ジャケット

服装 — Bottoms type: ズボン, 短パン, スカート, その他

服装 — Bottoms color: 黒, 紺, グレー, ベージュ

靴: スニーカー, 革靴, サンダル, ブーツ

バッグ: なし, リュック, ショルダーバッグ, トートバッグ, 手提げ

アクセサリー: なし, イヤホン, ピアス, ネックレス, 腕時計

年齢層: 10代, 20代, 30代, 40代, 50代以上

身長: 150cm未満, 150〜160cm, 160〜170cm, 170〜180cm, 180cm以上

体格: 細身, 普通, がっしり, 筋肉質, ふくよか

その他特徴 — text field with placeholder: 「ほくろ・傷・タトゥー・話し方・アクセントなど」

3. Avatar Preview — Below the options, show a realistic avatar generated based on selections. The avatar should update in real-time as options change. Style: clean, realistic facial composite / police sketch style — NOT cartoon or anime. Use SVG or canvas to render a composite face.

4. 報告を送信 — large submit button at bottom

5. Pattern Recognition Notice — If multiple reports match similar suspect features in the same area, show: 「この特徴に一致する報告が近くで複数確認されています」

SCREEN 4: 被害マップ (Incident Map)

Full-screen map with colored pins:

Red = 痴漢

Purple = 盗撮

Orange = ストーカー

Blue = 性暴力

Tapping a pin opens a bottom info card showing:

加害者イメージ (suspect avatar, prominently displayed)

被害種別

日時

場所

加害者の特徴

報告件数（周辺）

SCREEN 5: フィード (Feed)

Modern SNS-style scrollable feed

Each post card contains:

Suspect avatar at top-left with label 「加害者イメージ（被害者の記憶をもとに作成）」

被害種別

場所

日時

説明

Buttons: 「参考になった」 and 「共有」

No public comments

Create at least 3 example reports with different suspect avatars:

Example 1: 黒髪, 短髪, 黒いキャップ, 白いマスク, 黒いリュック
Example 2: 茶髪, センター分け, 眼鏡, ネイビーのパーカー
Example 3: 坊主, 黒縁眼鏡, スーツ, ショルダーバッグ

SCREEN 6: プロフィール (Profile)

Sections:

自分の投稿

保存したエリア

緊急連絡先

通知設定

プライバシー設定

アプリについて

TECHNICAL REQUIREMENTS

Build as a single-page React app (or similar framework Lovable supports)

Use Leaflet or Mapbox for maps

Avatar builder should render a composite face using SVG elements or canvas — each option changes a visible facial feature

All data can be mock/local state (no backend needed for prototype)

Responsive design that looks like a real iPhone app at 390x844 viewport

Add apple-mobile-web-app-capable meta tag for PWA feel

Smooth transitions between screens

The emergency button must use position: fixed with high z-index

VISUAL STYLE REFERENCE

Background: white or very light gray (#F8F9FA)

Cards: white, border-radius: 12-16px, box-shadow: 0 2px 8px rgba(0,0,0,0.08)

Typography: system font (-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans CJK JP")

Primary: #6C63FF (blue-purple)

Emergency: #FF3B30

Safe: #34C759

Warning: #FF9500

Danger: #FF3B30

Tab bar: white background, gray inactive icons, blue-purple active

Status bar style: dark content

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://voice-ru-strong.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ba25ccca-128a-481e-b8e5-bb7304e3c27b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
