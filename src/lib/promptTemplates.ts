import type { PromptTemplate, TaskParams } from '../types'
import { readRuntimeEnv } from './runtimeEnv'

const DEFAULT_PROMPT_TEMPLATES_URL = '/api/prompt-templates'
const PROMPT_TEMPLATES_URL = readRuntimeEnv(import.meta.env.VITE_PROMPT_TEMPLATES_URL) || DEFAULT_PROMPT_TEMPLATES_URL

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export interface PromptTemplatesFetchResult {
  templates: PromptTemplate[]
  updatedAt?: string
  error?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function normalizeString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function normalizeStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const items = value
    .map((item) => normalizeString(item))
    .filter((item): item is string => Boolean(item))
  return items.length ? Array.from(new Set(items)) : undefined
}

function normalizeOutputCompression(value: unknown): number | null | undefined {
  if (value == null) return null
  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric)) return undefined
  return Math.min(100, Math.max(0, Math.trunc(numeric)))
}

function normalizeN(value: unknown): number | undefined {
  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric)) return undefined
  return Math.max(1, Math.trunc(numeric))
}

export function normalizePromptTemplateParams(value: unknown): Partial<TaskParams> | undefined {
  if (!isRecord(value)) return undefined
  const params: Partial<TaskParams> = {}

  const size = normalizeString(value.size)
  if (size) params.size = size

  if (value.quality === 'auto' || value.quality === 'low' || value.quality === 'medium' || value.quality === 'high') {
    params.quality = value.quality
  }

  if (value.output_format === 'png' || value.output_format === 'jpeg' || value.output_format === 'webp') {
    params.output_format = value.output_format
  }

  const outputCompression = normalizeOutputCompression(value.output_compression)
  if (outputCompression !== undefined) params.output_compression = outputCompression

  if (value.moderation === 'auto' || value.moderation === 'low') {
    params.moderation = value.moderation
  }

  const n = normalizeN(value.n)
  if (n !== undefined) params.n = n

  return Object.keys(params).length ? params : undefined
}

export function normalizePromptTemplate(value: unknown, index = 0): PromptTemplate | null {
  if (!isRecord(value)) return null

  const title = normalizeString(value.title ?? value.name)
  const prompt = normalizeString(value.prompt)
  if (!title || !prompt) return null

  const id = normalizeString(value.id) ?? `remote-template-${index}`
  const sortOrder = typeof value.sortOrder === 'number' && Number.isFinite(value.sortOrder)
    ? value.sortOrder
    : typeof value.sort_order === 'number' && Number.isFinite(value.sort_order)
    ? value.sort_order
    : undefined

  return {
    id,
    title,
    prompt,
    description: normalizeString(value.description),
    coverImageUrl: normalizeString(value.coverImageUrl ?? value.cover_image_url ?? value.imageUrl ?? value.image_url),
    tags: normalizeStringArray(value.tags),
    category: normalizeString(value.category),
    params: normalizePromptTemplateParams(value.params),
    providerHint: normalizeString(value.providerHint ?? value.provider_hint),
    sortOrder,
  }
}

function normalizePromptTemplatesPayload(payload: unknown): { templates: PromptTemplate[]; updatedAt?: string } {
  const rawTemplates = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.templates)
    ? payload.templates
    : []

  const templates = rawTemplates
    .map((item, index) => normalizePromptTemplate(item, index))
    .filter((item): item is PromptTemplate => Boolean(item))
    .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER))

  return {
    templates,
    updatedAt: isRecord(payload) ? normalizeString(payload.updatedAt ?? payload.updated_at) : undefined,
  }
}

export async function fetchPromptTemplates(
  url = PROMPT_TEMPLATES_URL,
  fetcher: FetchLike = fetch,
): Promise<PromptTemplatesFetchResult> {
  const endpoint = url.trim()
  if (!endpoint) return { templates: [] }

  try {
    const response = await fetcher(endpoint, { cache: 'no-store' })
    if (!response.ok) {
      return { templates: [], error: `Prompt 模板请求失败：HTTP ${response.status}` }
    }

    const payload = await response.json()
    return normalizePromptTemplatesPayload(payload)
  } catch (err) {
    return {
      templates: [],
      error: `Prompt 模板加载失败：${err instanceof Error ? err.message : String(err)}`,
    }
  }
}
