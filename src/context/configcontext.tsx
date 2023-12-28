"use client";

import { createContext, useContext, useState } from "react";

interface ConfigsProps {
  openAiUrl: string;
  openAiKey: string;
}

interface ConfigContextProps {
  configs: ConfigsProps;
  setConfigs: React.Dispatch<React.SetStateAction<ConfigsProps>>;
  firstOpen: boolean;
  setFirstOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConfigContext = createContext<ConfigContextProps>(
  {} as ConfigContextProps
);

export default function ConfigContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [configs, setConfigs] = useState<ConfigsProps>({} as ConfigsProps);
  const [firstOpen, setFirstOpen] = useState<boolean>(true);

  return (
    <ConfigContext.Provider
      value={{ configs, setConfigs, firstOpen, setFirstOpen }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfigContext() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useContext Error");
  }
  return context;
}
