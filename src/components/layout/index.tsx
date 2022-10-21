import React, { useState, useEffect } from "react";
import { Flex } from "components/base/container";
import LayoutFooter from "./layout.footer";
import LayoutHeader from "./layout.header";
import LayoutSidebar from "./layout.sidebar";
import { BsInfoCircle } from "react-icons/bs";
import { ModalParent } from "components/modal";
import { DiscordIcon, TwitterIcon } from "components/icons";
import styled from "styled-components";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  return (
    <Flex col bg={"transparent"} width={"100%"} height={"100%"}>
      {isMobile ? (
        <ModalParent visible={true} setVisible={() => {}}>
          <StartupModalBody flex={1} />
        </ModalParent>
      ) : (
        <>
          <LayoutHeader />
          <Flex row flex={1} overflow={"auto"}>
            <LayoutSidebar />
            <Flex
              flex={1}
              height={"100%"}
              background={"#222129"}
              // px={"32px"}
              overflow={"auto"}
              overflowX={"hidden"}
            >
              {children}
            </Flex>
          </Flex>
          <LayoutFooter />
        </>
      )}
    </Flex>
  );
};

const StartupModalBody: React.FC<{ [index: string]: any }> = ({
  title = "???",
  setVisible = () => {},
  ...props
}) => {
  return (
    <Flex
      py={"20px"}
      width={"100%"}
      gridGap={"16px"}
      className={"ourTokenContainer"}
    >
      <Flex flex={1} col>
        <Flex p={"20px"} className={"tokenBody"}>
          <Flex
            flex={5}
            p={"20px"}
            fontFamily={"art"}
            fontSize={"18px"}
            fontWeight={"600"}
            letterSpacing={"0.1em"}
            aspectRatio={"8"}
            width={"0px"}
            alignCenter
            className={"tokenContent"}
          >
            <Flex
              flex={5}
              p={"20px"}
              fontFamily={"art"}
              fontSize={"60px"}
              fontWeight={"600"}
              letterSpacing={"0.1em"}
              className={"infoIcon"}
            >
              <BsInfoCircle />
            </Flex>
            <Flex>
              This site isn't made for mobile use - stay in the loop for updates
              on our mobile interface release!
              {/* Thanks for checking out our Beta app. Keep in mind, this is a
              rough version of our product. We work hard and move fast, so
              you'll probably encounter some bugs. Bear with us while we iron
              them out. */}
            </Flex>
          </Flex>
        </Flex>
        <Flex p={"20px"} className={"tokenBody"} justifyCenter my={"20px"}>
          <Flex
            justifyCenter
            // maxWidth={visibleSidebar ? "400px" : "0px"}
            py={"10px"}
            gridGap={"50px"}
            fontSize={"20px"}
            overflow={"hidden"}
            transition={"200ms"}
          >
            <Flex cursor={"pointer"}>
              <LinkIcon
                href={"https://discord.gg/yR3UzjZuxB"}
                target={"_blank"}
              >
                <DiscordIcon />
              </LinkIcon>
            </Flex>
            <Flex cursor={"pointer"}>
              <LinkIcon
                href={"https://twitter.com/Mira_Finance"}
                target={"_blank"}
              >
                <TwitterIcon />
              </LinkIcon>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
const LinkIcon = styled.a`
  text-decoration: none;
  color: #fafafa;
`;
const Link = styled.a`
  text-decoration: none;
`;
export default Layout;
