'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { getSessionData } from '@/lib/auth';

export async function updateProfile(formData: FormData) {
  try {
    const session = await getSessionData();
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Non autorisé' };
    }

    await dbConnect();

    const profileId = 'prof_001'; // Ton ID fixe

    const updateData: Record<string, unknown> = {
      full_name: formData.get('full_name'),
      title: formData.get('title'),
      short_bio: formData.get('short_bio'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      location: formData.get('location') || '',
      github_url: formData.get('github_url') || '',
      linkedin_url: formData.get('linkedin_url') || '',
      website_url: formData.get('website_url') || '',
      bio_1: formData.get('bio_1') || '',
      bio_2: formData.get('bio_2') || '',
      bio_3: formData.get('bio_3') || '',
      updated_at: new Date(),
    };

    // Gestion des images (upload vers Cloudinary / S3 / etc.)
    const avatarFile = formData.get('avatar') as File;
    const logoFile = formData.get('website_logo') as File;

    if (avatarFile && avatarFile.size > 0) {
      const avatarUrl = await uploadImage(avatarFile, 'avatars');
      updateData.avatar_url = avatarUrl;
    }

    if (logoFile && logoFile.size > 0) {
      const logoUrl = await uploadImage(logoFile, 'logos');
      updateData.website_logo = logoUrl;
    }

    await Profile.findByIdAndUpdate(profileId, updateData, { new: true });

    revalidatePath('/admin/profile');
    revalidatePath('/'); // Pour la page publique aussi

    return { success: true, message: 'Profil mis à jour avec succès' };
  } catch (error) {
    console.error('Update error:', error);
    return { success: false, message: 'Erreur lors de la mise à jour' };
  }
}

// Fonction d'upload d'image (à adapter selon ton provider)
async function uploadImage(file: File, folder: string): Promise<string> {
  // Exemple avec Cloudinary
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Tu peux utiliser cloudinary-sdk ou un API route dédié
  // Pour l'instant, je te montre l'approche avec une API route séparée
  // ou tu peux utiliser directement cloudinary ici
  
  // Alternative simple : upload vers un dossier public (déconseillé en prod)
  // return `/uploads/${folder}/${file.name}`;
  
  throw new Error('Upload non configuré - voir les options ci-dessous');
}