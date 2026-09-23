import { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../auth/AuthContext";
import { roleLabels } from "../auth/permissions";
import type { Role, User } from "../types/domain";
import { AppButton, Badge, s } from "./ui";
import { ErrorState } from "./States";
import { colors as c } from "../theme";
export function RoleBadge({ role }: { role: Role }) {
  return <Badge label={roleLabels[role]} />;
}
export function Avatar({ user }: { user: User }) {
  return (
    <View
      style={{
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: c.primarySoft,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 27, color: c.primary, fontWeight: "600" }}>
        {user.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </Text>
    </View>
  );
}
export function LogoutButton() {
  const { logout } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      {!!error && <ErrorState message={error} />}
      <AppButton
        title={busy ? "Saindo…" : "Sair da conta"}
        icon="log-out-outline"
        variant="danger"
        disabled={busy}
        onPress={() => {
          setBusy(true);
          void logout()
            .then(() => router.replace("/"))
            .catch(() =>
              setError("Não foi possível encerrar a sessão. Tente novamente."),
            )
            .finally(() => setBusy(false));
        }}
      />
    </View>
  );
}
export function AccountDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={s.small}>{label}</Text>
      <Text style={[s.body, { color: c.text, fontWeight: "500" }]}>
        {value}
      </Text>
    </View>
  );
}
