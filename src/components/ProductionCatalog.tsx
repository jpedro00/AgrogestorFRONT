import { useCallback, useState, type PropsWithChildren } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { useResource } from "../hooks/useResource";
import { ProductionService } from "../services/data";
import type { Harvest, Herd } from "../mocks/production";
import { colors as c } from "../theme";
import {
  AppButton,
  AppInput,
  Badge,
  Card,
  Icon,
  SectionTitle,
  Heading,
  s,
} from "./ui";
import { FilterChips } from "./FilterChips";
import { FieldBanner } from "./FieldBanner";
import { EmptyState, ErrorState, LoadingState } from "./States";

function Facts({ facts }: { facts: [string, string][] }) {
  return (
    <View style={[s.grid, { gap: 24 }]}>
      {facts.map(([label, value]) => (
        <View key={label} style={{ flexBasis: 130, flexGrow: 1, gap: 4 }}>
          <Text style={s.small}>{label}</Text>
          <Text style={s.label}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function ProductionCard({
  children,
  label,
  selected,
  onPress,
  color,
}: PropsWithChildren<{
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}>) {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ expanded: selected }}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        s.card,
        {
          flexBasis: 290,
          flexGrow: 1,
          gap: 18,
          borderTopWidth: color ? 3 : 1,
          borderTopColor: color ?? c.border,
          opacity: pressed ? 0.8 : 1,
          backgroundColor: hovered ? "#F2F6EF" : c.surface,
        },
      ]}
    >
      {children}
    </Pressable>
  );
}

