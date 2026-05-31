import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { useVersionCheck } from '../hooks/useVersionCheck'
import { useTooltip } from '../hooks/useTooltip'
import { dismissAllTooltips } from '../lib/tooltipDismiss'
import { PRODUCT_NAME_BY_LANGUAGE } from '../lib/appLanguage'
import type { AppLanguage } from '../types'
import ViewportTooltip from './ViewportTooltip'
import HelpModal from './HelpModal'
import HistoryModal from './HistoryModal'
import { EditIcon, HelpCircleIcon, HistoryIcon, InstallIcon, SettingsIcon } from './icons'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const headerCopy: Record<AppLanguage, {
  home: string
  gallery: string
  agent: string
  install: string
  installIosMessage: string
  installBrowserMessage: string
  confirmText: string
  guide: string
  settings: string
  history: string
  newConversation: string
  languageLabel: string
  languageButton: string
  pullHint: string
}> = {
  zh: {
    home: '首页',
    gallery: '画廊',
    agent: 'Agent',
    install: '安装为应用',
    installIosMessage: '在 Safari 浏览器中，点击底部「分享」按钮，选择「添加到主屏幕」即可安装此应用。',
    installBrowserMessage: '请在浏览器的菜单中选择「添加到主屏幕」或「安装应用」。\n\n（如果在微信等内置浏览器中，请先在外部浏览器打开）',
    confirmText: '我知道了',
    guide: '操作指南',
    settings: '设置',
    history: '历史记录',
    newConversation: '新对话',
    languageLabel: '切换为英文',
    languageButton: 'EN',
    pullHint: '列表顶部下拉展示顶栏',
  },
  en: {
    home: 'Home',
    gallery: 'Gallery',
    agent: 'Agent',
    install: 'Install app',
    installIosMessage: 'In Safari, tap Share and choose Add to Home Screen to install this app.',
    installBrowserMessage: 'Use your browser menu to choose Add to Home Screen or Install app.\n\nIf you are in an in-app browser, open this page in a regular browser first.',
    confirmText: 'Got it',
    guide: 'Guide',
    settings: 'Settings',
    history: 'History',
    newConversation: 'New chat',
    languageLabel: 'Switch to Chinese',
    languageButton: '中',
    pullHint: 'Pull down at the top to show the header',
  },
}

function isInstalledPwa() {
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
}

