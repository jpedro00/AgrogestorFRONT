import type { PropsWithChildren } from "react";
import { Redirect, router } from "expo-router";
import { useAuth } from "./AuthContext";
import { canAccess, type Permission } from "./permissions";
import { Screen } from "../components/Layout";
import {
  ErrorState,
  LoadingState,
  RestrictedState,
} from "../components/States";
export function RouteGuard({
  children,
  permission = "user",
}: PropsWithChildren<{ permission?: Permission }>) {
  const { user, loading, error, restore } = useAuth();
  if (loading)
    return (
      <Screen publicArea>
        <LoadingState />
      </Screen>
    );
  if (error)
    return (
      <Screen publicArea>
        <ErrorState message={error} retry={() => void restore()} />
      </Screen>
    );
  if (!user) return <Redirect href="/login" />;
  if (!canAccess(user, permission))
    return (
      <Screen>
        <RestrictedState onBack={() => router.replace("/usuario")} />
      </Screen>
    );
  return children;
}
