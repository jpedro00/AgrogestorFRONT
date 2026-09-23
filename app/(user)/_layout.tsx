import { Slot } from "expo-router";
import { RouteGuard } from "../../src/auth/RouteGuard";
export default function UserLayout() {
  return (
    <RouteGuard>
      <Slot />
    </RouteGuard>
  );
}
