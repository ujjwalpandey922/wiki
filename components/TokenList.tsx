import Image from 'next/image'

import mangoStore from '../store/state'
import { formatDecimal, numberFormat } from '../utils/numbers'
import Button from './shared/Button'
import ContentBox from './shared/ContentBox'

const TokenList = () => {
  const mangoAccount = mangoStore((s) => s.mangoAccount)
  const group = mangoStore((s) => s.group)

  const banks = group?.banksMap
    ? Array.from(group?.banksMap, ([key, value]) => ({ key, value }))
    : []

  return (
    <ContentBox hideBorder hidePadding>
      <h2>Tokens</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="w-[12.5%] text-left">Token</th>
            <th className="w-[12.5%] text-right">Price</th>
            <th className="w-[12.5%] text-right">24hr Change</th>
            <th className="w-[12.5%] text-right">24hr Volume</th>
            <th className="w-[12.5%] text-right">Rates (APR)</th>
            <th className="w-[12.5%] text-right">Liquidity</th>
            <th className="w-[12.5%] text-right">Available Balance</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank) => {
            const oraclePrice = bank.value.price
            return (
              <tr key={bank.key}>
                <td className="w-[12.5%]">
                  <div className="flex items-center">
                    <div className="mr-2.5 flex flex-shrink-0 items-center">
                      <Image
                        alt=""
                        width="24"
                        height="24"
                        src={`/icons/${bank.value.name.toLowerCase()}.svg`}
                      />
                    </div>
                    <p className="font-bold">{bank.value.name}</p>
                  </div>
                </td>
                <td className="w-[12.5%]">
                  <div className="flex flex-col text-right">
                    <p>${formatDecimal(oraclePrice.toNumber(), 2)}</p>
                  </div>
                </td>
                <td className="w-[12.5%]">
                  <div className="flex flex-col text-right">
                    <p className="text-th-green">0%</p>
                  </div>
                </td>
                <td className="w-[12.5%]">
                  <div className="flex flex-col text-right">
                    <p>1000</p>
                  </div>
                </td>
                <td className="w-[12.5%]">
                  <div className="flex justify-end space-x-2 text-right">
                    <p className="text-th-green">
                      {formatDecimal(bank.value.getDepositRate().toNumber(), 2)}
                      %
                    </p>
                    <span className="text-th-fgd-4">|</span>
                    <p className="text-th-red">
                      {formatDecimal(bank.value.getBorrowRate().toNumber(), 2)}%
                    </p>
                  </div>
                </td>
                <td className="w-[12.5%]">
                  <div className="flex flex-col text-right">
                    <p>
                      {formatDecimal(
                        bank.value.uiDeposits() - bank.value.uiBorrows(),
                        bank.value.mintDecimals
                      )}
                    </p>
                  </div>
                </td>
                <td className="w-[12.5%] pt-4 text-right">
                  <p className="px-2">
                    {mangoAccount
                      ? formatDecimal(mangoAccount.getUi(bank.value))
                      : '-'}
                  </p>
                  <p className="px-2 text-xs text-th-fgd-4">
                    {mangoAccount
                      ? `$${formatDecimal(
                          mangoAccount.getUi(bank.value) *
                            oraclePrice.toNumber(),
                          2
                        )}`
                      : '-'}
                  </p>
                </td>
                <td className="w-[12.5%]">
                  <div className="flex justify-end space-x-2">
                    <Button>Buy</Button>
                    <Button secondary>Sell</Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </ContentBox>
  )
}

export default TokenList
