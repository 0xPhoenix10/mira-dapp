import {
  Box,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
} from 'components/base'
import { Flex } from 'components/base/container'
import { CustomSelect, RadioBtn, SmOption } from 'components/form'
import {
  ArrowIcon,
  CheckIcon,
  CreateIcon,
  SearchIcon,
  TimesIcon,
  ExchangeIcon,
  FilterIcon,
  WarningIcon,
  IconNarrow,
  SortDirIcon,
  PencilIcon,
} from 'components/icons'
import { ModalParent } from 'components/modal'
import { CustomTooltip } from 'components/elements/tooptip'
import React, { useEffect, useState } from 'react'
import { FriendStatus, getFriendData, requestFriend } from '../utils/graphql'
import {
  CartesianGrid,
  Cell,
  Area,
  AreaChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { AptosClient, AptosAccount, CoinClient } from 'aptos'
import { FEE_DECIMAL, MODULE_ADDR, DECIMAL, NODE_URL } from '../config'
import { useWalletHook } from '../common/hooks/wallet'
import DepositModalBody from './dashboard/deposit.modal.body'
import WithdrawModalBody from './dashboard/withdraw.modal.body'
import { renderActiveShape } from '../common/recharts/piechart'
import {
  ArtButton,
  NormalBtn,
  AddBtn,
  SwipeBtn,
} from 'components/elements/buttons'
import { IndexAllocation } from '../utils/types'
import { getFormatedDate } from '../utils'
import { IndexAllocationModalBody } from './index.allocation.modal'
import { ProfileModalBody } from './otherprofile'

interface ChartBoxProps {
  title?: string
  owner?: string
  indexAllocation?: any
  [index: string]: any
}

interface IData {
  name: string
  value: string | number
}

export const ChartBox: React.FC<ChartBoxProps> = ({
  title = 'Chart Box',
  owner = 'Mira',
  indexAllocation = [],
  cursor = 'revert',
  onClickPieChart = () => {},
  onClickTitle = () => {},
  cursorAll,
  onClickAll = () => {},
  ...props
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isHovered, setHovered] = React.useState(false)

  const data = indexAllocation

  const COLORS = [
    '#5a9e47',
    '#23b5b5',
    '#527da7',
    '#d4901c',
    '#3d6595',
    '#345882',
  ]

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN) + 5

    if (data.length < 5) {
      return (
        <text
          fontSize={'10px'}
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="center"
        >
          {`${data[index].name}`}
        </text>
      )
    }
  }

  const style = {
    backgroundColor: 'lightgrey',
    color: 'black',
    padding: '2px 20px',
    fontSize: '12px',
  }

  const CustomizedTooltip = React.memo((props: any) => {
    if (props.payload.length > 0) {
      const sum = data.reduce((a, v) => (a = a + v.value), 0)

      const item: IData = props.payload[0]
      return (
        <div style={style}>
          <p>
            {item.name} - {((Number(item.value) / sum) * 100).toFixed(0)}%
          </p>
        </div>
      )
    }
    return null
  })

  const onPieEnter = (data, index) => {
    setActiveIndex(index)
    setHovered(true)
  }

  const onPieLeave = () => setHovered(false)

  return (
    <Flex
      col
      background={'#302d38'}
      p={'20px'}
      border={'1px solid #34383b'}
      borderRadius={'20px'}
      gridGap={'12px'}
      {...props}
    >
      <Flex
        justifyCenter
        alignCenter
        gridGap={'16px'}
        cursor={cursorAll}
        onClick={onClickAll}
      >
        <Flex width={'40%'} aspectRatio={'1'}>
          <ResponsiveContainer>
            <PieChart
              width={300}
              height={300}
              onClick={onClickPieChart}
              style={{ cursor: cursor }}
            >
              <Tooltip content={<CustomizedTooltip />} />
              <Pie
                activeIndex={isHovered ? activeIndex : null}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={'90%'}
                fill="#8884d8"
                stroke={'transparent'}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Flex>
        <Flex
          col
          gridGap={'4px'}
          color={'lightgrey'}
          cursor={'pointer'}
          alignItems={'end'}
        >
          <Flex
            mb={'8px'}
            fontSize={'18px'}
            fontWeight={'bold'}
            color={'#70e094'}
            mx={'auto'}
            onClick={onClickTitle}
          >
            {owner}
          </Flex>
          <CustomTooltip
            title="today's market performance"
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={'8px'}>
              <Box>1d ⓘ</Box>
              <Box>:</Box>
              <Box>0.2%</Box>
            </Flex>
          </CustomTooltip>
          <CustomTooltip
            title="this week's performance"
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={'8px'}>
              <Box>1w ⓘ</Box>
              <Box>:</Box>
              <Box>4.1%</Box>
            </Flex>
          </CustomTooltip>
          <CustomTooltip
            title="this year's performance"
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={'8px'}>
              <Box>1y ⓘ</Box>
              <Box>:</Box>
              <Box>18.5%</Box>
            </Flex>
          </CustomTooltip>
          <CustomTooltip
            title="the Sharpe Ratio measures risk to reward on a scale from 0-1."
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={'8px'}>
              <Box>Sharpe Ratio ⓘ</Box>
              <Box>:</Box>
              <Box>0.23</Box>
            </Flex>
          </CustomTooltip>
          <CustomTooltip
            title="Total Value Locked measures the total amount of funds deposited"
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={'8px'}>
              <Box>TVL ⓘ</Box>
              <Box>:</Box>
              <Box>3.2M</Box>
            </Flex>
          </CustomTooltip>
          <CustomTooltip
            title="Mira approves of this fund strategy as expert-crafted"
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={'8px'}>
              <Box>Expert ⓘ</Box>
              <Box>:</Box>
              <Box>✓</Box>
            </Flex>
          </CustomTooltip>
        </Flex>
      </Flex>
      <Box fontSize={'16px'} fontWeight={'bold'} color={'#fff'}>
        {title}
      </Box>
    </Flex>
  )
}

interface BlankCardProps {
  type?: 'invest' | 'index' | 'recommend'
  [index: string]: any
}

export const BlankCard: React.FC<BlankCardProps> = ({
  type = 'invest',
  ...props
}) => {
  return (
    <Flex
      col
      background={'#302d38'}
      p={'20px'}
      border={'1px solid #34383b'}
      borderRadius={'20px'}
      gridGap={'12px'}
      cursor={'pointer'}
      {...props}
    >
      <Flex justifyCenter pt={'50px'} alignCenter gridGap={'16px'}>
        <Flex aspectRatio={'1'} color={'lightgrey'}>
          <WarningIcon size="40px" />
        </Flex>
        <Flex col gridGap={'4px'} color={'lightgrey'}>
          <p
            style={{
              fontSize: '16px',
            }}
          >
            {type === 'invest' &&
              "You haven't invested in any portfolios yet. Check out Our Tokens or browse the Leaderboard to get started!"}
            {type === 'index' &&
              "You haven't created an index yet. Click here to get started!"}
            {type === 'recommend' && 'There is no recommended index now.'}
          </p>
        </Flex>
      </Flex>
    </Flex>
  )
}

