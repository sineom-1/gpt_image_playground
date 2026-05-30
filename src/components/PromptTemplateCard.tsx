import type { PromptTemplate } from '../types'

interface Props {
  template: PromptTemplate
  onUse: (template: PromptTemplate) => void
}

export default function PromptTemplateCard({ template, onUse }: Props) {
  const tags = template.tags?.slice(0, 3) ?? []

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.07] shadow-2xl shadow-black/10 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.1]">
      <button
        type="button"
        onClick={() => onUse(template)}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-violet-500/25 via-fuchsia-500/15 to-cyan-400/20">
          {template.coverImageUrl ? (
            <img
              src={template.coverImageUrl}
              alt={template.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-semibold text-white/60">
              Campaign-ready prompt
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-80" />
          {template.category && (
            <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-slate-950/65 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
              {template.category}
            </span>
          )}
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="line-clamp-1 text-base font-bold text-white">{template.title}</h3>
            {template.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{template.description}</p>
            )}
          </div>

          <p className="line-clamp-2 rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2 text-xs leading-5 text-slate-400">
            {template.prompt}
          </p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
            <span className="shrink-0 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-sm transition group-hover:shadow-cyan-300/20">
              使用此 Prompt
            </span>
          </div>
        </div>
      </button>
    </article>
  )
}
