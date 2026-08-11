import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Voiceるー痴漢・ストーカー・性犯罪アプリ" },
      {
        name: "description",
        content:
          "痴漢は口にしてはいけないことではなく、れっきとした犯罪。\n私たちVoiceるは被害者が我慢しなくてもいい世の中を目指します。\n\n・サイレンと連動して家族や恋人に位置情報とSOS通知を送信\n・被害の詳細を加害者の似顔絵アバター付きで投稿＆シェア\n・投稿をAIが分析しマップで可視化\n\n誰もが安心して過ごせる未来を目指して！",
      },
      { property: "og:title", content: "Voiceるー痴漢・ストーカー・性犯罪アプリ" },
      {
        property: "og:description",
        content:
          "痴漢は口にしてはいけないことではなく、れっきとした犯罪。\n私たちVoiceるは被害者が我慢しなくてもいい世の中を目指します。\n\n・サイレンと連動して家族や恋人に位置情報とSOS通知を送信\n・被害の詳細を加害者の似顔絵アバター付きで投稿＆シェア\n・投稿をAIが分析しマップで可視化\n\n誰もが安心して過ごせる未来を目指して！",
      },
    ],
  }),
  component: RootRedirectScreen,
});

function RootRedirectScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/incidents" });
  }, [navigate]);

  return null;
}
