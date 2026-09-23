import { useState, type PropsWithChildren } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import { AppButton, Icon, s, type IconName } from "./ui";
import { colors as c } from "../theme";
import { ConnectivityIndicator } from "./ConnectivityIndicator";
import { adminModules } from "../navigation/modules";
import { useAuth } from "../auth/AuthContext";

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="AgroGestor, página inicial"
      onPress={() => router.push("/")}
      style={[s.row, { minHeight: 48, gap: 9 }]}
    >
      <View
        style={{
          backgroundColor: dark ? c.accent : c.primary,
          width: 35,
          height: 35,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="leaf" size={22} color={dark ? c.primaryDark : c.surface} />
      </View>
      <Text
        style={{
          fontSize: 23,
          fontWeight: "700",
          letterSpacing: -0.7,
          color: dark ? c.surface : c.primaryDark,
        }}
      >
        Agro<Text style={{ fontWeight: "400" }}>Gestor</Text>
      </Text>
    </Pressable>
  );
}
export function Header({ publicArea = false }: { publicArea?: boolean }) {
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const path = usePathname();
  return (
    <View
      style={{
        backgroundColor: c.surface,
        borderBottomWidth: 1,
        borderBottomColor: c.border,
      }}
    >
      <View
        style={[
          s.between,
          {
            width: "100%",
            maxWidth: 1240,
            alignSelf: "center",
            paddingHorizontal: width < 600 ? 18 : 32,
            paddingVertical: 12,
          },
        ]}
      >
        <Brand />
        <View style={s.row}>
          {width > 720 && (
            <Text style={s.small}>
              {publicArea
                ? "Da gestão ao próximo negócio."
                : "Seu dia no campo, mais simples."}
            </Text>
          )}
          {publicArea ? (
            path === "/login" ? null : (
              <AppButton
                title={user ? "Minha conta" : "Entrar"}
                variant="secondary"
                icon="person-outline"
                onPress={() =>
                  router.push(
                    user
                      ? user.role === "administrador"
                        ? "/admin"
                        : "/usuario"
                      : "/login",
                  )
                }
              />
            )
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Minha conta"
              onPress={() => router.push("/usuario")}
              style={[s.iconBox, { minWidth: 44, minHeight: 44 }]}
            >
              <Text style={{ color: c.primary, fontWeight: "600" }}>
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
const navItems: {
  title: string;
  path: "/home" | "/fazenda" | "/mercado-rural" | "/negocios" | "/perfil";
  icon: IconName;
}[] = [
  { title: "Início", path: "/home", icon: "home-outline" },
  { title: "Fazenda", path: "/fazenda", icon: "leaf-outline" },
  { title: "Mercado", path: "/mercado-rural", icon: "storefront-outline" },
  { title: "Negócios", path: "/negocios", icon: "briefcase-outline" },
  { title: "Perfil", path: "/perfil", icon: "person-outline" },
];
function UserNavigation() {
  const path = usePathname();
  return (
    <View
      style={{
        backgroundColor: c.surface,
        borderTopWidth: 1,
        borderTopColor: c.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          maxWidth: 640,
          width: "100%",
          alignSelf: "center",
          paddingVertical: 5,
        }}
      >
        {navItems.map((item) => (
          <Pressable
            key={item.path}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            accessibilityState={{ selected: path.startsWith(item.path) }}
            onPress={() => router.replace(item.path)}
            style={{
              flex: 1,
              minHeight: 58,
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Icon
              name={item.icon}
              color={path.startsWith(item.path) ? c.primary : c.muted}
            />
            <Text
              style={{
                fontSize: 11,
                color: path.startsWith(item.path) ? c.primary : c.muted,
                fontWeight: path.startsWith(item.path) ? "700" : "400",
              }}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
export function Screen({
  children,
  publicArea = false,
  userNav = false,
  narrow = false,
}: PropsWithChildren<{
  publicArea?: boolean;
  userNav?: boolean;
  narrow?: boolean;
}>) {
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView
      testID="screen"
      style={{ flex: 1, backgroundColor: c.background }}
    >
      <Header publicArea={publicArea} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: "100%",
            maxWidth: narrow ? 680 : 1240,
            alignSelf: "center",
            padding: width < 600 ? 20 : 32,
            gap: 28,
            flexGrow: 1,
          }}
        >
          {children}
          <View style={{ paddingTop: 12, marginTop: "auto" }}>
            <ConnectivityIndicator />
          </View>
        </View>
      </ScrollView>
      {userNav && <UserNavigation />}
    </SafeAreaView>
  );
}
export function AdminSidebar({ close }: { close?: () => void }) {
  const path = usePathname();
  function go(url: string) {
    router.push(url as "/admin");
    close?.();
  }
  function item(title: string, url: string, icon: IconName) {
    const selected = path === url;
    return (
      <Pressable
        key={url}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ selected }}
        onPress={() => go(url)}
        style={[
          s.row,
          {
            paddingHorizontal: 12,
            paddingVertical: 11,
            minHeight: 44,
            borderRadius: 8,
            backgroundColor: selected ? c.primarySoft : c.transparent,
          },
        ]}
      >
        <Icon name={icon} size={19} />
        <Text
          style={{
            color: selected ? c.primary : c.muted,
            fontSize: 13,
            fontWeight: selected ? "600" : "400",
            flex: 1,
          }}
        >
          {title}
        </Text>
      </Pressable>
    );
  }
  return (
    <ScrollView
      style={{ backgroundColor: c.surface }}
      contentContainerStyle={{ padding: 18, gap: 4 }}
    >
      <Text style={[s.eyebrow, { marginBottom: 14 }]}>Administração</Text>
      {item("Dashboard", "/admin/dashboard", "grid-outline")}
      {(["Gestão rural", "AgroGestor Negócios"] as const).map((group) => (
        <View key={group} style={{ gap: 2 }}>
          <Text
            style={[
              s.small,
              {
                fontWeight: "700",
                marginTop: 20,
                marginBottom: 8,
                paddingLeft: 12,
              },
            ]}
          >
            {group}
          </Text>
          {adminModules
            .filter((m) => m.group === group)
            .map((m) => item(m.title, `/admin/modulo/${m.id}`, m.icon))}
        </View>
      ))}
      <View
        style={{
          marginTop: 22,
          borderTopWidth: 1,
          borderColor: c.border,
          paddingTop: 12,
        }}
      >
        {item("Área do usuário", "/usuario", "person-outline")}
        {item("Painel Administrativo", "/admin", "arrow-back-outline")}
      </View>
    </ScrollView>
  );
}
export function AdminScreen({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;
  const [menu, setMenu] = useState(false);
  return (
    <SafeAreaView
      testID="screen"
      style={{ flex: 1, backgroundColor: c.background }}
    >
      <Header />
      <View style={{ flex: 1, flexDirection: "row" }}>
        {desktop && (
          <View
            style={{ width: 252, borderRightWidth: 1, borderColor: c.border }}
          >
            <AdminSidebar />
          </View>
        )}
        <View style={{ flex: 1 }}>
          {!desktop && (
            <AppButton
              title={
                menu
                  ? "Fechar menu administrativo"
                  : "Abrir menu administrativo"
              }
              icon={menu ? "close" : "menu"}
              variant="secondary"
              onPress={() => setMenu((v) => !v)}
            />
          )}
          {menu && !desktop ? (
            <AdminSidebar close={() => setMenu(false)} />
          ) : (
            <ScrollView
              contentContainerStyle={{
                padding: width < 600 ? 20 : 32,
                gap: 28,
                maxWidth: 1280,
                width: "100%",
                alignSelf: "center",
              }}
            >
              {children}
              <ConnectivityIndicator />
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
