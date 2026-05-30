"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type NavigationContextValue = {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const contextValues = useMemo(
    () => ({
      mobileOpen,
      setMobileOpen,
    }),
    [mobileOpen],
  );

  return (
    <NavigationContext.Provider value={contextValues}>
      {children}
    </NavigationContext.Provider>
  );
};

const useNavigation = (): NavigationContextValue => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used inside NavigationProvider");
  }

  return context;
};

export { NavigationProvider, useNavigation };
