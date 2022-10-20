import { Flex } from "../../components/base/container";
import { Input, Table, Tbody, Td, Tr } from "../../components/base";
import { useWalletHook } from "../../common/hooks/wallet";
import { MODULE_ADDR } from "../../config";
import { useState } from "react";

const WithdrawModalBody: React.FC<{ [index: string]: any }> = ({
  miraIndexInfo = {},
  setVisible = () => {},
 setEstimateAmount = ()=>{},
 setShowPrice = ()=>{},
  ...props
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);

  return (
    <Flex col gridGap={"10px"}>
      <Flex
        py={"8px"}
        fontSize={"18px"}
        fontWeight={"500"}
        borderBottom={"1px solid #34383b"}
      >
        Withdraw
      </Flex>
      <Flex
        col
        background={"#302d38"}
        p={"20px"}
        border={"1px solid #34383b"}
        borderRadius={"20px"}
        gridGap={"12px"}
      >
        <Flex col justifyCenter gridGap={"16px"}>
          <Table>
            <Tbody>
              <Tr>
                <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                  Pool Name:
                </Td>
                <Td px={"4px"} py={"8px"} borderBottom={"none"} color={"#888"}>
                  {miraIndexInfo.poolName}
                </Td>
              </Tr>
              <Tr>
                <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                  Pool owner:
                </Td>
                <Td px={"4px"} py={"8px"} borderBottom={"none"} color={"#888"}>
                  {miraIndexInfo.poolOwner}
                </Td>
              </Tr>
              <Tr>
                <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                  Pool address:
                </Td>
                <Td px={"4px"} py={"8px"} borderBottom={"none"} color={"#888"}>
                  {miraIndexInfo.poolAddress}
                </Td>
              </Tr>
              <Tr>
                <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                  Management Fee:
                </Td>
                <Td px={"4px"} py={"8px"} borderBottom={"none"} color={"#888"}>
                  {miraIndexInfo.managementFee} %
                </Td>
              </Tr>
              <Tr>
                <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                  Founded:
                </Td>
                <Td px={"4px"} py={"8px"} borderBottom={"none"} color={"#888"}>
                  {miraIndexInfo.founded}
                </Td>
              </Tr>
              <Tr>
                <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                  Withdraw amount:
                </Td>
                <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                  <Flex
                    alignCenter
                    p={"4px"}
                    borderBottom={"1px solid #34383b"}
                  >
                    <Input
                      flex={"1"}
                      border={"none"}
                      background={"transparent"}
                      color={"#888"}
                      placeholder={"input here..."}
                      onChange={(e) => {
                        setWithdrawAmount(parseInt(e.target.value));
                        setEstimateAmount(parseInt(e.target.value));
                      }}
                    />
                    Aptos
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          </Table>
          <Flex
            alignCenter
            ml={"auto"}
            cursor={"pointer"}
            border={"1px solid #34383b"}
            borderRadius={"8px"}
            p={"8px 16px"}
            onClick={() => { setShowPrice(true); setVisible(false); } }
          >
            Withdraw
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default WithdrawModalBody;