interface IndexModalBodyProps {
  type?: 'modify' | 'create'
  [index: string]: any
}
export const IndexModalBody: React.FC<IndexModalBodyProps> = ({
  type = 'modify',
  setVisible = () => {},
  setAllocationVisible = () => {},
  allocationData = [],
  ...props
}) => {
  const { walletConnected, signAndSubmitTransaction } = useWalletHook()
  const [nameValue, setNameValue] = useState<string>('')
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [managementFee, setManagementFee] = useState<number>(0)
  const [rebalancingPeriod, setRebalancingPeriod] = useState<number>(0)
  const [minimumContribution, setMiniumContribution] = useState<number>(0)
  const [miniumWithdrawal, setMiniumWithdrawal] = useState<number>(0)
  const [privateAllocation, setPrivateAlloation] = useState<number>(0)
  const [referralReward, setReferralReward] = useState<number>(0)
  const [openMoreSetting, setOpenMoreSetting] = useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isHovered, setHovered] = React.useState(false)
  const [isRebalancingMore, setRebalancingMoreBtn] = useState(false)
  const [isMinWithdrawalMore, setMinWithdrawalMoreBtn] = useState(false)

  const COLORS = [
    '#5a9e47',
    '#23b5b5',
    '#527da7',
    '#d4901c',
    '#3d6595',
    '#345882',
  ]

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }
  const [visibleDeposit, setVisibleDeposit] = useState(false)
  const [visibleWithdraw, setVisibleWithdraw] = useState(false)
  const [estimateAmount, setEstimateAmount] = useState<string>('0.00')
  const show_price = async () => {
    if (!walletConnected) return

    let pool_name = nameValue.trim()
    let total_amount = totalAmount * 100000000
    let management_fee = managementFee * FEE_DECIMAL
    let minimum_contribution = minimumContribution * FEE_DECIMAL
    let index_allocation_key: string[] = []
    let index_allocation_value: number[] = []
    let sum = 0
    allocationData.forEach((data: any) => {
      index_allocation_key.push(data.name)
      index_allocation_value.push(data.value)
      sum += data.value
    })
    if (sum !== 100) return

    if (pool_name === '') return
    if (total_amount < 1) return
    if (management_fee < 0 || managementFee > 100) return
    if (minimum_contribution < 0 || minimum_contribution > 10000) return
    setEstimateAmount((total_amount / 100000000).toFixed(3))

    setShowPrice(true)
  }
  const create_index = async () => {
    if (!walletConnected) return

    let pool_name = nameValue.trim()
    let total_amount = totalAmount * DECIMAL
    let gas_amount = 20000
    let management_fee = managementFee * FEE_DECIMAL
    let rebalancing_period = rebalancingPeriod * 1
    let rebalancing_gas = 20000
    let minimum_contribution = minimumContribution * DECIMAL
    let minimum_withdrawal = miniumWithdrawal * 1
    let referral_reward = referralReward * DECIMAL

    let index_allocation_key: string[] = []
    let index_allocation_value: number[] = []
    let sum = 0
    allocationData.forEach((data: any) => {
      index_allocation_key.push(data.name)
      index_allocation_value.push(data.value)
      sum += data.value
    })
    if (sum !== 100) return

    let private_allocation = privateAllocation * 1

    if (pool_name === '') return
    if (total_amount < DECIMAL) return
    if (management_fee < 0 || managementFee > 100) return
    if (minimum_contribution < 0 || minimum_contribution > DECIMAL) return

    const transaction = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDR}::mira::create_pool`,
      arguments: [
        pool_name,
        total_amount,
        gas_amount,
        management_fee,
        rebalancing_period,
        rebalancing_gas,
        minimum_contribution,
        minimum_withdrawal,
        referral_reward,
        index_allocation_key,
        index_allocation_value,
        private_allocation,
      ],
      type_arguments: [],
    }
    const result = await signAndSubmitTransaction(transaction)

    if (result) {
      setVisible(false)
    }
  }

  const style = {
    backgroundColor: '#000',
    color: 'lightgrey',
    padding: '2px 15px',
    fontSize: '12px',
  }

  const CustomizedTooltip = React.memo((props: any) => {
    if (props.payload.length > 0) {
      const sum = allocationData.reduce((a, v) => (a = a + v.value), 0)

      const item: IData = props.payload[0]
      return (
        <div style={style}>
          <p>
            {item.name} - {((Number(item.value) / sum) * 100).toFixed(0)}%
          </p>
        </div>
      )
    }
    return null
  })

  const onPieEnter = (data, index) => {
    setActiveIndex(index)
    setHovered(true)
  }

  const onPieLeave = () => setHovered(false)

  const [showPrice, setShowPrice] = useState(false)

  return (
    <>
      {visibleDeposit || visibleWithdraw ? (
        <>
          <Flex
            background={'#0005'}
            p={'8px 16px'}
            border={'1px solid #34383b'}
            borderRadius={'8px'}
            ml={'auto'}
            cursor="pointer"
            onClick={() => {
              setVisibleDeposit(false)
              setVisibleWithdraw(false)
            }}
            zIndex={'0'}
          >
            <ArrowIcon dir={'left'} />
          </Flex>
          {visibleDeposit && <DepositModalBody />}
          {visibleWithdraw && <WithdrawModalBody />}
        </>
      ) : (
        <Flex col gridGap={'10px'}>
          {type === 'modify' && (
            <Flex
              py={'8px'}
              fontSize={'18px'}
              fontWeight={'500'}
              borderBottom={'1px solid #34383b'}
            >
              {type === 'modify' && 'Modify My Index'}
              {/* {type === 'create' && 'Create My Index'} */}
            </Flex>
          )}
          
          <Flex
            col
            justifyCenter
            gridGap={'1px'}
            background={'#302d38'}
            p={'20px'}
            border={'1px solid #34383b'}
            borderRadius={'20px'}
            {...props}
          >
            <Flex col gridGap={'12px'} {...props}>
              <Flex justifyCenter gridGap={'16px'} alignCenter>
                <Flex col gridGap={'4px'} minWidth={'395px'} justifyCenter>
                  <Flex
                    alignCenter
                    gridGap={'4px'}
                    background={'#0005'}
                    p={'8px 16px'}
                    border={'1px solid #34383b'}
                    borderRadius={'8px'}
                  >
                    <Input
                      border={'none'}
                      background={'transparent'}
                      color={'white'}
                      placeholder={'Pick a name'}
                      placeColor={'#70e094'}
                      fontSize={'24px'}
                      readOnly={type === 'modify'}
                      width={'100%'}
                      onChange={(e) => {
                        setNameValue(e.target.value)
                      }}
                    />
                    <Flex
                      cursor={'pointer'}
                    >
                      <PencilIcon size={'1.5em'}/>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex col gridGap={'12px'} {...props}>
              <Flex justifyCenter gridGap={'16px'} alignCenter>
                {(type === 'modify' || type === 'create') && (
                  <Flex col>
                    <Flex width={'300px'} aspectRatio={'1'}>
                      <ResponsiveContainer>
                        {allocationData && Array.isArray(allocationData) && (
                          <PieChart
                            width={300}
                            height={300}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setAllocationVisible(true)
                            }}
                          >
                            <Tooltip content={<CustomizedTooltip />} />
                            <Pie
                              activeIndex={isHovered ? activeIndex : null}
                              activeShape={renderActiveShape}
                              data={allocationData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={renderCustomizedLabel}
                              outerRadius={'90%'}
                              fill="#8884d8"
                              stroke={'transparent'}
                              dataKey="value"
                              onMouseEnter={onPieEnter}
                              onMouseLeave={onPieLeave}
                            >
                              {allocationData.map(
                                (entry: any, index: number) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 4]}
                                  />
                                ),
                              )}
                            </Pie>
                          </PieChart>
                        )}
                      </ResponsiveContainer>
                      <div
                        style={{
                          position: "relative",
                          top: '10px',
                          right: '40px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setAllocationVisible(true)
                        }}
                      >
                        <PencilIcon size={'1.5em'} />
                      </div>
                    </Flex>
                    {type === 'modify' && (
                      <Flex justifyCenter gridGap={'8px'}>
                        <Flex
                          alignCenter
                          gridGap={'4px'}
                          padding={'8px 16px'}
                          background={'#0005'}
                          p={'8px 16px'}
                          border={'1px solid #34383b'}
                          borderRadius={'8px'}
                          cursor="pointer"
                          onClick={() => {
                            setVisibleDeposit(true)
                          }}
                        >
                          Invest
                        </Flex>
                        <Flex
                          alignCenter
                          gridGap={'4px'}
                          padding={'8px 16px'}
                          background={'#0005'}
                          p={'8px 16px'}
                          border={'1px solid #34383b'}
                          borderRadius={'8px'}
                          cursor="pointer"
                          onClick={() => {
                            setVisibleWithdraw(true)
                          }}
                        >
                          Withdraw
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                )}
                <Flex
                  col
                  gridGap={'4px'}
                  minWidth={'395px'}
                  minHeight={'310px'}
                  justifyContent={'space-around'}
                  border={"1px solid #5c6266"}
                  borderRadius={"20px"}
                  mt={"20px"}
                  p={"20px"}
                >
                  <Table>
                    <Tbody>
                      <Tr fontSize={'16px'}>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          Deposit amount :
                        </Td>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          <Flex
                            alignCenter
                            p={'4px'}
                            borderBottom={'1px solid #34383b'}
                          >
                            <Input
                              flex={'1'}
                              type={'number'}
                              border={'none'}
                              background={'transparent'}
                              color={'white'}
                              placeholder={'input here...'}
                              fontSize={"16px"}
                              max={'100'}
                              min={'0'}
                              readOnly={type === 'modify'}
                              onChange={(e) => {
                                setTotalAmount(parseInt(e.target.value))
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr fontSize={'16px'}>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          Rebalancing :
                        </Td>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          <Flex
                            alignCenter
                            px={'4px'}
                            py={'1px'}
                            borderBottom={'1px solid #34383b'}
                          >
                            {isRebalancingMore ? (
                              <>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    rebalancingPeriod === 1
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setRebalancingPeriod(1)}
                                  fontSize={"16px"}
                                >
                                  1D
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    rebalancingPeriod === 7
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setRebalancingPeriod(7)}
                                  fontSize={"16px"}
                                >
                                  1W
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    rebalancingPeriod === 14
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setRebalancingPeriod(14)}
                                  fontSize={"16px"}
                                >
                                  2W
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    rebalancingPeriod === 30
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setRebalancingPeriod(30)}
                                  fontSize={"16px"}
                                >
                                  1M
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    rebalancingPeriod === 60
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setRebalancingPeriod(60)}
                                  fontSize={"16px"}
                                >
                                  2M
                                </NormalBtn>
                              </>
                            ) : (
                              <>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    rebalancingPeriod === 1
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setRebalancingPeriod(1)}
                                  fontSize={"16px"}
                                >
                                  1D
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    rebalancingPeriod === 7
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setRebalancingPeriod(7)}
                                  fontSize={"16px"}
                                >
                                  1W
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    rebalancingPeriod === 30
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setRebalancingPeriod(30)}
                                  fontSize={"16px"}
                                >
                                  1M
                                </NormalBtn>
                              </>
                            )}
                            <AddBtn
                              onClick={() =>
                                isRebalancingMore
                                  ? setRebalancingMoreBtn(false)
                                  : setRebalancingMoreBtn(true)
                              }
                              ml={'0px'}
                              fontSize={"16px"}
                            >
                              {isRebalancingMore ? '-' : '+'}
                            </AddBtn>
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr fontSize={'16px'}>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          Management fee :
                        </Td>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          <Flex
                            alignCenter
                            p={'4px'}
                            borderBottom={'1px solid #34383b'}
                          >
                            <NormalBtn
                              ml={'0px'}
                              background={
                                managementFee === 1 ? '#565656' : '#302d38'
                              }
                              onClick={() => setManagementFee(1)}
                              fontSize={"16px"}
                            >
                              1%
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                managementFee === 2 ? '#565656' : '#302d38'
                              }
                              onClick={() => setManagementFee(2)}
                              fontSize={"16px"}
                            >
                              2%
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                managementFee === 5 ? '#565656' : '#302d38'
                              }
                              onClick={() => setManagementFee(5)}
                              fontSize={"16px"}
                            >
                              5%
                            </NormalBtn>
                            <Input
                              flex={'1'}
                              type={'number'}
                              border={'none'}
                              background={'transparent'}
                              fontSize={"16px"}
                              color={'white'}
                              placeholder={'...'}
                              max={'100'}
                              min={'0'}
                              ml={'10px'}
                              readOnly={type === 'modify'}
                              onChange={(e) => {
                                setManagementFee(parseInt(e.target.value))
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                      {openMoreSetting && (
                        <>
                          <Tr fontSize={'16px'}>
                            <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                              Minimum Contribution :
                            </Td>
                            <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                              <Flex
                                alignCenter
                                p={'4px'}
                                borderBottom={'1px solid #34383b'}
                              >
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    minimumContribution === 0.1
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumContribution(0.1)}
                                  fontSize={"16px"}
                                >
                                  $1
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    minimumContribution === 0.5
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumContribution(0.5)}
                                  fontSize={"16px"}
                                >
                                  $5
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    minimumContribution === 1
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumContribution(1)}
                                  fontSize={"16px"}
                                >
                                  $10
                                </NormalBtn>
                                <Input
                                  flex={'1'}
                                  border={'none'}
                                  background={'transparent'}
                                  color={'white'}
                                  placeholder={'...'}
                                  ml={'10px'}
                                  readOnly={type === 'modify'}
                                  fontSize={"16px"}
                                  onChange={(e) => {
                                    setMiniumContribution(
                                      parseFloat(e.target.value),
                                    )
                                  }}
                                />
                              </Flex>
                            </Td>
                          </Tr>
                          <Tr fontSize={'16px'}>
                            <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                              Minimum Withdrawal Period :
                            </Td>
                            <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                              <Flex
                                alignCenter
                                px={'4px'}
                                py={'1px'}
                                borderBottom={'1px solid #34383b'}
                              >
                                {isMinWithdrawalMore ? (
                                  <>
                                    <NormalBtn
                                      ml={'0px'}
                                      background={
                                        miniumWithdrawal === 1
                                          ? '#565656'
                                          : '#302d38'
                                      }
                                      onClick={() => setMiniumWithdrawal(1)}
                                      fontSize={"16px"}
                                    >
                                      1D
                                    </NormalBtn>
                                    <NormalBtn
                                      ml={'0px'}
                                      background={
                                        miniumWithdrawal === 7
                                          ? '#565656'
                                          : '#302d38'
                                      }
                                      onClick={() => setMiniumWithdrawal(7)}
                                      fontSize={"16px"}
                                    >
                                      1W
                                    </NormalBtn>
                                    <NormalBtn
                                      ml={'0px'}
                                      background={
                                        miniumWithdrawal === 14
                                          ? '#565656'
                                          : '#302d38'
                                      }
                                      onClick={() => setMiniumWithdrawal(14)}
                                      fontSize={"16px"}
                                    >
                                      2W
                                    </NormalBtn>
                                    <NormalBtn
                                      ml={'0px'}
                                      background={
                                        miniumWithdrawal === 30
                                          ? '#565656'
                                          : '#302d38'
                                      }
                                      onClick={() => setMiniumWithdrawal(30)}
                                      fontSize={"16px"}
                                    >
                                      1M
                                    </NormalBtn>
                                    <NormalBtn
                                      ml={'0px'}
                                      background={
                                        miniumWithdrawal === 60
                                          ? '#565656'
                                          : '#302d38'
                                      }
                                      onClick={() => setMiniumWithdrawal(60)}
                                      fontSize={"16px"}
                                    >
                                      2M
                                    </NormalBtn>
                                  </>
                                ) : (
                                  <>
                                    <NormalBtn
                                      ml={'0px'}
                                      background={
                                        miniumWithdrawal === 1
                                          ? '#565656'
                                          : '#302d38'
                                      }
                                      onClick={() => setMiniumWithdrawal(1)}
                                      fontSize={"16px"}
                                    >
                                      1D
                                    </NormalBtn>
                                    <NormalBtn
                                      ml={'0px'}
                                      background={
                                        miniumWithdrawal === 7
                                          ? '#565656'
                                          : '#302d38'
                                      }
                                      onClick={() => setMiniumWithdrawal(7)}
                                      fontSize={"16px"}
                                    >
                                      1W
                                    </NormalBtn>
                                    <NormalBtn
                                      ml={'0px'}
                                      background={
                                        miniumWithdrawal === 30
                                          ? '#565656'
                                          : '#302d38'
                                      }
                                      onClick={() => setMiniumWithdrawal(30)}
                                      fontSize={"16px"}
                                    >
                                      1M
                                    </NormalBtn>
                                  </>
                                )}
                                <AddBtn
                                  onClick={() =>
                                    isMinWithdrawalMore
                                      ? setMinWithdrawalMoreBtn(false)
                                      : setMinWithdrawalMoreBtn(true)
                                  }
                                  fontSize={"16px"}
                                  ml={'0px'}
                                >
                                  {isMinWithdrawalMore ? '-' : '+'}
                                </AddBtn>
                              </Flex>
                            </Td>
                          </Tr>
                          <Tr fontSize={'16px'}>
                            <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                              Privacy Allocation :
                            </Td>
                            <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                              <Flex
                                alignCenter
                                p={'4px'}
                                borderBottom={'1px solid #34383b'}
                                gridGap={'20px'}
                              >
                                <RadioBtn
                                  name={'privacy_allocation'}
                                  value={'0'}
                                  title={'Public'}
                                  selected
                                  onChange={(e: any) => {
                                    setPrivateAlloation(e)
                                  }}
                                />
                                <RadioBtn
                                  name={'privacy_allocation'}
                                  value={'1'}
                                  title={'Private'}
                                  onChange={(e: any) => {
                                    setPrivateAlloation(e)
                                  }}
                                />
                                <RadioBtn
                                  name={'privacy_allocation'}
                                  value={'2'}
                                  title={'Private Fund'}
                                  onChange={(e: any) => {
                                    setPrivateAlloation(e)
                                  }}
                                />
                              </Flex>
                            </Td>
                          </Tr>
                          {/* <Tr>
                            <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                              Referral Rewards :
                            </Td>
                            <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                              <Flex
                                alignCenter
                                p={"4px"}
                                borderBottom={"1px solid #34383b"}
                              >
                                <Input
                                  flex={"1"}
                                  border={"none"}
                                  background={"transparent"}
                                  color={"white"}
                                  placeholder={"input here..."}
                                  readOnly={type === "modify"}
                                  onChange={(e) => {
                                    setReferralReward(parseInt(e.target.value));
                                  }}
                                />
                              </Flex>
                            </Td>
                          </Tr> */}
                        </>
                      )}

                      <Tr fontSize={'16px'}>
                        <Td
                          px={'4px'}
                          py={'2px'}
                          borderBottom={'none'}
                          cursor={'pointer'}
                          onClick={() => setOpenMoreSetting(!openMoreSetting)}
                          color={'#ab9b4e'}
                          style={{ textDecoration: 'underline' }}
                        >
                          {openMoreSetting ? 'Hide...' : 'Advanced Settings...'}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                  <Flex gridGap={'8px'}>
                    {type === 'modify' ? (
                      <>
                        {/* <Flex
                          alignCenter
                          gridGap={'4px'}
                          ml={'auto'}
                          padding={'8px 16px'}
                          background={'#0005'}
                          p={'8px 16px'}
                          border={'1px solid #34383b'}
                          borderRadius={'8px'}
                          cursor="pointer"
                        >
                          <CheckIcon size={'1.2em'} />
                          Save
                        </Flex> */}
                        <Flex
                          alignCenter
                          gridGap={'4px'}
                          ml={'auto'}
                          padding={'8px 16px'}
                          background={'#0005'}
                          p={'8px 16px'}
                          border={'1px solid #34383b'}
                          borderRadius={'8px'}
                          cursor="pointer"
                          fontSize={'18px'}
                          onClick={() => {
                            setVisible(false)
                          }}
                        >
                          <TimesIcon size={'1.2em'} />
                          Cancel
                        </Flex>
                      </>
                    ) : !showPrice ? (
                      <Flex
                        alignCenter
                        gridGap={'4px'}
                        ml={'auto'}
                        padding={'8px 16px'}
                        background={'#0005'}
                        p={'8px 16px'}
                        border={'1px solid #34383b'}
                        borderRadius={'8px'}
                        cursor="pointer"
                        fontSize={"18px"}
                        onClick={() => show_price()}
                      >
                        <CreateIcon size={'1.2em'} />
                        Create
                      </Flex>
                    ) : (
                      <SwipeBtn
                        gridGap={'4px'}
                        mt={'auto'}
                        ml={'auto'}
                        cursor="pointer"
                        onClick={() => create_index()}
                      >
                        Aptos {estimateAmount}
                      </SwipeBtn>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  )
}

export const UpdateModalBody: React.FC<{ [index: string]: any }> = ({
  setVisible = () => {},
  poolInfo = {},
  ...props
}) => {
  const { walletConnected, signAndSubmitTransaction } = useWalletHook()

  const [nameValue, setNameValue] = useState<string>(
    poolInfo.poolName ? poolInfo.poolName.trim() : ''
  )
  const [rebalancingPeriod, setRebalancingPeriod] = useState<number>(
    poolInfo.settings.rebalancing_period * 1
  )
  const [minimumContribution, setMiniumContribution] = useState<number>(
    poolInfo.settings.minimum_contribution / DECIMAL
  )
  const [miniumWithdrawal, setMiniumWithdrawal] = useState<number>(
    poolInfo.settings.minimum_withdrawal_period * 1
  )
  const [privateAllocation, setPrivateAlloation] = useState<number>(
    poolInfo.settings.privacy_allocation
  )
  const [referralReward, setReferralReward] = useState<number>(
    poolInfo.settings.referral_reward / DECIMAL
  )
  const [showPrice, setShowPrice] = useState(false)
  const [openMoreSetting, setOpenMoreSetting] = useState(false)
  const [isRebalancingMore, setRebalancingMoreBtn] = useState(false)
  const [isMinWithdrawalMore, setMinWithdrawalMoreBtn] = useState(false)

  const updatePool = async () => {
    if (!walletConnected) return

    let pool_name = nameValue.trim()
    let rebalancing_period = rebalancingPeriod * 1
    let minimum_contribution = minimumContribution * DECIMAL
    let minimum_withdrawal_period = miniumWithdrawal * 1
    let referral_reward = referralReward * DECIMAL
    let privacy_allocation = privateAllocation
    let index_allocation_key = poolInfo.indexList
    let index_allocation_value = poolInfo.indexAllocation

    if (pool_name === '') return
    if (minimum_contribution < 0 || minimum_contribution > DECIMAL) return

    const transaction = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDR}::mira::update_pool`,
      arguments: [
        pool_name,
        rebalancing_period,
        minimum_contribution,
        minimum_withdrawal_period,
        referral_reward,
        index_allocation_key,
        index_allocation_value,
        privacy_allocation,
      ],
      type_arguments: [],
    }
    const result = await signAndSubmitTransaction(transaction)

    if (result) {
      setVisible(false)
    }
  }

  return (
    <Flex col gridGap={'10px'}>
      <Flex
        py={'8px'}
        fontSize={'18px'}
        fontWeight={'500'}
        borderBottom={'1px solid #34383b'}
      >
        Update Settings for "{nameValue}"
      </Flex>
      <Flex justifyCenter gridGap={'16px'}>
        <Flex
          col
          background={'#302d38'}
          p={'20px'}
          border={'1px solid #34383b'}
          borderRadius={'20px'}
          gridGap={'12px'}
          {...props}
        >
          <Flex justifyCenter gridGap={'16px'} alignCenter>
            <Flex
              col
              gridGap={'4px'}
              minWidth={'395px'}
              minHeight={'310px'}
              justifyCenter
            >
              <Table>
                <Tbody>
                  <Tr fontSize={'16px'}>
                    <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                      Rebalancing :
                    </Td>
                    <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                      <Flex
                        alignCenter
                        px={'4px'}
                        py={'1px'}
                        borderBottom={'1px solid #34383b'}
                      >
                        {isRebalancingMore ? (
                          <>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                rebalancingPeriod === 1 ? '#565656' : '#302d38'
                              }
                              onClick={() => setRebalancingPeriod(1)}
                            >
                              1D
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                rebalancingPeriod === 7 ? '#565656' : '#302d38'
                              }
                              onClick={() => setRebalancingPeriod(7)}
                            >
                              1W
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                rebalancingPeriod === 14 ? '#565656' : '#302d38'
                              }
                              onClick={() => setRebalancingPeriod(14)}
                            >
                              2W
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                rebalancingPeriod === 30 ? '#565656' : '#302d38'
                              }
                              onClick={() => setRebalancingPeriod(30)}
                            >
                              1M
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                rebalancingPeriod === 60 ? '#565656' : '#302d38'
                              }
                              onClick={() => setRebalancingPeriod(60)}
                            >
                              2M
                            </NormalBtn>
                          </>
                        ) : (
                          <>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                rebalancingPeriod === 0 ? '#565656' : '#302d38'
                              }
                              onClick={() => setRebalancingPeriod(0)}
                            >
                              none
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                rebalancingPeriod === 1 ? '#565656' : '#302d38'
                              }
                              onClick={() => setRebalancingPeriod(1)}
                            >
                              1D
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                rebalancingPeriod === 7 ? '#565656' : '#302d38'
                              }
                              onClick={() => setRebalancingPeriod(7)}
                            >
                              1W
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                rebalancingPeriod === 30 ? '#565656' : '#302d38'
                              }
                              onClick={() => setRebalancingPeriod(30)}
                            >
                              1M
                            </NormalBtn>
                          </>
                        )}
                        <AddBtn
                          onClick={() =>
                            isRebalancingMore
                              ? setRebalancingMoreBtn(false)
                              : setRebalancingMoreBtn(true)
                          }
                          ml={'0px'}
                        >
                          {isRebalancingMore ? '-' : '+'}
                        </AddBtn>
                      </Flex>
                    </Td>
                  </Tr>
                  {openMoreSetting && (
                    <>
                      <Tr fontSize={'16px'}>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          Minimum Contribution :
                        </Td>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          <Flex
                            alignCenter
                            p={'4px'}
                            borderBottom={'1px solid #34383b'}
                          >
                            <NormalBtn
                              ml={'0px'}
                              background={
                                minimumContribution === 0.1 ? '#565656' : '#302d38'
                              }
                              onClick={() => setMiniumContribution(0.1)}
                            >
                              $1
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                minimumContribution === 0.5 ? '#565656' : '#302d38'
                              }
                              onClick={() => setMiniumContribution(0.5)}
                            >
                              $5
                            </NormalBtn>
                            <NormalBtn
                              ml={'0px'}
                              background={
                                minimumContribution === 1
                                  ? '#565656'
                                  : '#302d38'
                              }
                              onClick={() => setMiniumContribution(1)}
                            >
                              $10
                            </NormalBtn>
                            <Input
                              flex={'1'}
                              border={'none'}
                              background={'transparent'}
                              color={'white'}
                              placeholder={'...'}
                              ml={'10px'}
                              onChange={(e) => {
                                setMiniumContribution(
                                  parseFloat(e.target.value),
                                )
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr fontSize={'16px'}>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          Minimum Withdrawal Period :
                        </Td>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          <Flex
                            alignCenter
                            px={'4px'}
                            py={'1px'}
                            borderBottom={'1px solid #34383b'}
                          >
                            {isMinWithdrawalMore ? (
                              <>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    miniumWithdrawal === 1
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumWithdrawal(1)}
                                >
                                  1D
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    miniumWithdrawal === 7
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumWithdrawal(7)}
                                >
                                  1W
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    miniumWithdrawal === 14
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumWithdrawal(14)}
                                >
                                  2W
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    miniumWithdrawal === 30
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumWithdrawal(30)}
                                >
                                  1M
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    miniumWithdrawal === 60
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumWithdrawal(60)}
                                >
                                  2M
                                </NormalBtn>
                              </>
                            ) : (
                              <>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    miniumWithdrawal === 0
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumWithdrawal(0)}
                                >
                                  none
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    miniumWithdrawal === 1
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumWithdrawal(1)}
                                >
                                  1D
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    miniumWithdrawal === 7
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumWithdrawal(7)}
                                >
                                  1W
                                </NormalBtn>
                                <NormalBtn
                                  ml={'0px'}
                                  background={
                                    miniumWithdrawal === 30
                                      ? '#565656'
                                      : '#302d38'
                                  }
                                  onClick={() => setMiniumWithdrawal(30)}
                                >
                                  1M
                                </NormalBtn>
                              </>
                            )}
                            <AddBtn
                              onClick={() =>
                                isMinWithdrawalMore
                                  ? setMinWithdrawalMoreBtn(false)
                                  : setMinWithdrawalMoreBtn(true)
                              }
                              ml={'0px'}
                            >
                              {isMinWithdrawalMore ? '-' : '+'}
                            </AddBtn>
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr fontSize={'16px'}>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          Privacy Allocation :
                        </Td>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          <Flex
                            alignCenter
                            p={'4px'}
                            borderBottom={'1px solid #34383b'}
                            gridGap={'20px'}
                          >
                            <RadioBtn
                              name={'privacy_allocation'}
                              value={'0'}
                              title={'Public'}
                              selected
                              onChange={(e: any) => {
                                setPrivateAlloation(e)
                              }}
                            />
                            <RadioBtn
                              name={'privacy_allocation'}
                              value={'1'}
                              title={'Private'}
                              onChange={(e: any) => {
                                setPrivateAlloation(e)
                              }}
                            />
                            <RadioBtn
                              name={'privacy_allocation'}
                              value={'2'}
                              title={'Private Fund'}
                              onChange={(e: any) => {
                                setPrivateAlloation(e)
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                      {/* <Tr>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          Referral Rewards :
                        </Td>
                        <Td px={'4px'} py={'2px'} borderBottom={'none'}>
                          <Flex
                            alignCenter
                            p={'4px'}
                            borderBottom={'1px solid #34383b'}
                          >
                            <Input
                              flex={'1'}
                              border={'none'}
                              background={'transparent'}
                              color={'white'}
                              placeholder={'input here...'}
                              value={referralReward}
                              onChange={(e) => {
                                setReferralReward(parseInt(e.target.value))
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr> */}
                    </>
                  )}
                  <Tr fontSize={'16px'}>
                    <Td
                      px={'4px'}
                      py={'2px'}
                      borderBottom={'none'}
                      cursor={'pointer'}
                      onClick={() => setOpenMoreSetting(!openMoreSetting)}
                      color={'#ab9b4e'}
                      style={{ textDecoration: 'underline' }}
                    >
                      {openMoreSetting ? 'Hide...' : 'Advanced Settings...'}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
              <Flex gridGap={'8px'}>
                <Flex
                  alignCenter
                  gridGap={'4px'}
                  ml={'auto'}
                  padding={'8px 16px'}
                  background={'#0005'}
                  fontSize={'18px'}
                  p={'8px 16px'}
                  border={'1px solid #34383b'}
                  borderRadius={'8px'}
                  cursor="pointer"
                  onClick={() => {
                    setVisible(false)
                  }}
                >
                  <TimesIcon size={'1.2em'} />
                  Cancel
                </Flex>
                {!showPrice ? (
                  <Flex
                    alignCenter
                    gridGap={'4px'}
                    padding={'8px 16px'}
                    background={'#0005'}
                    p={'8px 16px'}
                    fontSize={'18px'}
                    border={'1px solid #34383b'}
                    borderRadius={'8px'}
                    cursor="pointer"
                    onClick={() => setShowPrice(true)}
                  >
                    <CheckIcon size={'1.2em'} />
                    Update
                  </Flex>
                ) : (
                  <SwipeBtn cursor="pointer" onClick={() => updatePool()}>
                    $0.45
                  </SwipeBtn>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export const IndexListModalBody: React.FC<{ [index: string]: any }> = ({
  title = '???',
  ...props
}) => {
  const miraIndexes = [
    {
      poolName: 'ha',
      poolAddress:
        '0xecc36a4b515e44347d40333db3b8aab14971a65e41819159e1ad9182f6006c41',
      poolOwner:
        '0xb7273e97383c1c0d77c548b6d7ab903748c6a7fd8406ca8e3d6560294e9c8102',
      managementFee: '1',
      founded: 'Sep 30, 2022',
    },
    {
      poolName: '10',
      poolAddress:
        '0xe28c78edbc8ee93447f488618aab75e60767f05655fec16736d17ec8e9373b08',
      poolOwner:
        '0xa464f9110ebd5fb70bb56f16b9d863de6221c221c40c7d2ff147fd20e4af5d46',
      managementFee: '10',
      founded: 'Oct 3, 2022',
    },
    {
      poolName: 'testttt',
      poolAddress:
        '0xe3cf662714c1524d0ed2f61e2e903508878fd9e418532814cd196eb28a7a44be',
      poolOwner:
        '0xb7273e97383c1c0d77c548b6d7ab903748c6a7fd8406ca8e3d6560294e9c8102',
      managementFee: '1',
      founded: 'Oct 3, 2022',
    },
    {
      poolName: 'abcd',
      poolAddress:
        '0x78e1616a36923d36b9c0a5d8a41c51302fe45bd2a6bdbfb1a6f24d78385e8715',
      poolOwner:
        '0xb4793170e2a45111d813f39c3d746b9e77b5aab1b88c30047d759d9f351e1a26',
      managementFee: '1',
      founded: 'Oct 3, 2022',
    },
    {
      poolName: 'newtest',
      poolAddress:
        '0xc8ff8558f31b7406af670e6117befabfd3473945f4a7c8a9e1652f1e1f51e196',
      poolOwner:
        '0xb4793170e2a45111d813f39c3d746b9e77b5aab1b88c30047d759d9f351e1a26',
      managementFee: '1',
      founded: 'Oct 3, 2022',
    },
    {
      poolName: 'a',
      poolAddress:
        '0xc295f421b4c792144e569c389137d861e3cad0459256286696cd375771aef4b9',
      poolOwner:
        '0xc4603e82c3cf11b69c127b77252d874687e9f8e45094be73343f18b35d91f26e',
      managementFee: '5',
      founded: 'Oct 4, 2022',
    },
    {
      poolName: 'test2',
      poolAddress:
        '0x3c1d1c2cae08702ed7b099fe6086da87353f932ae86399f4802b7a9dd1a6552e',
      poolOwner:
        '0xb4793170e2a45111d813f39c3d746b9e77b5aab1b88c30047d759d9f351e1a26',
      managementFee: '0',
      founded: 'Oct 5, 2022',
    },
    {
      poolName: 'mira-test-1',
      poolAddress:
        '0xd59fba7334a7e79bba413ca4fa19264e24f90a2c0c2b5dbe179e8014215f50f8',
      poolOwner:
        '0xb5424c1606664d839e855aee375aaa0becbcdf908f374b09616b7f3df1b5f4d0',
      managementFee: '1',
      founded: 'Oct 7, 2022',
    },
    {
      poolName: 'son',
      poolAddress:
        '0x3033e5036f7d68cf22abfc8ba4aa5ff2d53edfafefd1116d9f35e039f6eb376a',
      poolOwner:
        '0x1956d5ee9a7a0e9679ba9fd797f6846e0a7766d71ba8a8fdbb3fb6251d0f2dc7',
      managementFee: '1',
      founded: 'Oct 7, 2022',
    },
    {
      poolName: 'test1',
      poolAddress:
        '0x9df806e12d20fc0afc6bcd9b455cb0b4b6bfab1a4137517f9367d6cd75973d46',
      poolOwner:
        '0x405bdfc954f3e04d7ba4abe80912ee7d323ec4d3757cba9dbfffc713083fd1cb',
      managementFee: '1',
      founded: 'Oct 7, 2022',
    },
    {
      poolName: 'name1',
      poolAddress:
        '0xf008e478616d5550ed814d487868545342e5cf40028fdfa2ac89d52c4ddbe764',
      poolOwner:
        '0x5ed9883e2cbf957dd7525357df0e51f592d4210ac9000f5554b355243efe0b03',
      managementFee: '3',
      founded: 'Oct 9, 2022',
    },
    {
      poolName: 'BestIndex',
      poolAddress:
        '0x33118fea32ff8a208eb704ff5d85b449ed239b1a848ffee57c477d3709e5c32',
      poolOwner:
        '0x598f9b869e6879d7daf0efcfff9c60f78ff7e772e94887885fb743121843e117',
      managementFee: '1',
      founded: 'Oct 9, 2022',
    },
    {
      poolName: 'abc',
      poolAddress:
        '0xbea557fa971d797e122f7e253f235dc42a3af0a0d1d99829a07ffba3e68199c4',
      poolOwner:
        '0xb4793170e2a45111d813f39c3d746b9e77b5aab1b88c30047d759d9f351e1a26',
      managementFee: '10',
      founded: 'Oct 10, 2022',
    },
    {
      poolName: 'ab',
      poolAddress:
        '0x2b652d569785137b5a1851d4c72b67ec2dc50ccefc7ddb23037113569811a302',
      poolOwner:
        '0xb4793170e2a45111d813f39c3d746b9e77b5aab1b88c30047d759d9f351e1a26',
      managementFee: '1',
      founded: 'Oct 10, 2022',
    },
  ]

  const [visiblePortfolio, setVisiblePortfolio] = useState(false)
  const [visibleProfile, setVisibleProfile] = useState(false)

  const [searchValue, setSearchValue] = useState('')
  const [sortDir, setSortDir] = useState<boolean>(false)
  const [sortValue, setSortValue] = useState('')
  const [activeFilter, setActiveFilter] = useState<boolean>(false)
  const [managementFeeMin, setMmanagementFeeMin] = useState('')
  const [managementFeeMax, setMmanagementFeeMax] = useState('')
  const [foundedMin, setFoundedMin] = useState('')
  const [foundedMax, setFoundedMax] = useState('')
  const [profile, setProfile] = useState({})
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setSearchValue(window.localStorage.getItem('modal_searchValue'))
    setSortDir(window.localStorage.getItem('modal_sortDir') === 'true')
    setSortValue(window.localStorage.getItem('modal_sortValue'))
    setActiveFilter(
      window.localStorage.getItem('modal_activeFilter') === 'true',
    )
    setMmanagementFeeMin(window.localStorage.getItem('modal_managementFeeMin'))
    setMmanagementFeeMax(window.localStorage.getItem('modal_managementFeeMax'))
    setFoundedMin(window.localStorage.getItem('modal_foundedMin'))
    setFoundedMax(window.localStorage.getItem('modal_foundedMax'))
    setMounted(true)
  }, [])
  useEffect(() => {
    if (!mounted) return
    window.localStorage.setItem('modal_searchValue', searchValue)
    window.localStorage.setItem('modal_sortDir', sortDir ? 'true' : 'false')
    window.localStorage.setItem('modal_sortValue', sortValue)
    window.localStorage.setItem(
      'modal_activeFilter',
      activeFilter ? 'true' : 'false',
    )
    window.localStorage.setItem('modal_managementFeeMin', managementFeeMin)
    window.localStorage.setItem('modal_managementFeeMax', managementFeeMax)
    window.localStorage.setItem('modal_foundedMin', foundedMin)
    window.localStorage.setItem('modal_foundedMax', foundedMax)
  }, [
    searchValue,
    sortDir,
    sortValue,
    activeFilter,
    managementFeeMin,
    managementFeeMax,
    foundedMin,
    foundedMax,
  ])
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
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

  return (
    <>
      {visibleProfile ||
      visiblePortfolio ||
      updateModalVisible ||
      indexAllocationModalVisible ? (
        <>
          <Flex
            background={'#0005'}
            p={'8px 16px'}
            border={'1px solid #34383b'}
            borderRadius={'8px'}
            ml={'auto'}
            cursor="pointer"
            onClick={() => {
              if (updateModalVisible || indexAllocationModalVisible) {
                setVisiblePortfolio(true)
                setVisibleProfile(true)
              } else {
                setVisiblePortfolio(false)
                setVisibleProfile(false)
              }
              setUpdateModalVisible(false)
              setIndexAllocationModalVisible(false)
            }}
            zIndex={'0'}
          >
            <ArrowIcon dir={'left'} />
          </Flex>
          {visiblePortfolio && (
            <ModifyModalBody
              flex={1}
              setUpdateVisible={(bValue) => {
                setUpdateModalVisible(bValue)
                setVisiblePortfolio(false)
              }}
              setAllocationVisible={(bValue) => {
                setIndexAllocationModalVisible(bValue)
                setVisiblePortfolio(false)
              }}
              allocationData={allocationData}
            />
          )}
          {visibleProfile && <ProfileModalBody profile={profile} />}
          {updateModalVisible && <UpdateModalBody />}
          {indexAllocationModalVisible && (
            <IndexAllocationModalBody
              flex={1}
              type={'create'}
              allocationData={allocationData}
              setAllocationData={setAllocationData}
            />
          )}
        </>
      ) : (
        <Flex col gridGap={'10px'}>
          <Flex
            alignCenter
            gridGap={'8px'}
            py={'8px'}
            fontSize={'18px'}
            fontWeight={'500'}
            borderBottom={'1px solid #34383b'}
          >
            {title}
            <Flex
              alignCenter
              gridGap={'4px'}
              ml={'auto'}
              background={'#0005'}
              p={'8px 16px'}
              border={'1px solid #34383b'}
              borderRadius={'8px'}
            >
              <Input
                value={searchValue}
                border={'none'}
                background={'transparent'}
                color={'white'}
                placeholder={'Search'}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
              />
              <SearchIcon />
            </Flex>
            <Flex
              alignCenter
              gridGap={'8px'}
              background={'#0005'}
              p={'8px 16px'}
              border={'1px solid #34383b'}
              borderRadius={'8px'}
              fontSize={'13.3px'}
              cursor={'pointer'}
              onClick={() => setActiveFilter(!activeFilter)}
            >
              <FilterIcon />
              filter
              <IconNarrow dir={activeFilter ? 'up' : 'down'} />
            </Flex>
          </Flex>

          {activeFilter && (
            <Flex gridGap={'16px'} flexWrap={'wrap'}>
              <FilterItem
                title={'Management Fee'}
                min={managementFeeMin}
                setMin={setMmanagementFeeMin}
                max={managementFeeMax}
                setMax={setMmanagementFeeMax}
              />
              <FilterItem
                title={'Founded'}
                isDate
                min={foundedMin}
                setMin={setFoundedMin}
                max={foundedMax}
                setMax={setFoundedMax}
              />
            </Flex>
          )}
          <Flex
            col
            gridGap={'16px'}
            background={'#302d38'}
            p={'20px'}
            border={'1px solid #34383b'}
            borderRadius={'10px'}
            height={'480px'}
            overflow={'auto'}
          >
            <Table width={'100%'} textAlign={'left'}>
              <Thead>
                <Tr>
                  <Th>
                    <SortBtn
                      value={'poolName'}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      Index Name
                    </SortBtn>
                  </Th>
                  <Th>
                    <SortBtn
                      value={'-'}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      TVL
                    </SortBtn>
                  </Th>
                  <Th>
                    <SortBtn
                      value={'-'}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      YTD %
                    </SortBtn>
                  </Th>
                  <Th>
                    <SortBtn
                      value={'founded'}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      Founded
                    </SortBtn>
                  </Th>
                  <Th>
                    <SortBtn
                      value={'managementFee'}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      Management Fee
                    </SortBtn>
                  </Th>
                  <Th>
                    <SortBtn
                      value={'No'}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      Locked
                    </SortBtn>
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {miraIndexes
                  .sort(
                    (a: any, b: any) =>
                      (a[sortValue]?.toString() > b[sortValue]?.toString()
                        ? 1
                        : -1) * (sortDir ? -1 : 1),
                  )
                  .map((miraIndex, index) => {
                    let flag = false
                    for (const key in miraIndex) {
                      if (
                        miraIndex[key] &&
                        searchValue &&
                        miraIndex[key]
                          .toUpperCase()
                          .search(searchValue.toUpperCase()) !== -1
                      ) {
                        flag = true
                        break
                      }
                    }
                    if (activeFilter) {
                      if (
                        managementFeeMin &&
                        parseInt(managementFeeMin) >
                          parseInt(miraIndex.managementFee)
                      )
                        return ''
                      if (
                        managementFeeMax &&
                        parseInt(managementFeeMax) <
                          parseInt(miraIndex.managementFee)
                      )
                        return ''
                      if (
                        foundedMin &&
                        new Date(foundedMin) > new Date(miraIndex.founded)
                      )
                        return ''
                      if (
                        foundedMax &&
                        new Date(foundedMax) < new Date(miraIndex.founded)
                      )
                        return ''
                    }
                    return searchValue && !flag ? (
                      ''
                    ) : (
                      <Tr key={index}>
                        <Td>
                          <Flex
                            alignCenter
                            gridGap={'10px'}
                            cursor={'pointer'}
                            onClick={() => {
                              setProfile({
                                username: miraIndex.poolName,
                                owner: miraIndex.poolOwner,
                              })
                              setVisibleProfile(true)
                            }}
                          >
                            <Box
                              background={
                                'linear-gradient(90deg,#fceabb,#f8b500)'
                              }
                              borderRadius={'100%'}
                              width={'25px'}
                              height={'25px'}
                            ></Box>
                            {miraIndex.poolName}
                          </Flex>
                        </Td>
                        <Td
                          cursor={'pointer'}
                          onClick={() => {
                            setVisiblePortfolio(true)
                          }}
                        >
                          -
                        </Td>
                        <Td
                          cursor={'pointer'}
                          onClick={() => {
                            setVisiblePortfolio(true)
                          }}
                        >
                          -%
                        </Td>
                        <Td
                          cursor={'pointer'}
                          onClick={() => {
                            setVisiblePortfolio(true)
                          }}
                        >
                          {miraIndex.founded}
                        </Td>
                        <Td
                          cursor={'pointer'}
                          onClick={() => {
                            setVisiblePortfolio(true)
                          }}
                        >
                          {miraIndex.managementFee}%
                        </Td>
                        <Td
                          cursor={'pointer'}
                          onClick={() => {
                            setVisiblePortfolio(true)
                          }}
                        >
                          No
                        </Td>
                        <Td>
                          <Flex
                            justifyCenter
                            padding={'4px 8px'}
                            background={'#0005'}
                            border={'1px solid #34383b'}
                            borderRadius={'4px'}
                            cursor={'pointer'}
                          >
                            start with this
                          </Flex>
                        </Td>
                      </Tr>
                    )
                  })}
              </Tbody>
            </Table>
          </Flex>
        </Flex>
      )}
    </>
  )
}