export default function Header() {
  const appMode = useStore((s) => s.appMode)
  const setAppMode = useStore((s) => s.setAppMode)
  const uiLanguage = useStore((s) => s.uiLanguage)
  const setUiLanguage = useStore((s) => s.setUiLanguage)
  const setShowSettings = useStore((s) => s.setShowSettings)
  const setConfirmDialog = useStore((s) => s.setConfirmDialog)
  const agentMobileHeaderVisible = useStore((s) => s.agentMobileHeaderVisible)
  const setAgentMobileHeaderVisible = useStore((s) => s.setAgentMobileHeaderVisible)
  const agentConversations = useStore((s) => s.agentConversations)
  const activeAgentConversationId = useStore((s) => s.activeAgentConversationId)
  const setAgentEditingConversationId = useStore((s) => s.setAgentEditingConversationId)
  const setAgentSidebarCollapsed = useStore((s) => s.setAgentSidebarCollapsed)
  const activeConversation = agentConversations.find((item) => item.id === activeAgentConversationId)
  const { hasUpdate, latestRelease, dismiss } = useVersionCheck()
  const [showHelp, setShowHelp] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isPwaInstalled, setIsPwaInstalled] = useState(isInstalledPwa)
  const [hintVisible, setHintVisible] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const historyButtonRef = useRef<HTMLButtonElement>(null)
  const createConversation = useStore((s) => s.createAgentConversation)
  const copy = headerCopy[uiLanguage]
  const productName = PRODUCT_NAME_BY_LANGUAGE[uiLanguage]
  const nextLanguage: AppLanguage = uiLanguage === 'zh' ? 'en' : 'zh'

  useEffect(() => {
    if (appMode === 'agent') {
      setScrollDirection('up')
      return
    }

    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          if (currentScrollY < 20) {
            setScrollDirection('up')
          } else if (currentScrollY > lastScrollY + 10) {
            setScrollDirection('down')
          } else if (currentScrollY < lastScrollY - 10) {
            setScrollDirection('up')
          }
          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [appMode])

  useEffect(() => {
    if (appMode === 'agent' && !agentMobileHeaderVisible) {
      setHintVisible(true)
      const timer = setTimeout(() => {
        setHintVisible(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [appMode, agentMobileHeaderVisible])

  const installTooltip = useTooltip()
  const helpTooltip = useTooltip()
  const settingsTooltip = useTooltip()

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
      setIsPwaInstalled(false)
    }

    const handleAppInstalled = () => {
      setInstallPrompt(null)
      setIsPwaInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (installPrompt) {
      const promptEvent = installPrompt
      setInstallPrompt(null)

      try {
        await promptEvent.prompt()
        const choice = await promptEvent.userChoice
        setIsPwaInstalled(choice.outcome === 'accepted')
      } catch {
        setIsPwaInstalled(isInstalledPwa())
      }
    } else {
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      if (isIos) {
        setConfirmDialog({
          title: copy.install,
          message: copy.installIosMessage,
          showCancel: false,
          confirmText: copy.confirmText,
          icon: 'info',
          action: () => {},
        })
      } else {
        setConfirmDialog({
          title: copy.install,
          message: copy.installBrowserMessage,
          showCancel: false,
          confirmText: copy.confirmText,
          icon: 'info',
          action: () => {},
        })
      }
    }
  }

  return (
    <>
      <header data-no-drag-select className={`safe-area-top fixed top-0 left-0 right-0 z-40 border-b border-gray-200/70 bg-white/82 backdrop-blur-xl transition-transform duration-300 ease-in-out dark:border-white/[0.08] dark:bg-slate-950/82 ${appMode === 'agent' && !agentMobileHeaderVisible ? '-translate-y-full sm:translate-y-0' : 'translate-y-0'}`}>
        <div className="safe-area-x safe-header-inner max-w-7xl mx-auto flex items-center justify-between relative">
          <div className="flex-1 min-w-0 pr-2 flex items-center gap-2">
            <h1 className="inline-flex items-start relative mr-2">
              <a
                href="https://github.com/CookSleep/gpt_image_playground"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[16px] sm:text-lg font-black tracking-tight text-gray-900 transition-colors hover:text-violet-600 dark:text-white dark:hover:text-cyan-200"
              >
                {productName}
              </a>
              {hasUpdate && latestRelease && (
                <a
                  href={latestRelease.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismiss}
                  className="absolute -right-1 -top-1 translate-x-full -translate-y-1/4 px-1 py-0.5 rounded-[4px] border border-red-500/30 text-[9px] font-black bg-red-500 text-white hover:bg-red-600 transition-all animate-fade-in leading-none shadow-sm"
                  title={`新版本 ${latestRelease.tag}`}
                >
                  NEW
                </a>
              )}
            </h1>
            {appMode === 'agent' && <div className="hidden sm:flex items-center gap-1 relative">
              <button
                ref={historyButtonRef}
                type="button"
                onClick={() => setShowHistoryModal((visible) => !visible)}
                className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.04] rounded-lg transition-colors"
                title={copy.history}
              >
                <HistoryIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setAppMode('agent')
                  createConversation()
                }}
                className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.04] rounded-lg transition-colors"
                title={copy.newConversation}
              >
                <EditIcon className="w-5 h-5" />
              </button>
              {showHistoryModal && (
                <HistoryModal onClose={() => setShowHistoryModal(false)} ignoreOutsideClickRef={historyButtonRef} />
              )}
            </div>}
          </div>
          {appMode === 'agent' && activeConversation && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex max-w-[30%]">
              <button
                type="button"
                onClick={() => {
                  setShowHistoryModal(true)
                  // Use setTimeout to ensure HistoryModal is mounted before setting editing id
                  setTimeout(() => {
                    useStore.getState().setAgentEditingConversationId(activeConversation.id)
                  }, 0)
                }}
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate hover:bg-gray-100 dark:hover:bg-white/[0.04] px-2 py-1 rounded transition-colors"
              >
                {activeConversation.title || 'Agent'}
              </button>
            </div>
          )}
          <div className="hidden sm:flex items-center gap-1 rounded-full border border-gray-200/80 bg-gray-100/70 p-1 mr-4 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.05]">
            <button
              type="button"
              onClick={() => setAppMode('home')}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${appMode === 'home' ? 'bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              {copy.home}
            </button>
            <button
              type="button"
              onClick={() => setAppMode('gallery')}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${appMode === 'gallery' ? 'bg-white text-gray-900 shadow-sm font-medium dark:bg-white/10 dark:text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              {copy.gallery}
            </button>
            <button
              type="button"
              onClick={() => setAppMode('agent')}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${appMode === 'agent' ? 'bg-white text-gray-900 shadow-sm font-medium dark:bg-white/10 dark:text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              {copy.agent}
            </button>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setUiLanguage(nextLanguage)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
              aria-label={copy.languageLabel}
              title={copy.languageLabel}
            >
              {copy.languageButton}
            </button>
            {!isPwaInstalled && (
              <div
                className="relative"
                {...installTooltip.handlers}
              >
                <button
                  onClick={() => {
                    dismissAllTooltips()
                    handleInstallClick()
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  aria-label={copy.install}
                >
                  <InstallIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <ViewportTooltip visible={installTooltip.visible} className="whitespace-nowrap">
                  {copy.install}
                </ViewportTooltip>
              </div>
            )}
            <div
              className="relative"
              {...helpTooltip.handlers}
            >
              <button
                onClick={() => {
                  dismissAllTooltips()
                  setShowHelp(true)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label={copy.guide}
              >
                <HelpCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <ViewportTooltip visible={helpTooltip.visible} className="whitespace-nowrap">
                {copy.guide}
              </ViewportTooltip>
            </div>
            <div
              className="relative"
              {...settingsTooltip.handlers}
            >
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label={copy.settings}
              >
                <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <ViewportTooltip visible={settingsTooltip.visible} className="whitespace-nowrap">
                {copy.settings}
              </ViewportTooltip>
            </div>
          </div>
        </div>
        <div className={`safe-area-x sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${appMode === 'gallery' && scrollDirection === 'down' ? 'max-h-0 opacity-0 pb-0' : 'max-h-20 opacity-100 pb-2'}`}>
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-100/70 dark:bg-white/[0.04] p-1 mx-2">
            <button
              type="button"
              onClick={() => setAppMode('home')}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${appMode === 'home' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              {copy.home}
            </button>
            <button
              type="button"
              onClick={() => setAppMode('gallery')}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${appMode === 'gallery' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              {copy.gallery}
            </button>
            <button
              type="button"
              onClick={() => setAppMode('agent')}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${appMode === 'agent' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              {copy.agent}
            </button>
          </div>
        </div>
      </header>
      
      {/* Hint for sliding down */}
      <div className={`fixed top-0 left-0 right-0 z-30 flex justify-center pointer-events-none transition-all duration-300 ease-in-out sm:hidden ${appMode === 'agent' && hintVisible && !agentMobileHeaderVisible ? 'translate-y-[env(safe-area-inset-top,0px)] opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-b-xl shadow-lg">
          {copy.pullHint}
        </div>
      </div>

      <div className={`safe-area-top invisible pointer-events-none transition-all duration-300 ease-in-out ${appMode === 'agent' && !agentMobileHeaderVisible ? 'max-h-0 sm:max-h-[500px] opacity-0 sm:opacity-100 overflow-hidden sm:overflow-visible' : 'max-h-[500px] opacity-100'}`} aria-hidden="true">
        <div className="safe-header-inner" />
        <div className={`safe-area-x sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${appMode === 'gallery' && scrollDirection === 'down' ? 'max-h-0 pb-0' : 'max-h-20 pb-2'}`}>
          <div className="p-1">
            <div className="py-1.5 text-sm">占位</div>
          </div>
        </div>
      </div>
      {showHelp && <HelpModal appMode={appMode} onClose={() => setShowHelp(false)} />}
    </>
  )
}
