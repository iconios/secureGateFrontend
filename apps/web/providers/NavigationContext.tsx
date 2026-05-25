"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

const NavigationContext = createContext<any>(null);

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

const useNavigation = () => {
  return useContext(NavigationContext);
};

export { NavigationProvider, useNavigation };
