import { cn } from "@/lib/utils";

export type SuspectFeatures = {
  gender?: "male" | "female" | "unknown";
  hairColor?: "black" | "brown" | "blonde" | "gray" | "none";
  hairStyle?: "short" | "long" | "center-part" | "buzz" | "bald";
  bangs?: "none" | "straight" | "swept" | "split";
  faceShape?: "oval" | "round" | "square" | "long";
  skinTone?: "light" | "medium" | "tan" | "dark";
  eyes?: "small" | "average" | "large" | "narrow";
  brows?: "thin" | "average" | "thick";
  nose?: "small" | "average" | "large";
  mouth?: "thin" | "average" | "full";
  beard?: "none" | "stubble" | "goatee" | "full";
  headwear?: "none" | "black-cap" | "white-cap" | "hat";
  facewear?: "none" | "white-mask" | "black-mask" | "glasses" | "black-glasses" | "sunglasses";
  top?: "hoodie-navy" | "hoodie-black" | "suit" | "tshirt" | "jacket";
  topColor?: "black" | "white" | "gray" | "navy" | "red" | "green";
  bottom?: "jeans" | "slacks" | "shorts" | "skirt";
  bottomColor?: "black" | "blue" | "gray" | "beige";
  shoes?: "sneakers-white" | "sneakers-black" | "leather" | "boots";
  bag?: "none" | "black-backpack" | "shoulder-bag" | "handbag";
  accessory?: "none" | "watch" | "earring" | "necklace";
  build?: "slim" | "average" | "large";
  height?: "short" | "average" | "tall";
  ageGroup?: "teen" | "20s" | "30s" | "40s" | "50s" | "60plus";
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

const SKIN_TONES: Record<string, string> = {
  light: "#f2c9a1",
  medium: "#d9a271",
  tan: "#b07a4d",
  dark: "#7a4a2b",
};

const TOP_COLOR_OVERRIDES: Record<string, string> = {
  black: "#111827",
  white: "#f9fafb",
  gray: "#6b7280",
  navy: "#1e3a8a",
  red: "#b91c1c",
  green: "#166534",
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
    gender = "unknown",
    hairColor = "black",
    hairStyle = "short",
    bangs = "none",
    faceShape = "oval",
    skinTone = "light",
    eyes = "average",
    brows = "average",
    nose = "average",
    mouth = "average",
    beard = "none",
    headwear = "none",
    facewear = "none",
    top = "tshirt",
    topColor,
  } = features;

  const hairFill = HAIR_COLORS[hairColor] ?? "#111";
  const topFill = topColor ? TOP_COLOR_OVERRIDES[topColor] : TOP_COLORS[top] ?? "#e5e7eb";
  const skinFill = SKIN_TONES[skinTone] ?? "#f2c9a1";

  // face shape radii
  const rx = faceShape === "round" ? 22 : faceShape === "square" ? 21 : faceShape === "long" ? 18 : 20;
  const ry = faceShape === "long" ? 26 : faceShape === "round" ? 22 : 23;

  // feature sizing
  const eyeR = eyes === "small" ? 1.2 : eyes === "large" ? 2.4 : eyes === "narrow" ? 1.5 : 1.8;
  const eyeStretch = eyes === "narrow" ? 0.5 : 1;
  const browY = 40;
  const browThick = brows === "thin" ? 1 : brows === "thick" ? 2.5 : 1.6;
  const noseLen = nose === "small" ? 4 : nose === "large" ? 9 : 6;
  const mouthW = mouth === "thin" ? 8 : mouth === "full" ? 14 : 11;
  const mouthThick = mouth === "full" ? 2.4 : 1.2;

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
      <rect x="43" y="60" width="14" height="12" fill={skinFill} />

      {/* head */}
      {faceShape === "square" ? (
        <rect x={50 - rx} y={45 - ry} width={rx * 2} height={ry * 2} rx="6" fill={skinFill} />
      ) : (
        <ellipse cx="50" cy="45" rx={rx} ry={ry} fill={skinFill} />
      )}

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
              <rect x="49" y="24" width="2" height="10" fill={skinFill} />
            </>
          )}
        </>
      )}
      {hairStyle === "buzz" && hairColor !== "none" && (
        <path d="M32 38 Q32 26, 50 26 Q68 26, 68 38 Z" fill={hairFill} opacity="0.85" />
      )}

      {/* bangs */}
      {bangs !== "none" && hairColor !== "none" && (
        <>
          {bangs === "straight" && (
            <path d="M32 32 Q50 30, 68 32 L68 40 Q50 38, 32 40 Z" fill={hairFill} />
          )}
          {bangs === "swept" && (
            <path d="M32 32 Q40 26, 68 34 L64 40 Q46 38, 32 40 Z" fill={hairFill} />
          )}
          {bangs === "split" && (
            <>
              <path d="M32 32 Q40 30, 49 36 L46 40 L32 40 Z" fill={hairFill} />
              <path d="M68 32 Q60 30, 51 36 L54 40 L68 40 Z" fill={hairFill} />
            </>
          )}
        </>
      )}

      {/* brows */}
      <line x1={38} y1={browY} x2={46} y2={browY} stroke="#111" strokeWidth={browThick} strokeLinecap="round" />
      <line x1={54} y1={browY} x2={62} y2={browY} stroke="#111" strokeWidth={browThick} strokeLinecap="round" />

      {/* eyes */}
      <ellipse cx="42" cy="46" rx={eyeR} ry={eyeR * eyeStretch} fill="#111" />
      <ellipse cx="58" cy="46" rx={eyeR} ry={eyeR * eyeStretch} fill="#111" />

      {/* nose */}
      <path d={`M50 47 L${50 - noseLen / 3} ${47 + noseLen} Q50 ${47 + noseLen + 1} ${50 + noseLen / 3} ${47 + noseLen}`} stroke="#8b5a3c" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* mouth */}
      <path d={`M${50 - mouthW / 2} 58 Q50 ${58 + mouthThick} ${50 + mouthW / 2} 58`} stroke="#8b5a3c" strokeWidth={mouthThick} fill="none" strokeLinecap="round" />

      {/* beard */}
      {beard === "stubble" && <ellipse cx="50" cy="58" rx="14" ry="6" fill="#111" opacity="0.18" />}
      {beard === "goatee" && <path d="M46 60 Q50 66, 54 60 L53 64 Q50 67, 47 64 Z" fill={hairFill} />}
      {beard === "full" && <path d="M32 52 Q35 68, 50 70 Q65 68, 68 52 Q60 60, 50 60 Q40 60, 32 52 Z" fill={hairFill} opacity="0.85" />}

      {/* subtle earring hint for female */}
      {gender === "female" && (
        <>
          <circle cx={50 - rx} cy="50" r="1.2" fill="#c084fc" />
          <circle cx={50 + rx} cy="50" r="1.2" fill="#c084fc" />
        </>
      )}

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