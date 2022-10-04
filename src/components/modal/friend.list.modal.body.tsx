import { Table, Tr, Th, Td, Thead, Tbody } from "components/base";
import { Flex } from "components/base/container";
import { useWalletHook } from "../../common/hooks/wallet";
import { useEffect, useState } from "react";
import { acceptFriend, FriendStatus, getRequestedFriendData } from "../../utils/graphql";


const FriendListModalBody: React.FC<{ [index: string]: any }> = ({
    setVisible = () => { },
    ...props
}) => {
    const { walletConnected, walletAddress } = useWalletHook();
    const [requestedFriendDataList, setRequestedFriendDataList] = useState<string[]>([]);

    useEffect(() => {
        if (!walletConnected) return;
        const getFetchRequestedFriend = async () => {
            if (!walletConnected || !walletAddress) return;
            let friendDataList = await getRequestedFriendData(walletAddress);
            friendDataList.forEach((friendData) => {
                if (friendData.status !== FriendStatus.Request) return;
                setRequestedFriendDataList([...requestedFriendDataList, friendData.requestUser]);
            })
        }
        getFetchRequestedFriend();
    }, [walletConnected, requestedFriendDataList, walletAddress]);
    const accept_friend = async (requestedAddr: string, index: number) => {
        if (!walletConnected) return;
        let res = await acceptFriend(walletAddress, requestedAddr);
        if (res) {
            requestedFriendDataList.splice(index);
            setRequestedFriendDataList([...requestedFriendDataList]);
        }
    }
    return (
        <Flex col gridGap={"10px"} minWidth={"500px"}>
            <Flex py={"8px"} fontSize={"18px"} fontWeight={"500"} borderBottom={"1px solid #34383b"}>
                Friend Request List
            </Flex>
            <Flex
                col
                background={"#101012"}
                p={"20px"}
                border={"1px solid #34383b"}
                borderRadius={"20px"}
                gridGap={"12px"}
            >
                <Flex col justifyCenter gridGap={"16px"}>
                    <Table cellSpacing={"2px"}>
                        <Thead>
                            <Tr>
                                <Th textAlign={"left"}>
                                    Pool Owner address
                                </Th>
                                <Th>

                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                walletConnected && requestedFriendDataList.map((requestedAddr, index) => {
                                    return (<Tr key={index}>
                                        <Td px={"4px"} py={"8px"} color={"#888"}>
                                            {requestedAddr}
                                        </Td>
                                        <Td>
                                            <Flex
                                                justifyCenter
                                                alignCenter
                                                ml={"auto"}
                                                cursor={"pointer"}
                                                border={"1px solid #34383b"}
                                                borderRadius={"8px"}
                                                p={"8px 16px"}
                                                onClick={() => {
                                                    accept_friend(requestedAddr, index)
                                                }}
                                            >
                                                Accept
                                            </Flex>
                                        </Td>
                                    </Tr>)
                                })
                            }
                        </Tbody>
                    </Table>
                </Flex>
            </Flex>
        </Flex>
    )
}
export default FriendListModalBody;