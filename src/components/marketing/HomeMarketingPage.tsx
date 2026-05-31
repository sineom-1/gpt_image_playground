import { useEffect, type FormEvent, useState } from 'react'
import { homeMarketingCopy } from '../../lib/homeMarketingCopy'
import { useStore } from '../../store'
import type { PromptTemplate } from '../../types'
import PromptTemplateCard from '../PromptTemplateCard'

const knownHeroPrompts = Object.values(homeMarketingCopy).flatMap((copy) => copy.heroPrompts)

interface Props {
  templates: PromptTemplate[]
  visibleTemplates: PromptTemplate[]
  categories: string[]
  selectedCategory: string
  loading: boolean
  error: string | null
  onSelectCategory: (category: string) => void
  onReload: () => void
  onUseTemplate: (template: PromptTemplate) => void
  onOpenGallery: () => void
  onOpenAgent: () => void
}

export default function HomeMarketingPage({
  templates,
  visibleTemplates,
  categories,
  selectedCategory,
  loading,
  error,
  onSelectCategory,
  onReload,
  onUseTemplate,
  onOpenGallery,
  onOpenAgent,
}: Props) {
  const uiLanguage = useStore((s) => s.uiLanguage)
  const copy = homeMarketingCopy[uiLanguage]
  const [heroPrompt, setHeroPrompt] = useState(copy.heroPrompts[0])
  const heroPromptReady = heroPrompt.trim().length > 0

  useEffect(() => {
    setHeroPrompt((current) => knownHeroPrompts.includes(current) ? copy.heroPrompts[0] : current)
  }, [copy])

  const handleHeroPromptSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const prompt = heroPrompt.trim()
    if (!prompt) return

    onUseTemplate({
      id: `home-quick-start-${Date.now()}`,
      title: copy.quickStartTemplateTitle,
      description: copy.quickStartTemplateDescription,
      prompt,
      category: copy.quickStartTemplateCategory,
      tags: copy.quickStartTemplateTags,
    })
  }

  return (
    <div className="relative -mx-4 overflow-hidden bg-slate-950 text-white sm:-mx-6 lg:-mx-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-0 top-[38rem] h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.13),transparent_34rem)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pt-20">
        <section className="mx-auto max-w-5xl text-center">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 shadow-lg shadow-black/20 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
              {copy.badge}
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              {copy.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {copy.subtitle}
            </p>
          </div>

          <form onSubmit={handleHeroPromptSubmit} className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.08] p-3 text-left shadow-2xl shadow-fuchsia-950/30 backdrop-blur-2xl">
              <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/80 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span className="ml-2">{copy.composerLabel}</span>
                </div>
                <label htmlFor="home-hero-prompt" className="sr-only">{copy.promptLabel}</label>
                <textarea
                  id="home-hero-prompt"
                  value={heroPrompt}
                  onChange={(event) => setHeroPrompt(event.target.value)}
                  rows={4}
                  className="mt-4 min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-300/10 sm:text-base"
                  placeholder={copy.promptPlaceholder}
                />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">{copy.examplesLabel}</span>
                  {copy.heroPrompts.map((prompt, index) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setHeroPrompt(prompt)}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-300 transition hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-cyan-100"
                    >
                      {copy.exampleButton(index)}
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {copy.capabilityBadges.map((badge) => (
                    <span key={badge} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="submit"
                    disabled={!heroPromptReady}
                    className="rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-fuchsia-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100"
                  >
                    {copy.submit}
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('prompt-template-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                  >
                    {copy.templatesCta}
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAgent}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                  >
                    {copy.agentCta}
                  </button>
                </div>
              </div>
          </form>

          <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
              {copy.stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
                  <p className="text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{item.label}</p>
                </div>
              ))}
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-5 text-slate-500">
              {copy.backupNote}
          </p>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.features.map((feature) => (
            <article key={feature.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.08]">
              <div className="mb-5 h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-300/90 to-fuchsia-400/90 shadow-lg shadow-fuchsia-500/20" />
              <h2 className="text-lg font-bold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
            </article>
          ))}
        </section>

        <section id="prompt-template-studio" className="mt-24 scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">{copy.templateStudioLabel}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{copy.templateStudioTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {copy.templateStudioDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={onReload}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
            >
              {copy.refreshTemplates}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              {error}
            </div>
          )}

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {categories.map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onSelectCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                      : 'border border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]'
                  }`}
                >
                  {category === 'all' ? copy.allCategory : category}
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.05]">
                  <div className="aspect-[4/3] animate-pulse bg-white/[0.06]" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/5 animate-pulse rounded bg-white/[0.08]" />
                    <div className="h-3 w-full animate-pulse rounded bg-white/[0.08]" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-white/[0.08]" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleTemplates.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleTemplates.map((template) => (
                <PromptTemplateCard key={template.id} template={template} onUse={onUseTemplate} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.04] px-6 py-12 text-center text-sm text-slate-400">
              {templates.length === 0 ? copy.emptyAll : copy.emptyCategory}
            </div>
          )}
        </section>

        <section className="mt-24 grid gap-8 rounded-[2rem] border border-cyan-300/15 bg-cyan-300/[0.04] p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">{copy.agentLabel}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{copy.agentTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {copy.agentDescription}
            </p>
            <button
              type="button"
              onClick={onOpenAgent}
              className="mt-6 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
            >
              {copy.agentWorkspaceCta}
            </button>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/20">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.agentBriefLabel}</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                {copy.agentBrief}
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {copy.agentSteps.map(([title, description], index) => (
                <div key={title} className="grid grid-cols-[2.25rem_1fr] gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300/15 text-sm font-black text-cyan-100">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-200">{copy.workflowLabel}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{copy.workflowTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {copy.workflowDescription}
            </p>
          </div>
          <div className="space-y-4">
            {copy.workflow.map(([step, title, description]) => (
              <article key={step} className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 sm:grid-cols-[4rem_1fr]">
                <div className="text-2xl font-black text-cyan-200">{step}</div>
                <div>
                  <h3 className="font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-24 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">{copy.useCasesLabel}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{copy.useCasesTitle}</h2>
            </div>
            <button
              type="button"
              onClick={onOpenGallery}
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-100"
            >
              {copy.viewGallery}
            </button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {copy.useCases.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-sm font-semibold text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
