import { createContext, useContext, useState, type ReactNode } from "react";
import * as THREE from "three";

type SceneContextValue = {
  scene: THREE.Scene | null;
  setScene: (scene: THREE.Scene | null) => void;
};

export const SceneContext = createContext<SceneContextValue | null>(null);

type SceneProviderProps = {
  children: ReactNode;
};

export const SceneProvider = ({ children }: SceneProviderProps) => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);

  return (
    <SceneContext.Provider value={{ scene, setScene }}>
      {children}
    </SceneContext.Provider>
  );
};

export const useScene = () => {
  const context = useContext(SceneContext);
  if (context === null) {
    throw new Error("useScene must be used within a SceneProvider");
  }

  return context;
};
