import mongoose, { Schema, Document } from 'mongoose'

export interface IService extends Document {
    _id: string
    title: string
    description: string
    icon: string
    order_index: number
    isVisible: boolean
    created_at: Date
    updated_at: Date
}

const ServiceSchema = new Schema({
    _id: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    order_index: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema)
