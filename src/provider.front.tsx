import React, { createContext, useState } from "react";

export const FrontContext = createContext<any>(null);

type FrontProviderProps = {
    children?: React.ReactNode
};

const FrontProvider: React.FC<FrontProviderProps> = ({ children }) => {
  const [visibleSidebar, setVisibleSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  return (
    <FrontContext.Provider
      value={{
        currentPage: currentPage,
        setCurrentPage: setCurrentPage,
        visibleSidebar: visibleSidebar,
        setVisibleSidebar: setVisibleSidebar,
      }}
    >
      {children}
    </FrontContext.Provider>
  );
};

export default FrontProvider;
