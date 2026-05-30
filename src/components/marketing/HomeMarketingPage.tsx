import type { PromptTemplate } from '../../types'
import PromptTemplateCard from '../PromptTemplateCard'

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

const heroPrompts = [
  'Create a cinematic product shot for a matte black smart speaker on a glossy obsidian desk.',
  'Generate a premium fashion campaign poster with violet neon, silver fabric, and bold negative space.',
  'Design a cozy wabi-sabi interior scene with natural light, warm concrete, and editorial styling.',
]

const capabilityBadges = [
  'Text to image',
  'Image editing',
  'Prompt templates',
  'Agent workflows',
]

const stats = [
  { value: '6+', label: 'Creative starter templates' },
  { value: '3', label: 'Generation workflows' },
  { value: 'Local', label: 'Private IndexedDB gallery' },
]

const features = [
  {
    title: 'Start from proven prompts',
    description: 'Use curated commercial, poster, product, avatar, and concept prompts instead of starting from a blank page.',
  },
  {
    title: 'Remix with references',
    description: 'Bring images, masks, and previous outputs back into the flow for precise edits and visual iteration.',
  },
  {
    title: 'Ship multi-step ideas',
    description: 'Agent mode turns creative briefs into guided image tasks, so longer campaigns stay organized.',
  },
  {
    title: 'Keep your gallery local',
    description: 'Outputs, favorites, parameters, and revisions are organized in the browser without a backend account system.',
  },
]

const workflow = [
  ['01', 'Choose a direction', 'Pick a template or paste a campaign brief into the hero-style prompt surface.'],
  ['02', 'Tune the creative', 'Adjust size, quality, references, masks, and provider settings before generating.'],
  ['03', 'Generate and iterate', 'Review outputs in the gallery, reuse parameters, edit images, and favorite winners.'],
]

const useCases = ['Product hero shots', 'Social campaign visuals', 'Character concepts', 'Interior moodboards', 'Food ads', 'Profile avatars']

function TemplatePreview({ template, index }: { template?: PromptTemplate; index: number }) {
  const fallbackTitles = ['Product launch', 'Fashion poster', 'Concept art']

  return (
    <div className={`relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/[0.06] shadow-2xl shadow-black/20 ${index === 1 ? 'mt-10' : ''}`}>
      <div className="aspect-[4/5] bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-400/20">
        {template?.coverImageUrl ? (
          <img src={template.coverImageUrl} alt={template.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm font-semibold text-white/65">
            {template?.title ?? fallbackTitles[index]}
          </div>
        )}
      </div>
      <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/15 bg-black/35 p-3 text-white shadow-lg backdrop-blur-xl">
        <p className="line-clamp-1 text-sm font-semibold">{template?.title ?? fallbackTitles[index]}</p>
        <p className="mt-1 line-clamp-1 text-xs text-white/65">{template?.category ?? 'AI creative prompt'}</p>
      </div>
    </div>
  )
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
  const heroTemplates = templates.slice(0, 3)

  return (
    <div className="relative -mx-4 overflow-hidden bg-slate-950 text-white sm:-mx-6 lg:-mx-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-0 top-[38rem] h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.13),transparent_34rem)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pt-20">
        <section className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 shadow-lg shadow-black/20 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
              GPT Image Playground
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Turn prompts into campaign-ready images.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              从模板、参考图和 Agent 工作流开始，把产品图、海报、角色概念和社媒视觉快速推进到可交付状态。
            </p>

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.08] p-3 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-2xl">
              <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/80 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span className="ml-2">Prompt composer</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">{heroPrompts[0]}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {capabilityBadges.map((badge) => (
                    <span key={badge} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => document.getElementById('prompt-template-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-fuchsia-500/25 transition hover:scale-[1.01]"
                  >
                    Start with templates
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAgent}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                  >
                    Explore Agent mode
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
                  <p className="text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[34rem]">
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-2xl" />
            <div className="relative grid h-full grid-cols-3 gap-3 p-4 sm:gap-4 sm:p-5">
              {[0, 1, 2].map((index) => (
                <TemplatePreview key={index} template={heroTemplates[index]} index={index} />
              ))}
            </div>
            <div className="absolute -bottom-4 left-6 right-6 rounded-[1.5rem] border border-white/15 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Creative pipeline ready</p>
                  <p className="mt-1 text-xs text-slate-400">Template - Generate - Edit - Gallery</p>
                </div>
                <button
                  type="button"
                  onClick={onOpenGallery}
                  className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-100"
                >
                  Open Gallery
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
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
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Template studio</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Pick a launch-ready creative direction.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                点击模板会保留现有生成流程：自动填入 prompt，并进入可继续微调的 Playground。
              </p>
            </div>
            <button
              type="button"
              onClick={onReload}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
            >
              Refresh templates
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
                  {category === 'all' ? '全部' : category}
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
              {templates.length === 0 ? '当前没有可用的 Prompt 模板。' : '当前分类下没有匹配的模板。'}
            </div>
          )}
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-200">Workflow</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">A creative system, not just a generator.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              参考 Manus 和 Canva 的营销结构，把核心生成能力包装成清晰的创作路径，同时保持现有工具效率。
            </p>
          </div>
          <div className="space-y-4">
            {workflow.map(([step, title, description]) => (
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
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Use cases</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Built for marketing assets that need momentum.</h2>
            </div>
            <button
              type="button"
              onClick={onOpenGallery}
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-100"
            >
              View generated gallery
            </button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item) => (
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
