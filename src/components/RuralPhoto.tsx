import { Image } from "react-native";
import type { Opportunity } from "../types/domain";

const photos = {
  countryside: {
    source: require("../../assets/photos/countryside.jpg"),
    label: "Vista aérea dos campos de São Simão, em São Paulo",
  },
  land: {
    source: require("../../assets/photos/land.jpg"),
    label: "Propriedade rural cercada por mata em Barra do Turvo",
  },
  cattle: {
    source: require("../../assets/photos/cattle.jpg"),
    label: "Gado Nelore em uma pastagem verde",
  },
  crop: {
    source: require("../../assets/photos/crop.jpg"),
    label: "Detalhe dos grãos amarelos de uma espiga de milho",
  },
  lease: {
    source: require("../../assets/photos/lease.jpg"),
    label: "Vista aérea de áreas agrícolas na região de Maringá",
  },
};

export function RuralPhoto({
  variant = "countryside",
}: {
  variant?: Opportunity["art"] | "countryside";
}) {
  const photo = photos[variant];
  return (
    <Image
      source={photo.source}
      accessibilityLabel={photo.label}
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
