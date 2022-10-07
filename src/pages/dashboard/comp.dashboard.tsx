import { Link } from "components/base";
import { Flex } from "components/base/container";
import { ArrowIcon } from "components/icons";
import {
  Children,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import styled from "styled-components";

export const Carousel3D: React.FC<{
  stop?: boolean;
  children: React.ReactNode;
  [index: string]: any;
}> = forwardRef(({ stop, children, ...props }, ref) => {
  const childNodes = Children.toArray(children);
  const [currentSlide, setCurrentSlide] = useState(0);
  useImperativeHandle(ref, () => ({
    reset() {
      setCurrentSlide(
        (currentSlide + childNodes.length - 1) % childNodes.length
      );
    },
  }));
  useEffect(() => {
    if (stop) return;
    const timeout = setTimeout(() => {
      setCurrentSlide(
        (currentSlide + childNodes.length - 1) % childNodes.length
      );
    }, 3000);
    return () => clearTimeout(timeout);
  }, [currentSlide, stop]);
  return (
    <Carousel3dContainer {...props}>
      {childNodes.map((each, index) => {
        return (
          <Flex
            key={index}
            justifyCenter
            position={currentSlide === index ? "relative" : "absolute"}
            width={"100%"}
            transform={
              currentSlide === index
                ? "none"
                : (currentSlide + 1) % childNodes.length === index
                ? "translateX(-20%) translateZ(-200px)"
                : (currentSlide + childNodes.length - 1) % childNodes.length ===
                  index
                ? "translateX(20%) translateZ(-200px)"
                : "translateZ(-200px) scale(0)"
            }
            transition={"1500ms"}
            // opacity={currentSlide === index ? "1" : "0.5"}
          >
            {each}
          </Flex>
        );
      })}
      <Flex mt={"8px"} gridGap={"8px"}>
        <Link
          p={"8px 16px"}
          border={"1px dashed #fff4"}
          borderRadius={"8px"}
          onClick={() =>
            setCurrentSlide((currentSlide + 1) % childNodes.length)
          }
        >
          <ArrowIcon dir="left" />
        </Link>
        <Link
          p={"8px 16px"}
          border={"1px dashed #fff4"}
          borderRadius={"8px"}
          onClick={() =>
            setCurrentSlide(
              (currentSlide + childNodes.length - 1) % childNodes.length
            )
          }
        >
          <ArrowIcon dir="right" />
        </Link>
      </Flex>
    </Carousel3dContainer>
  );
});

const Carousel3dContainer = styled(Flex)`
  transform-style: preserve-3d;
  perspective: 50vw;
`;
Carousel3dContainer.defaultProps = {
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
};
