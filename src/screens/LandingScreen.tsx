import { Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/Layout";
import { AppButton, Icon, s } from "../components/ui";
import { RuralPhoto } from "../components/RuralPhoto";
import { FieldFilm } from "../components/FieldFilm";
import { colors as c } from "../theme";
import { FieldMotion } from "../components/FieldMotion";
import { MarketPreview } from "../components/MarketPreview";

export default function LandingScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 850;
  return (
    <Screen publicArea>
      <View
        style={{
          borderRadius: 30,
          overflow: "hidden",
          backgroundColor: c.primaryDark,
        }}
      >
        <View style={{ position: "absolute", inset: 0 }}>
          <RuralPhoto />
        </View>
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(7,30,22,0.64)",
          }}
        />
        <View
          style={{
            padding: wide ? 60 : 28,
            paddingVertical: wide ? 78 : 44,
            gap: 26,
            minHeight: wide ? 560 : 530,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: c.accent,
              fontSize: 12,
              letterSpacing: 3,
              fontWeight: "700",
            }}
          >
            RAÍZES NO CAMPO. OLHOS NO FUTURO.
          </Text>
          <Text
            accessibilityRole="header"
            style={{
              color: "#FFFFFF",
              fontSize: wide ? 70 : 43,
              lineHeight: wide ? 76 : 49,
              letterSpacing: -2,
              fontWeight: "600",
              maxWidth: 780,
            }}
          >
            Seu campo.{"\n"}Seus negócios.{"\n"}
            <Text style={{ color: c.accent }}>Novas possibilidades.</Text>
          </Text>
          <Text
            style={{
              color: "#ECF1E7",
              fontSize: 18,
              lineHeight: 29,
              maxWidth: 490,
            }}
          >
            Da primeira semente ao próximo grande negócio. Um novo olhar para
            tudo o que você cultiva.
          </Text>
          <View
            style={{
              flexDirection: wide ? "row" : "column",
              gap: 12,
              alignSelf: wide ? "flex-start" : "stretch",
            }}
          >
            <AppButton
              title="Criar minha conta"
              icon="arrow-forward"
              onPress={() => router.push("/cadastro")}
            />
            <AppButton
              title="Explorar Mercado Rural"
              variant="secondary"
              icon="storefront-outline"
              onPress={() => router.push("/mercado")}
            />
          </View>
          <Text style={{ color: "#D5DFD2", fontSize: 12 }}>
            GESTÃO RURAL / CONEXÕES / OPORTUNIDADES
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: wide ? "row" : "column",
          gap: 24,
          paddingVertical: 14,
        }}
      >
        {[
          {
            n: "01",
            title: "Sua fazenda, mais perto",
            body: "Um espaço para organizar a rotina e acompanhar cada etapa do campo.",
            icon: "leaf-outline" as const,
          },
          {
            n: "02",
            title: "Conexões que crescem",
            body: "Encontre novas possibilidades no mercado de terras, produção e pecuária.",
            icon: "storefront-outline" as const,
          },
          {
            n: "03",
            title: "Simplicidade para avançar",
            body: "Do computador ao celular, uma experiência pensada para sua rotina.",
            icon: "sunny-outline" as const,
          },
        ].map((item) => (
          <View
            key={item.n}
            style={{
              flex: 1,
              gap: 12,
              padding: 24,
              borderBottomWidth: 1,
              borderColor: c.border,
            }}
          >
            <View style={s.between}>
              <Icon name={item.icon} size={28} />
              <Text style={{ color: c.muted, fontSize: 12 }}>
                {item.n} / AGROGESTOR
              </Text>
            </View>
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.body}>{item.body}</Text>
          </View>
        ))}
      </View>
      <View
        style={{
          flexDirection: wide ? "row" : "column",
          gap: 32,
          alignItems: "center",
          paddingVertical: 18,
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            height: wide ? 350 : 260,
            borderRadius: 26,
            overflow: "hidden",
          }}
        >
          <FieldFilm />
        </View>
        <View
          style={{ flex: 1, width: "100%", gap: 20, padding: wide ? 24 : 4 }}
        >
          <Text style={s.eyebrow}>O CAMPO INSPIRA. A TECNOLOGIA APROXIMA.</Text>
          <Text
            accessibilityRole="header"
            style={[
              s.heading,
              { fontSize: wide ? 38 : 30, lineHeight: wide ? 45 : 38 },
            ]}
          >
            Grandes histórias começam com a terra.
          </Text>
          <Text style={s.body}>
            Quem vive o campo sabe: cada detalhe faz diferença. Reunimos gestão
            e oportunidades para você dedicar mais tempo ao que importa.
          </Text>
          <AppButton
            title="Entrar"
            icon="arrow-forward"
            onPress={() => router.push("/login")}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: c.primaryDark,
          borderRadius: 26,
          overflow: "hidden",
          padding: wide ? 42 : 26,
          minHeight: 230,
          justifyContent: "center",
        }}
      >
        <FieldMotion />
        <View style={{ maxWidth: 550, gap: 16 }}>
          <Text style={[s.eyebrow, { color: c.accent }]}>
            CULTIVAR HOJE. CONECTAR O AMANHÃ.
          </Text>
          <Text
            style={[s.heading, { color: "white", fontSize: wide ? 38 : 30 }]}
          >
            Uma nova perspectiva para o seu campo.
          </Text>
          <Text style={[s.body, { color: "#D5DFD2" }]}>
            Explore o mercado rural e descubra o que pode crescer junto com
            você.
          </Text>
        </View>
      </View>
      <MarketPreview />
      <View style={{ flexDirection: wide ? "row" : "column", gap: 18 }}>
        {(
          [
            {
              art: "soy",
              title: "Da semente à colheita",
              label: "AGRICULTURA",
            },
            {
              art: "cattle",
              title: "O valor de cada criação",
              label: "PECUÁRIA",
            },
            { art: "land", title: "Espaço para novos planos", label: "TERRAS" },
          ] as const
        ).map((item) => (
          <View
            key={item.art}
            style={{
              flex: 1,
              minHeight: 260,
              borderRadius: 22,
              overflow: "hidden",
              backgroundColor: c.primaryDark,
            }}
          >
            <View style={{ height: 190 }}>
              <RuralPhoto variant={item.art} />
            </View>
            <View style={{ padding: 22, gap: 8 }}>
              <Text style={[s.eyebrow, { color: c.accent }]}>{item.label}</Text>
              <Text style={[s.cardTitle, { color: "white" }]}>
                {item.title}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={s.small}>
        AgroGestor · Gestão e conexões para o campo. Os módulos de negócio
        exibem dados de demonstração.
      </Text>
    </Screen>
  );
}
