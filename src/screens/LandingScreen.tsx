import { Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/Layout";
import { AppButton, Badge, Icon, s } from "../components/ui";
import { RuralArt } from "../components/RuralArt";
import { colors as c } from "../theme";
export default function LandingScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 850;
  return (
    <Screen publicArea>
      <View
        style={{
          flexDirection: wide ? "row" : "column",
          gap: wide ? 64 : 28,
          alignItems: "center",
          paddingVertical: wide ? 38 : 8,
        }}
      >
        <View style={{ flex: 1, gap: 25, width: "100%" }}>
          <Badge label="FEITO PARA QUEM VIVE O CAMPO" />
          <Text
            accessibilityRole="header"
            style={{
              fontSize: wide ? 58 : 39,
              lineHeight: wide ? 66 : 47,
              fontWeight: "700",
              letterSpacing: -1.8,
              color: c.primaryDark,
            }}
          >
            Seu campo.{"\n"}Seus negócios.{"\n"}Novas possibilidades.
          </Text>
          <Text
            style={[
              s.subtitle,
              { maxWidth: 430, fontSize: 18, lineHeight: 29 },
            ]}
          >
            Mais clareza para cuidar da sua propriedade. Mais conexões para
            fazer seu trabalho crescer.
          </Text>
          <View
            style={{ gap: 12, alignItems: wide ? "flex-start" : "stretch" }}
          >
            <AppButton
              title="Entrar"
              icon="arrow-forward"
              onPress={() => router.push("/login")}
            />
            <AppButton
              title="Explorar Mercado Rural"
              icon="storefront-outline"
              variant="secondary"
              onPress={() => router.push("/mercado")}
            />
          </View>
          <Text style={s.small}>
            Um jeito simples de estar mais perto do seu campo.
          </Text>
        </View>
        <View style={{ flex: wide ? 1.08 : undefined, width: "100%", gap: 0 }}>
          <View
            style={{
              height: wide ? 400 : 260,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: "hidden",
            }}
          >
            <RuralArt />
          </View>
          <View
            style={{
              backgroundColor: c.primaryDark,
              padding: 26,
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              gap: 9,
            }}
          >
            <View style={s.row}>
              <Icon name="leaf-outline" color={c.accent} />
              <Text
                style={{
                  color: c.accent,
                  fontSize: 12,
                  letterSpacing: 1.2,
                  fontWeight: "600",
                }}
              >
                DA PORTEIRA PARA DENTRO. E ALÉM.
              </Text>
            </View>
            <Text style={{ color: c.surface, fontSize: 21, lineHeight: 29 }}>
              Tudo começa com um campo bem cuidado.
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[
          s.grid,
          { borderTopWidth: 1, borderColor: c.border, paddingTop: 28 },
        ]}
      >
        {[
          {
            icon: "leaf-outline" as const,
            title: "Sua gestão rural",
            body: "Propriedades, atividades e informações essenciais, mais próximas de você.",
          },
          {
            icon: "storefront-outline" as const,
            title: "Seu próximo negócio",
            body: "Terras, animais e produção. Explore oportunidades no Mercado Rural.",
          },
          {
            icon: "shield-checkmark-outline" as const,
            title: "Cada área no seu lugar",
            body: "As informações da sua fazenda ficam separadas dos anúncios públicos.",
          },
        ].map((item) => (
          <View
            key={item.title}
            style={{ flex: 1, minWidth: 240, gap: 10, paddingRight: 20 }}
          >
            <Icon name={item.icon} />
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.body}>{item.body}</Text>
          </View>
        ))}
      </View>
      <Text style={s.small}>
        AgroGestor · Protótipo funcional · Todos os dados são de demonstração.
      </Text>
    </Screen>
  );
}
