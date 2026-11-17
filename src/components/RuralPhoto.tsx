import { Image } from "react-native";
import type { Opportunity } from "../types/domain";

const photos = {
  soy: {
    source: require("../../assets/photos/soy.jpg"),
    label: "Plantas de soja em uma lavoura verde",
  },
  coffee: {
    source: require("../../assets/photos/coffee.jpg"),
    label: "Frutos de café amadurecendo nos galhos",
  },
  angus: {
    source: require("../../assets/photos/angus.jpg"),
    label: "Detalhe de um bovino Angus de pelagem preta",
  },
  holstein: {
    source: require("../../assets/photos/holstein.jpg"),
    label: "Bovino Holandês de pelagem preta e branca na pastagem",
  },
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
