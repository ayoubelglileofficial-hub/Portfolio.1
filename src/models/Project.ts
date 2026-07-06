import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
    name: string
    title: string
    photo: string
    description: string
    languages: string[]
    demoLink: string
    githubLink: string
    order_index: number
    is_featured: boolean
    created_at: Date
    updated_at: Date
}

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    photo: { type: String, required: true },
    description: { type: String, required: true },
    languages: [{ type: String }],
    demoLink: { type: String, default: '' },
    githubLink: { type: String, default: '' },
    order_index: { type: Number, default: 0 },
    is_featured: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
