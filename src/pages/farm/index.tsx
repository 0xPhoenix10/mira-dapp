import { Flex } from "components/base/container";
import { Box } from "components/base";

const FarmPage = () => {
    return (
        <Flex
            alignCenter
            gridGap={"16px"}
            px={"100px"}
            pb={"60px"}
            borderBottom={"1px solid #34383b"}
        >
            <Box
                fontFamily={"art"}
                fontWeight={"bold"}
                cursor={"pointer"}
                transition={"100ms"}
                fontSize={"50px"}
            >
                Coming Soon.
            </Box>
        </Flex>
    );
};

export default FarmPage;