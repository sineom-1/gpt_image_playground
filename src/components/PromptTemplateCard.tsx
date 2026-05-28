import type { PromptTemplate } from '../types'

interface Props {
  template: PromptTemplate
  onUse: (template: PromptTemplate) => void
}

export default function PromptTemplateCard({ template, onUse }: Props) {
  const tags = template.tags?.slice(0, 3) ?? []

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.08] dark:bg-gray-900/80">
      <button
        type="button"
        onClick={() => onUse(template)}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10">
          {template.coverImageUrl ? (
            <img
              src={template.coverImageUrl}
              alt={template.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-medium text-gray-400 dark:text-gray-500">
              GPT Image Prompt
            </div>
          )}
          {template.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur dark:bg-gray-950/80 dark:text-gray-200">
              {template.category}
            </span>
          )}
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{template.title}</h3>
            {template.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{template.description}</p>
            )}
          </div>

          <p className="line-clamp-2 rounded-xl bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-500 dark:bg-white/[0.04] dark:text-gray-400">
            {template.prompt}
          </p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500 dark:bg-white/[0.06] dark:text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
            <span className="shrink-0 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition group-hover:bg-blue-600">
              使用此 Prompt
            </span>
          </div>
        </div>
      </button>
    </article>
  )
}
