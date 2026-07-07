import { z } from 'zod'

export interface Certification {
  _id: string
  title: string
  organization: string
  period: string
  description: string
  skills: string[]
  attestationUrl: string
  order_index: number
  isVisible: boolean
  created_at: string
  updated_at: string
}

export const CertificationCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  organization: z.string().min(1, 'Organization is required').max(100, 'Organization must be at most 100 characters'),
  period: z.string().min(1, 'Period is required').max(50, 'Period must be at most 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be at most 2000 characters'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  attestationUrl: z.union([z.string().url('Attestation URL must be a valid URL'), z.literal('')]).optional().default(''),
  order_index: z.number().int('order_index must be an integer').positive('order_index must be positive'),
  isVisible: z.boolean().optional().default(true),
})

export const CertificationUpdateSchema = CertificationCreateSchema.partial()

export type CertificationCreateInput = z.infer<typeof CertificationCreateSchema>
export type CertificationUpdateInput = z.infer<typeof CertificationUpdateSchema>
