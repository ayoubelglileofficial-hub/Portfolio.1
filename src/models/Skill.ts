import mongoose, { Schema, Document } from 'mongoose'

export interface ISkill extends Document {
    name: string
    slug: string
    category: string
    length_of_experience: string
    icon: string
    color: string
    is_highlighted: boolean
    order_index: number
    created_at: Date
    updated_at: Date
}

const SkillSchema = new Schema({
    _id: { type: String },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    length_of_experience: { type: String, default: '' },
    icon: { type: String, default: '' },
    color: { type: String, default: '#000000' },
    is_highlighted: { type: Boolean, default: false },
    order_index: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema)
