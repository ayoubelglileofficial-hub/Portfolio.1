import mongoose, { Schema, Document } from 'mongoose'

export interface IEducation extends Document {
    title: string
    company: string
    period: string
    description: string
    project: string
    attestationUrl: string
    align: 'left' | 'right'
    order_index: number
    isVisible: boolean
    created_at: Date
    updated_at: Date
}

const EducationSchema = new Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
    project: { type: String, default: '' },
    attestationUrl: { type: String, default: '' },
    align: { type: String, enum: ['left', 'right'], default: 'left' },
    order_index: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

export default mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema)
