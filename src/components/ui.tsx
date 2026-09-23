import type { ComponentProps, PropsWithChildren } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors as c, radius } from "../theme";

export type IconName = ComponentProps<typeof Ionicons>["name"];
export function Icon({
  name,
  color = c.primary,
  size = 22,
}: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  return <Ionicons name={name} size={size} color={color} accessible={false} />;
}
export function AppButton({
  title,
  onPress,
  variant = "primary",
  icon,
  loading,
  disabled,
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const fg =
    variant === "primary"
      ? c.surface
      : variant === "danger"
        ? c.danger
        : c.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        variant === "primary" && { backgroundColor: c.primary },
        variant === "secondary" && {
          borderWidth: 1,
          borderColor: c.border,
          backgroundColor: c.surface,
        },
        { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : icon ? (
        <Icon name={icon} color={fg} size={19} />
      ) : null}
      <Text style={[s.buttonText, { color: fg }]}>
        {loading ? "Entrando…" : title}
      </Text>
    </Pressable>
  );
}
export function AppInput({
  label,
  error,
  ...props
}: ComponentProps<typeof TextInput> & { label: string; error?: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={c.muted}
        {...props}
        style={[
          s.input,
          error ? { borderColor: c.danger } : undefined,
          props.style,
        ]}
      />
      {error && (
        <Text accessibilityRole="alert" style={{ color: c.danger }}>
          {error}
        </Text>
      )}
    </View>
  );
}
export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Badge({
  label,
  tone = "green",
}: {
  label: string;
  tone?: "green" | "warning" | "neutral";
}) {
  return (
    <View
      style={[
        s.badge,
        {
          backgroundColor:
            tone === "warning"
              ? c.warningSoft
              : tone === "neutral"
                ? c.background
                : c.primarySoft,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: tone === "warning" ? c.warning : c.primary,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
export function Heading({
  children,
  subtitle,
  eyebrow,
}: PropsWithChildren<{ subtitle?: string; eyebrow?: string }>) {
  return (
    <View style={{ gap: 8 }}>
      {eyebrow && <Text style={s.eyebrow}>{eyebrow}</Text>}
      <Text accessibilityRole="header" style={s.heading}>
        {children}
      </Text>
      {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
    </View>
  );
}
export function SectionTitle({ children }: PropsWithChildren) {
  return (
    <Text accessibilityRole="header" style={s.sectionTitle}>
      {children}
    </Text>
  );
}
export function StatCard({
  label,
  value,
  detail,
  icon,
  tone = "green",
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  tone?: "green" | "warning";
}) {
  return (
    <Card style={{ flex: 1, minWidth: 140, gap: 14 }}>
      <View style={s.between}>
        <Text style={[s.body, { flex: 1 }]}>{label}</Text>
        <Icon name={icon} color={tone === "warning" ? c.warning : c.primary} />
      </View>
      <Text style={s.stat}>{value}</Text>
      <Text style={s.small}>{detail}</Text>
    </Card>
  );
}
export function ModuleCard({
  title,
  description,
  icon,
  onPress,
  accessibilityLabel,
}: {
  title: string;
  description: string;
  icon: IconName;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={({ pressed }) => [
        s.card,
        { gap: 18, flexGrow: 1, flexBasis: 230, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <View style={s.between}>
        <View style={s.iconBox}>
          <Icon name={icon} />
        </View>
        <Icon name="arrow-forward-outline" color={c.muted} size={20} />
      </View>
      <View style={{ gap: 6 }}>
        <Text style={s.cardTitle}>{title}</Text>
        <Text style={s.body}>{description}</Text>
      </View>
    </Pressable>
  );
}
export const QuickActionCard = ModuleCard;
export const s = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: { fontSize: 15, fontWeight: "600", textAlign: "center" },
  label: { fontSize: 14, fontWeight: "600", color: c.text },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    fontSize: 16,
    color: c.text,
    backgroundColor: c.surface,
  },
  card: {
    padding: 22,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: radius.md,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  eyebrow: {
    color: c.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700",
    color: c.text,
    letterSpacing: -0.8,
  },
  subtitle: { fontSize: 16, lineHeight: 25, color: c.muted },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: c.text,
    letterSpacing: -0.3,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: c.text },
  body: { fontSize: 14, lineHeight: 22, color: c.muted },
  small: { fontSize: 12, lineHeight: 19, color: c.muted },
  stat: { fontSize: 34, fontWeight: "600", color: c.text, letterSpacing: -1 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: c.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
