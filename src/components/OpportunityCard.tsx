import { Text, View } from "react-native";
import type { Opportunity } from "../types/domain";
import { RuralArt } from "./RuralArt";
import { AppButton, Badge, Icon, s } from "./ui";
import { colors as c } from "../theme";
export function OpportunityCard({
  item,
  onView,
  onFavorite,
  favorite,
}: {
  item: Opportunity;
  onView: () => void;
  onFavorite: () => void;
  favorite: boolean;
}) {
  return (
    <View
      style={{
        flexGrow: 1,
        flexBasis: 270,
        maxWidth: 580,
        backgroundColor: c.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: c.border,
        overflow: "hidden",
      }}
    >
      <View style={{ height: 180 }}>
        <RuralArt variant={item.art} />
        <View style={{ position: "absolute", left: 14, top: 14 }}>
          <Badge label={item.category} />
        </View>
      </View>
      <View style={{ padding: 20, gap: 14 }}>
        <Text style={s.cardTitle}>{item.title}</Text>
        <View style={[s.row, { gap: 6 }]}>
          <Icon name="location-outline" size={15} color={c.muted} />
          <Text style={[s.small, { flex: 1 }]}>{item.location}</Text>
        </View>
        <Text style={s.body}>{item.summary}</Text>
        <Text style={[s.sectionTitle, { fontSize: 20 }]}>{item.price}</Text>
        <AppButton
          title="Ver oportunidade"
          accessibilityLabel={`Ver oportunidade: ${item.title}`}
          onPress={onView}
          icon="arrow-forward"
          variant="secondary"
        />
        <AppButton
          title={favorite ? "Remover favorito" : "Favoritar"}
          accessibilityLabel={`${favorite ? "Remover favorito" : "Favoritar"}: ${item.title}`}
          variant="ghost"
          icon={favorite ? "heart" : "heart-outline"}
          onPress={onFavorite}
        />
      </View>
    </View>
  );
}
