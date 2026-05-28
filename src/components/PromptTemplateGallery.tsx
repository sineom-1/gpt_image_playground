import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { fetchPromptTemplates } from '../lib/promptTemplates'
import type { PromptTemplate } from '../types'
import PromptTemplateCard from './PromptTemplateCard'

export default function PromptTemplateGallery() {
  const applyPromptTemplate = useStore((s) => s.applyPromptTemplate)
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
    <section className="mt-6 mb-6 rounded-3xl border border-gray-200/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/[0.08] dark:bg-gray-950/60">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-500">GPT Image</p>
          <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">Prompt 模型画廊</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            选择模板后会自动填入 prompt，并切回现有的编辑输入区，方便你继续微调后再生成。
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReloadNonce((value) => value + 1)}
          className="inline-flex items-center justify-center rounded-full border border-gray-200/70 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-gray-200 dark:hover:bg-white/[0.06]"
        >
          刷新模板
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          {error}
        </div>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => {
          const active = selectedCategory === category
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'border border-gray-200/70 bg-white text-gray-600 hover:bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-gray-300 dark:hover:bg-white/[0.06]'
              }`}
            >
              {category === 'all' ? '全部' : category}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm dark:border-white/[0.08] dark:bg-gray-900/80">
              <div className="aspect-[4/3] animate-pulse bg-gray-100 dark:bg-white/[0.04]" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/5 animate-pulse rounded bg-gray-100 dark:bg-white/[0.04]" />
                <div className="h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-white/[0.04]" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-gray-100 dark:bg-white/[0.04]" />
                <div className="flex gap-2">
                  <div className="h-5 w-14 animate-pulse rounded-full bg-gray-100 dark:bg-white/[0.04]" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-white/[0.04]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : visibleTemplates.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleTemplates.map((template) => (
            <PromptTemplateCard key={template.id} template={template} onUse={applyPromptTemplate} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-200/70 bg-gray-50/80 px-6 py-10 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-400">
          {templates.length === 0
            ? '当前没有可用的 Prompt 模板。'
            : '当前分类下没有匹配的模板。'}
        </div>
      )}
    </section>
  )
}
