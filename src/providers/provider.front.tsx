import React, { createContext, useState } from "react";

export const FrontContext = createContext<any>(null);

type FrontProviderProps = {
  children?: React.ReactNode;
};

const FrontProvider: React.FC<FrontProviderProps> = ({ children }) => {
  const [visibleSidebar, setVisibleSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [currentChain, setCurrentChain] = useState("APTOS");
  return (
    <FrontContext.Provider
      value={{
        currentPage: currentPage,
        setCurrentPage: setCurrentPage,
        visibleSidebar: visibleSidebar,
        setVisibleSidebar: setVisibleSidebar,
        currentChain: currentChain,
        setCurrentChain: setCurrentChain,
      }}
    >
      {children}
    </FrontContext.Provider>
  );
};

export default FrontProvider;
