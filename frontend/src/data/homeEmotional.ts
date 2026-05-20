import type { EmotionalFrame } from './productEmotionalImages'
import { getProductEmotional } from './productEmotionalImages'

const cycle = getProductEmotional('cycle-relief')!

export const HOME_HERO = {
  before: cycle['pain-before'],
  after: cycle['pain-after'],
  transformation: cycle.transformation,
  includes: ['period-belt', 'lumbar', 'neck'] as const,
}

export const HOME_EMOTIONAL_FRAMES: Record<string, EmotionalFrame> = {
  cycle: cycle.hero,
  back: getProductEmotional('body-relief')!.hero,
  neck: cycle.hero,
}
