import { z } from 'zod'

export interface Education {
  _id: string
  title: string
  company: string
  period: string
  description: string
  project: string
  attestationUrl: string
  align: 'left' | 'right'
  order_index: number
  isVisible: boolean
  created_at: string
  updated_at: string
}

export const EducationCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  company: z.string().min(1, 'Company is required').max(100, 'Company must be at most 100 characters'),
  period: z.string().min(1, 'Period is required').max(50, 'Period must be at most 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be at most 2000 characters'),
  project: z.string().max(150, 'Project must be at most 150 characters').optional().default(''),
  attestationUrl: z.union([z.string().url('Attestation URL must be a valid URL'), z.literal('')]).optional().default(''),
  align: z.enum(['left', 'right'], { message: 'Align must be left or right' }),
  order_index: z.number().int('order_index must be an integer').positive('order_index must be positive'),
  isVisible: z.boolean().optional().default(true),
})

export const EducationUpdateSchema = EducationCreateSchema.partial()

export type EducationCreateInput = z.infer<typeof EducationCreateSchema>
export type EducationUpdateInput = z.infer<typeof EducationUpdateSchema>