export const SortBtn: React.FC<{
  value: string
  sortDir: any
  setSortValue?: (arg: any) => void
  sortValue: any
  setSortDir?: (arg: any) => void
  children: React.ReactNode
}> = ({ value, sortDir, setSortValue, sortValue, setSortDir, children }) => {
  return (
    <Flex
      alignCenter
      justifyContent={'flex-start'}
      gridGap={'8px'}
      onClick={() => {
        setSortValue(value)
        sortValue === value && setSortDir(!sortDir)
      }}
    >
      {children}
      <SortDirIcon active={sortValue === value} isInc={sortDir} />
    </Flex>
  )
}

export const FilterItem: React.FC<{
  title: string
  isDate?: boolean
  min: any
  setMin: (arg: any) => void
  max: any
  setMax: (arg: any) => void
}> = ({ title, isDate, min, setMin, max, setMax }) => {
  return (
    <Flex
      col
      gridGap={'4px'}
      p={'6px 12px'}
      bg={'#302d38'}
      border={'1px solid #34383b'}
      borderRadius={'8px'}
    >
      <Flex alignCenter justifyContent={'space-between'}>
        {title}
        <Link
          p={'2px 6px'}
          bg={'#0005'}
          border={'1px solid #34383b'}
          borderRadius={'8px'}
          visibility={min || max ? 'visible' : 'hidden'}
          onClick={() => {
            setMax('')
            setMin('')
          }}
        >
          &times;
        </Link>
      </Flex>
      <Flex alignCenter gridGap={'8px'}>
        <Flex>
          <Input
            type={isDate ? 'date' : 'number'}
            placeholder="min"
            value={min}
            bg={'#0005'}
            border={'1px solid #34383b'}
            borderRadius={'8px'}
            color={'white'}
            p={'6px 12px'}
            width={'100px'}
            onChange={(e) => setMin(e.target.value)}
          />
        </Flex>
        <Flex>to</Flex>
        <Flex>
          <Input
            type={isDate ? 'date' : 'number'}
            placeholder="max"
            value={max}
            bg={'#0005'}
            border={'1px solid #34383b'}
            borderRadius={'8px'}
            color={'white'}
            p={'6px 12px'}
            width={'100px'}
            onChange={(e) => setMax(e.target.value)}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

interface MiraPoolSettings {
  management_fee: number
  rebalancing_period: number
  minimum_contribution: number
  minimum_withdrawal_period: number
  referral_reward: number
  privacy_allocation: number
}

interface MiraPool {
  poolName: string
  created: string
  poolAddress: string
  managerAddress: string
  rebalancingGas: number
  indexAllocation: Array<number>
  indexList: Array<string>
  amount: number
  gasPool: number
  settings: MiraPoolSettings
}

export const ModifyModalBody: React.FC<{ [index: string]: any }> = ({
  miraIndexInfo = {},
  setVisible = () => {},
  setUpdateVisible = () => {},
  setAllocationVisible = () => {},
  allocationData = [],
  ...props
}) => {
  const { walletConnected, walletAddress } = useWalletHook()
  const [visibleDeposit, setVisibleDeposit] = useState(false)
  const [visibleWithdraw, setVisibleWithdraw] = useState(false)
  const [isFriend, setIsFriend] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setHovered] = useState(false)
  const [isReal, setRealAlloc] = useState(true)
  const [isMore, setMoreBtn] = useState(false)
  const [myPoolInfo, setMyPoolInfo] = useState<MiraPool | null>(null)
  const [indexAllocation, setIndexAllocation] = useState<IndexAllocation[]>([])
  const [allocVisible, setAllocVisible] = useState(false)
  const [dataRange, setDataRange] = useState("1D");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (walletConnected) {
      const getFetchFriend = async () => {
        let friendDataList = await getFriendData(walletAddress)
        for (let i = 0; i < friendDataList.length; i++) {
          if (
            friendDataList[i].receiveUser === miraIndexInfo.poolOwner &&
            friendDataList[i].status !== FriendStatus.None
          ) {
            setIsFriend(true)
            return
          }
        }
      }

      getFetchFriend()
      getMiraPoolInfo()
    }
  }, [walletConnected, miraIndexInfo.poolOwner, walletAddress])

  const getMiraPoolInfo = async () => {
    const client = new AptosClient(NODE_URL)
    try {
      let resource = await client.getAccountResource(
        miraIndexInfo.poolAddress,
        `${MODULE_ADDR}::mira::MiraPool`,
      )

      const data = resource?.data as {
        amount: number
        created: number
        gas_pool: number
        index_allocation: Array<number>
        index_list: Array<string>
        manager_addr: string
        pool_address: string
        pool_name: string
        rebalancing_gas: number
        settings: MiraPoolSettings
      }

      let pool_info: MiraPool = {
        poolName: data?.pool_name,
        created: getFormatedDate(data?.created),
        poolAddress: data?.pool_name,
        managerAddress: data?.manager_addr,
        rebalancingGas: data?.rebalancing_gas,
        indexAllocation: data?.index_allocation,
        indexList: data?.index_list,
        amount: data?.amount,
        gasPool: data?.gas_pool,
        settings: data?.settings,
      }

      setMyPoolInfo(pool_info)

      let allocation: IndexAllocation[] = []
      for (let i = 0; i < pool_info.indexAllocation.length; i++) {
        allocation.push({
          name: pool_info.indexList[i],
          value: pool_info.indexAllocation[i] * 1,
        })
      }

      setIndexAllocation(allocation)
    } catch (error) {
      console.log('get mira pools error', error)
    }
  }

  const COLORS = [
    '#5a9e47',
    '#23b5b5',
    '#527da7',
    '#d4901c',
    '#3d6595',
    '#345882',
  ]

  const request_friend = async () => {
    if (!walletConnected) return
    let res = await requestFriend(walletAddress, miraIndexInfo.poolOwner)
    if (res) {
      setIsFriend(true)
    }
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.45
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        fontSize={'10px'}
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const style = {
    backgroundColor: 'lightgrey',
    color: 'black',
    padding: '2px 15px',
    fontSize: '12px',
  }

  const CustomizedTooltip = React.memo((props: any) => {
    if (props.payload.length > 0) {
      const sum = indexAllocation.reduce((a, v) => (a = a + v.value), 0)

      const item: IData = props.payload[0]
      return (
        <div style={style}>
          <p>
            {item.name} - {((Number(item.value) / sum) * 100).toFixed(0)}%
          </p>
        </div>
      )
    }
    return null
  })

  const onPieEnter = (data, index) => {
    setActiveIndex(index)
    setHovered(true)
  }

  const onPieLeave = () => setHovered(false)

  const CustomizedTick2 = ({ x, y, payload }) => {
    return (
      <text
        style={{
          fontSize: '12px',
          float: 'right',
          textAlign: 'right',
          fill: '#fff',
        }}
        x={x - 24}
        y={y}
        textAnchor="top"
        dominantBaseline="hanging"
      >
        {payload.value}
      </text>
    )
  }

  const renderTooltip = (props) => {
    if (props && props.payload[0]) {
      return (
        <div
          style={{
            padding: '12px',
            background: '#222129',
            color: '#ffffff',
            fontSize: '12px',
          }}
        >
          <div>Value: {props.payload[0].payload.value}</div>
        </div>
      )
    }
  }

  const args = {
    gradientColor: 'green',
    areaStrokeColor: 'cyan',
    customizedTick: CustomizedTick2,
    tickFormatter: null,
    renderTooltip: renderTooltip,
    uniqueId: 2,
  }

  useEffect(() => {
    getChartData();
  }, [dataRange]);
  const getChartData = () => {
    var arrTmp = [];
    for (var i = 0; i < 7; i++) {
      if (dataRange === "3D" && i > 2) {
        continue;
      }
      var m = "";
      switch (dataRange) {
        case "1D":
          m = `${(i + 1) * 2}:00`;
          break;
        case "3D":
          m = `10/${i + 4}`;
          break;
        case "1W":
          m = `10/${i + 10}`;
          break;
        case "1W":
          m = `10/${i + 7}`;
          break;
      }
      arrTmp.push({
        month: m,
        value: 100 + Math.floor(Math.random() * (500 - 100)),
      });
    }
    setChartData(arrTmp);
  };

  return (
    <>
      <ModalParent
        visible={allocVisible}
        setVisible={setAllocVisible}
        zIndex={'1004'}
      >
        <IndexAllocationModalBody
          flex={1}
          allocationData={indexAllocation}
          setAllocationData={setIndexAllocation}
          setVisible={setAllocVisible}
          poolInfo={myPoolInfo}
        />
      </ModalParent>
      {visibleDeposit || visibleWithdraw ? (
        <>
          <Flex
            background={'#0005'}
            p={'8px 16px'}
            border={'1px solid #34383b'}
            borderRadius={'8px'}
            ml={'auto'}
            cursor="pointer"
            onClick={() => {
              setVisibleDeposit(false)
              setVisibleWithdraw(false)
            }}
            zIndex={'0'}
          >
            <ArrowIcon dir={'left'} />
          </Flex>
          {visibleDeposit && <DepositModalBody />}
          {visibleWithdraw && <WithdrawModalBody />}
        </>
      ) : (
        <Flex py={'20px'} width={'100%'} gridGap={'16px'} minWidth={'80vw'}>
          <Flex flex={1} col>
            <Flex
              mt={'4px'}
              fontFamily={'art'}
              fontSize={'20px'}
              fontWeight={'bold'}
              px={'10px'}
              pb={'6px'}
              borderBottom={'1px solid #34383b'}
            >
              Modify "{miraIndexInfo.poolName}"
              <Flex
                ml={'auto'}
                mt={'auto'}
                fontSize={'16px'}
                fontWeight={'normal'}
                gridGap={'16px'}
              >
                <Flex fontSize={'30px'} fontWeight={'bold'}>
                  48.29
                </Flex>
                <Flex fontSize={'30px'} fontWeight={'bold'}>
                  /
                </Flex>
                <Flex fontSize={'30px'} fontWeight={'bold'} color={'#70e094'}>
                  4.1%
                </Flex>
              </Flex>
            </Flex>
            <Flex px={'20px'} pt={'20px'}>
              <Flex col flex={3} width={'0px'} p={'20px'} aspectRatio={'2'}>
                <ResponsiveContainer>
                  {indexAllocation && Array.isArray(indexAllocation) && (
                    <PieChart
                      width={300}
                      height={300}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setAllocVisible(true)
                      }}
                    >
                      <Tooltip content={<CustomizedTooltip />} />
                      <Pie
                        activeIndex={isHovered ? activeIndex : null}
                        activeShape={renderActiveShape}
                        data={indexAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={'90%'}
                        fill="#8884d8"
                        stroke={'transparent'}
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                      >
                        {indexAllocation.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </Flex>
              <Flex col flex={5} width={'0px'} aspectRatio={'2'}>
                <Flex ml={'auto'} gridGap={'4px'}>
                {isMore ? (
                    <>
                      <NormalBtn onClick={() => setDataRange("1D")}>
                        1D
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("3D")}>
                        3D
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("1W")}>
                        1W
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("2W")}>
                        2W
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("1M")}>
                        1M
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("3M")}>
                        3M
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("6M")}>
                        6M
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("1Y")}>
                        1Y
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("YTD")}>
                        YTD
                      </NormalBtn>
                    </>
                  ) : (
                    <>
                      <NormalBtn onClick={() => setDataRange("1D")}>
                        1D
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("1W")}>
                        1W
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("1M")}>
                        1M
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("YTD")}>
                        YTD
                      </NormalBtn>
                    </>
                  )}
                  <AddBtn
                    onClick={() =>
                      isMore ? setMoreBtn(false) : setMoreBtn(true)
                    }
                  >
                    {isMore ? '-' : '+'}
                  </AddBtn>
                </Flex>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 10, left: -30, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={'colorUv' + args.uniqueId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="100%" stopColor={args.gradientColor} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={args.customizedTick} />
                    <YAxis
                      width={80}
                      tick={args.customizedTick}
                      // ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                      interval={0}
                      domain={[1, 15]}
                      tickFormatter={args.tickFormatter}
                    />
                    <CartesianGrid
                      strokeDasharray="5 5"
                      fill="#222129"
                      horizontal={false}
                      vertical={false}
                    />
                    <Tooltip content={args.renderTooltip} />
                    <Area
                      dot={{ fill: args.gradientColor, fillOpacity: 1 }}
                      type="monotone"
                      dataKey="value"
                      stroke={args.gradientColor}
                      fillOpacity={0.1}
                      fill={'url(#colorUv' + args.uniqueId + ')'}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Flex>
            </Flex>
            <Flex>
              <Flex col flex={3} width={'0px'}>
                <ResponsiveContainer>
                  <div>
                    <Flex
                      fontSize={'15px'}
                      alignCenter
                      justifyContent={'space-around'}
                    >
                      <Flex
                        cursor={'pointer'}
                        onClick={() => setRealAlloc(true)}
                        color={isReal ? '#70e094' : '#fafafa'}
                      >
                        Strategy Allocation
                      </Flex>
                      <Link
                        m={'auto 0px'}
                        fontSize={'2em'}
                        transform={'rotate(90deg)'}
                        onClick={() =>
                          isReal ? setRealAlloc(false) : setRealAlloc(true)
                        }
                      >
                        <ExchangeIcon />
                      </Link>
                      <Flex
                        cursor={'pointer'}
                        onClick={() => setRealAlloc(false)}
                        color={!isReal ? '#70e094' : '#fafafa'}
                      >
                        Real Allocation
                      </Flex>
                      <Flex cursor={'pointer'}>
                        <CustomTooltip
                          title="changes the portfolio above from viewing the strategy to the current allocation"
                          arrow
                          disableInteractive
                          placement="top"
                        >
                          <span>ⓘ</span>
                        </CustomTooltip>
                      </Flex>
                    </Flex>
                  </div>
                </ResponsiveContainer>
              </Flex>
              <Flex col flex={3} width={'0px'}></Flex>
            </Flex>
            <Flex mt={'24px'} col>
              <Flex
                fontFamily={'art'}
                fontSize={'18px'}
                fontWeight={'600'}
                letterSpacing={'0.1em'}
                px={'10px'}
                pb={'6px'}
                borderBottom={'1px solid #34383b'}
              >
                Stats
              </Flex>
              <Flex justifyCenter>
                <Table width={'90%'} textAlign={'center'}>
                  <Thead>
                    <Tr>
                      <Th>Market Cap</Th>
                      <Th>Total Volume</Th>
                      <Th>Supply</Th>
                      <Th>Fee1</Th>
                      <Th>Fee2</Th>
                      <Th>NAV</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>10.5M</Td>
                      <Td>220.1K</Td>
                      <Td>8.2K</Td>
                      <Td>1%</Td>
                      <Td>2%</Td>
                      <Td>$47.28</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Flex>
            </Flex>
          </Flex>
          <UpdateSection
            setVisibleDeposit={setVisibleDeposit}
            setVisibleWithdraw={setVisibleWithdraw}
            poolInfo={myPoolInfo}
          />
        </Flex>
      )}
    </>
  )
}

