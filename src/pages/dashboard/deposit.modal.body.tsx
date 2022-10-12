import { Input, Table, Tr, Td, Tbody } from "components/base";
import { Flex } from "components/base/container";
import { useWalletHook } from "../../common/hooks/wallet";
import { MODULE_ADDR } from "../../config";
import { useState } from "react";

const DepositModalBody: React.FC<{ [index: string]: any }> = ({
  miraIndexInfo = {},
  setVisible = () => {},
  setUpdateInvest = () => {},
  ...props
}) => {
  const { walletConnected, signAndSubmitTransaction } = useWalletHook();
  const [depositAmount, setDepositAmount] = useState<number>(0);

  const deposit = async () => {
    if (!walletConnected) return;
    try {
      const transaction = {
        type: "entry_function_payload",
        function: `${MODULE_ADDR}::mira::invest`,
        type_arguments: [],
        arguments: [
          miraIndexInfo.poolName,
          miraIndexInfo.poolOwner,
          depositAmount,
        ],
      };
      const result = await signAndSubmitTransaction(transaction);
    } catch (error) {
      console.log("deposit error", error);
    }
    setVisible(false);
    setUpdateInvest((value) => value + 1);
  };
  return (
    <Flex col gridGap={"10px"}>
      <Flex
        py={"8px"}
        fontSize={"18px"}
        fontWeight={"500"}
        borderBottom={"1px solid #34383b"}
      >
        Deposit
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
          <Table cellSpacing={"2px"}>
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
                  Deposit amount:
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
                        setDepositAmount(parseInt(e.target.value));
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
            onClick={() => deposit()}
          >
            Deposit
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default DepositModalBody;
