import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { fetchPromptTemplates } from '../lib/promptTemplates'
import type { PromptTemplate } from '../types'
import HomeMarketingPage from './marketing/HomeMarketingPage'

export default function PromptTemplateGallery() {
  const applyPromptTemplate = useStore((s) => s.applyPromptTemplate)
  const setAppMode = useStore((s) => s.setAppMode)
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

  const categories = useMemo(() => {
    const seen = new Set<string>()
    const items = ['all']
    for (const template of templates) {
      if (!template.category || seen.has(template.category)) continue
      seen.add(template.category)
      items.push(template.category)
    }
    return items
  }, [templates])

  useEffect(() => {
    if (selectedCategory === 'all') return
    if (categories.includes(selectedCategory)) return
    setSelectedCategory('all')
  }, [categories, selectedCategory])

  const visibleTemplates = useMemo(() => {
    if (selectedCategory === 'all') return templates
    return templates.filter((template) => template.category === selectedCategory)
  }, [templates, selectedCategory])

  return (
    <HomeMarketingPage
      templates={templates}
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
