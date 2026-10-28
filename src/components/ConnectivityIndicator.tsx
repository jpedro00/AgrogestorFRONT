import { useNetInfo } from "@react-native-community/netinfo";
import { useSyncExternalStore } from "react";
import { Platform, Text, View } from "react-native";
import { Icon, s } from "./ui";
import type { SyncStatus } from "../types/domain";
import { colors as c } from "../theme";
function subscribeOnline(callback: () => void) {
  if (Platform.OS !== "web" || typeof window === "undefined") return () => {};
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}
function browserOnline() {
  return Platform.OS === "web" && typeof navigator !== "undefined"
    ? navigator.onLine
    : null;
}
export function ConnectivityIndicator({
  syncStatus = "synced",
}: {
  syncStatus?: SyncStatus;
}) {
  const network = useNetInfo();
  // Some browsers expose navigator.connection without firing its change event
  // when only online/offline changes. Listen to the browser events directly.
  const online = useSyncExternalStore(
    subscribeOnline,
    browserOnline,
    () => null,
  );
  const offline = (online ?? network.isConnected) === false;
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