type UpdateSectionProps = {
  setVisibleDeposit: (arg: boolean) => void
  setVisibleWithdraw: (arg: boolean) => void
  poolInfo: MiraPool
}
const UpdateSection: React.FC<UpdateSectionProps> = ({
  setVisibleDeposit,
  setVisibleWithdraw,
  poolInfo,
}) => {
  const { walletConnected, openConnectModal } = useWalletHook()
  const [isInvest, setInvest] = useState(true)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)

  return (
    <Flex
      col
      my={'auto'}
      justifyContent={'space-around'}
      gridGap={'10px'}
      background={'#302D38'}
      padding={'20px'}
      border={'1px solid #34383b'}
      borderRadius={'20px'}
    >
      <Flex
        fontFamily={'art'}
        fontSize={'20px'}
        fontWeight={'bold'}
        justifyCenter
      >
        Update
      </Flex>
      <Flex
        mt={'1em'}
        fontSize={'16px'}
        alignCenter
        justifyContent={'space-around'}
      >
        <ArtButton
          btnColor={'#3c3a45'}
          mt={'24px'}
          mx={'auto'}
          minWidth={'150px'}
          padding={'12px 24px'}
          textAlign={'center'}
          onClick={() => {
            setUpdateModalVisible(true)
          }}
        >
          Change Settings
        </ArtButton>
      </Flex>
      <Flex
        mt={'1em'}
        fontSize={'16px'}
        alignCenter
        justifyContent={'space-around'}
      >
        <ArtButton
          btnColor={'#3c3a45'}
          mt={'24px'}
          mx={'auto'}
          minWidth={'150px'}
          padding={'12px 24px'}
          textAlign={'center'}
        >
          Rebalance Now
        </ArtButton>
      </Flex>
      <Flex
        mt={'1em'}
        fontSize={'16px'}
        alignCenter
        justifyContent={'space-around'}
      >
        <Flex
          cursor={'pointer'}
          onClick={() => setInvest(true)}
          color={isInvest ? '#70e094' : '#fafafa'}
        >
          Add Funds
        </Flex>
        <Link
          m={'auto 0px'}
          fontSize={'2em'}
          transform={'rotate(90deg)'}
          onClick={() => (isInvest ? setInvest(false) : setInvest(true))}
        >
          <ExchangeIcon />
        </Link>
        <Flex
          cursor={'pointer'}
          onClick={() => setInvest(false)}
          color={!isInvest ? '#70e094' : '#fafafa'}
        >
          Remove Funds
        </Flex>
      </Flex>
      <AddRemoveBox />

      {walletConnected ? (
        <ArtButton
          btnColor={'#3c3a45'}
          mt={'24px'}
          mx={'auto'}
          minWidth={'150px'}
          padding={'12px 24px'}
          textAlign={'center'}
          onClick={() =>
            isInvest ? setVisibleDeposit(true) : setVisibleWithdraw(true)
          }
        >
          {isInvest ? 'ADD' : 'REMOVE'}
        </ArtButton>
      ) : (
        <ArtButton
          btnColor={'#3c3a45'}
          mt={'24px'}
          mx={'auto'}
          minWidth={'150px'}
          padding={'12px 24px'}
          textAlign={'center'}
          onClick={() => openConnectModal()}
        >
          Connect Wallet
        </ArtButton>
      )}
      {updateModalVisible && (
        <ModalParent
          visible={updateModalVisible}
          setVisible={setUpdateModalVisible}
          zIndex={'1004'}
        >
          <UpdateModalBody
            flex={1}
            setVisible={setUpdateModalVisible}
            poolInfo={poolInfo}
          />
        </ModalParent>
      )}
    </Flex>
  )
}

