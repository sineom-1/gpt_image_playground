import type { PromptTemplate, TaskParams } from '../types'
import { readRuntimeEnv } from './runtimeEnv'

const DEFAULT_PROMPT_TEMPLATES_URL = '/api/prompt-templates'
const PROMPT_TEMPLATES_URL = readRuntimeEnv(import.meta.env.VITE_PROMPT_TEMPLATES_URL) || DEFAULT_PROMPT_TEMPLATES_URL
const SHOULD_USE_DEV_MOCKS = import.meta.env.DEV && PROMPT_TEMPLATES_URL === DEFAULT_PROMPT_TEMPLATES_URL

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export interface PromptTemplatesFetchResult {
  templates: PromptTemplate[]
  updatedAt?: string
  error?: string
}

export const MOCK_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'mock-product-photography',
    title: '高端产品摄影',
    description: '适合电商首图、官网主视觉和产品详情页。',
    prompt: '为一款极简白色无线耳机生成高端商业产品摄影图，纯净浅灰背景，柔和棚拍灯光，清晰反射，画面高级、真实、适合电商首图。',
    category: '产品摄影',
    tags: ['电商', '棚拍', '真实感'],
    params: { quality: 'high', output_format: 'png', n: 1 },
    sortOrder: 10,
  },
  {
    id: 'mock-fashion-poster',
    title: '潮流时尚海报',
    description: '生成适合社媒传播的品牌大片。',
    prompt: '生成一张未来感时尚品牌海报，一位模特穿着银色机能风外套站在霓虹城市街头，强烈蓝紫色光影，电影级构图，留出顶部标题空间。',
    category: '海报设计',
    tags: ['时尚', '霓虹', '品牌'],
    params: { quality: 'high', size: '1024x1536', output_format: 'png' },
    sortOrder: 20,
  },
  {
    id: 'mock-character-concept',
    title: '角色概念设定',
    description: '用于游戏、动画或 IP 角色探索。',
    prompt: '设计一个原创奇幻游戏角色：年轻的森林守护者，穿着藤蔓与皮革结合的轻甲，手持发光木杖，温暖自然光，完整半身像，细节丰富，概念艺术风格。',
    category: '角色设计',
    tags: ['奇幻', '游戏', '概念图'],
    params: { quality: 'high', size: '1024x1024', output_format: 'png' },
    sortOrder: 30,
  },
  {
    id: 'mock-food-ad',
    title: '美食广告图',
    description: '适合餐饮菜单和外卖平台展示。',
    prompt: '生成一张诱人的汉堡广告摄影图，芝士融化、肉饼多汁、生菜新鲜，深色背景，暖色侧光，浅景深，画面中央有充足留白用于添加文案。',
    category: '商业广告',
    tags: ['美食', '广告', '摄影'],
    params: { quality: 'high', output_format: 'jpeg', output_compression: 90 },
    sortOrder: 40,
  },
  {
    id: 'mock-interior-design',
    title: '现代室内空间',
    description: '快速生成装修和空间氛围参考。',
    prompt: '生成一个现代侘寂风客厅室内设计效果图，米色微水泥墙面，低矮沙发，原木茶几，落地窗自然光，简洁高级，真实建筑摄影质感。',
    category: '空间设计',
    tags: ['室内', '侘寂风', '真实'],
    params: { quality: 'high', size: '1536x1024', output_format: 'png' },
    sortOrder: 50,
  },
  {
    id: 'mock-avatar-illustration',
    title: '社媒头像插画',
    description: '生成辨识度高的个人头像风格图。',
    prompt: '生成一个可爱的 3D 卡通头像，年轻亚洲女性，圆形构图，柔和粉蓝渐变背景，大眼睛，微笑，干净高质量渲染，适合作为社交媒体头像。',
    category: '头像插画',
    tags: ['头像', '3D', '可爱'],
    params: { quality: 'medium', size: '1024x1024', output_format: 'png' },
    sortOrder: 60,
  },
]

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

function getDevMockPromptTemplates(error?: string): PromptTemplatesFetchResult {
  return {
    templates: MOCK_PROMPT_TEMPLATES,
    updatedAt: 'dev-mock',
    error,
  }
}

export async function fetchPromptTemplates(
  url = PROMPT_TEMPLATES_URL,
  fetcher: FetchLike = fetch,
): Promise<PromptTemplatesFetchResult> {
  const endpoint = url.trim()
  if (!endpoint) return SHOULD_USE_DEV_MOCKS ? getDevMockPromptTemplates() : { templates: [] }

  try {
    const response = await fetcher(endpoint, { cache: 'no-store' })
    if (!response.ok) {
      const error = `Prompt 模板请求失败：HTTP ${response.status}`
      return SHOULD_USE_DEV_MOCKS ? getDevMockPromptTemplates(error) : { templates: [], error }
    }

    const payload = await response.json()
    const result = normalizePromptTemplatesPayload(payload)
    if (SHOULD_USE_DEV_MOCKS && result.templates.length === 0) {
      return getDevMockPromptTemplates('当前接口没有返回可用模板，已加载本地测试 Prompt。')
    }
    return result
  } catch (err) {
    const error = `Prompt 模板加载失败：${err instanceof Error ? err.message : String(err)}`
    return SHOULD_USE_DEV_MOCKS ? getDevMockPromptTemplates(error) : { templates: [], error }
  }
}
