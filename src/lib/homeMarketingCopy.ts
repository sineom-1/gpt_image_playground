import type { AppLanguage } from '../types'

export const homeMarketingCopy: Record<AppLanguage, {
  badge: string
  title: string
  subtitle: string
  composerLabel: string
  promptLabel: string
  promptPlaceholder: string
  examplesLabel: string
  exampleButton: (index: number) => string
  submit: string
  templatesCta: string
  agentCta: string
  backupNote: string
  templateStudioLabel: string
  templateStudioTitle: string
  templateStudioDescription: string
  refreshTemplates: string
  allCategory: string
  emptyAll: string
  emptyCategory: string
  agentLabel: string
  agentTitle: string
  agentDescription: string
  agentWorkspaceCta: string
  agentBriefLabel: string
  agentBrief: string
  workflowLabel: string
  workflowTitle: string
  workflowDescription: string
  useCasesLabel: string
  useCasesTitle: string
  viewGallery: string
  quickStartTemplateTitle: string
  quickStartTemplateDescription: string
  quickStartTemplateCategory: string
  quickStartTemplateTags: string[]
  heroPrompts: string[]
  capabilityBadges: string[]
  stats: Array<{ value: string; label: string }>
  features: Array<{ title: string; description: string }>
  workflow: Array<[string, string, string]>
  agentSteps: Array<[string, string]>
  useCases: string[]
}> = {
  zh: {
    badge: 'AI 图像创作工作台',
    title: '把一句 Prompt 变成可交付的商业图片。',
    subtitle: '从首页直接输入、套用精选模板，或交给 Agent 拆解任务，把产品图、海报、角色概念和社媒视觉快速推进到可交付状态。',
    composerLabel: '首页 Prompt 输入器',
    promptLabel: '输入图片创意 Prompt',
    promptPlaceholder: '描述你想生成的图片，例如：为新款咖啡豆设计一张暖色调电商主图...',
    examplesLabel: '示例',
    exampleButton: (index) => `示例 ${index + 1}`,
    submit: '带入生成器',
    templatesCta: '使用模板开始',
    agentCta: '探索 Agent 模式',
    backupNote: '提醒：图库默认保存在当前浏览器本地，如需长期归档，建议定期导出备份。',
    templateStudioLabel: '模板工作室',
    templateStudioTitle: '选择一个可以直接开工的创意方向。',
    templateStudioDescription: '点击模板会保留现有生成流程：自动填入 prompt，并进入可继续微调的 Playground。',
    refreshTemplates: '刷新模板',
    allCategory: '全部',
    emptyAll: '当前没有可用的 Prompt 模板。',
    emptyCategory: '当前分类下没有匹配的模板。',
    agentLabel: 'Agent 模式',
    agentTitle: '不只是生成一张图，而是拆解一组任务。',
    agentDescription: '当需求包含多个画面版本、参考图或局部修改时，Agent 可以把 brief 拆成连续步骤，让创作过程更可追踪。',
    agentWorkspaceCta: '进入 Agent 工作区',
    agentBriefLabel: '示例 brief',
    agentBrief: '为咖啡新品做一组秋季上线视觉：电商主图、社媒海报、局部替换杯身标签，并保持统一暖色调。',
    workflowLabel: '创作流程',
    workflowTitle: '这是一个创作系统，不只是生成按钮。',
    workflowDescription: '参考 Manus 和 Canva 的营销结构，把核心生成能力包装成清晰的创作路径，同时保持现有工具效率。',
    useCasesLabel: '使用场景',
    useCasesTitle: '适合需要快速推进的营销视觉资产。',
    viewGallery: '查看已生成图库',
    quickStartTemplateTitle: '首页快速创作',
    quickStartTemplateDescription: '从首页输入框直接带入的创意 brief。',
    quickStartTemplateCategory: '快速创作',
    quickStartTemplateTags: ['首页输入', '快速开始'],
    heroPrompts: [
      '为一款哑光黑智能音箱生成电影感产品主图，放在黑曜石质感桌面上，边缘有柔和反光，适合官网首屏。',
      '生成一张未来感时尚品牌海报，银色机能外套、紫色霓虹光影、强留白，适合社媒发布。',
      '设计一个现代侘寂风客厅场景，微水泥墙面、低矮沙发、自然光、杂志级室内摄影质感。',
    ],
    capabilityBadges: ['文生图', '图片编辑', 'Prompt 模板', 'Agent 工作流'],
    stats: [
      { value: '6+', label: '精选创意模板' },
      { value: '3', label: '生成 / 编辑 / Agent 路径' },
      { value: '本地', label: '私有 IndexedDB 图库' },
    ],
    features: [
      { title: '从成熟 Prompt 开始', description: '产品摄影、海报、角色、头像和空间模板已经整理好，避免从空白页面反复试错。' },
      { title: '带参考图继续微调', description: '把参考图、遮罩和历史输出重新带回流程，适合做局部修改和风格迭代。' },
      { title: '用 Agent 拆解复杂需求', description: '把一句创意 brief 拆成可追踪的多步图片任务，适合活动海报和系列资产。' },
      { title: '图库默认保存在本地', description: '输出、收藏、参数和修订记录都保存在浏览器 IndexedDB，不依赖后端账号系统。' },
    ],
    workflow: [
      ['01', '选择方向', '从模板或首页输入框开始，先确定产品图、海报、角色或空间氛围。'],
      ['02', '调整创意参数', '继续设置尺寸、质量、参考图、遮罩和服务商配置，让生成更可控。'],
      ['03', '生成并迭代', '在图库中复用参数、继续编辑、收藏候选图，逐步收敛到可交付版本。'],
    ],
    agentSteps: [
      ['解析 brief', '识别目标受众、画面主体、风格和交付尺寸。'],
      ['拆分任务', '先生成主视觉，再安排背景替换、局部重绘和版本扩展。'],
      ['回收结果', '把每一轮输出沉淀到图库，方便继续编辑或复用参数。'],
    ],
    useCases: ['产品主图', '社媒活动视觉', '角色概念', '室内氛围图', '美食广告', '头像插画'],
  },
  en: {
    badge: 'AI Image Studio',
    title: 'Turn one prompt into production-ready images.',
    subtitle: 'Start from a prompt, curated templates, or Agent workflows to move product shots, posters, character concepts, and social visuals toward delivery.',
    composerLabel: 'Hero prompt composer',
    promptLabel: 'Image creative prompt',
    promptPlaceholder: 'Describe the image you want, for example: create a warm e-commerce hero shot for a new coffee blend...',
    examplesLabel: 'Examples',
    exampleButton: (index) => `Example ${index + 1}`,
    submit: 'Send to generator',
    templatesCta: 'Start with templates',
    agentCta: 'Explore Agent mode',
    backupNote: 'Note: the gallery is stored locally in this browser. Export backups for long-term archiving.',
    templateStudioLabel: 'Template studio',
    templateStudioTitle: 'Pick a launch-ready creative direction.',
    templateStudioDescription: 'Clicking a template keeps the current flow: it fills the prompt and opens the Playground for further tuning.',
    refreshTemplates: 'Refresh templates',
    allCategory: 'All',
    emptyAll: 'No prompt templates are available yet.',
    emptyCategory: 'No templates match the current category.',
    agentLabel: 'Agent mode',
    agentTitle: 'Not just one image: break a campaign into tasks.',
    agentDescription: 'When a brief includes multiple versions, references, or local edits, Agent mode turns it into traceable creative steps.',
    agentWorkspaceCta: 'Open Agent workspace',
    agentBriefLabel: 'Example brief',
    agentBrief: 'Create an autumn launch set for a new coffee product: e-commerce hero shot, social poster, label replacement, and a consistent warm palette.',
    workflowLabel: 'Workflow',
    workflowTitle: 'A creative system, not just a generate button.',
    workflowDescription: 'The homepage uses a clear creative path inspired by modern AI tools while keeping the existing Playground workflow efficient.',
    useCasesLabel: 'Use cases',
    useCasesTitle: 'Built for marketing assets that need momentum.',
    viewGallery: 'View generated gallery',
    quickStartTemplateTitle: 'Homepage quick start',
    quickStartTemplateDescription: 'A creative brief sent directly from the homepage composer.',
    quickStartTemplateCategory: 'Quick start',
    quickStartTemplateTags: ['Homepage input', 'Quick start'],
    heroPrompts: [
      'Create a cinematic product hero image for a matte black smart speaker on a glossy obsidian desk with soft edge reflections.',
      'Generate a futuristic fashion campaign poster with a silver technical jacket, violet neon lighting, and bold negative space.',
      'Design a modern wabi-sabi living room with microcement walls, low sofa, natural light, and editorial interior photography texture.',
    ],
    capabilityBadges: ['Text to image', 'Image editing', 'Prompt templates', 'Agent workflows'],
    stats: [
      { value: '6+', label: 'Curated creative templates' },
      { value: '3', label: 'Generate / Edit / Agent paths' },
      { value: 'Local', label: 'Private IndexedDB gallery' },
    ],
    features: [
      { title: 'Start from proven prompts', description: 'Product, poster, character, avatar, and interior templates are ready so you do not start from a blank page.' },
      { title: 'Remix with references', description: 'Bring references, masks, and previous outputs back into the flow for local edits and style iteration.' },
      { title: 'Let Agent split complex briefs', description: 'Turn one creative brief into traceable image tasks for campaigns and asset sets.' },
      { title: 'Keep the gallery local', description: 'Outputs, favorites, parameters, and revisions are stored in browser IndexedDB without a backend account system.' },
    ],
    workflow: [
      ['01', 'Choose a direction', 'Start from a template or homepage composer, then define the product, poster, character, or interior direction.'],
      ['02', 'Tune the creative', 'Adjust size, quality, references, masks, and provider settings before generating.'],
      ['03', 'Generate and iterate', 'Reuse parameters, keep editing, favorite candidates, and converge on deliverable versions in the gallery.'],
    ],
    agentSteps: [
      ['Parse the brief', 'Identify audience, subject, style, and delivery dimensions.'],
      ['Split tasks', 'Generate the hero visual first, then schedule background swaps, local repainting, and version expansion.'],
      ['Collect results', 'Save every round to the gallery for continued editing or parameter reuse.'],
    ],
    useCases: ['Product hero shots', 'Social campaign visuals', 'Character concepts', 'Interior moodboards', 'Food ads', 'Avatar illustrations'],
  },
}
