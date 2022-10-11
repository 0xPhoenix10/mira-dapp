import React from "react";
import ThemesProvider from "./provider.theme";
import FrontProvider from "./provider.front";
import LayoutProvider from "./provider.wallet";

type AllProviderProps = {
  children?: React.ReactNode;
};
const AllProvider: React.FC<AllProviderProps> = ({ children }) => {
  return (
    <ThemesProvider>
      <LayoutProvider>
        <FrontProvider>{children}</FrontProvider>
      </LayoutProvider>
    </ThemesProvider>
  );
};

export default AllProvider;
