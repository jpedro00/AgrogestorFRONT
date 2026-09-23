import { router } from "expo-router";
import { Screen } from "../src/components/Layout";
import { EmptyState } from "../src/components/States";
export default function NotFound() {
  return (
    <Screen publicArea>
      <EmptyState
        title="Página não encontrada"
        description="Este caminho não está disponível. Volte ao início para continuar."
        onBack={() => router.replace("/")}
      />
    </Screen>
  );
}
