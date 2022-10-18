import { useWalletHook } from 'common/hooks/wallet'
import { Box } from 'components/base'
import { Flex } from 'components/base/container'
import { CreateIcon, WarningIcon } from 'components/icons'
import { ModalParent } from 'components/modal'
import { useEffect, useRef, useState, useContext } from 'react'
import {
  ChartBox,
  IndexListModalBody,
  IndexModalBody,
  ModifyModalBody,
  UpdateModalBody,
  BlankCard,
} from '../components'
import { PortfolioModalBody } from './portfolio.modal.body'
import { ProfileModalBody } from '../otherprofile'
import { IndexAllocationModalBody } from '../index.allocation.modal'
import { IndexAllocation } from '../../utils/types'
import { Carousel3D } from '../common/comp.carousel'
import { UpdateIndexProviderContext } from './index'
import { AptosClient } from 'aptos'
import { MODULE_ADDR, NODE_URL } from 'config'
import { getFormatedDate, getStringFee } from '../../utils'
import { BsPause } from 'react-icons/bs'
import { VscDebugStart } from 'react-icons/vsc'
import { Link } from 'components/base'

interface MiraIndex {
  poolName: string
  poolAddress: string
  poolOwner: string
  managementFee: string
  founded: string
}

interface CreatePoolEvent {
  pool_name: string
  pool_address: string
  pool_owner: string
  privacy_allocation: number
  management_fee: number
  founded: number
}

interface MiraInvest {
  poolName: string
  investor: string
  amount: number
}

interface DepositPoolEvent {
  pool_name: string
  investor: string
  amount: number
}