const AddRemoveBox = () => {
  const { walletConnected, walletAddress } = useWalletHook()
  const [max, setMax] = useState(0)
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (walletConnected) {
      getAccountBalance()
    }
  }, [walletConnected])

  const getAccountBalance = async () => {
    const client = new AptosClient(NODE_URL)
    const aptos_account = new AptosAccount(undefined, walletAddress)
    const coin_client = new CoinClient(client)

    let balance = await coin_client.checkBalance(aptos_account)
    setMax(parseInt(balance.toString()) / DECIMAL)
  }

  return (
    <Flex
      col
      gridGap={'12px'}
      background={'#3c3a45'}
      width={'300px'}
      p={'12px 24px'}
      border={'1px solid #fff3'}
      borderRadius={'20px'}
    >
      <Flex alignCenter justifyContent={'space-between'}>
        <Flex col>
          <Flex color={'#70e094'} fontSize={'1.4em'} fontWeight={'bold'}>
            0.0
          </Flex>
          <Flex>$0.0</Flex>
        </Flex>
        <Flex bg={'#302d38'} borderRadius={'8px'}>
          <CustomSelect>
            <SmOption value={'APTOS'} selected>
              APTOS
            </SmOption>
            <SmOption value={'XSI'}>XSI</SmOption>
          </CustomSelect>
        </Flex>
      </Flex>
      <Flex alignCenter justifyContent={'flex-end'} gridGap={'8px'}>
        <Flex>Balance :</Flex>
        <Flex>{max}</Flex>
        <Link
          ml={'8px'}
          p={'4px 8px'}
          bg={'#26242f'}
          borderRadius={'4px'}
          onClick={() => {
            setAmount(max)
          }}
        >
          Max
        </Link>
      </Flex>
    </Flex>
  )
}

