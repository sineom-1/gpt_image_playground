import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { fetchPromptTemplates, localizePromptTemplates } from '../lib/promptTemplates'
import type { PromptTemplate } from '../types'
import HomeMarketingPage from './marketing/HomeMarketingPage'

export default function PromptTemplateGallery() {
  const applyPromptTemplate = useStore((s) => s.applyPromptTemplate)
  const setAppMode = useStore((s) => s.setAppMode)
  const uiLanguage = useStore((s) => s.uiLanguage)
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [reloadNonce, setReloadNonce] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    void fetchPromptTemplates().then(({ templates: nextTemplates, error: nextError }) => {
      if (cancelled) return
      setTemplates(nextTemplates)
      setError(nextError ?? null)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [reloadNonce])

  const localizedTemplates = useMemo(() => localizePromptTemplates(templates, uiLanguage), [templates, uiLanguage])

  const categories = useMemo(() => {
    const seen = new Set<string>()
    const items = ['all']
    for (const template of localizedTemplates) {
      if (!template.category || seen.has(template.category)) continue
      seen.add(template.category)
      items.push(template.category)
    }
    return items
  }, [localizedTemplates])

  useEffect(() => {
    if (selectedCategory === 'all') return
    if (categories.includes(selectedCategory)) return
    setSelectedCategory('all')
  }, [categories, selectedCategory])

  const visibleTemplates = useMemo(() => {
    if (selectedCategory === 'all') return localizedTemplates
    return localizedTemplates.filter((template) => template.category === selectedCategory)
  }, [localizedTemplates, selectedCategory])

  return (
    <HomeMarketingPage
      templates={localizedTemplates}
      visibleTemplates={visibleTemplates}
      categories={categories}
      selectedCategory={selectedCategory}
      loading={loading}
      error={error}
      onSelectCategory={setSelectedCategory}
      onReload={() => setReloadNonce((value) => value + 1)}
      onUseTemplate={applyPromptTemplate}
      onOpenGallery={() => setAppMode('gallery')}
      onOpenAgent={() => setAppMode('agent')}
    />
  )
}
