import { useCallback, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "../components/Layout";
import { AppButton, AppInput, Badge, Card, Heading, s } from "../components/ui";
import { EmptyState, ErrorState, LoadingState } from "../components/States";
import { OpportunityCard } from "../components/OpportunityCard";
import { RuralPhoto } from "../components/RuralPhoto";
import { MarketplaceService } from "../services/data";
import { useResource } from "../hooks/useResource";
import { useAuth } from "../auth/AuthContext";
import { useMarketplace } from "../contexts/MarketplaceContext";
import { FilterChips } from "../components/FilterChips";
import { FieldBanner } from "../components/FieldBanner";
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
  const [breed, setBreed] = useState("Todas");
  const [crop, setCrop] = useState("Todas");
  const [season, setSeason] = useState("Todas");
  const [purpose, setPurpose] = useState("Todas");
  const filtered = resource.data?.filter(
    (item) =>
      (category === "Todas" ||
        (category === "Favoritos" && favorites.includes(item.id)) ||
        item.category === category) &&
      (breed === "Todas" || item.breed === breed) &&
      (crop === "Todas" || item.crop === crop) &&
      (season === "Todas" || item.season === season) &&
      (purpose === "Todas" || item.purpose === purpose) &&
      `${item.title} ${item.location} ${item.breed ?? ""} ${item.crop ?? ""} ${item.season ?? ""} ${item.purpose ?? ""} ${item.summary}`
        .toLocaleLowerCase("pt-BR")
        .includes(search.trim().toLocaleLowerCase("pt-BR")),
  );
  return (
    <Screen publicArea={!privateArea} userNav={privateArea}>
      <FieldBanner
        label="AGROGESTOR NEGÓCIOS"
        title="Mercado Rural"
        description="Explore terras, raças e safras. Encontre os exemplos que combinam com o seu próximo passo."
      />
      <Text style={s.body}>
        Catálogo público de demonstração. Anúncios e valores fictícios, sem
        vínculo automático com os dados privados da sua fazenda.
      </Text>
      <AppInput
        label="Buscar oportunidades"
        placeholder="Busque por cultura, raça, safra ou região"
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
            selected={category === value}
            onPress={() => {
              setCategory(value);
              setBreed("Todas");
              setCrop("Todas");
              setSeason("Todas");
              setPurpose("Todas");
            }}
          />
        ))}
      </View>
      {category === "Gado" && (
        <Card style={{ gap: 18 }}>
          <FilterChips
            label="Raça"
            values={[
              "Todas",
              ...new Set(
                resource.data?.flatMap((item) =>
                  item.breed ? [item.breed] : [],
                ) ?? [],
              ),
            ]}
            value={breed}
            onChange={setBreed}
          />
          <FilterChips
            label="Finalidade"
            values={["Todas", "Corte", "Leite"]}
            value={purpose}
            onChange={setPurpose}
          />
        </Card>
      )}
      {category === "Produção agrícola" && (
        <Card style={{ gap: 18 }}>
          <FilterChips
            label="Cultura"
            values={[
              "Todas",
              ...new Set(
                resource.data?.flatMap((item) =>
                  item.crop ? [item.crop] : [],
                ) ?? [],
              ),
            ]}
            value={crop}
            onChange={setCrop}
          />
          <FilterChips
            label="Safra"
            values={[
              "Todas",
              ...new Set(
                resource.data?.flatMap((item) =>
                  item.season ? [item.season] : [],
                ) ?? [],
              ),
            ]}
            value={season}
            onChange={setSeason}
          />
        </Card>
      )}
      {!resource.loading && !resource.error && (
        <Text accessibilityLiveRegion="polite" style={s.small}>
          {filtered?.length ?? 0} oportunidades encontradas
        </Text>
      )}
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
              <RuralPhoto variant={item.art} />
            </View>
            <Card style={{ flex: 1, gap: 22 }}>
              <Badge label="OPORTUNIDADE DE DEMONSTRAÇÃO" tone="warning" />
              <Text style={s.stat}>{item.price}</Text>
              <Text style={s.sectionTitle}>{item.summary}</Text>
              <View style={s.grid}>
                {!!item.breed && <Badge label={item.breed} />}
                {!!item.purpose && (
                  <Badge label={item.purpose} tone="neutral" />
                )}
                {!!item.crop && <Badge label={item.crop} />}
                {!!item.season && (
                  <Badge label={`Safra ${item.season}`} tone="neutral" />
                )}
              </View>
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
