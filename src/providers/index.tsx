import React from "react";
import ThemesProvider from "./provider.theme";
import LayoutProvider from "./provider.wallet";

type AllProviderProps = {
    children?: React.ReactNode
};
const AllProvider: React.FC<AllProviderProps> = ({ children }) => {
  return (
    <ThemesProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </ThemesProvider>
  );
};

export default AllProvider;
