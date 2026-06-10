import connectDB from '../lib/mongodb';
import Profile from '../models/Profile';

const profileData = {
    _id: 'prof_001',
    full_name: 'Your Name',
    title: 'Full Stack Developer',
    short_bio: 'Building digital experiences that matter.',
    email: 'your.email@example.com',
    phone: '+1 234 567 890',
    location: 'Your City, Country',
    avatar_url: 'https://tse4.mm.bing.net/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgHaHw?cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3',
    website_logo: 'https://tse4.mm.bing.net/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgHaHw?cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3',
    github_url: 'https://github.com/yourusername',
    linkedin_url: 'https://linkedin.com/in/yourusername',
    website_url: 'https://yourportfolio.com',
    bio_1: 'Passionate developer with expertise in building modern web applications...',
    bio_2: 'With over 5 years of experience in the industry...',
    bio_3: "When I'm not coding, I enjoy contributing to open-source projects...",
    
    isVisible: true,   // ← NEW: Profile visible by default

    // All sections visible by default
    show_experience: true,
    show_projects: true,
    show_services: true,
    show_skills: true,
    show_testimonials: true,
    show_education: true,
    show_resume: true,
    show_social_links: true,
    show_contact: true,
};

async function seed() {
    await connectDB();

    // Upsert - update if exists, create if not
    await Profile.findOneAndUpdate(
        { _id: 'prof_001' },
        profileData,
        { upsert: true, new: true }
    );

    console.log('Profile seeded successfully!');
    process.exit(0);
}

seed().catch(console.error);