type BuySellSectionProps = {
  miraInfo?: any
  depositAmnt?: number
  accountBalance?: number
}
export const BuySellSection: React.FC<BuySellSectionProps> = ({
  miraInfo,
  depositAmnt,
  accountBalance,
}) => {
  const {
    walletConnected,
    openConnectModal,
    signAndSubmitTransaction,
  } = useWalletHook()
  const [isInvest, setInvest] = useState(true)
  const [amount, setAmount] = useState('0.0')
  const [max, setMax] = useState(0)

  useEffect(() => {
    if (walletConnected) {
      isInvest ? setMax(accountBalance) : setMax(depositAmnt)
    }
  }, [walletConnected])

  const setMaxValue = () => {
    if (walletConnected) {
      !isInvest ? setMax(accountBalance) : setMax(depositAmnt)
    }
  }

  const invest = async () => {
    if (!walletConnected) return

    let amnt = Number(amount) * DECIMAL

    if (amnt < DECIMAL) return

    try {
      const transaction = {
        type: 'entry_function_payload',
        function: `${MODULE_ADDR}::mira::invest`,
        type_arguments: [],
        arguments: [miraInfo.poolName, miraInfo.poolOwner, amnt],
      }
      const result = await signAndSubmitTransaction(transaction)
    } catch (error) {
      console.log('deposit error', error)
    }
  }

  const withdraw = async () => {
    if (!walletConnected) return

    let amnt = Number(amount) * DECIMAL
    if (amnt <= 0) return

    try {
      const transaction = {
        type: 'entry_function_payload',
        function: `${MODULE_ADDR}::mira::withdraw`,
        type_arguments: [],
        arguments: [miraInfo.poolName, miraInfo.poolOwner, amnt],
      }
      const result = await signAndSubmitTransaction(transaction)
    } catch (error) {
      console.log('deposit error', error)
    }
  }
  const txtAmountChange = (e: any) => {
    let input = e.target.value
    var val = isNaN(parseFloat(input)) ? 0 : parseFloat(input)

    if (val < 0) {
      setAmount('0.0')
      return
    }

    if (input.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
      if (input[input.length - 1] == '.') {
        setAmount(input)
      } else {
        setAmount(val.toString())
      }
    }
  }

  return (
    <Flex
      col
      justifyContent={'space-around'}
      gridGap={'10px'}
      background={'#302D38'}
      padding={'20px'}
      border={'1px solid #34383b'}
      borderRadius={'20px'}
    >
      <Flex
        mx={'auto'}
        fontFamily={'art'}
        fontSize={'20px'}
        fontWeight={'bold'}
      >
        Invest / Withdraw
        {/* Buy / Sell */}
      </Flex>
      <Flex
        mt={'1em'}
        fontSize={'16px'}
        alignCenter
        justifyContent={'space-around'}
      >
        <Flex
          cursor={'pointer'}
          onClick={() => {
            setInvest(true)
            setMaxValue()
          }}
          color={isInvest ? '#70e094' : '#fafafa'}
        >
          Invest
        </Flex>
        <Link
          m={'auto 0px'}
          fontSize={'2em'}
          transform={'rotate(90deg)'}
          onClick={() => {
            setInvest(!isInvest)
            setMaxValue()
          }}
        >
          <ExchangeIcon />
        </Link>
        <Flex
          cursor={'pointer'}
          onClick={() => {
            setInvest(false)
            setMaxValue()
          }}
          color={!isInvest ? '#70e094' : '#fafafa'}
        >
          Withdraw
        </Flex>
      </Flex>
      <Flex
        col
        gridGap={'12px'}
        background={'#3c3a45'}
        width={'300px'}
        p={'12px 24px'}
        border={'1px solid #fff3'}
        borderRadius={'20px'}
      >
        <Flex alignCenter justifyContent={'space-between'}>
          <Flex col>
            <Flex>
              <Flex
                fontSize={'1.4em'}
                fontWeight={'bold'}
                background={'transparent'}
                color={'#70e094'}
              >
                $
              </Flex>
              <Input
                flex={'1'}
                border={'none'}
                width={'50%'}
                fontSize={'1.4em'}
                fontWeight={'bold'}
                background={'transparent'}
                paddingTop={'5px'}
                color={'#70e094'}
                placeholder={'0.0'}
                placeColor={'#70e094'}
                value={amount}
                type={'number'}
                onChange={txtAmountChange}
              />
            </Flex>
            <Flex>0</Flex>
          </Flex>
          <Flex bg={'#302d38'} borderRadius={'8px'}>
            <CustomSelect>
              <SmOption value={'APTOS'} selected>
                APTOS
              </SmOption>
              <SmOption value={'XSI'}>XSI</SmOption>
            </CustomSelect>
          </Flex>
        </Flex>
        <Flex alignCenter justifyContent={'flex-end'} gridGap={'8px'}>
          <Flex>Balance :</Flex>
          <Flex>{max}</Flex>
          <Link
            ml={'8px'}
            p={'4px 8px'}
            bg={'#26242f'}
            borderRadius={'4px'}
            onClick={() => {
              setAmount(max.toString())
            }}
          >
            Max
          </Link>
        </Flex>
      </Flex>

      {walletConnected ? (
        <ArtButton
          btnColor={'#3c3a45'}
          mt={'24px'}
          mx={'auto'}
          minWidth={'150px'}
          padding={'12px 24px'}
          textAlign={'center'}
          onClick={() => (isInvest ? invest() : withdraw())}
        >
          {isInvest ? 'INVEST' : 'WITHDRAW'}
        </ArtButton>
      ) : (
        <ArtButton
          btnColor={'#3c3a45'}
          mt={'24px'}
          mx={'auto'}
          minWidth={'150px'}
          padding={'12px 24px'}
          textAlign={'center'}
          onClick={() => openConnectModal()}
        >
          Connect Wallet
        </ArtButton>
      )}
    </Flex>
  )
}
