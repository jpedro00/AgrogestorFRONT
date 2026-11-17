import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { RuralPhoto } from "./RuralPhoto";
import { Badge, Icon, SectionTitle, s } from "./ui";
import type { Opportunity } from "../types/domain";

const examples: {
  id: string;
  title: string;
  detail: string;
  art: Opportunity["art"];
}[] = [
  { id: "soja", title: "Soja", detail: "Safra 2026/27", art: "soy" },
  { id: "angus", title: "Angus", detail: "Gado de corte", art: "angus" },
  {
    id: "cafe",
    title: "Café arábica",
    detail: "Produção agrícola",
    art: "coffee",
  },
  {
    id: "holandes",
    title: "Holandês",
    detail: "Pecuária leiteira",
    art: "holstein",
  },
];

export function MarketPreview() {
  return (
    <View style={{ gap: 20 }}>
      <View style={{ gap: 8 }}>
        <Text style={s.eyebrow}>EXPLORE O MERCADO RURAL</Text>
        <SectionTitle>Da lavoura ao rebanho.</SectionTitle>
        <Text style={s.body}>
          Conheça alguns exemplos de oportunidades da plataforma.
        </Text>
      </View>
      <View style={s.grid}>
        {examples.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Explorar exemplo: ${item.title}`}
            onPress={() => router.push(`/oportunidade/${item.id}`)}
            style={({ pressed }) => [
              s.card,
              {
                padding: 0,
                overflow: "hidden",
                flexBasis: 240,
                flexGrow: 1,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={{ height: 180 }}>
              <RuralPhoto variant={item.art} />
            </View>
            <View style={{ padding: 18, gap: 12 }}>
              <Badge label={item.detail} tone="neutral" />
              <View style={s.between}>
                <Text style={s.cardTitle}>{item.title}</Text>
                <Icon name="arrow-forward" size={18} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
