import { Flex } from "components/base/container";
import DashboardLeaderBoard from "./dashboard.leaderboard";
import DashboardRecommended from "./dashboard.recommended";

const DashboardPage = () => {
  return (
    <Flex col width={"100%"} height={"max-content"} py={"20px"}>
      <DashboardRecommended />
      <DashboardLeaderBoard />
    </Flex>
  );
};

export default DashboardPage;
