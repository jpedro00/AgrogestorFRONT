import Svg, { Circle, Ellipse, Path, Rect, G } from "react-native-svg";
import { colors as c } from "../theme";

// Bundled vector illustration: no remote image service or network dependency.
export function RuralArt({
  variant = "land",
}: {
  variant?: "land" | "cattle" | "crop" | "lease";
}) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 640 420"
      preserveAspectRatio="xMidYMid slice"
      accessibilityLabel="Ilustração de uma paisagem rural"
    >
      <Rect width="640" height="420" fill={c.artSky} />
      <Circle cx="492" cy="88" r="42" fill={c.artSun} />
      <Path d="M0 218 Q130 100 300 200 T640 160 V420 H0Z" fill={c.artFar} />
      <Path d="M0 255 Q190 155 350 246 T640 224 V420 H0Z" fill={c.artMid} />
      <Path d="M0 330 Q220 220 640 325 V420 H0Z" fill={c.artNear} />
      <Path
        d="M130 420 Q310 320 480 265 M230 420 Q370 330 520 280 M340 420 Q430 350 570 301 M455 420 Q510 370 622 320"
        fill="none"
        stroke={c.artMid}
        strokeWidth="13"
      />
      <G transform="translate(140 166)">
        <Rect x="0" y="35" width="103" height="69" rx="2" fill={c.artCream} />
        <Path d="M-15 38 L52 -8 L118 38Z" fill={c.artRoof} />
        <Rect x="17" y="59" width="24" height="45" fill={c.artBarn} />
        <Rect x="64" y="55" width="21" height="20" fill={c.primaryDark} />
      </G>
      <G fill={c.primaryDark}>
        <Rect x="81" y="167" width="6" height="79" />
        <Ellipse cx="84" cy="168" rx="26" ry="43" />
        <Rect x="279" y="185" width="5" height="70" />
        <Ellipse cx="281" cy="179" rx="20" ry="36" />
      </G>
      {variant === "cattle" && (
        <G fill={c.artCream}>
          <Ellipse cx="375" cy="278" rx="40" ry="23" />
          <Ellipse cx="414" cy="267" rx="17" ry="18" />
          <Rect x="346" y="285" width="9" height="32" />
          <Rect x="395" y="285" width="9" height="32" />
          <Ellipse cx="483" cy="307" rx="33" ry="18" />
          <Ellipse cx="513" cy="298" rx="14" ry="15" />
          <Rect x="462" y="315" width="7" height="24" />
          <Rect x="500" y="312" width="7" height="27" />
        </G>
      )}
      {variant === "crop" && (
        <G stroke={c.artSun} strokeWidth="5" fill="none">
          {[390, 430, 470, 510].map((x) => (
            <G key={x}>
              <Path
                d={`M${x} 360 V250 M${x} 300 l-18 -20 M${x} 280 l18 -18 M${x} 320 l18 -20`}
              />
            </G>
          ))}
        </G>
      )}
      {variant === "lease" && (
        <G>
          <Rect x="400" y="228" width="6" height="74" fill={c.artRoof} />
          <Rect
            x="360"
            y="220"
            width="86"
            height="42"
            rx="3"
            fill={c.artCream}
          />
          <Path d="M374 241 H432" stroke={c.artMid} strokeWidth="4" />
        </G>
      )}
    </Svg>
  );
}
