const _ = require('lodash')
const { ethers } = require('ethers')
const { getMulticaller } = require('easy-multicall')
const parseArgs = require('./src/parse-args.js')
const farmCallEncoder = require('./src/farm')

const s = (value, str) => (value === 1 ? `${value} ${str}` : `${value} ${str}s`)

async function main() {
  const provider = new ethers.providers.JsonRpcProvider('https://dai.poa.network')
  const multicall = getMulticaller('0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a', provider)
  const { account, show } = parseArgs()
  if (!ethers.utils.isAddress(account)) {
    throw new Error(
      `"${account}" is not valid address, please specify an address using the -a or --account flags`
    )
  }
  const [rawDeposits] = await multicall([farmCallEncoder('balanceOf', account)])
  const depositCount = rawDeposits.toNumber()
  const currentTime = Math.floor(Date.now() / 1000)
  const nextDay = currentTime + 24 * 60 * 60
  const [totalAlloc, upcomingRewards, depositIds] = await multicall([
    farmCallEncoder('totalAllocationPoints'),
    farmCallEncoder('getDistribution', currentTime, nextDay),
    _.range(depositCount).map((depositIndex) =>
      farmCallEncoder('tokenOfOwnerByIndex', account, depositIndex)
    )
  ])
  const [depositsInfo, pendingComb] = await multicall([
    depositIds.map((depositId) => farmCallEncoder('depositInfo', depositId)),
    depositIds.map((depositId) => farmCallEncoder('pendingHsf', depositId))
  ])
  const deposits = _.zip(depositIds, depositsInfo).map(([depositId, depositInfo]) => ({
    ...depositInfo,
    depositId
  }))
  const pools = new Set()
  deposits.forEach((deposit) => pools.add(deposit.pool))

  const poolList = Array.from(pools)
  const rawPoolInfo = await multicall(poolList.map((pool) => farmCallEncoder('poolInfo', pool)))
  const poolInfo = Object.fromEntries(_.zip(poolList, rawPoolInfo))
  console.log('account: ', account)
  console.log(`owns ${s(depositCount, 'deposit')} across ${s(pools.size, 'pool')}`)

  const totalHsf = pendingComb.reduce((sum, pending) => sum.add(pending), ethers.constants.Zero)
  console.log(`total pending xCOMB: ${ethers.utils.formatUnits(totalHsf)}`)

  console.log('\nPool breakdown (Pool share, daily earnings):')
  let totalPoolRewards = ethers.constants.Zero
  pools.forEach((pool) => {
    const poolDeposits = deposits.filter((deposit) => deposit.pool === pool)
    const userShares = poolDeposits.reduce(
      (sum, { rewardShare }) => sum.add(rewardShare),
      ethers.constants.Zero
    )
    const poolShares = poolInfo[pool].totalShares
    const precision = 1e6
    const poolShare = userShares.mul(100 * precision).div(poolShares)
    const poolRewards = upcomingRewards
      .mul(poolInfo[pool].allocation)
      .mul(userShares)
      .div(totalAlloc)
      .div(poolShares)
      .div(ethers.constants.WeiPerEther)
    totalPoolRewards = totalPoolRewards.add(poolRewards)
    console.log(
      `${pool}: ${poolShare.toNumber() / precision}% (xCOMB / day = ${ethers.utils.formatUnits(
        poolRewards
      )})`
    )
    if (show) {
      const depositSharePrec = 1e2
      const depositBreakdown = poolDeposits.map(({ depositId, rewardShare }) => {
        depositId = depositId.toNumber()
        const depositShare = rewardShare.mul(100 * depositSharePrec).div(userShares)
        return `${depositId} (${depositShare.toNumber() / depositSharePrec}%)`
      })
      console.log(`=> ${depositBreakdown.join(', ')}`)
    }
  })

  console.log(
    `\nTotal daily yield (next 24h): ${ethers.utils.formatUnits(totalPoolRewards)} xCOMB / day`
  )
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('err:', err)
    process.exit(1)
  })
