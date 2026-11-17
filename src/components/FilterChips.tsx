import { ScrollView, Text, View } from "react-native";
import { AppButton, s } from "./ui";

export function FilterChips({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={s.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, padding: 2 }}
      >
        {values.map((option) => (
          <AppButton
            key={option}
            title={option}
            accessibilityLabel={`${label}: ${option}`}
            selected={value === option}
            variant={value === option ? "primary" : "secondary"}
            onPress={() => onChange(option)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
