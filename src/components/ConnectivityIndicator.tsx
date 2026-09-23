import { useNetInfo } from "@react-native-community/netinfo";
import { Text, View } from "react-native";
import { Icon, s } from "./ui";
import type { SyncStatus } from "../types/domain";
import { colors as c } from "../theme";
export function ConnectivityIndicator({
  syncStatus = "synced",
}: {
  syncStatus?: SyncStatus;
}) {
  const network = useNetInfo();
  const offline = network.isConnected === false;
  const label = offline
    ? "Offline · dados de demonstração"
    : syncStatus === "pending"
      ? "Pendente de sincronização · demonstração"
      : syncStatus === "syncing"
        ? "Sincronizando · demonstração"
        : syncStatus === "error"
          ? "Sincronização indisponível"
          : network.isConnected === null
            ? "Verificando conexão"
            : "Online · demonstração";
  return (
    <View style={[s.row, { gap: 6 }]}>
      <Icon
        name={
          offline
            ? "cloud-offline-outline"
            : syncStatus === "pending"
              ? "time-outline"
              : "cloud-done-outline"
        }
        size={16}
        color={offline ? c.warning : c.muted}
      />
      <Text style={s.small}>{label}</Text>
    </View>
  );
}
