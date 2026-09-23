import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
type Experience = {
  simplified: boolean;
  assisted: boolean;
  setSimplified: (v: boolean) => void;
  setAssisted: (v: boolean) => void;
};
const Context = createContext<Experience | null>(null);
export function ExperienceProvider({ children }: PropsWithChildren) {
  const [simplified, setSimplified] = useState(false);
  const [assisted, setAssisted] = useState(false);
  return (
    <Context.Provider
      value={{ simplified, assisted, setSimplified, setAssisted }}
    >
      {children}
    </Context.Provider>
  );
}
export function useExperience() {
  const value = useContext(Context);
  if (!value) throw new Error("ExperienceProvider ausente");
  return value;
}
