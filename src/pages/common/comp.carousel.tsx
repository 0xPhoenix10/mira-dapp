import { Link } from "components/base";
import { Flex } from "components/base/container";
import { ArrowIcon } from "components/icons";
import { BsPause } from "react-icons/bs";
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
  const [isStop, setStop] = useState(false);
  const [isHover, setHover] = useState(false);

  useImperativeHandle(ref, () => ({
    reset() {
      setCurrentSlide(
        (currentSlide + childNodes.length - 1) % childNodes.length
      );
    },
  }));
  useEffect(() => {
    if (isHover) return;
    if (stop || isStop) return;
    const timeout = setTimeout(() => {
      setCurrentSlide(
        (currentSlide + childNodes.length - 1) % childNodes.length
      );
    }, 5500);
    return () => clearTimeout(timeout);
  }, [currentSlide, stop, isHover]);

  return (
    <Carousel3dContainer
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      {...props}
    >
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
            opacity={currentSlide === index ? "1" : "0.3"}
          >
            {each}
          </Flex>
        );
      })}
      <Flex mt={"8px"} gridGap={"8px"}>
        <Link
          p={"8px 16px"}
          border={"1px solid #fff4"}
          borderRadius={"8px"}
          onClick={() =>
            setCurrentSlide((currentSlide + 1) % childNodes.length)
          }
        >
          <ArrowIcon dir="left" />
        </Link>
        {/* <Link
          p={"8px 16px"}
          border={
            isStop ? "1px solid #70E094" : "1px solid #fff4"
          }
          color={isStop ? "#70E094" : "#fff"}
          borderRadius={"8px"}
          onClick={() =>
            isStop ? setStop(false) : setStop(true)
          }
        >
          <BsPause />
        </Link> */}
        <Link
          p={"8px 16px"}
          border={"1px solid #fff4"}
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