const DashboardRecommended = () => {
  const { walletAddress, walletConnected } = useWalletHook()
  const [createMmodalVisible, setCreateModalVisible] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [modifyModalVisible, setModifyModalVisible] = useState(false)
  const [recommendedModalVisible, setRecommendedModalVisible] = useState(false)
  const [myIndexesModalVisible, setMyIndexesModalVisible] = useState(false)
  const [walletConnectAlertVisible, setWalletConnectAlertVisible] = useState(
    false,
  )
  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [profile, setProfile] = useState({})
  const [currentTab, setCurrentTab] = useState(0)
  const [isInvest, setInvest] = useState(true)
  const [
    indexAllocationModalVisible,
    setIndexAllocationModalVisible,
  ] = useState(false)
  const [allocationData, setAllocationData] = useState<IndexAllocation[]>([
    {
      name: 'BTC',
      value: 50,
    },
    {
      name: 'USDT',
      value: 50,
    },
  ])
  const Carousel3D1 = useRef(null)
  const Carousel3D2 = useRef(null)
  const Carousel3D3 = useRef(null)
  const { setUpdateInvest } = useContext(UpdateIndexProviderContext)
  const [miraMyIndexes, setMiraMyIndexes] = useState<MiraIndex[]>([])
  const [recommendedIndexes, setRecommendedIndexes] = useState<MiraIndex[]>([])
  const [miraMyInvests, setMiraMyInvests] = useState<MiraInvest[]>([])
  const [carouselStop, setCarouselStop] = useState(false)
  const [selectIndexInfo, setSelectIndexInfo] = useState<MiraIndex | null>(
    null
  );

  useEffect(() => {
    Carousel3D1?.current?.reset()
    Carousel3D2?.current?.reset()
    Carousel3D3?.current?.reset()
  }, [walletConnected, isInvest])

  useEffect(() => {
    if (walletAddress) {
      fetchIndexes()
      fetchInvests()
      getRecommendedIndexes()
    }
  }, [walletAddress])

  const fetchIndexes = async () => {
    const client = new AptosClient(NODE_URL)
    try {
      let events = await client.getEventsByEventHandle(
        MODULE_ADDR,
        `${MODULE_ADDR}::mira::MiraStatus`,
        'create_pool_events',
        { limit: 1000 },
      )
      let create_pool_events: MiraIndex[] = []
      for (let ev of events) {
        let e: CreatePoolEvent = ev.data
        if (walletAddress != e.pool_owner) continue
        create_pool_events.push({
          poolName: e.pool_name,
          poolAddress: e.pool_address,
          poolOwner: e.pool_owner,
          managementFee: getStringFee(e.management_fee),
          founded: getFormatedDate(e.founded),
        })
      }
      setMiraMyIndexes(create_pool_events)
    } catch (error) {
      console.log('set mira indexes error', error)
    }
  }

  const fetchInvests = async () => {
    const client = new AptosClient(NODE_URL)
    try {
      let events = await client.getEventsByEventHandle(
        MODULE_ADDR,
        `${MODULE_ADDR}::mira::MiraStatus`,
        'deposit_pool_events',
        { limit: 1000 },
      )
      let deposit_pool_events: MiraInvest[] = []
      for (let ev of events) {
        let e: DepositPoolEvent = ev.data
        if (walletAddress != e.investor) continue
        deposit_pool_events.push({
          poolName: e.pool_name,
          investor: e.investor,
          amount: e.amount,
        })
      }
      setMiraMyInvests(deposit_pool_events)
    } catch (error) {
      console.log('set mira invests error', error)
    }
  }

  const getRecommendedIndexes = async () => {
    const client = new AptosClient(NODE_URL)
    try {
      let events = await client.getEventsByEventHandle(
        MODULE_ADDR,
        `${MODULE_ADDR}::mira::MiraStatus`,
        'create_pool_events',
        { limit: 3 },
      )
      let create_pool_events: MiraIndex[] = []
      for (let ev of events) {
        let e: CreatePoolEvent = ev.data
        if (e.privacy_allocation == 1 || walletAddress == e.pool_owner) continue
        create_pool_events.push({
          poolName: e.pool_name,
          poolAddress: e.pool_address,
          poolOwner: e.pool_owner,
          managementFee: getStringFee(e.management_fee),
          founded: getFormatedDate(e.founded),
        })
      }
      setRecommendedIndexes(create_pool_events)
    } catch (error) {
      console.log('set recommended mira indexes error', error)
    }
  }

  return (
    <>
      {
        <ModalParent
          visible={portfolioModalVisible}
          setVisible={setPortfolioModalVisible}
        >
          <PortfolioModalBody
            flex={1}
            setVisible={setPortfolioModalVisible}
            setUpdateInvest={setUpdateInvest}
            miraIndexInfo={selectIndexInfo}
          />
        </ModalParent>
      }
      {
        <ModalParent
          visible={profileModalVisible}
          setVisible={setProfileModalVisible}
        >
          <ProfileModalBody
            flex={1}
            setVisible={setProfileModalVisible}
            profile={profile}
          />
        </ModalParent>
      }

      {
        <ModalParent
          visible={createMmodalVisible}
          setVisible={setCreateModalVisible}
        >
          <IndexModalBody
            flex={1}
            type={'create'}
            setVisible={setCreateModalVisible}
            setAllocationVisible={setIndexAllocationModalVisible}
            allocationData={allocationData}
          />
        </ModalParent>
      }
      {
        <ModalParent
          visible={updateModalVisible}
          setVisible={setUpdateModalVisible}
          zIndex={'1002'}
        >
          <UpdateModalBody flex={1} setVisible={setUpdateModalVisible} />
        </ModalParent>
      }
      {
        <ModalParent
          visible={indexAllocationModalVisible}
          setVisible={setIndexAllocationModalVisible}
          zIndex={'1004'}
        >
          <IndexAllocationModalBody
            flex={1}
            type={'create'}
            allocationData={allocationData}
            setAllocationData={setAllocationData}
            setVisible={setIndexAllocationModalVisible}
          />
        </ModalParent>
      }

      {
        <ModalParent
          visible={modifyModalVisible}
          setVisible={setModifyModalVisible}
          zIndex={'1001'}
        >
          <ModifyModalBody
            flex={1}
            setVisible={setModifyModalVisible}
            setUpdateVisible={setUpdateModalVisible}
            setAllocationVisible={setIndexAllocationModalVisible}
            allocationData={allocationData}
            miraIndexInfo={selectIndexInfo}
          />
        </ModalParent>
      }
      {
        <ModalParent
          visible={recommendedModalVisible}
          setVisible={setRecommendedModalVisible}
        >
          <IndexListModalBody flex={1} title={'Recommended'} />
        </ModalParent>
      }
      {
        <ModalParent
          visible={myIndexesModalVisible}
          setVisible={setMyIndexesModalVisible}
        >
          <IndexListModalBody flex={1} type={'create'} title={'My Indexes'} />
        </ModalParent>
      }
      {
        <ModalParent
          visible={walletConnectAlertVisible}
          setVisible={setWalletConnectAlertVisible}
        >
          <Flex alignCenter gridGap={'8px'} p={'10px 20px'}>
            <WarningIcon size={'25px'} color={'orange'} />
            Connect your wallet to create a portfolio.
          </Flex>
        </ModalParent>
      }

      <Flex gridGap={'16px'}>
        <Flex flex={1} col gridGap={'20px'}>
          <Flex alignCenter height={'50px'} borderBottom={'1px solid #34383b'}>
            <Box
              fontFamily={'art'}
              fontSize={'20px'}
              fontWeight={'bold'}
              cursor={'pointer'}
              onClick={() => {
                setRecommendedModalVisible(true)
              }}
            >
              Recommended
            </Box>
            {!walletConnected && (
              <Flex
                alignCenter
                gridGap={'4px'}
                ml={'auto'}
                padding={'8px 16px'}
                background={'#27282c'}
                p={'8px 16px'}
                border={'1px solid #34383b'}
                borderRadius={'8px'}
                cursor="pointer"
                onClick={() => setWalletConnectAlertVisible(true)}
              >
                <CreateIcon size={'1.2em'} />
                Create
              </Flex>
            )}
          </Flex>
          <Flex
            mx={!walletConnected ? 'auto' : 'unset'}
            width={!walletConnected ? '60%' : 'unset'}
            col
            alignCenter
            position={'relative'}
          >
            <Link
              p={'8px 16px'}
              border={carouselStop ? '1px solid #70E094' : '1px solid #fff4'}
              color={carouselStop ? '#70E094' : '#fff'}
              borderRadius={'8px'}
              onClick={() =>
                carouselStop ? setCarouselStop(false) : setCarouselStop(true)
              }
              position={'absolute'}
              left={'-10px'}
              zIndex={1}
            >
              {carouselStop ? <VscDebugStart /> : <BsPause />}
            </Link>
            {recommendedIndexes.length > 0 ? (
              <Carousel3D
                ref={Carousel3D1}
                stop={
                  portfolioModalVisible ||
                  modifyModalVisible ||
                  createMmodalVisible ||
                  carouselStop
                }
              >
                {recommendedIndexes.map((item, index) => {
                  return (
                    <ChartBox
                      key={index}
                      flex={1}
                      width={'0px'}
                      maxWidth={'70%'}
                      title={item.poolName}
                      cursor={'pointer'}
                      onClickPieChart={() => {
                        setPortfolioModalVisible(true)
                        setSelectIndexInfo(item)
                      }}
                      onClickTitle={() => {
                        setProfile({
                          username: item.poolName,
                          owner: item.poolName,
                        })
                        setProfileModalVisible(true)
                      }}
                    />
                  )
                })}
              </Carousel3D>
            ) : (
              <BlankCard
                flex={1}
                maxWidth={'70%'}
                minHeight={'245px'}
                type={'recommend'}
              />
            )}
          </Flex>
        </Flex>
        {walletConnected && (
          <Flex flex={1} col gridGap={'20px'}>
            <Flex
              alignCenter
              height={'50px'}
              borderBottom={'1px solid #34383b'}
            >
              <Flex alignItems={'flex-end'} gridGap={'8px'}>
                <Box
                  fontFamily={'art'}
                  fontSize={currentTab === 0 ? '20px' : '16px'}
                  opacity={currentTab === 0 ? '1' : '0.5'}
                  fontWeight={'bold'}
                  cursor={'pointer'}
                  onClick={() => {
                    if (currentTab !== 0) {
                      setCurrentTab(0)
                      setInvest(true)
                    } else setMyIndexesModalVisible(true)
                  }}
                  transition={'100ms'}
                >
                  My Investments
                </Box>
                <Box
                  fontFamily={'art'}
                  fontSize={currentTab === 1 ? '20px' : '16px'}
                  opacity={currentTab === 1 ? '1' : '0.5'}
                  fontWeight={'bold'}
                  cursor={'pointer'}
                  onClick={() => {
                    if (currentTab !== 1) {
                      setCurrentTab(1)
                      setInvest(false)
                    } else setMyIndexesModalVisible(true)
                  }}
                  transition={'100ms'}
                >
                  My Index Funds
                </Box>
              </Flex>
              <Flex
                alignCenter
                gridGap={'4px'}
                ml={'auto'}
                padding={'8px 16px'}
                background={'#302D38'}
                p={'8px 16px'}
                mt={'10px'}
                mb={'8px'}
                border={'1px solid #34383b'}
                borderRadius={'8px'}
                cursor="pointer"
                onClick={() => setCreateModalVisible(true)}
              >
                <CreateIcon size={'1.2em'} />
                Create
              </Flex>
            </Flex>
            <Flex justifyCenter gridGap={'16px'} height={'100%'} alignCenter>
              {isInvest ? (
                miraMyInvests.length > 0 ? (
                  <Carousel3D
                    ref={Carousel3D2}
                    stop={
                      portfolioModalVisible ||
                      modifyModalVisible ||
                      createMmodalVisible ||
                      carouselStop
                    }
                  >
                    {miraMyInvests.map((item, index) => {
                      return (
                        <ChartBox
                          key={index}
                          flex={1}
                          width={'0px'}
                          maxWidth={'70%'}
                          title={item.poolName}
                          cursor={'pointer'}
                          onClickPieChart={() => {
                            setModifyModalVisible(true)
                          }}
                          onClickTitle={() => {
                            setProfile({
                              username: item.poolName,
                              owner: item.poolName,
                            })
                            setProfileModalVisible(true)
                          }}
                        />
                      )
                    })}
                  </Carousel3D>
                ) : (
                  <BlankCard
                    flex={1}
                    maxWidth={'70%'}
                    minHeight={'245px'}
                    type={'invest'}
                  />
                )
              ) : miraMyIndexes.length > 0 ? (
                <Carousel3D
                  ref={Carousel3D3}
                  stop={
                    portfolioModalVisible ||
                    modifyModalVisible ||
                    createMmodalVisible ||
                    carouselStop
                  }
                >
                  {miraMyIndexes.map((item, index) => {
                    return (
                      <ChartBox
                        key={index}
                        flex={1}
                        width={'0px'}
                        maxWidth={'70%'}
                        title={item.poolName}
                        cursor={'pointer'}
                        onClickPieChart={() => {
                          setModifyModalVisible(true)
                          setSelectIndexInfo(item)
                        }}
                        onClickTitle={() => {
                          setProfile({
                            username: item.poolName,
                            owner: item.poolName,
                          })
                          setProfileModalVisible(true)
                        }}
                      />
                    )
                  })}
                </Carousel3D>
              ) : (
                <BlankCard
                  flex={1}
                  maxWidth={'70%'}
                  minHeight={'245px'}
                  type={'index'}
                  onClick={() => {
                    setCreateModalVisible(true)
                  }}
                />
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default DashboardRecommended
