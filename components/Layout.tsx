import SideNav from './shared/SideNav'
import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import { useViewport } from '../hooks/useViewport'
import { breakpoints } from '../utils/theme'
import { useTranslation } from 'next-i18next'
import { Popover, Transition } from '@headlessui/react'
import MangoAccountSummary from './account/MangoAccountSummary'
import { HealthType, MangoAccount } from '@blockworks-foundation/mango-v4'
import mangoStore from '../store/state'
import HealthHeart from './account/HealthHeart'
import BottomBar from './mobile/BottomBar'
import useLocalStorageState from '../hooks/useLocalStorageState'
import UserSetupModal from './modals/UserSetupModal'
import { ConnectWalletButton } from './wallet/ConnectWalletButton'
import ConnectedMenu from './wallet/ConnectedMenu'
import WalletIcon from './icons/WalletIcon'
import BounceLoader from './shared/BounceLoader'

export const IS_ONBOARDED_KEY = 'isOnboarded'

const Layout = ({ children }: { children: ReactNode }) => {
  const mangoAccount = mangoStore((s) => s.mangoAccount.current)
  const loadingMangoAccount = mangoStore((s) => s.mangoAccount.loading)
  const { t } = useTranslation('common')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { width } = useViewport()
  const isMobile = width ? width < breakpoints.md : false
  const [isOnboarded] = useLocalStorageState(IS_ONBOARDED_KEY)
  const [showUserSetupModal, setShowUserSetupModal] = useState(false)

  useEffect(() => {
    const collapsed = width ? width < breakpoints.xl : false
    setIsCollapsed(collapsed)
  }, [width])

  useEffect(() => {
    if (width < breakpoints.lg) {
      setIsCollapsed(true)
    }
  }, [width])

  const handleCloseModal = useCallback(() => {
    setShowUserSetupModal(false)
  }, [])

  const handleShowModal = useCallback(() => {
    setShowUserSetupModal(true)
  }, [])

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
  }

  return (
    <>
      {loadingMangoAccount && isOnboarded ? (
        <div className="fixed z-30 flex h-screen w-full items-center justify-center bg-[rgba(0,0,0,0.7)]">
          <BounceLoader />
        </div>
      ) : null}
      <div className={`flex-grow bg-th-bkg-1 text-th-fgd-1 transition-all`}>
        <div className="flex">
          {isMobile ? (
            <div className="fixed bottom-0 left-0 z-20 w-full md:hidden">
              <BottomBar />
            </div>
          ) : (
            <div className={`fixed z-20 h-screen`}>
              <button
                className="absolute -right-4 top-1/2 z-20 hidden h-10 w-4 -translate-y-1/2 transform rounded-none rounded-r bg-th-bkg-4 focus:outline-none lg:block"
                onClick={handleToggleSidebar}
              >
                <ChevronRightIcon
                  className={`default-transition h-full w-full ${
                    !isCollapsed ? 'rotate-180' : 'rotate-360'
                  }`}
                />
              </button>
              <div
                className={`h-full ${!isCollapsed ? 'overflow-y-auto' : ''}`}
              >
                <SideNav collapsed={isCollapsed} />
              </div>
            </div>
          )}
          <div
            className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
              isMobile ? '' : isCollapsed ? 'pl-[72px]' : 'pl-44 lg:pl-56'
            }`}
          >
            <div className="flex h-16 items-center justify-between border-b border-th-bkg-3 bg-th-bkg-1 px-6">
              <div className="flex items-center text-th-fgd-3">
                <span className="mb-0 mr-2">
                  {mangoAccount ? (
                    <MangoAccountSummaryDropdown mangoAccount={mangoAccount} />
                  ) : (
                    <span className="flex items-center">
                      🔗<span className="ml-2">{t('connect-helper')}</span>
                      <ArrowRightIcon className="sideways-bounce ml-2 h-5 w-5 text-th-fgd-1" />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                {mangoAccount ? (
                  <ConnectedMenu />
                ) : isOnboarded ? (
                  <ConnectWalletButton />
                ) : (
                  <button
                    className="relative flex h-16 items-center justify-center rounded-none bg-gradient-to-bl from-mango-theme-yellow to-mango-theme-red-dark px-6 text-base font-bold text-white before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.25)] before:to-transparent before:opacity-0 hover:cursor-pointer hover:overflow-hidden hover:before:-translate-x-full hover:before:animate-[shimmer_0.75s_normal] hover:before:opacity-100"
                    onClick={handleShowModal}
                  >
                    <WalletIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                    {t('connect')}
                  </button>
                )}
              </div>
            </div>
            <div className={`min-h-screen p-8 ${isMobile ? 'pb-20' : ''}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
      {showUserSetupModal ? (
        <UserSetupModal
          isOpen={showUserSetupModal}
          onClose={handleCloseModal}
        />
      ) : null}
    </>
  )
}

export default Layout

const MangoAccountSummaryDropdown = ({
  mangoAccount,
}: {
  mangoAccount: MangoAccount
}) => {
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="flex w-full items-center justify-between rounded-none text-th-fgd-1 hover:text-th-primary">
            <div className="flex items-center">
              <HealthHeart
                health={mangoAccount.getHealthRatio(HealthType.init).toNumber()}
                size={20}
              />
              <span className="ml-1.5 mr-0.5 font-bold">
                {mangoAccount.name}
              </span>
            </div>
            <ChevronDownIcon
              className={`${
                open ? 'rotate-180 transform' : 'rotate-360 transform'
              } mt-0.5 h-5 w-5 flex-shrink-0 text-th-fgd-3`}
            />
          </Popover.Button>
          <Transition
            appear={true}
            show={open}
            as={Fragment}
            enter="transition-all ease-in duration-200"
            enterFrom="opacity-0 transform scale-75"
            enterTo="opacity-100 transform scale-100"
            leave="transition ease-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel className="absolute top-[63px] z-10 mr-4 w-56 rounded-md rounded-t-none border border-th-bkg-3 bg-th-bkg-1 p-4">
              <MangoAccountSummary />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
