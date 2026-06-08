import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI as string;

async function createAdmin() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const existingUser = await User.findOne({ email: 'ayoubelglile@gmail.com' });
        if (existingUser) {
            console.log('⚠️ Admin user already exists!');
            console.log('📧 Email: ayoubelglile@gmail.com');
            console.log('💡 To create another user, change the email address in the script.');
            process.exit(0);
        }

        const plainPassword = 'Ayoub_el_123_admin';

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const newUser = new User({
            email: 'ayoubelglile@gmail.com',
            password: hashedPassword,
            role: 'admin',
        });

        await newUser.save();

        console.log('Admin user created successfully!');
        console.log('Email: ayoubelglile@gmail.com');
        console.log('Password:', plainPassword);
        console.log('Password has been hashed and stored securely.');
        console.log('Save this password in a secure location (e.g., password manager)!');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createAdmin();