import { z } from 'zod'

export interface Service {
  _id: string
  title: string
  description: string
  icon: string
  order_index: number
  isVisible: boolean
  created_at: string
  updated_at: string
}

export const ServiceCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  order_index: z.number().int('order_index must be an integer').optional().default(0),
  isVisible: z.boolean().optional().default(true),
})

export const ServiceUpdateSchema = ServiceCreateSchema.partial()

export type ServiceCreateInput = z.infer<typeof ServiceCreateSchema>
export type ServiceUpdateInput = z.infer<typeof ServiceUpdateSchema>
