import { Text, View } from "react-native";
import { FieldMotion } from "./FieldMotion";
import { colors as c } from "../theme";
import { s } from "./ui";

export function FieldBanner({
  title,
  description,
  label,
}: {
  title: string;
  description: string;
  label: string;
}) {
  return (
    <View
      style={{
        backgroundColor: c.primaryDark,
        borderRadius: 22,
        overflow: "hidden",
        padding: 28,
        minHeight: 180,
        justifyContent: "center",
      }}
    >
      <FieldMotion />
      <View style={{ gap: 10, maxWidth: 540 }}>
        <Text style={[s.eyebrow, { color: c.accent }]}>{label}</Text>
        <Text
          accessibilityRole="header"
          style={[s.heading, { color: c.surface }]}
        >
          {title}
        </Text>
        <Text style={[s.body, { color: "#D4E3D7", maxWidth: 440 }]}>
          {description}
        </Text>
      </View>
    </View>
  );
}
