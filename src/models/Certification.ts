import mongoose, { Schema, Document } from 'mongoose'

export interface ICertification extends Document {
    title: string
    organization: string
    period: string
    description: string
    skills: string[]
    attestationUrl: string
    order_index: number
    isVisible: boolean
    created_at: Date
    updated_at: Date
}

const CertificationSchema = new Schema({
    title: { type: String, required: true },
    organization: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    attestationUrl: { type: String, default: '' },
    order_index: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

export default mongoose.models.Certification || mongoose.model<ICertification>('Certification', CertificationSchema)
