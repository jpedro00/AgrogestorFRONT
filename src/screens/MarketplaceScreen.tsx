import { useCallback, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "../components/Layout";
import { AppButton, AppInput, Badge, Card, Heading, s } from "../components/ui";
import { EmptyState, ErrorState, LoadingState } from "../components/States";
import { OpportunityCard } from "../components/OpportunityCard";
import { RuralArt } from "../components/RuralArt";
import { MarketplaceService } from "../services/data";
import { useResource } from "../hooks/useResource";
import { useAuth } from "../auth/AuthContext";
import { useMarketplace } from "../contexts/MarketplaceContext";
export default function MarketplaceScreen({
  privateArea = false,
}: {
  privateArea?: boolean;
}) {
  const { user } = useAuth();
  const { favorites, toggle } = useMarketplace();
  const resource = useResource(MarketplaceService.list);
  const [category, setCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const filtered = resource.data?.filter(
    (item) =>
      (category === "Todas" ||
        (category === "Favoritos" && favorites.includes(item.id)) ||
        item.category === category) &&
      `${item.title} ${item.location}`
        .toLocaleLowerCase("pt-BR")
        .includes(search.toLocaleLowerCase("pt-BR")),
  );
  return (
    <Screen publicArea={!privateArea} userNav={privateArea}>
      <Heading
        eyebrow="AGROGESTOR NEGÓCIOS"
        subtitle="Novas conexões. Boas oportunidades. Um campo de possibilidades."
      >
        Mercado Rural
      </Heading>
      <Text style={s.body}>
        Catálogo público de demonstração. Anúncios e valores fictícios, sem
        vínculo automático com os dados privados da sua fazenda.
      </Text>
      <AppInput
        label="Buscar oportunidades"
        placeholder="Busque por título ou região"
        value={search}
        onChangeText={setSearch}
      />
      <View style={s.grid}>
        {[
          "Todas",
          "Terra",
          "Gado",
          "Produção agrícola",
          "Arrendamento",
          ...(user ? ["Favoritos"] : []),
        ].map((value) => (
          <AppButton
            key={value}
            title={value}
            variant={category === value ? "primary" : "secondary"}
            onPress={() => setCategory(value)}
          />
        ))}
      </View>
      {resource.loading ? (
        <LoadingState />
      ) : resource.error ? (
        <ErrorState retry={resource.retry} />
      ) : filtered?.length ? (
        <View style={s.grid}>
          {filtered.map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              favorite={favorites.includes(item.id)}
              onView={() => router.push(`/oportunidade/${item.id}`)}
              onFavorite={() =>
                user ? toggle(item.id) : router.push("/login")
              }
            />
          ))}
        </View>
      ) : (
        <EmptyState
          title="Nenhuma oportunidade encontrada"
          description="Tente outra busca ou categoria. Seus favoritos ficam disponíveis durante esta sessão."
        />
      )}
    </Screen>
  );
}
export function OpportunityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const { favorites, toggle } = useMarketplace();
  const [message, setMessage] = useState("");
  const resource = useResource(
    useCallback(() => MarketplaceService.get(id), [id]),
  );
  const item = resource.data;
  function interaction() {
    if (!user) {
      router.push("/login");
      return;
    }
    setMessage(
      "Interesse demonstrado neste protótipo. Nenhuma mensagem foi enviada e nenhuma negociação real foi criada.",
    );
  }
  return (
    <Screen publicArea={!user} userNav={!!user}>
      <AppButton
        title="Voltar ao Mercado Rural"
        variant="ghost"
        icon="arrow-back"
        onPress={() => router.replace(user ? "/mercado-rural" : "/mercado")}
      />
      {resource.loading ? (
        <LoadingState />
      ) : resource.error ? (
        <ErrorState retry={resource.retry} />
      ) : !item ? (
        <EmptyState
          title="Oportunidade não encontrada"
          description="Esta oportunidade não faz parte do catálogo de demonstração."
          onBack={() => router.replace("/mercado")}
        />
      ) : (
        <>
          <Heading eyebrow={item.category} subtitle={item.location}>
            {item.title}
          </Heading>
          <View
            style={{ flexDirection: width > 850 ? "row" : "column", gap: 24 }}
          >
            <View
              style={{
                flex: 1,
                minHeight: 280,
                height: width > 850 ? 390 : 280,
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              <RuralArt variant={item.art} />
            </View>
            <Card style={{ flex: 1, gap: 22 }}>
              <Badge label="OPORTUNIDADE DE DEMONSTRAÇÃO" tone="warning" />
              <Text style={s.stat}>{item.price}</Text>
              <Text style={s.sectionTitle}>{item.summary}</Text>
              <Text style={s.body}>{item.description}</Text>
              <AppButton
                title="Manifestar interesse"
                icon="hand-left-outline"
                onPress={interaction}
              />
              <AppButton
                title="Negociar"
                variant="secondary"
                onPress={interaction}
              />
              <AppButton
                title={
                  favorites.includes(item.id) ? "Remover favorito" : "Favoritar"
                }
                icon="heart-outline"
                variant="ghost"
                onPress={() => (user ? toggle(item.id) : router.push("/login"))}
              />
              {!!message && (
                <Text accessibilityRole="alert" style={s.body}>
                  {message}
                </Text>
              )}
            </Card>
          </View>
        </>
      )}
    </Screen>
  );
}
