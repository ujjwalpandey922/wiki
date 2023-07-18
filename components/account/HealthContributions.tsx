import HealthContributionsChart from './HealthContributionsChart'
import useMangoGroup from 'hooks/useMangoGroup'
import useMangoAccount from 'hooks/useMangoAccount'
import { useMemo, useState } from 'react'
import { HealthType } from '@blockworks-foundation/mango-v4'
import {
  ArrowLeftIcon,
  NoSymbolIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid'
import Tooltip from '@components/shared/Tooltip'
import TokenLogo from '@components/shared/TokenLogo'
import { useTranslation } from 'next-i18next'
import MarketLogos from '@components/trade/MarketLogos'
import mangoStore from '@store/mangoStore'
import TokensHealthTable from './TokensHealthTable'
import MarketsHealthTable from './MarketsHealthTable'
import { HealthContribution, PerpMarketContribution } from 'types'

const HealthContributions = ({ hideView }: { hideView: () => void }) => {
  const { t } = useTranslation(['common', 'account', 'trade'])
  const { group } = useMangoGroup()
  const { mangoAccount, mangoAccountAddress } = useMangoAccount()
  const [initActiveIndex, setInitActiveIndex] = useState<number | undefined>(
    undefined
  )
  const [maintActiveIndex, setMaintActiveIndex] = useState<number | undefined>(
    undefined
  )

  const [initHealthContributions, maintHealthContributions] = useMemo(() => {
    if (!group || !mangoAccount) return [[], []]
    const initAssets = mangoAccount.getHealthContributionPerAssetUi(
      group,
      HealthType.init
    )
    const initContributions = []
    for (const item of initAssets) {
      const contribution = item.contribution
      if (item.asset === 'USDC') {
        const hasPerp =
          !!item.contributionDetails?.perpMarketContributions.find(
            (perp: PerpMarketContribution) => Math.abs(perp.contributionUi) > 0
          )
        initContributions.push({
          ...item,
          contribution: Math.abs(contribution),
          hasPerp: hasPerp,
          isAsset: contribution > 0 ? true : false,
        })
        if (item.contributionDetails) {
          for (const perpMarket of item.contributionDetails
            .perpMarketContributions) {
            const contribution = Math.abs(perpMarket.contributionUi)
            if (contribution > 0) {
              initContributions.push({
                asset: perpMarket.market,
                contribution: contribution,
                isAsset: perpMarket.contributionUi > 0 ? true : false,
              })
            }
          }
        }
      } else {
        initContributions.push({
          ...item,
          isAsset: contribution > 0 ? true : false,
          contribution: Math.abs(contribution),
        })
      }
    }

    const maintAssets = mangoAccount.getHealthContributionPerAssetUi(
      group,
      HealthType.maint
    )
    const maintContributions = []
    for (const item of maintAssets) {
      const contribution = item.contribution
      if (item.asset === 'USDC') {
        const hasPerp =
          !!item.contributionDetails?.perpMarketContributions.find(
            (perp: PerpMarketContribution) => Math.abs(perp.contributionUi) > 0
          )
        maintContributions.push({
          ...item,
          hasPerp: hasPerp,
          isAsset: contribution > 0 ? true : false,
          contribution: Math.abs(contribution),
        })
        if (item.contributionDetails) {
          for (const perpMarket of item.contributionDetails
            .perpMarketContributions) {
            const contribution = Math.abs(perpMarket.contributionUi)
            if (contribution > 0) {
              maintContributions.push({
                asset: perpMarket.market,
                contribution: contribution,
                isAsset: perpMarket.contributionUi > 0 ? true : false,
              })
            }
          }
        }
      } else {
        maintContributions.push({
          ...item,
          isAsset: contribution > 0 ? true : false,
          contribution: Math.abs(contribution),
        })
      }
    }

    return [initContributions, maintContributions]
  }, [group, mangoAccount])

  const [initHealthMarkets, initHealthTokens] = useMemo(() => {
    if (!initHealthContributions.length) return [[], []]
    const splitData = initHealthContributions.reduce(
      (
        acc: { market: HealthContribution[]; token: HealthContribution[] },
        obj: HealthContribution
      ) => {
        const isPerp = obj.asset.includes('PERP')
        const isSpotMarket = obj.asset.includes('/')
        if (isSpotMarket) {
          acc.market.push(obj)
        }
        if (!isPerp && !isSpotMarket) {
          acc.token.push(obj)
        }
        return acc
      },
      { market: [], token: [] }
    )
    return [splitData.market, splitData.token]
  }, [initHealthContributions])

  const [maintHealthMarkets, maintHealthTokens] = useMemo(() => {
    if (!maintHealthContributions.length) return [[], []]
    const splitData = maintHealthContributions.reduce(
      (
        acc: { market: HealthContribution[]; token: HealthContribution[] },
        obj: HealthContribution
      ) => {
        const isPerp = obj.asset.includes('PERP')
        const isSpotMarket = obj.asset.includes('/')
        if (isSpotMarket) {
          acc.market.push(obj)
        }
        if (!isPerp && !isSpotMarket) {
          acc.token.push(obj)
        }
        return acc
      },
      { market: [], token: [] }
    )
    const markets = splitData.market.filter((d) => d.contribution > 0)
    const tokens = splitData.token
    return [markets, tokens]
  }, [maintHealthContributions])

  const handleLegendClick = (item: HealthContribution) => {
    const maintIndex = maintChartData.findIndex((d) => d.asset === item.asset)
    const initIndex = initChartData.findIndex((d) => d.asset === item.asset)
    setMaintActiveIndex(maintIndex)
    setInitActiveIndex(initIndex)
  }

  const handleLegendMouseEnter = (item: HealthContribution) => {
    const maintIndex = maintChartData.findIndex((d) => d.asset === item.asset)
    const initIndex = initChartData.findIndex((d) => d.asset === item.asset)
    setMaintActiveIndex(maintIndex)
    setInitActiveIndex(initIndex)
  }

  const handleLegendMouseLeave = () => {
    setInitActiveIndex(undefined)
    setMaintActiveIndex(undefined)
  }

  const renderLegendLogo = (asset: string) => {
    const group = mangoStore.getState().group
    if (!group)
      return <QuestionMarkCircleIcon className="h-6 w-6 text-th-fgd-3" />
    const isSpotMarket = asset.includes('/')
    const isPerpMarket = asset.includes('PERP')
    const isMarket = isSpotMarket || isPerpMarket
    if (isMarket) {
      let market
      if (isSpotMarket) {
        market = group.getSerum3MarketByName(asset)
      } else {
        market = group.getPerpMarketByName(asset)
      }
      return market ? (
        <MarketLogos market={market} size="small" />
      ) : (
        <QuestionMarkCircleIcon className="h-6 w-6 text-th-fgd-3" />
      )
    } else {
      const bank = group.banksMapByName.get(asset)?.[0]
      return bank ? (
        <div className="mr-1.5">
          <TokenLogo bank={bank} size={16} />
        </div>
      ) : (
        <QuestionMarkCircleIcon className="h-6 w-6 text-th-fgd-3" />
      )
    }
  }

  const initChartData = useMemo(() => {
    if (!initHealthContributions.length) return []
    return initHealthContributions
      .filter((cont) => {
        if (cont.asset.includes('PERP')) {
          return
        } else if (cont.asset.includes('/')) {
          return cont.contribution > 0.01
        } else return cont
      })
      .sort((a, b) => {
        const aMultiplier = a.isAsset ? 1 : -1
        const bMultiplier = b.isAsset ? 1 : -1
        return b.contribution * bMultiplier - a.contribution * aMultiplier
      })
  }, [initHealthContributions])

  const maintChartData = useMemo(() => {
    if (!maintHealthContributions.length) return []
    return maintHealthContributions
      .filter((cont) => {
        if (cont.asset.includes('PERP')) {
          return
        } else if (cont.asset.includes('/')) {
          return cont.contribution > 0.01
        } else return cont
      })
      .sort((a, b) => {
        const aMultiplier = a.isAsset ? 1 : -1
        const bMultiplier = b.isAsset ? 1 : -1
        return b.contribution * bMultiplier - a.contribution * aMultiplier
      })
  }, [maintHealthContributions])

  return group ? (
    <>
      <div className="hide-scroll flex h-14 items-center space-x-4 overflow-x-auto border-b border-th-bkg-3">
        <button
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center border-r border-th-bkg-3 focus-visible:bg-th-bkg-3 md:hover:bg-th-bkg-2"
          onClick={hideView}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="text-lg">{t('account:health-contributions')}</h2>
      </div>
      {mangoAccountAddress ? (
        <>
          <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-6 p-6 sm:gap-8">
            <div className="col-span-1 flex h-full flex-col items-center">
              <Tooltip content={t('account:tooltip-init-health')}>
                <h3 className="tooltip-underline text-xs sm:text-base">
                  {t('account:init-health-contributions')}
                </h3>
              </Tooltip>
              <HealthContributionsChart
                data={initChartData}
                activeIndex={initActiveIndex}
                setActiveIndex={setInitActiveIndex}
              />
            </div>
            <div className="col-span-1 flex flex-col items-center">
              <Tooltip content={t('account:tooltip-maint-health')}>
                <h3 className="tooltip-underline text-xs sm:text-base">
                  {t('account:maint-health-contributions')}
                </h3>
              </Tooltip>
              <HealthContributionsChart
                data={maintChartData}
                activeIndex={maintActiveIndex}
                setActiveIndex={setMaintActiveIndex}
              />
            </div>
            <div className="col-span-2 mx-auto flex max-w-[600px] flex-wrap justify-center space-x-4">
              {[...maintChartData]
                .sort((a, b) => b.contribution - a.contribution)
                .map((d, i) => {
                  return (
                    <div
                      key={d.asset + i}
                      className={`default-transition flex h-7 cursor-pointer items-center md:hover:text-th-active`}
                      onClick={() => handleLegendClick(d)}
                      onMouseEnter={() => handleLegendMouseEnter(d)}
                      onMouseLeave={handleLegendMouseLeave}
                    >
                      {renderLegendLogo(d.asset)}
                      <span className={`default-transition`}>{d.asset}</span>
                    </div>
                  )
                })}
            </div>
          </div>
          {maintHealthTokens.length ? (
            <div className="border-t border-th-bkg-3 pt-6">
              <h2 className="mb-1 px-6 text-lg">{t('tokens')}</h2>
              <TokensHealthTable
                initTokens={initHealthTokens}
                maintTokens={maintHealthTokens}
                handleLegendClick={handleLegendClick}
                handleLegendMouseEnter={handleLegendMouseEnter}
                handleLegendMouseLeave={handleLegendMouseLeave}
              />
            </div>
          ) : null}
          {maintHealthMarkets.length ? (
            <div className="pt-6">
              <h2 className="mb-1 px-6 text-lg">{t('markets')}</h2>
              <MarketsHealthTable
                initMarkets={initHealthMarkets}
                maintMarkets={maintHealthMarkets}
                handleLegendClick={handleLegendClick}
                handleLegendMouseEnter={handleLegendMouseEnter}
                handleLegendMouseLeave={handleLegendMouseLeave}
              />
            </div>
          ) : null}
        </>
      ) : (
        <div className="mx-6 mt-6 flex flex-col items-center rounded-lg border border-th-bkg-3 p-8">
          <NoSymbolIcon className="mb-2 h-6 w-6 text-th-fgd-4" />
          <p>{t('account:no-data')}</p>
        </div>
      )}
    </>
  ) : null
}

export default HealthContributions