export function ProductionCatalog({ kind }: { kind: "crops" | "herds" }) {
  const { user } = useAuth();
  const resource = useResource(
    useCallback(
      () => (user ? ProductionService.list(user) : Promise.resolve(null)),
      [user],
    ),
  );
  const [season, setSeason] = useState("2026/27");
  const [crop, setCrop] = useState("Todas");
  const [purpose, setPurpose] = useState("Todas");
  const [breed, setBreed] = useState("Todas");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const isCrops = kind === "crops";
  const title = isCrops ? "Culturas e Safras" : "Rebanhos e Raças";
  const data = resource.data;
  if (resource.loading)
    return (
      <>
        <Heading>{title}</Heading>
        <LoadingState />
      </>
    );
  if (resource.error)
    return (
      <>
        <Heading>{title}</Heading>
        <ErrorState retry={resource.retry} />
      </>
    );
  if (!data || (!data.harvests.length && !data.herds.length))
    return (
      <EmptyState
        title={title}
        description="Nenhuma propriedade vinculada. Os exemplos de gestão ficam disponíveis para perfis de demonstração vinculados a uma propriedade."
      />
    );

  const harvests = data.harvests.filter(
    (item) =>
      item.season === season && (crop === "Todas" || item.name === crop),
  );
  const herds = data.herds.filter(
    (item) =>
      (purpose === "Todas" || item.purpose === purpose) &&
      (breed === "Todas" || item.breed === breed),
  );
  const matches = (text: string) =>
    text
      .toLocaleLowerCase("pt-BR")
      .includes(search.trim().toLocaleLowerCase("pt-BR"));
  const visibleCrops = harvests.filter((item) =>
    matches(`${item.name} ${item.variety} ${item.plot}`),
  );
  const visibleHerds = herds.filter((item) =>
    matches(`${item.name} ${item.breed} ${item.location} ${item.stage}`),
  );
  const changeFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setSelected(null);
  };
  const activeCrop = visibleCrops.find((item) => item.id === selected);
  const activeHerd = visibleHerds.find((item) => item.id === selected);
  return (
    <View style={{ gap: 24 }}>
      <FieldBanner
        label="FAZENDA SANTA CLARA · DEMONSTRAÇÃO"
        title={title}
        description={
          isCrops
            ? "Explore o planejamento, acompanhe as culturas e encontre os detalhes de cada área."
            : "Conheça os lotes, compare raças e acompanhe as etapas da criação."
        }
      />
      <Card style={{ flexDirection: "row", gap: 24, paddingVertical: 16 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={s.small}>
            {isCrops ? "Culturas na seleção" : "Lotes na seleção"}
          </Text>
          <Text style={[s.stat, { fontSize: 26 }]}>
            {isCrops ? visibleCrops.length : visibleHerds.length}
          </Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={s.small}>
            {isCrops ? "Área da seleção" : "Animais na seleção"}
          </Text>
          <Text style={[s.stat, { fontSize: 26 }]}>
            {isCrops
              ? `${visibleCrops.reduce((sum, item) => sum + item.area, 0)} ha`
              : visibleHerds.reduce((sum, item) => sum + item.heads, 0)}
          </Text>
        </View>
      </Card>
      <Card style={{ gap: 18 }}>
        {isCrops ? (
          <>
            <FilterChips
              label="Safra"
              values={[...new Set(data.harvests.map((item) => item.season))]}
              value={season}
              onChange={changeFilter(setSeason)}
            />
            <FilterChips
              label="Cultura"
              values={[
                "Todas",
                ...new Set(data.harvests.map((item) => item.name)),
              ]}
              value={crop}
              onChange={changeFilter(setCrop)}
            />
          </>
        ) : (
          <>
            <FilterChips
              label="Finalidade"
              values={["Todas", "Corte", "Leite"]}
              value={purpose}
              onChange={changeFilter(setPurpose)}
            />
            <FilterChips
              label="Raça"
              values={[
                "Todas",
                ...new Set(data.herds.map((item) => item.breed)),
              ]}
              value={breed}
              onChange={changeFilter(setBreed)}
            />
          </>
        )}
        <AppInput
          label={isCrops ? "Buscar cultura ou talhão" : "Buscar lote ou raça"}
          placeholder={
            isCrops
              ? "Ex. soja, Catuaí, talhão 05"
              : "Ex. Nelore, lactação, pasto norte"
          }
          value={search}
          onChangeText={changeFilter(setSearch)}
        />
      </Card>
      <Modal
        visible={!!activeCrop || !!activeHerd}
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15,35,24,0.55)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <ScrollView
            style={{
              flexGrow: 0,
              maxHeight: "90%",
              width: "100%",
              maxWidth: 700,
              alignSelf: "center",
            }}
          >
            {activeCrop && (
              <CropDetail item={activeCrop} close={() => setSelected(null)} />
            )}
            {activeHerd && (
              <HerdDetail item={activeHerd} close={() => setSelected(null)} />
            )}
          </ScrollView>
        </View>
      </Modal>
      <Text accessibilityLiveRegion="polite" style={s.small}>
        {isCrops ? visibleCrops.length : visibleHerds.length}{" "}
        {isCrops ? "culturas encontradas" : "lotes encontrados"} · Selecione um
        cartão para consultar os detalhes
      </Text>
      <View style={s.grid}>
        {isCrops
          ? visibleCrops.map((item) => (
              <ProductionCard
                key={item.id}
                label={`Ver cultura: ${item.name}`}
                selected={selected === item.id}
                onPress={() => setSelected(item.id)}
                color={item.color}
              >
                <View style={s.between}>
                  <View style={s.iconBox}>
                    <Icon name="leaf-outline" color={item.color} />
                  </View>
                  <Badge
                    label={item.status}
                    tone={item.status === "Planejada" ? "neutral" : "green"}
                  />
                </View>
                <View style={{ gap: 4 }}>
                  <Text style={s.cardTitle}>{item.name}</Text>
                  <Text style={s.small}>
                    {item.variety} · {item.plot}
                  </Text>
                </View>
                <Facts
                  facts={[
                    ["Área", `${item.area} ha`],
                    ["Safra", item.season],
                  ]}
                />
                <View style={{ gap: 6 }}>
                  <View style={s.between}>
                    <Text style={s.small}>Evolução do ciclo</Text>
                    <Text style={s.small}>{item.progress}%</Text>
                  </View>
                  <View
                    style={{
                      height: 5,
                      borderRadius: 4,
                      backgroundColor: c.border,
                    }}
                  >
                    <View
                      style={{
                        height: 5,
                        borderRadius: 4,
                        width: `${item.progress}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </View>
                </View>
                <Text style={[s.label, { color: c.primary }]}>
                  Consultar cultura ↗
                </Text>
              </ProductionCard>
            ))
          : visibleHerds.map((item) => (
              <ProductionCard
                key={item.id}
                label={`Ver lote: ${item.breed}`}
                selected={selected === item.id}
                onPress={() => setSelected(item.id)}
              >
                <View style={s.between}>
                  <View style={s.iconBox}>
                    <Icon name="paw-outline" />
                  </View>
                  <Badge
                    label={`${item.purpose} · ${item.stage}`}
                    tone={item.purpose === "Leite" ? "warning" : "green"}
                  />
                </View>
                <View style={{ gap: 4 }}>
                  <Text style={s.cardTitle}>{item.breed}</Text>
                  <Text style={s.small}>{item.name}</Text>
                </View>
                <Facts
                  facts={[
                    ["Animais", `${item.heads} cabeças`],
                    ["Peso médio", item.weight],
                  ]}
                />
                <View style={s.between}>
                  <Text style={s.small}>{item.location}</Text>
                  <Icon name="arrow-forward" size={18} />
                </View>
              </ProductionCard>
            ))}
      </View>
      {!(isCrops ? visibleCrops.length : visibleHerds.length) && (
        <EmptyState
          title="Nenhum exemplo encontrado"
          description="Ajuste a busca ou os filtros para explorar os outros exemplos."
        />
      )}
      <Text style={s.small}>
        Dados fictícios para explorar a plataforma. Áreas, calendários, pesos e
        estimativas ilustram a interface.
      </Text>
    </View>
  );
}

function CropDetail({ item, close }: { item: Harvest; close: () => void }) {
  return (
    <Card style={{ gap: 20, borderColor: c.primary }}>
      <Badge label={`SAFRA ${item.season}`} />
      <SectionTitle>
        {item.name} · {item.variety}
      </SectionTitle>
      <Facts
        facts={[
          ["Área de cultivo", `${item.area} ha`],
          ["Localização", item.plot],
          ["Plantio ilustrativo", item.planting],
          ["Colheita ilustrativa", item.harvest],
          [
            item.status === "Concluída"
              ? "Produção demonstrativa"
              : "Previsão demonstrativa",
            item.production,
          ],
          ["Situação", item.status],
        ]}
      />
      <AppButton
        title="Fechar detalhes"
        variant="ghost"
        icon="close"
        onPress={close}
      />
    </Card>
  );
}

function HerdDetail({ item, close }: { item: Herd; close: () => void }) {
  return (
    <Card style={{ gap: 20, borderColor: c.primary }}>
      <Badge
        label={`${item.purpose.toUpperCase()} · ${item.stage.toUpperCase()}`}
      />
      <SectionTitle>
        {item.breed} · {item.name}
      </SectionTitle>
      <Facts
        facts={[
          ["Quantidade", `${item.heads} cabeças`],
          ["Faixa etária", item.age],
          ["Peso médio", item.weight],
          ["Localização", item.location],
          ["Sistema", item.system],
          ["Etapa", item.stage],
        ]}
      />
      <Text style={s.body}>{item.note}</Text>
      <AppButton
        title="Fechar detalhes"
        variant="ghost"
        icon="close"
        onPress={close}
      />
    </Card>
  );
}
