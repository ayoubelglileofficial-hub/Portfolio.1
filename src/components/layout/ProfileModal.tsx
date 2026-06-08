'use client';

import { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { updateProfile } from '@/app/api/profile/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Upload, User, Link as LinkIcon, FileText } from 'lucide-react';

interface ProfileFormProps {
  profile: {
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
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Mise à jour...
        </>
      ) : (
        'Mettre à jour le profil'
      )}
    </Button>
  );
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [formState, setFormState] = useState(profile);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url);
  const [logoPreview, setLogoPreview] = useState(profile.website_logo);
  const [isUploading, setIsUploading] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'logo'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview locale immédiate
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setAvatarPreview(reader.result as string);
      } else {
        setLogoPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload vers Cloudinary
    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', type === 'avatar' ? 'avatars' : 'logos');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      
      if (data.url) {
        setFormState(prev => ({
          ...prev,
          [type === 'avatar' ? 'avatar_url' : 'website_logo']: data.url
        }));
        toast.success(`${type === 'avatar' ? 'Avatar' : 'Logo'} uploadé !`);
      }
    } catch (error) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    // Ajouter les URLs d'images déjà uploadées
    formData.append('avatar_url', formState.avatar_url);
    formData.append('website_logo', formState.website_logo);
    
    const result = await updateProfile(formData);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Images Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Images du profil
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar */}
          <div className="space-y-3">
            <Label>Photo de profil</Label>
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
                   onClick={() => avatarInputRef.current?.click()}>
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, 'avatar')}
              />
            </div>
            {isUploading && <p className="text-sm text-muted-foreground">Upload en cours...</p>}
          </div>

          {/* Website Logo */}
          <div className="space-y-3">
            <Label>Logo du site</Label>
            <div className="relative group">
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
                   onClick={() => logoInputRef.current?.click()}>
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <LinkIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                name="website_logo"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, 'logo')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire avec Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Informations
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" /> Liens
          </TabsTrigger>
          <TabsTrigger value="bio" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Bio
          </TabsTrigger>
        </TabsList>

        {/* Onglet Informations */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={formState.full_name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Titre / Poste</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={formState.title}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_bio">Bio courte</Label>
                <Textarea
                  id="short_bio"
                  name="short_bio"
                  defaultValue={formState.short_bio}
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={formState.email}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={formState.phone}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={formState.location}
                  placeholder="Ville, Pays"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Liens */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub</Label>
                <Input
                  id="github_url"
                  name="github_url"
                  type="url"
                  defaultValue={formState.github_url}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  defaultValue={formState.linkedin_url}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Site web</Label>
                <Input
                  id="website_url"
                  name="website_url"
                  type="url"
                  defaultValue={formState.website_url}
                  placeholder="https://monsite.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Bio */}
        <TabsContent value="bio" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio_1">Bio 1</Label>
                <Textarea
                  id="bio_1"
                  name="bio_1"
                  defaultValue={formState.bio_1}
                  rows={4}
                  placeholder="Premier paragraphe de ta bio..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio_2">Bio 2</Label>
                <Textarea
                  id="bio_2"
                  name="bio_2"
                  defaultValue={formState.bio_2}
                  rows={4}
                  placeholder="Deuxième paragraphe..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio_3">Bio 3</Label>
                <Textarea
                  id="bio_3"
                  name="bio_3"
                  defaultValue={formState.bio_3}
                  rows={4}
                  placeholder="Troisième paragraphe..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SubmitButton />
    </form>
  );
}