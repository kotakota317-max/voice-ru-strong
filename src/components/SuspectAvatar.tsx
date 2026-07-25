import { cn } from "@/lib/utils";

export type SuspectFeatures = {
  hairColor?: "black" | "brown" | "blonde" | "gray" | "none";
  hairStyle?: "short" | "long" | "center-part" | "buzz" | "bald";
  headwear?: "none" | "black-cap" | "white-cap" | "hat";
  facewear?: "none" | "white-mask" | "black-mask" | "glasses" | "black-glasses" | "sunglasses";
  top?: "hoodie-navy" | "hoodie-black" | "suit" | "tshirt" | "jacket";
  bag?: "none" | "black-backpack" | "shoulder-bag" | "handbag";
  build?: "slim" | "average" | "large";
  height?: "short" | "average" | "tall";
};

const HAIR_COLORS: Record<string, string> = {
  black: "#111",
  brown: "#6b4423",
  blonde: "#d4a55a",
  gray: "#9ca3af",
  none: "transparent",
};

const TOP_COLORS: Record<string, string> = {
  "hoodie-navy": "#1e3a8a",
  "hoodie-black": "#111827",
  suit: "#1f2937",
  tshirt: "#e5e7eb",
  jacket: "#374151",
};

export function SuspectAvatar({
  features = {},
  className,
  size = 96,
}: {
  features?: SuspectFeatures;
  className?: string;
  size?: number;
}) {
  const {
    hairColor = "black",
    hairStyle = "short",
    headwear = "none",
    facewear = "none",
    top = "tshirt",
  } = features;

  const hairFill = HAIR_COLORS[hairColor] ?? "#111";
  const topFill = TOP_COLORS[top] ?? "#e5e7eb";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("rounded-full bg-muted", className)}
      aria-label="加害者イメージ"
    >
      {/* background */}
      <rect width="100" height="100" fill="#f1f5f9" />

      {/* shoulders / top */}
      <path d="M10 100 C 15 78, 35 70, 50 70 C 65 70, 85 78, 90 100 Z" fill={topFill} />

      {/* neck */}
      <rect x="43" y="60" width="14" height="12" fill="#e0b48a" />

      {/* head */}
      <ellipse cx="50" cy="45" rx="20" ry="23" fill="#f2c9a1" />

      {/* hair styles */}
      {hairStyle !== "bald" && hairStyle !== "buzz" && hairColor !== "none" && (
        <>
          {hairStyle === "short" && (
            <path d="M30 40 Q30 22, 50 22 Q70 22, 70 40 L70 32 Q60 26, 50 26 Q40 26, 30 32 Z" fill={hairFill} />
          )}
          {hairStyle === "long" && (
            <path d="M28 45 Q26 22, 50 22 Q74 22, 72 45 L72 62 L64 60 L64 35 Q50 30, 36 35 L36 60 L28 62 Z" fill={hairFill} />
          )}
          {hairStyle === "center-part" && (
            <>
              <path d="M30 40 Q30 22, 50 22 Q70 22, 70 40 L66 32 Q58 28, 50 30 Q42 28, 34 32 Z" fill={hairFill} />
              <rect x="49" y="24" width="2" height="10" fill="#f2c9a1" />
            </>
          )}
        </>
      )}
      {hairStyle === "buzz" && hairColor !== "none" && (
        <path d="M32 38 Q32 26, 50 26 Q68 26, 68 38 Z" fill={hairFill} opacity="0.85" />
      )}

      {/* eyes */}
      <circle cx="42" cy="46" r="1.8" fill="#111" />
      <circle cx="58" cy="46" r="1.8" fill="#111" />

      {/* mouth */}
      <path d="M44 56 Q50 59, 56 56" stroke="#8b5a3c" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* facewear */}
      {(facewear === "white-mask" || facewear === "black-mask") && (
        <path
          d="M32 52 Q50 48, 68 52 L66 64 Q50 70, 34 64 Z"
          fill={facewear === "white-mask" ? "#ffffff" : "#111827"}
          stroke="#00000022"
        />
      )}
      {(facewear === "glasses" || facewear === "black-glasses" || facewear === "sunglasses") && (
        <g
          stroke={facewear === "black-glasses" ? "#111" : "#333"}
          strokeWidth={facewear === "black-glasses" ? 2 : 1.4}
          fill={facewear === "sunglasses" ? "#111" : "none"}
        >
          <circle cx="42" cy="46" r="5" />
          <circle cx="58" cy="46" r="5" />
          <line x1="47" y1="46" x2="53" y2="46" />
        </g>
      )}

      {/* headwear */}
      {headwear === "black-cap" && (
        <>
          <path d="M28 36 Q50 18, 72 36 L72 40 L28 40 Z" fill="#111" />
          <path d="M28 40 L18 44 L72 44 L72 40 Z" fill="#111" />
        </>
      )}
      {headwear === "white-cap" && (
        <>
          <path d="M28 36 Q50 18, 72 36 L72 40 L28 40 Z" fill="#f9fafb" stroke="#d1d5db" />
          <path d="M28 40 L18 44 L72 44 L72 40 Z" fill="#f9fafb" stroke="#d1d5db" />
        </>
      )}
      {headwear === "hat" && (
        <>
          <ellipse cx="50" cy="42" rx="30" ry="4" fill="#111" />
          <rect x="36" y="20" width="28" height="22" fill="#111" />
        </>
      )}
    </svg>
  );
}