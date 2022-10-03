import { Flex } from "components/base/container";
import LayoutFooter from "./layout.footer";
import LayoutHeader from "./layout.header";
import LayoutSidebar from "./layout.sidebar";

type LayoutProps = {
    children?: React.ReactNode
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex col bg={"transparent"} width={"100%"} height={"100%"}>
      <LayoutHeader />
      <Flex row flex={1} overflow={"auto"}>
        <LayoutSidebar />
        <Flex
          flex={1}
          height={"100%"}
          background={"#222129"} ß
          px={"32px"}
          overflow={"auto"}
        >
          {children}
        </Flex>
      </Flex>
      <LayoutFooter />
    </Flex>
  );
};

export default Layout;
