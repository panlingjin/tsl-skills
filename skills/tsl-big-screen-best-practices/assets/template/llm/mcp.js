import { z } from 'zod'
import { frontControl } from './frontControl'

const refreshSchema = z.object({
  type: z.literal('refresh'),
  params: z.object({}).default({}),
})

const switchSceneSchema = z.object({
  type: z.literal('switchScene'),
  params: z.object({
    sceneIndex: z.coerce.number().int().nonnegative(),
  }),
})

const navigateSchema = z.object({
  type: z.literal('navigate'),
  params: z.object({
    path: z.string().regex(/^\/(?!\/)[A-Za-z0-9/_-]*$/),
  }),
})

export const frontControlSchema = z.discriminatedUnion('type', [
  refreshSchema,
  switchSceneSchema,
  navigateSchema,
])

export function createFrontControlTool(context) {
  return {
    name: 'front_control',
    description: 'Control the current big-screen view',
    schema: frontControlSchema,
    execute(input) {
      return frontControl(frontControlSchema.parse(input), context)
    },
  }
}
