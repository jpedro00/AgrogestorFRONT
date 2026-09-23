import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuth } from "../auth/AuthContext";
type Value = { favorites: string[]; toggle: (id: string) => void };
const Context = createContext<Value | null>(null);
export function MarketplaceProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  return (
    <FavoritesState key={user?.id ?? "visitor"}>{children}</FavoritesState>
  );
}
function FavoritesState({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  return (
    <Context.Provider
      value={{
        favorites,
        toggle: (id) => {
          if (user)
            setFavorites((current) =>
              current.includes(id)
                ? current.filter((x) => x !== id)
                : [...current, id],
            );
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useMarketplace() {
  const value = useContext(Context);
  if (!value) throw new Error("MarketplaceProvider ausente");
  return value;
}
