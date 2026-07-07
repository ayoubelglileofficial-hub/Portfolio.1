import { z } from 'zod'

export interface Project {
  _id: string
  name: string
  title: string
  photo: string
  description: string
  languages: string[]
  demoLink: string
  githubLink: string
  order_index: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export const ProjectCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  photo: z.string().min(1, 'Photo URL is required'),
  description: z.string().min(1, 'Description is required'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  demoLink: z.string().url('Demo link must be a valid URL'),
  githubLink: z.string().url('GitHub link must be a valid URL'),
  order_index: z.number().int('order_index must be an integer'),
  is_featured: z.boolean().optional().default(false),
})

export const ProjectUpdateSchema = ProjectCreateSchema.partial()

export type ProjectCreateInput = z.infer<typeof ProjectCreateSchema>
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>
