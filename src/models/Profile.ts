import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
    _id: string;
    full_name: string;
    title: string;
    short_bio: string;
    email: string;
    phone: string;
    location: string;
    avatar_url: string;
    website_logo: string;
    github_url: string;
    linkedin_url: string;
    website_url: string;
    bio_1: string;
    bio_2: string;
    bio_3: string;
    created_at: Date;
    updated_at: Date;
}

const ProfileSchema = new Schema<IProfile>({
    _id: { type: String, default: 'prof_001' },
    full_name: { type: String, required: true },
    title: { type: String, required: true },
    short_bio: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    avatar_url: { type: String, default: '' },
    website_logo: { type: String, default: '' },
    github_url: { type: String, default: '' },
    linkedin_url: { type: String, default: '' },
    website_url: { type: String, default: '' },
    bio_1: { type: String, default: '' },
    bio_2: { type: String, default: '' },
    bio_3: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);