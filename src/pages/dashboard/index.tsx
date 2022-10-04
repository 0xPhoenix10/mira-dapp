import { Flex } from "components/base/container";
import DashboardLeaderBoard from "./dashboard.leaderboard";
import DashboardRecommended from "./dashboard.recommended";
import { createContext, useState } from "react";

export const UpdateIndexProviderContext = createContext<any>(null);

const DashboardPage = () => {
  const [updateIndex, setUpdateIndex] = useState(false);
  return (
    <UpdateIndexProviderContext.Provider
      value={{ setUpdateIndex: setUpdateIndex, updateIndex: updateIndex }}
    >
      <Flex col width={"100%"} height={"max-content"} py={"20px"}>
        <DashboardRecommended />
        <DashboardLeaderBoard />
      </Flex>
    </UpdateIndexProviderContext.Provider>
  );
};

export default DashboardPage;
