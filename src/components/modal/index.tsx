import { Flex } from "components/base/container";
import { TimesIcon } from "components/icons";
import { useRef } from "react";

type ModalParentProps = {
  visible: boolean;
  width?: string;
  minWidth?: string;
  setVisible: (arg: boolean) => void;
  children?: React.ReactNode;
  zIndex?: string;
  background?: string;
};

export const ModalParent: React.FC<ModalParentProps> = ({
  visible,
  width = "auto",
  minWidth = "80vw",
  setVisible,
  children,
  zIndex = "1000",
  background = "#222129",
}) => {
  const modalContainer = useRef<any>();
  return (
    <>
      {visible && (
        <Flex
          position={"fixed"}
          backdropFilter={"blur(5px)"}
          top={"0px"}
          left={"0px"}
          background={"#0008"}
          width={"100%"}
          height={"100%"}
          zIndex={zIndex}
          onClick={(e) => {
            if (modalContainer?.current && modalContainer?.current === e.target)
              setVisible(false);
          }}
          ref={modalContainer}
        >
          <Flex
            col
            margin={"auto"}
            background={background}
            padding={"20px"}
            border={"1px solid #34383b"}
            borderRadius={"20px"}
            boxSizing={"border-box"}
            width={width}
            minWidth={minWidth}
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
