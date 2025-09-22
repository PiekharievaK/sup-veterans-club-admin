import React, { useState } from "react";
import { LoaderContext } from "../helpers/LoaderContext";


export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
