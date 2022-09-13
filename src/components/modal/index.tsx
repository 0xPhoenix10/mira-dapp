import { Flex } from "components/base/container";
import { TimesIcon } from "components/icons";
import { useRef } from "react";

type ModalParentProps = {
  visible: boolean,
  setVisible: (arg: boolean) => void,
  children?: React.ReactNode
};

export const ModalParent: React.FC<ModalParentProps> = ({ visible, setVisible, children }) => {
  const modalContainer = useRef<any>();
  return (
    <>
      {visible && (
        <Flex
          position={"fixed"}
          backDrop={"blur(5px)"}
          top={"0px"}
          left={"0px"}
          background={"#0008"}
          width={"100%"}
          height={"100%"}
          zIndex={"1000"}
          onClick={(e) => {
            if (modalContainer?.current && modalContainer?.current === e.target) setVisible(false);
          }}
          ref={modalContainer}
        >
          <Flex
            col
            margin={"auto"}
            background={"#101012"}
            padding={"20px"}
            border={"1px solid #34383b"}
            borderRadius={"20px"}
            boxSizing={"border-box"}
          >
            <Flex
              ml={"auto"}
              fontSize={"25px"}
              lineHeight={"1em"}
              cursor={"pointer"}
              onClick={() => setVisible(false)}
            >
              <TimesIcon />
            </Flex>
            {children}
          </Flex>
        </Flex>
      )}
    </>
  );
};
