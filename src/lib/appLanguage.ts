import type { AppLanguage } from '../types'

export const PRODUCT_NAME_BY_LANGUAGE: Record<AppLanguage, string> = {
  zh: 'AI 图像创作工作台',
  en: 'AI Image Studio',
}

export const DOCUMENT_LANG_BY_LANGUAGE: Record<AppLanguage, string> = {
  zh: 'zh-CN',
  en: 'en',
}

export const DOCUMENT_TITLE_BY_LANGUAGE: Record<AppLanguage, string> = {
  zh: 'AI 图像创作工作台',
  en: 'AI Image Studio',
}

export function normalizeAppLanguage(value: unknown): AppLanguage {
  return value === 'en' ? 'en' : 'zh'
}
